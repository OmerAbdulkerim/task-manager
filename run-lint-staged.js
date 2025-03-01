#!/usr/bin/env node

// Script to run lint-staged with formatting check first
const { execSync, spawnSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Get the project root directory
const projectRoot = __dirname;
const backendDir = path.join(projectRoot, 'backend');
const frontendDir = path.join(projectRoot, 'frontend');

// Function to check if files have formatting issues
function checkFormatting(directory, patterns) {
    console.log(`Checking formatting in ${path.basename(directory)} files...`);
    try {
        // Check formatting without writing changes
        execSync(`npx prettier --check --ignore-unknown "${patterns}"`, { 
            cwd: directory,
            // Use stdio: 'pipe' to capture output without displaying it
            stdio: 'pipe'
        });
        // If we reach here, all files are properly formatted
        return true;
    } catch (error) {
        console.log(`❌ Formatting issues found in ${path.basename(directory)} files`);
        return false;
    }
}

// Function to run prettier to fix formatting
function runPrettier(directory, patterns) {
    console.log(`Applying formatting to ${path.basename(directory)} files...`);
    try {
        // Try using npx first
        execSync(`npx prettier --write --ignore-unknown "${patterns}"`, { 
            stdio: 'inherit',
            cwd: directory
        });
    } catch (error) {
        console.log(`Falling back to direct node execution for ${path.basename(directory)}...`);
        try {
            // Fallback to direct node execution
            const prettierPath = path.join(directory, 'node_modules', 'prettier', 'bin-prettier.js');
            if (fs.existsSync(prettierPath)) {
                execSync(`node "${prettierPath}" --write --ignore-unknown "${patterns}"`, {
                    stdio: 'inherit',
                    cwd: directory
                });
            } else {
                // Try global prettier
                const rootPrettierPath = path.join(projectRoot, 'node_modules', 'prettier', 'bin-prettier.js');
                if (fs.existsSync(rootPrettierPath)) {
                    execSync(`node "${rootPrettierPath}" --write --ignore-unknown "${patterns}"`, {
                        stdio: 'inherit',
                        cwd: directory
                    });
                } else {
                    throw new Error(`Could not find prettier module in ${directory} or root`);
                }
            }
        } catch (fallbackError) {
            console.error(`Failed to run prettier in ${path.basename(directory)}:`, fallbackError.message);
            throw fallbackError;
        }
    }
}

// Check formatting in backend and frontend
let backendFormatted = checkFormatting(backendDir, "**/*.{ts,js,json}");
let frontendFormatted = checkFormatting(frontendDir, "**/*.{js,jsx,ts,tsx,json,css,scss,md}");

// If any directory has formatting issues
if (!backendFormatted || !frontendFormatted) {
    console.log('\n❌ Commit failed due to formatting issues');
    console.log('🔄 Auto-formatting code...');
    
    // Fix formatting
    if (!backendFormatted) {
        runPrettier(backendDir, "**/*.{ts,js,json}");
    }
    
    if (!frontendFormatted) {
        runPrettier(frontendDir, "**/*.{js,jsx,ts,tsx,json,css,scss,md}");
    }
    
    console.log('\n✅ Code has been auto-formatted');
    console.log('📝 Please stage the changes and try committing again');
    process.exit(1); // Exit with error to prevent the commit
} else {
    console.log('✅ All files are properly formatted');
}
