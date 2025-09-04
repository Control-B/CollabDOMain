#!/usr/bin/env node
/* eslint-env node */
const fs = require('fs');
const path = require('path');

// Create a timestamp file to trigger hot reload
const timestampFile = path.join(process.cwd(), '.dev-timestamp');

function triggerRefresh() {
  const timestamp = new Date().toISOString();
  fs.writeFileSync(timestampFile, timestamp);
  console.log(`🔄 Triggered refresh at ${timestamp}`);
}

// Watch for file changes and trigger refresh
if (process.argv.includes('--watch')) {
  const chokidar = require('chokidar');

  const watcher = chokidar.watch(
    [
      'app/**/*.{ts,tsx,js,jsx}',
      'components/**/*.{ts,tsx,js,jsx}',
      'hooks/**/*.{ts,tsx,js,jsx}',
      'store/**/*.{ts,tsx,js,jsx}',
    ],
    {
      ignored: /(^|[\/\\])\../,
      persistent: true,
    }
  );

  watcher.on('change', (filePath) => {
    console.log(`📝 File changed: ${filePath}`);
    setTimeout(triggerRefresh, 100);
  });

  console.log('👀 Watching for file changes...');
} else {
  triggerRefresh();
}
