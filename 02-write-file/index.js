const fs = require('fs');
const path = require('path');
const { stdin, stdout } = process;


const output = fs.createWriteStream(path.join(__dirname, 'text.txt'));


stdout.write('Enter your text\n');
stdin.on('data' , data => { 
  if (data.toString().trim() === 'exit') {
    stdout.write('Bye');
    process.exit();
  } else {
    output.write(data.toString());
  }
});

process.on('SIGINT', () => {
  stdout.write('Bye');
  process.exit();
});