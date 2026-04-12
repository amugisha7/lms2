import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import process from "node:process";
import { execFileSync } from "node:child_process";

const projectRoot = process.cwd();

const apiTemplatePath = path.join(
  projectRoot,
  "amplify",
  "backend",
  "api",
  "lms2",
  "build",
  "cloudformation-template.json",
);
const customResourcesTemplatePath = path.join(
  projectRoot,
  "amplify",
  "backend",
  "api",
  "lms2",
  "stacks",
  "CustomResources.json",
);
const amplifyMetaPath = path.join(
  projectRoot,
  "amplify",
  "backend",
  "amplify-meta.json",
);

const readJson = (filePath) => JSON.parse(fs.readFileSync(filePath, "utf8"));

const execAws = (args, options = {}) => {
  try {
    return execFileSync("aws", args, {
      encoding: "utf8",
      stdio: options.stdio || ["ignore", "pipe", "pipe"],
    });
  } catch (error) {
    const stderr = error.stderr?.toString?.() || "";
    const stdout = error.stdout?.toString?.() || "";

    if (stderr) {
      process.stderr.write(stderr);
    }
    if (stdout) {
      process.stdout.write(stdout);
    }

    throw error;
  }
};

const execAwsJson = (args) => JSON.parse(execAws(args));

const buildEventSourceMapping = (streamArnParameter) => ({
  Type: "AWS::Lambda::EventSourceMapping",
  Properties: {
    BatchSize: 100,
    Enabled: true,
    EventSourceArn: {
      Ref: streamArnParameter,
    },
    FunctionName: {
      Ref: "loanSummaryStreamHandlerArn",
    },
    StartingPosition: "LATEST",
  },
});

const ensureCustomResourceMappings = (customResourcesTemplate) => {
  customResourcesTemplate.Parameters ||= {};
  customResourcesTemplate.Resources ||= {};

  customResourcesTemplate.Parameters.loanSummaryStreamHandlerArn = {
    Type: "String",
    Description: "ARN of the deployed loanSummaryStreamHandler Lambda.",
  };
  customResourcesTemplate.Parameters.loanTableStreamArn = {
    Type: "String",
    Description: "Loan table DynamoDB stream ARN.",
  };
  customResourcesTemplate.Parameters.paymentTableStreamArn = {
    Type: "String",
    Description: "Payment table DynamoDB stream ARN.",
  };
  customResourcesTemplate.Parameters.penaltyTableStreamArn = {
    Type: "String",
    Description: "Penalty table DynamoDB stream ARN.",
  };

  customResourcesTemplate.Resources.LoanStreamEventSourceMapping =
    buildEventSourceMapping("loanTableStreamArn");
  customResourcesTemplate.Resources.PaymentStreamEventSourceMapping =
    buildEventSourceMapping("paymentTableStreamArn");
  customResourcesTemplate.Resources.PenaltyStreamEventSourceMapping =
    buildEventSourceMapping("penaltyTableStreamArn");
};

const ensureApiCustomResourceParameters = (apiTemplate) => {
  apiTemplate.Parameters ||= {};
  apiTemplate.Parameters.loanSummaryStreamHandlerArn = {
    Type: "String",
    Description: "ARN of the deployed loanSummaryStreamHandler Lambda.",
  };

  const customResourcesStack = apiTemplate.Resources?.CustomResourcesjson;

  if (!customResourcesStack?.Properties?.Parameters) {
    throw new Error("Unable to locate CustomResourcesjson nested stack in API template.");
  }

  customResourcesStack.Properties.Parameters.loanSummaryStreamHandlerArn = {
    Ref: "loanSummaryStreamHandlerArn",
  };
  customResourcesStack.Properties.Parameters.loanTableStreamArn = {
    "Fn::GetAtt": ["Loan", "Outputs.GetAttLoanTableStreamArn"],
  };
  customResourcesStack.Properties.Parameters.paymentTableStreamArn = {
    "Fn::GetAtt": ["Payment", "Outputs.GetAttPaymentTableStreamArn"],
  };
  customResourcesStack.Properties.Parameters.penaltyTableStreamArn = {
    "Fn::GetAtt": ["Penalty", "Outputs.GetAttPenaltyTableStreamArn"],
  };
};

const writeJson = (filePath, content) => {
  fs.writeFileSync(filePath, `${JSON.stringify(content, null, 2)}\n`, "utf8");
};

const getApiStackDetails = ({ region, rootStackName }) => {
  const resources = execAwsJson([
    "--no-cli-pager",
    "cloudformation",
    "describe-stack-resources",
    "--stack-name",
    rootStackName,
    "--logical-resource-id",
    "apilms2",
    "--region",
    region,
    "--output",
    "json",
  ]);

  const apiStackId = resources?.StackResources?.[0]?.PhysicalResourceId;

  if (!apiStackId) {
    throw new Error("Unable to resolve the nested API stack ID.");
  }

  const stackDescription = execAwsJson([
    "--no-cli-pager",
    "cloudformation",
    "describe-stacks",
    "--stack-name",
    apiStackId,
    "--region",
    region,
    "--output",
    "json",
  ]);

  const apiStack = stackDescription?.Stacks?.[0];

  if (!apiStack) {
    throw new Error("Unable to describe the nested API stack.");
  }

  return {
    apiStackId,
    parameters: apiStack.Parameters || [],
  };
};

