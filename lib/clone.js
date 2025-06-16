const fs = require('fs-extra');
const path = require('path');
const os = require('os');
const simpleGit = require('simple-git');

const TEMPLATE_REPO = 'https://github.com/awesamarth/privy-embedded-starter.git';

async function cloneTemplate(targetPath) {
  // Create a temporary directory for cloning
  const tempDir = path.join(os.tmpdir(), `privy-template-${Date.now()}`);
  
  try {
    // Clone from git repository
    const git = simpleGit();
    await git.clone(TEMPLATE_REPO, tempDir, ['--depth', '1']);
    
    // Remove .git directory from cloned template
    await fs.remove(path.join(tempDir, '.git'));
    
    // Copy from temp directory to target, excluding unwanted files
    await fs.copy(tempDir, targetPath, {
      filter: (src) => {
        const basename = path.basename(src);
        
        // Skip these files and directories
        const skipPatterns = [
          'node_modules',
          '.git',
          '.next',
          'out',
          'cache',
          '.env.local',
          'pnpm-lock.yaml',
          'yarn.lock',
          'package-lock.json'
        ];
        
        return !skipPatterns.includes(basename);
      }
    });
    
    // Clean up temp directory
    await fs.remove(tempDir);
    
  } catch (error) {
    // Clean up temp directory on error
    if (await fs.pathExists(tempDir)) {
      await fs.remove(tempDir);
    }
    throw new Error(`Failed to clone template: ${error.message}`);
  }
}

module.exports = { cloneTemplate };