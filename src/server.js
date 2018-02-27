const http = require('http');
const url = require('url');
const query = require('querystring');
const htmlHandler = require('./htmlResponses.js');
const jsonHandler = require('./jsonResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

// handle POST requests
const handlePost = (request, response, parsedUrl) => {
  // if post is to /addUser
  if (parsedUrl.pathname === '/addCard' || parsedUrl.pathname === '/editCard') {
    // byte array
    const body = [];

    // if the upload stream errors out
    request.on('error', (err) => {
      console.dir(err);
      response.statusCode = 400;
      response.end();
      console.log('reached error');
    });

    // add it to our byte array.
    request.on('data', (chunk) => {
      body.push(chunk);
    });

    // on end of upload stream.
    request.on('end', () => {
      // combine our byte array &convert it to a string
      const bodyString = Buffer.concat(body).toString();

      // Parse the string into an object by field name
      const bodyParams = query.parse(bodyString);

      // pass to our addUser function
      jsonHandler.addCards(request, response, bodyParams);
    });
  }
};

// handle GET requests
const handleGet = (request, response, parsedUrl) => {
  // route to correct method based on url
  if (parsedUrl.pathname === '/') {
    htmlHandler.getIndex(request, response);
  } else if (parsedUrl.pathname === '/style.css') {
    htmlHandler.getCSS(request, response);
  } else if (parsedUrl.pathname === '/getCards') {
    jsonHandler.getCards(request, response);
		console.log("ahhhhhh");
  } else if (parsedUrl.pathname === '/bundle.js') {
    htmlHandler.getBundle(request, response);
  } else {
    jsonHandler.notFound(request, response);
  }
};

// handle HEAD requests
const handleHead = (request, response, parsedUrl) => {
  if (parsedUrl.pathname === '/getCards') {
    // if get users, send meta data back
    jsonHandler.getCardsMeta(request, response);
  } else {
    // if not found send 404 without body
    jsonHandler.notFoundMeta(request, response);
  }
};

const onRequest = (request, response) => {
  // parse url into individual parts
  // returns an object of url parts by name
  const parsedUrl = url.parse(request.url);

  // check the request method (get, head, post, etc)
  switch (request.method) {
    case 'GET':
      handleGet(request, response, parsedUrl);
      break;
    case 'HEAD':
      handleHead(request, response, parsedUrl);
      break;
    case 'POST':
      handlePost(request, response, parsedUrl);
      break;
    default:
      // send 404 in any other case
      jsonHandler.notFound(request, response);
      break;
  }
};

http.createServer(onRequest).listen(port);

console.log(`Listening on 127.0.0.1: ${port}`);
