import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔧 Fixing sharp module...');

try {
    const nodeVersion = process.version;
    console.log(`Node version: ${nodeVersion}`);

    // Do NOT delete sharp anymore
    console.log('📦 Keeping installed sharp module...');

    // Rebuild sharp safely
    execSync('npm rebuild sharp --force', {
        stdio: 'inherit',
        cwd: __dirname
    });

    // Test import
    await import('sharp');

    console.log('✅ Sharp module fixed successfully!');

} catch (error) {
    console.error('❌ Sharp fix failed:', error);
    process.exit(1);
}
