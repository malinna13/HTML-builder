const f = require('fs');
const fs = require('fs/promises');
const path = require('path');

const components = path.join(__dirname, 'components');
const assets = path.join(__dirname, 'assets');
const css = path.join(__dirname, 'styles');
const template = path.join(__dirname, 'template.html');

const projectDist = path.join(__dirname, 'project-dist');
const newAssets = path.join(projectDist, 'assets');
const newCss = path.join(projectDist,'style.css');
const newHtml = path.join(projectDist, 'index.html');

async function createFolder (path) {
  f.access(projectDist, (err) => {
    if (err) {
      fs.mkdir(path);
    }
  });
}

async function createFile (path, content) {
  return await fs.writeFile(path, content);
}

async function mergeCss() {
  let parts = [];
  const folderContent = await fs.readdir(css, {withFileTypes: true});

  for (let item of folderContent) {
    const filePath = path.join(css, item.name);
    const fileType = path.extname(filePath);
    if (fileType === '.css'){
      const part = await fs.readFile(filePath, 'utf-8');
      parts.push(part);
    } 
  }

  createFile(newCss, parts);
}

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

async function pasteComponents() {
  let html = await fs.readFile(template, 'utf-8');
  const componentsFiles = await fs.readdir(components, {withFileTypes:true});

  for(let item of componentsFiles) {
    const component = await fs.readFile(path.join(components, `${item.name}`), 'utf-8');
    const regExp = new RegExp(`{{${(item.name).split('.')[0]}}}`, 'g');
    html = html.replace(regExp,component);
  }
  createFile(newHtml, html);
}

async function build(){
  createFolder(projectDist);
  mergeCss();
  copyDir(assets, newAssets);
  pasteComponents();
}

build();