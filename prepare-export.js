const fs = require('fs');
const path = require('path');

// Remove API routes (not needed for static export)
const apiDir = path.join(__dirname, 'src', 'app', 'api');
if (fs.existsSync(apiDir)) {
  fs.rmSync(apiDir, { recursive: true, force: true });
}

// Write static export config
fs.writeFileSync(path.join(__dirname, 'next.config.js'), `/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "export",
  images: { unoptimized: true },
};
module.exports = nextConfig;
`);

console.log('Static export config ready');
