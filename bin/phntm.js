#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');
const os = require('os');

// Get the binary path based on platform
const platform = os.platform();
const arch = os.arch();

let binaryName = 'phntm';
if (platform === 'win32') {
  binaryName = 'phntm.exe';
}

const binaryPath = path.join(__dirname, 'binaries', platform, arch, binaryName);

// Get arguments from command line
const args = process.argv.slice(2);

try {
  // Execute the binary with all arguments
  execSync(`"${binaryPath}" ${args.map(a => `"${a}"`).join(' ')}`, {
    stdio: 'inherit',
    env: { ...process.env }
  });
} catch (error) {
  process.exit(error.status || 1);
}