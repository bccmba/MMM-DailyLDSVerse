# GitHub Actions Workflows

This directory contains GitHub Actions workflows for CI/CD automation.

## Workflows

### `ci.yml`
Main CI workflow that runs on every push and pull request:
- Runs all test suites
- Validates code syntax
- Verifies module structure
- Tests on Node.js 18.x and 20.x

### `release.yml`
Release verification workflow:
- Runs when a release is created
- Verifies version and documentation
- Ensures all tests pass before release

## Setup

These workflows are automatically enabled when pushed to the repository. No additional setup is required.

## Customization

Edit the workflow files to:
- Change Node.js versions
- Add additional test steps
- Modify triggers
- Add deployment steps

