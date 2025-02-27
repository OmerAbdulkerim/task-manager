#!/usr/bin/env node

// Simple script to run lint-staged
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Get the project root directory
const projectRoot = __dirname;
const backendDir = path.join(projectRoot, 'backend');
const frontendDir = path.join(projectRoot, 'frontend');

// Function to run prettier with fallback options
function runPrettier(directory, patterns) {
    console.log(`Running prettier on ${path.basename(directory)} files...`);
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

try {
    // Run prettier on backend files
    runPrettier(backendDir, "**/*.{ts,js,json}");
    
    // Run prettier on frontend files
    runPrettier(frontendDir, "**/*.{js,jsx,ts,tsx,json,css,scss,md}");
    
    console.log('All formatting complete!');
} catch (error) {
    console.error('Error during formatting:', error.message);
    process.exit(1);
}
