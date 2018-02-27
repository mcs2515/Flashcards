// pull in the file system module
const fs = require('fs');


// variables
const index = fs.readFileSync(`${__dirname}/../hosted/client.html`);
const css = fs.readFileSync(`${__dirname}/../hosted/style.css`);
const helptip = fs.readFileSync(`${__dirname}/../hosted/helptip.css`);

//added script to pull in our js bundle. This script is generated
//by our babel build/watch scripts in our package.json
const jsBundle = fs.readFileSync(`${__dirname}/../hosted/bundle.js`);

const getIndex = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(index);
  response.end();
};

// function to get css page
const getCSS = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/css' });
  response.write(css);
  response.end();
};

const getHelpTip = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/css' });
  response.write(helptip);
  response.end();
};

//function to get our js file in our hosted folder.
const getBundle = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'application/javascript' });
  response.write(jsBundle);
  response.end();
};

// making methods public now
module.exports = {
  getIndex,
  getCSS,
	getHelpTip,
	getBundle,
};
