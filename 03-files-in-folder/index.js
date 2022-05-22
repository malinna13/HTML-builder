const fs = require('fs/promises');
const path = require('path');

(async () => {
  const folderContent = await fs.readdir(path.join(__dirname, 'secret-folder'), {withFileTypes:true});

  for (let item of folderContent) {
    if (item.isFile()){
      const fileName = item.name.split('.')[0];

      const filePath = path.join(__dirname, 'secret-folder', item.name);
      const fileType = path.extname(filePath).substring(1);
      const stats = await fs.stat(filePath);

      console.log(`${fileName} - ${fileType} - ${stats.size}b`);
    }
  }}
)();
