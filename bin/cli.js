#!/usr/bin/env node

const { Command } = require('commander');
const chalk = require('chalk');
const fs = require('fs-extra');
const path = require('path');
const { createApp } = require('../lib/create');

const program = new Command();

program
  .name('create-privy-embedded-app')
  .description('Create a new Privy embedded wallet application')
  .version('1.0.0')
  .argument('[project-name]', 'name of the project')
  .option('-y, --yes', 'skip all prompts and use defaults')
  .action(async (projectName, options) => {
    try {
      console.log(chalk.blue.bold('\n🔐 Create Privy Embedded App\n'));
      
      await createApp(projectName, options);
      
      console.log(chalk.green.bold('\n✅ Success! Your Privy embedded app is ready.\n'));
    } catch (error) {
      console.error(chalk.red.bold('\n❌ Error creating app:'), error.message);
      process.exit(1);
    }
  });

program.parse();