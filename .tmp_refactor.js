const fs = require('fs');
const path = require('path');

const walkSync = (dir, filelist = []) => {
  fs.readdirSync(dir, { withFileTypes: true }).forEach(dirent => {
    const dirFile = path.join(dir, dirent.name);
    if (dirent.isDirectory()) {
      filelist = walkSync(dirFile, filelist);
    } else {
      filelist.push(dirFile);
    }
  });
  return filelist;
};

const files = walkSync('src/app/admin');
for (const file of files) {
  if (!file.endsWith('page.tsx')) continue;
  if (file.includes('layout.tsx')) continue;
  if (file === path.join('src','app','admin','page.tsx') || file === path.join('src','app','admin','settings','page.tsx')) continue; // Already did manually

  let content = fs.readFileSync(file, 'utf8');
  if (content.includes('import Header')) {
    content = content.replace(/import Header from '@\/components\/Header'\s*\n?/, '');
    content = content.replace(/import Footer from '@\/components\/Footer'\s*\n?/, '');
    content = content.replace(/<Header \/>\s*\n?/, '');
    content = content.replace(/<Footer \/>\s*\n?/, '');
    content = content.replace(/<div className=\"min-h-screen[^>]*>/, '<div className=\"py-8 sm:py-12\">');
    content = content.replace(/<main className=\"flex-1[^>]*>/, '');
    
    // Find the end to remove </main>
    if (content.includes('</main>')) {
        content = content.replace('</main>', '');
    }
    fs.writeFileSync(file, content);
    console.log('Processed:', file);
  }
}
