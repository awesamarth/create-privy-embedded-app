const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const ora = require('ora');
const prompts = require('prompts');
const { spawn } = require('child_process');
const { cloneTemplate } = require('./clone');
const { updateProjectFiles } = require('./setup');

async function createApp(projectName, options = {}) {
  let appName = projectName;
  let privyAppId = '';
  
  // If no project name provided, prompt for it
  if (!appName) {
    const response = await prompts({
      type: 'text',
      name: 'name',
      message: 'What is your project name?',
      initial: 'my-privy-app',
      validate: value => value.length > 0 ? true : 'Project name cannot be empty'
    });
    appName = response.name;
  }
  
  // If not using --yes flag, prompt for Privy App ID
  if (!options.yes) {
    const response = await prompts({
      type: 'text',
      name: 'privyAppId',
      message: 'What is your Privy App ID? (you can skip this and add it later)',
      initial: '',
    });
    privyAppId = response.privyAppId;
  }
  
  // Validate project name
  if (!appName || appName.trim() === '') {
    throw new Error('Project name is required');
  }
  
  // Create project directory
  const projectPath = path.resolve(process.cwd(), appName);
  
  // Check if directory already exists
  if (await fs.pathExists(projectPath)) {
    throw new Error(`Directory "${appName}" already exists`);
  }
  
  // Clone the template
  const spinner = ora('Cloning template...').start();
  try {
    await cloneTemplate(projectPath);
    spinner.succeed('Template cloned successfully');
  } catch (error) {
    spinner.fail('Failed to clone template');
    throw error;
  }
  
  // Update project files
  const updateSpinner = ora('Setting up project...').start();
  try {
    await updateProjectFiles(projectPath, appName, privyAppId);
    updateSpinner.succeed('Project setup complete');
  } catch (error) {
    updateSpinner.fail('Failed to setup project');
    throw error;
  }
  
  // Initialize git repository
  const gitSpinner = ora('Initializing git repository...').start();
  try {
    await initializeGit(projectPath);
    gitSpinner.succeed('Git repository initialized');
  } catch (error) {
    gitSpinner.fail('Failed to initialize git repository');
    console.log(chalk.yellow('You can initialize git manually later with: git init'));
  }
  
  // Install dependencies
  const packageManager = await detectPackageManager(projectPath);
  const installSpinner = ora(`Installing dependencies using ${packageManager}...`).start();
  try {
    await installDependencies(projectPath);
    installSpinner.succeed(`Dependencies installed successfully using ${packageManager}`);
  } catch (error) {
    installSpinner.fail('Failed to install dependencies');
    console.log(chalk.yellow(`You can install dependencies manually later with: ${packageManager} install`));
  }
  
  // Show success message and next steps
  console.log(chalk.green(`\n📦 Project created: ${chalk.bold(appName)}`));
  console.log(chalk.cyan('\n📋 Next steps:'));
  console.log(chalk.white(`  1. cd ${appName}`));
  
  if (!privyAppId) {
    console.log(chalk.yellow(`  2. Add your Privy App ID to .env.local`));
    console.log(chalk.white(`  3. npm run dev`));
  } else {
    console.log(chalk.white(`  2. npm run dev`));
  }
  
  console.log(chalk.green('\n🚀 Happy coding!'));
}

async function initializeGit(projectPath) {
  return new Promise((resolve, reject) => {
    const git = spawn('git', ['init'], { 
      cwd: projectPath, 
      stdio: 'ignore' 
    });
    
    git.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Git init failed with code ${code}`));
      }
    });
    
    git.on('error', (error) => {
      reject(error);
    });
  });
}

async function detectPackageManager(projectPath) {
  // Check for lock files to determine preferred package manager
  if (await fs.pathExists(path.join(projectPath, 'pnpm-lock.yaml'))) {
    return 'pnpm';
  }
  if (await fs.pathExists(path.join(projectPath, 'yarn.lock'))) {
    return 'yarn';
  }
  if (await fs.pathExists(path.join(projectPath, 'package-lock.json'))) {
    return 'npm';
  }
  
  // Default fallback: check if pnpm/yarn are available
  try {
    await new Promise((resolve, reject) => {
      const pnpm = spawn('pnpm', ['--version'], { stdio: 'ignore' });
      pnpm.on('close', (code) => code === 0 ? resolve() : reject());
      pnpm.on('error', reject);
    });
    return 'pnpm';
  } catch {
    try {
      await new Promise((resolve, reject) => {
        const yarn = spawn('yarn', ['--version'], { stdio: 'ignore' });
        yarn.on('close', (code) => code === 0 ? resolve() : reject());
        yarn.on('error', reject);
      });
      return 'yarn';
    } catch {
      return 'npm';
    }
  }
}

async function installDependencies(projectPath) {
  const packageManager = await detectPackageManager(projectPath);
  const installCommand = packageManager === 'npm' ? 'install' : 'install';
  
  return new Promise((resolve, reject) => {
    const install = spawn(packageManager, [installCommand], { 
      cwd: projectPath, 
      stdio: 'ignore' 
    });
    
    install.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`${packageManager} install failed with code ${code}`));
      }
    });
    
    install.on('error', (error) => {
      reject(error);
    });
  });
}

module.exports = { createApp };