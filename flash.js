import { execSync } from 'child_process';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

console.log('🔧 Checking sharp module...');

try {
    console.log(`Node version: ${process.version}`);

    try {
        require.resolve('sharp');
        await import('sharp');

        console.log('✅ Sharp is installed and working');
        process.exit(0);
    } catch {
        console.log('⚠️ Sharp not found, installing...');

        execSync('npm install sharp@0.33.5 --force', {
            stdio: 'inherit'
        });

        await import('sharp');
        console.log('✅ Sharp installed successfully');
        process.exit(0);
    }
} catch (error) {
    console.error('❌ Sharp fix failed:', error);
    process.exit(1);
}
