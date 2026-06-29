const fs = require('fs');
const path = require('path');

function searchDir(dir, pattern) {
  let results = [];
  try {
    const list = fs.readdirSync(dir);
    list.forEach(file => {
      file = path.join(dir, file);
      const stat = fs.statSync(file);
      if (stat && stat.isDirectory()) {
        if (!file.includes('node_modules') && !file.includes('.git') && !file.includes('.system_generated')) {
          results = results.concat(searchDir(file, pattern));
        }
      } else {
        try {
          const content = fs.readFileSync(file, 'utf8');
          if (content.includes(pattern)) {
            results.push(file);
          }
        } catch (e) {}
      }
    });
  } catch (e) {}
  return results;
}

const pattern = 'Task #1';
console.log('Searching in Expence...');
console.log(searchDir('c:/Users/suraj/Desktop/Expence', pattern));
console.log('Searching in .gemini...');
console.log(searchDir('C:/Users/suraj/.gemini', pattern));
