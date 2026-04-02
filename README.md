# phntm

Encrypted file sharing from the terminal. Zero-knowledge, self-destructing files.

This is an npm wrapper that downloads the official PHNTM CLI binary for your platform.

## Install

```bash
npm install -g phntm
```

Or with your favorite package manager:

```bash
yarn global add phntm
pnpm add -g phntm
```

## Usage

```bash
# Upload a file (24h expiry default)
phntm send report.pdf

# Upload with custom expiry
phntm send secrets.tar.gz --expiry 1h

# Download & decrypt
phntm get https://phntm.sh/f/abc123#key

# Shorthand — just pass the file
phntm report.pdf
```

## How it works

This package downloads the official pre-built binary from [GitHub Releases](https://github.com/aliirz/phntm-cli/releases) during installation.

Supported platforms:
- macOS (Intel & Apple Silicon)
- Linux (amd64 & arm64)
- Windows (amd64 & arm64)

## What is PHNTM?

PHNTM is an encrypted, self-destructing file sharing tool. Files are encrypted locally before upload. The decryption key lives in the URL fragment — servers never see it. Files self-destruct after 1, 6, or 24 hours.

Learn more at [phntm.sh](https://phntm.sh).

## License

MIT