const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Read current version from package.json
const packagePath = path.join(__dirname, '../package.json');
const package = require(packagePath);
const currentVersion = package.version;

function bumpVersion(version, type) {
    const [major, minor, patch] = version.split('.').map(Number);
    switch (type) {
        case 'major':
            return `${major + 1}.0.0`;
        case 'minor':
            return `${major}.${minor + 1}.0`;
        case 'patch':
            return `${major}.${minor}.${patch + 1}`;
        default:
            throw new Error('Invalid version type. Use: major, minor, or patch');
    }
}

function publish(type) {
    try {
        // Ensure we're on main/master branch
        const currentBranch = execSync('git branch --show-current').toString().trim();
        if (!['main', 'master'].includes(currentBranch)) {
            throw new Error('Must be on main or master branch to publish');
        }

        // Ensure working directory is clean
        const status = execSync('git status --porcelain').toString().trim();
        if (status) {
            throw new Error('Working directory is not clean. Commit or stash changes first.');
        }

        // Pull latest changes
        execSync('git pull origin ' + currentBranch);

        // Calculate new version
        const newVersion = bumpVersion(currentVersion, type);
        console.log(`Publishing version ${newVersion}...`);

        // Update package.json
        package.version = newVersion;
        fs.writeFileSync(packagePath, JSON.stringify(package, null, 2) + '\n');

        // Build and test if needed
        // execSync('npm run build', { stdio: 'inherit' });
        // execSync('npm test', { stdio: 'inherit' });

        // Commit version bump
        execSync(`git add package.json`);
        execSync(`git commit -m "chore: bump version to ${newVersion}"`);
        execSync(`git tag v${newVersion}`);

        // Push changes and tags
        execSync(`git push origin ${currentBranch}`);
        execSync(`git push origin v${newVersion}`);

        // Publish to npm
        execSync('npm publish --access public', { stdio: 'inherit' });

        console.log(`✨ Successfully published version ${newVersion}`);
    } catch (error) {
        console.error('❌ Publication failed:', error.message);
        process.exit(1);
    }
}

// Get version type from command line argument
const type = process.argv[2];
if (!['major', 'minor', 'patch'].includes(type)) {
    console.error('Please specify version type: major, minor, or patch');
    process.exit(1);
}

publish(type); 