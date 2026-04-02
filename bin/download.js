#!/usr/bin/env node

const https = require('https');
const fs = require('fs');
const path = require('path');
const os = require('os');
const zlib = require('zlib');

const VERSION = '0.2.0';
const GITHUB_REPO = 'aliirz/phntm-cli';

// Map platform and arch to binary names
const getBinaryName = () => {
  const platform = os.platform();
  const arch = os.arch();

  const mappings = {
    'darwin-x64': 'phntm_0.2.0_darwin_amd64.tar.gz',
    'darwin-arm64': 'phntm_0.2.0_darwin_arm64.tar.gz',
    'linux-x64': 'phntm_0.2.0_linux_amd64.tar.gz',
    'linux-arm64': 'phntm_0.2.0_linux_arm64.tar.gz',
    'win32-x64': 'phntm_0.2.0_windows_amd64.zip',
    'win32-arm64': 'phntm_0.2.0_windows_arm64.zip'
  };

  const key = `${platform}-${arch}`;
  return mappings[key];
};

const download = (url, dest) => {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);

    const request = (url) => {
      https.get(url, (response) => {
        if (response.statusCode === 302 || response.statusCode === 301) {
          request(response.headers.location);
          return;
        }

        if (response.statusCode !== 200) {
          reject(new Error(`Failed to download: ${response.statusCode}`));
          return;
        }

        response.pipe(file);
        file.on('finish', () => {
          file.close();
          resolve();
        });
      }).on('error', reject);
    };

    request(url);
  });
};

const extract = (archivePath, destDir) => {
  const platform = os.platform();
  const isWindows = platform === 'win32';
  const ext = path.extname(archivePath);

  if (ext === '.zip') {
    // For zip files, use built-in unzip (macOS/Linux) or PowerShell (Windows)
    const cmd = isWindows
      ? `powershell -Command "Expand-Archive -Path '${archivePath}' -DestinationPath '${destDir}'"`
      : `unzip -o "${archivePath}" -d "${destDir}"`;
    require('child_process').execSync(cmd, { stdio: 'inherit' });
  } else {
    // For tar.gz files
    require('child_process').execSync(`tar -xzf "${archivePath}" -C "${destDir}"`, { stdio: 'inherit' });
  }
};

const main = async () => {
  const binaryName = getBinaryName();

  if (!binaryName) {
    console.error(`Unsupported platform: ${os.platform()}-${os.arch()}`);
    process.exit(1);
  }

  const downloadUrl = `https://github.com/${GITHUB_REPO}/releases/download/v${VERSION}/${binaryName}`;
  const binariesDir = path.join(__dirname, 'binaries');
  const platformDir = path.join(binariesDir, os.platform(), os.arch());
  const archivePath = path.join(binariesDir, binaryName);

  // Create directories
  fs.mkdirSync(platformDir, { recursive: true });

  console.log(`Downloading phntm v${VERSION} for ${os.platform()}-${os.arch()}...`);

  try {
    // Download archive
    await download(downloadUrl, archivePath);

    // Extract
    console.log('Extracting...');
    extract(archivePath, platformDir);

    // Cleanup archive
    fs.unlinkSync(archivePath);

    // Make binary executable (Unix)
    if (os.platform() !== 'win32') {
      const binaryPath = path.join(platformDir, 'phntm');
      fs.chmodSync(binaryPath, 0o755);
    }

    console.log('phntm installed successfully!');
  } catch (error) {
    console.error('Failed to download phntm:', error.message);
    console.error('Please install manually: https://github.com/aliirz/phntm-cli#install');
    process.exit(1);
  }
};

main();