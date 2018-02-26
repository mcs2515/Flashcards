"use strict";

var totalCards = $('.card:visible').length;
console.log("total cards start: " + totalCards);

var handleResponse = function handleResponse(xhr) {

	var content = document.querySelector("#content");

	switch (xhr.status) {
		case 200:
			//success in getting
			displayCards(content, xhr);
			break;
		case 201:
			//sucess in creating
			createCard(content, xhr);
			break;
		case 204:
			//updated
			//displayCards(content,xhr);
			break;
		case 400:
			//bad request
			//content.innerHTML = '<h1>Bad Request</h1>';
			break;
		case 404:
			//bad request
			//content.innerHTML = '<h1>Bad Request</h1>';
			break;
		default:
			//content.innerHTML = `<h1>Resource Not Found</h1>`;
			break;
	}
};

var addCard = function addCard(e, addForm) {
	//grab the forms action (url to go to)
	//and method (HTTP method - POST in this case)
	var action = addForm.getAttribute('action');
	var method = addForm.getAttribute('method');

	//grab the form's name and age fields so we can check user input
	var topicField = addForm.querySelector('#topicField');
	var questionField = addForm.querySelector('#questionField');
	var answerField = addForm.querySelector('#answerField');

	var xhr = new XMLHttpRequest();

	xhr.open(method, action);
	xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	xhr.setRequestHeader('Accept', 'application/json');

	//if get request or head request
	if (method == 'post') {
		//set onload to parse request and get json message
		xhr.onload = function () {
			return handleResponse(xhr);
		};
	}

	//build our x-www-form-urlencoded format
	var formData = "topic=" + topicField.value + "&question=" + questionField.value + "&answer=" + answerField.value;

	xhr.send(formData);

	//cancel browser's default action
	e.preventDefault();
	//return false to prevent page redirection from a form
	return false;
};

var createCard = function createCard(content, xhr) {

	var obj = JSON.parse(xhr.response);

	if (Object.keys(obj.cards)) {

		totalCards++;

		//last card in object
		var cardName = Object.keys(obj.cards)[Object.keys(obj.cards).length - 1];
		var card = obj.cards[cardName];
		console.log(obj.cards);
		//console.log(cardName);

		createTemplate(totalCards, card.topic, card.question, card.answer);
	}
};

var getCards = function getCards(e, searchForm) {

	//grab the forms action (url to go to)
	//and method (HTTP method - POST in this case)
	var action = searchForm.getAttribute('action');
	var method = searchForm.getAttribute('method');

	var xhr = new XMLHttpRequest();

	xhr.open(method, action);
	xhr.setRequestHeader('Accept', 'application/json');

	//if get request or head request
	if (method == 'get') {
		//set onload to parse request and get json message
		xhr.onload = function () {
			return handleResponse(xhr);
		};
	}

	xhr.send();
	//cancel browser's default action
	e.preventDefault();
	//return false to prevent page redirection from a form
	return false;
};

var displayCards = function displayCards(content, xhr) {

	var obj = JSON.parse(xhr.response);

	var subjectField = addForm.querySelector('#subjectField');

	if (obj.cards.length > 0) {
		//if card obj list is not empty

		//clear content
		content.innerHTML = "";

		for (var i = 0; i < obj.cards.length; i++) {

			var card = obj[cards[i]]; //get card object at index

			//if topic is all
			if (subjectField.value === 'All') {
				createTemplate(i, card.topic, card.question, card.answer);
				//console.log("displaying only certain cards");
			} else {
				//if card topic matches with the search topic
				if (obj[cards[i]].topic === subjectField.value) {
					//send only the filtered topic
					createTemplate(i, card.topic, card.question, card.answer);
					//console.log("displaying only certain cards");
				}
			}
		}
	}
};

var createTemplate = function createTemplate(num, topic, question, answer) {
	var html = "";

	//do some concatenation
	html += "<div class='card' id='card-" + num + "'>"; //card number

	html += "<div class='front'>";
	html += "<div class= 'topicId'>Topic: " + topic + "</div>"; //card topic
	html += "<div class='cardContent'>";
	html += "<p><strong>Q: </strong>" + question + "</p>";
	html += "</div>";
	html += "</div>";

	html += "<div class='back'>";
	html += "<div class= 'topicId'>Topic: " + topic + "</div>"; //card topic
	html += "<div class='cardContent'>";
	html += "<p><strong>A: </strong>" + answer + "</p>";
	html += "</div>";
	html += "</div>";

	html += "</div>";

	content.innerHTML += html;

	$("div[id^=card-]").flip(); //apply flip animations

	//reset cards to question side
	$("div[id^=card-]").trigger("click");
	$("div[id^=card-]").trigger("click");
};

var init = function init() {
	//grab form
	var addForm = document.querySelector('#addForm');
	var searchForm = document.querySelector('#searchForm');

	var questionField = document.querySelector('#questionField');
	var answerField = document.querySelector('#answerField');

	addForm.addEventListener('submit', function (e) {
		addCard(e, addForm);
		questionField.value = ''; //empty out field
		answerField.value = ''; //empty out field
	});

	searchForm.addEventListener('submit', function (e) {
		getCards(e, searchForm);
	});
};

window.onload = init;
