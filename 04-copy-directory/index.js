const f = require('fs');
const fs = require('fs/promises');
const path = require('path');

const folder = path.join(__dirname, 'files');
const newFolder = path.join(__dirname, 'files-copy');

f.access(newFolder, (error) => {
  if (error) {
    fs.mkdir(newFolder);
  } 
});
async function copyDir(from, to) {
  await fs.rm(to, {force:true, recursive: true});
  await fs.mkdir(to, {recursive: true});

  const folderContent = await fs.readdir(from, {withFileTypes:true});
  for (let item of folderContent) {
    const fromPath = path.join(from, item.name);
    const toPath = path.join(to, item.name);

    if (item.isDirectory()){
      await fs.mkdir(toPath, {recursive:true});
      await copyDir(fromPath, toPath);
    } else if (item.isFile()) {
      await fs.copyFile(fromPath,toPath);
    }

  }
}

copyDir(folder, newFolder);