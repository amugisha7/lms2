import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import process from "node:process";
import { execFileSync } from "node:child_process";

const projectRoot = process.cwd();
const amplifyMetaPath = path.join(
  projectRoot,
  "amplify",
  "backend",
  "amplify-meta.json",
);

const readJson = (filePath) => JSON.parse(fs.readFileSync(filePath, "utf8"));

const execAws = (args) =>
  execFileSync("aws", args, {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });

const execAwsJson = (args) => JSON.parse(execAws(args));

const getTableName = ({ region, prefix }) => {
  const output = execAwsJson([
    "--no-cli-pager",
    "dynamodb",
    "list-tables",
    "--region",
    region,
    "--output",
    "json",
  ]);

  return (output.TableNames || []).find((name) => name.startsWith(prefix)) || null;
};

const writeTempJson = (value, filename) => {
  const filePath = path.join(
    fs.mkdtempSync(path.join(os.tmpdir(), "lms2-loan-summary-repair-")),
    filename,
  );
  fs.writeFileSync(filePath, JSON.stringify(value), "utf8");
  return filePath;
};

const main = () => {
  const amplifyMeta = readJson(amplifyMetaPath);
  const region = amplifyMeta?.providers?.awscloudformation?.Region;

  if (!region) {
    throw new Error("Missing AWS region in amplify-meta.json.");
  }

  const summaryTable = getTableName({ region, prefix: "LoanSummary-" });
  const branchTable = getTableName({ region, prefix: "Branch-" });

  if (!summaryTable || !branchTable) {
    throw new Error("Unable to resolve LoanSummary or Branch table name.");
  }

  const missingInstitutionRows = execAwsJson([
    "--no-cli-pager",
    "dynamodb",
    "scan",
    "--table-name",
    summaryTable,
    "--filter-expression",
    "attribute_not_exists(institutionID)",
    "--projection-expression",
    "id, branchID",
    "--region",
    region,
    "--output",
    "json",
  ]).Items || [];

  let patched = 0;

  for (const item of missingInstitutionRows) {
    const summaryId = item?.id?.S;
    const branchId = item?.branchID?.S;

    if (!summaryId || !branchId) {
      continue;
    }

    const branchKeyPath = writeTempJson({ id: { S: branchId } }, "branch-key.json");
    const branchResult = execAwsJson([
      "--no-cli-pager",
      "dynamodb",
      "get-item",
      "--table-name",
      branchTable,
      "--key",
      `file://${branchKeyPath}`,
      "--region",
      region,
      "--output",
      "json",
    ]);

    const institutionId =
      branchResult?.Item?.institutionBranchesId?.S ||
      branchResult?.Item?.institutionID?.S ||
      null;

    if (!institutionId) {
      console.log(`Skipped ${summaryId}: branch ${branchId} has no institution key.`);
      continue;
    }

    const summaryKeyPath = writeTempJson({ id: { S: summaryId } }, "summary-key.json");
    const attrValuesPath = writeTempJson(
      { ":institutionID": { S: institutionId } },
      "attr-values.json",
    );

    execAws([
      "--no-cli-pager",
      "dynamodb",
      "update-item",
      "--table-name",
      summaryTable,
      "--key",
      `file://${summaryKeyPath}`,
      "--update-expression",
      "SET institutionID = :institutionID",
      "--expression-attribute-values",
      `file://${attrValuesPath}`,
      "--region",
      region,
    ]);

    patched += 1;
    console.log(`Patched ${summaryId} -> institution ${institutionId}`);
  }

  console.log(`Patched ${patched} LoanSummary rows in ${summaryTable}.`);
};

main();