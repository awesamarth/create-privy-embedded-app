const fs = require('fs-extra');
const path = require('path');

async function updateProjectFiles(projectPath, projectName, privyAppId = '') {
  // Update package.json with new project name
  await updatePackageJson(projectPath, projectName);
  
  // Create .env.local file with Privy App ID if provided
  await createEnvFile(projectPath, privyAppId);
  
  // Update README.md with project name
  await updateReadme(projectPath, projectName);
}

async function updatePackageJson(projectPath, projectName) {
  const packageJsonPath = path.join(projectPath, 'package.json');
  
  if (await fs.pathExists(packageJsonPath)) {
    const packageJson = await fs.readJson(packageJsonPath);
    packageJson.name = projectName;
    // Remove private field and version for user projects
    delete packageJson.private;
    packageJson.version = '0.1.0';
    await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
  }
}

async function createEnvFile(projectPath, privyAppId) {
  const envPath = path.join(projectPath, '.env.local');
  
  let envContent = '';
  if (privyAppId && privyAppId.trim() !== '') {
    envContent = `NEXT_PUBLIC_PROJECT_ID=${privyAppId.trim()}\n`;
  } else {
    envContent = `# Add your Privy App ID here\nNEXT_PUBLIC_PROJECT_ID=your_privy_app_id_here\n`;
  }
  
  await fs.writeFile(envPath, envContent);
}

async function updateReadme(projectPath, projectName) {
  const readmePath = path.join(projectPath, 'README.md');
  
  if (await fs.pathExists(readmePath)) {
    let readmeContent = await fs.readFile(readmePath, 'utf8');
    
    // Replace the title
    readmeContent = readmeContent.replace(
      /# Privy Embedded Wallet Starter/g,
      `# ${projectName}`
    );
    
    // Update the clone instructions
    readmeContent = readmeContent.replace(
      /git clone https:\/\/github\.com\/awesamarth\/privy-embedded-starter\.git\n   cd privy-embedded-starter/g,
      `# This project was created with create-privy-embedded-app\n   # cd ${projectName}`
    );
    
    await fs.writeFile(readmePath, readmeContent);
  }
}

module.exports = { updateProjectFiles };