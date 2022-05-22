const fs = require('fs/promises');
const path = require('path');

const from = path.join(__dirname, 'styles');
const to = path.join(__dirname,'project-dist','bundle.css');

let parts = [];

(async () => {
  const folderContent = await fs.readdir(from, {withFileTypes:true});

  for (let file of folderContent) {
    const filePath = path.join(from, file.name);
    const fileType = path.extname(filePath);
    if (fileType === '.css'){
      const part = await fs.readFile(filePath, 'utf-8');
      parts.push(part);
    } 
  }

  await fs.writeFile(to, parts);
})();