const verifyMappings = ({ region, functionName }) => {
  const output = execAws([
    "--no-cli-pager",
    "lambda",
    "list-event-source-mappings",
    "--function-name",
    functionName,
    "--region",
    region,
    "--query",
    "EventSourceMappings[].EventSourceArn",
    "--output",
    "json",
  ]);

  const eventSourceArns = JSON.parse(output || "[]");
  const requiredTables = ["Loan-", "Payment-", "Penalty-"];
  const missing = requiredTables.filter(
    (tablePrefix) =>
      !eventSourceArns.some((arn) => typeof arn === "string" && arn.includes(`/table/${tablePrefix}`)),
  );

  if (missing.length > 0) {
    throw new Error(
      `Missing expected Lambda event source mappings for: ${missing.join(", ")}`,
    );
  }

  return eventSourceArns;
};

const main = () => {
  const apiTemplate = readJson(apiTemplatePath);
  const customResourcesTemplate = readJson(customResourcesTemplatePath);
  const amplifyMeta = readJson(amplifyMetaPath);

  const provider = amplifyMeta?.providers?.awscloudformation;
  const functionName = amplifyMeta?.function?.loanSummaryStreamHandler?.output?.Name;
  const functionArn = amplifyMeta?.function?.loanSummaryStreamHandler?.output?.Arn;

  if (!provider?.DeploymentBucketName || !provider?.Region || !provider?.StackName) {
    throw new Error("Missing awscloudformation deployment metadata.");
  }

  if (!functionName || !functionArn) {
    throw new Error("Missing deployed loanSummaryStreamHandler function metadata.");
  }

  ensureCustomResourceMappings(customResourcesTemplate);
  ensureApiCustomResourceParameters(apiTemplate);

  const apiStackDetails = getApiStackDetails({
    region: provider.Region,
    rootStackName: provider.StackName,
  });
  const apiParametersByKey = Object.fromEntries(
    apiStackDetails.parameters.map((parameter) => [
      parameter.ParameterKey,
      parameter.ParameterValue,
    ]),
  );
  const deploymentBucket = apiParametersByKey.S3DeploymentBucket;
  const deploymentRootKey = apiParametersByKey.S3DeploymentRootKey;

  if (!deploymentBucket || !deploymentRootKey) {
    throw new Error("Unable to resolve the deployed API stack S3 parameters.");
  }

  const tempDir = fs.mkdtempSync(
    path.join(os.tmpdir(), "lms2-loan-summary-streams-"),
  );
  const apiTemplateKey = [
    "amplify-cfn-templates/api/cloudformation-template.loan-summary-streams",
    new Date().toISOString().replace(/[.:]/g, "-"),
    "json",
  ].join(".");
  const apiTemplateUrl = `https://s3.amazonaws.com/${provider.DeploymentBucketName}/${apiTemplateKey}`;
  const patchedApiTemplatePath = path.join(tempDir, "api-cloudformation-template.json");
  const patchedCustomResourcesPath = path.join(tempDir, "CustomResources.json");

  writeJson(patchedApiTemplatePath, apiTemplate);
  writeJson(patchedCustomResourcesPath, customResourcesTemplate);

  console.log(
    `Uploading patched CustomResources template to s3://${deploymentBucket}/${deploymentRootKey}/stacks/CustomResources.json`,
  );
  execAws([
    "--no-cli-pager",
    "s3",
    "cp",
    patchedCustomResourcesPath,
    `s3://${deploymentBucket}/${deploymentRootKey}/stacks/CustomResources.json`,
    "--region",
    provider.Region,
  ]);

  console.log(`Uploading patched API template to s3://${provider.DeploymentBucketName}/${apiTemplateKey}`);
  execAws([
    "--no-cli-pager",
    "s3",
    "cp",
    patchedApiTemplatePath,
    `s3://${provider.DeploymentBucketName}/${apiTemplateKey}`,
    "--region",
    provider.Region,
  ]);

  const parameterArgs = apiStackDetails.parameters.flatMap((parameter) => [
    "ParameterKey=" + parameter.ParameterKey + ",UsePreviousValue=true",
  ]);
  parameterArgs.push(
    `ParameterKey=loanSummaryStreamHandlerArn,ParameterValue=${functionArn}`,
  );

  console.log(`Updating nested API stack ${apiStackDetails.apiStackId}`);
  let noUpdates = false;

  try {
    execAws([
      "--no-cli-pager",
      "cloudformation",
      "update-stack",
      "--stack-name",
      apiStackDetails.apiStackId,
      "--template-url",
      apiTemplateUrl,
      "--capabilities",
      "CAPABILITY_IAM",
      "CAPABILITY_NAMED_IAM",
      "--parameters",
      ...parameterArgs,
      "--region",
      provider.Region,
    ]);
  } catch (error) {
    const stderr = error.stderr?.toString?.() || "";
    if (stderr.includes("No updates are to be performed")) {
      noUpdates = true;
      console.log("Root stack already up to date.");
    } else {
      throw error;
    }
  }

  if (!noUpdates) {
    console.log("Waiting for nested API stack update to complete...");
    execAws(
      [
        "--no-cli-pager",
        "cloudformation",
        "wait",
        "stack-update-complete",
        "--stack-name",
        apiStackDetails.apiStackId,
        "--region",
        provider.Region,
      ],
      { stdio: "inherit" },
    );
  }

  const eventSourceArns = verifyMappings({
    region: provider.Region,
    functionName,
  });

  console.log("Verified DynamoDB stream mappings:");
  eventSourceArns.forEach((arn) => console.log(`- ${arn}`));
};

main();