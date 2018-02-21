// json object to send
const cards = {};


// function to respond with a json object
// takes request, response, status code and object to send
const respondJSON = (request, response, status, obj) => {
  const headers = {
    'Content-Type': 'application/json',
  };

  // send response with json object
  response.writeHead(status, headers);
  response.write(JSON.stringify(obj));
  response.end();
};

const respondJSONMeta = (request, response, status) => {
  const headers = { 'Content-Type': 'application/json' };

  // send response with json object
  response.writeHead(status, headers);
  response.end();
};


const getCards = (request, response) => {
  const responseJSON = { cards };
  // Send 200 w/ object
  respondJSON(request, response, 200, responseJSON);
};

const getCardsMeta = (request, response) => {
  // Send 200 w/o object
  respondJSONMeta(request, response, 200);
};

const addCards = (request, response, body) => {
  const status = 201;

  // default json message
  const responseJSON = {
    message: 'Question and answer are both required.',
  };

  // If either are missing, send back an error message as a 400 badRequest
  if (!body.question || !body.answer) {
    responseJSON.id = 'missingParams';
    return respondJSON(request, response, 400, responseJSON);
  }

  // then switch to a 204 updated status
  //  if (cards[body.topic].name) {
  //    // if user already exist, then switch to a 204 updated status
  //    status = 204;
  //  } else {
  // otherwise create an object with that topic
  cards[body.question] = {};
  //  }

  // add or update fields for this topic
	cards[body.question].topic = body.topic;
  cards[body.question].question = body.question;
  cards[body.question].answer = body.answer;


  if (status === 201) {
    responseJSON.message = 'Created Successfully';
		responseJSON.cards = cards; //send last card in list
		
		console.log(cards );
    // send 200 w/ object
    return respondJSON(request, response, status, responseJSON);
  }

  // Send 204 w/o object
  return respondJSONMeta(request, response, status);
};

// function for 404 not found requests with message
const notFound = (request, response) => {
  const responseJSON = { message: 'The page you are looking for was not found.', id: 'notFound' };
  // Send 404 w/ message
  respondJSON(request, response, 404, responseJSON);
};

// function for 404 not found requests with message
const notFoundMeta = (request, response) => {
  // Send 404 w/o message
  respondJSONMeta(request, response, 404);
};

// set public modules
module.exports = {
  getCards,
  getCardsMeta,
  addCards,
  notFound,
  notFoundMeta,
};
