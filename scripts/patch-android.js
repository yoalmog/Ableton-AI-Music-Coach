import fs from 'fs';
import path from 'path';

const appBuildGradlePath = path.resolve('android', 'app', 'build.gradle');

console.log('Checking for android/app/build.gradle to patch Java compatibility...');

if (fs.existsSync(appBuildGradlePath)) {
  let content = fs.readFileSync(appBuildGradlePath, 'utf8');
  
  // Replace sourceCompatibility and targetCompatibility with VERSION_17
  content = content.replace(/sourceCompatibility\s+JavaVersion\.VERSION_\d+/g, 'sourceCompatibility JavaVersion.VERSION_17');
  content = content.replace(/targetCompatibility\s+JavaVersion\.VERSION_\d+/g, 'targetCompatibility JavaVersion.VERSION_17');
  
  // Also check compileOptions if present
  if (!content.includes('sourceCompatibility JavaVersion.VERSION_17')) {
    // If not found, inject into compileOptions if compileOptions exists
    if (content.includes('compileOptions {')) {
      content = content.replace(
        'compileOptions {',
        'compileOptions {\n        sourceCompatibility JavaVersion.VERSION_17\n        targetCompatibility JavaVersion.VERSION_17'
      );
    }
  }

  fs.writeFileSync(appBuildGradlePath, content, 'utf8');
  console.log('Successfully patched android/app/build.gradle to Java 17 compatibility.');
} else {
  console.log('android/app/build.gradle not found yet. Skipping patch.');
}
