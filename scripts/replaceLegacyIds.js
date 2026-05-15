const fs = require('fs');
const path = require('path');

const directory = './amplify/backend/function';

function replaceInFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  let newContent = content
    .replace(/institutionUsersId/g, 'institutionID')
    .replace(/branchUsersId/g, 'branchID')
    .replace(/institutionBranchesId/g, 'institutionID')
    .replace(/institutionAccountsId/g, 'institutionID');

  if (content !== newContent) {
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`Updated: ${filePath}`);
  }
}

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (file.endsWith('.js') || file.endsWith('.jsx')) {
      replaceInFile(fullPath);
    }
  }
}

processDirectory(directory);
console.log('Done replacing legacy IDs throughout src directory.');