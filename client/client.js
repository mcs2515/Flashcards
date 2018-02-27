"use strict";

let totalCards = 0;
console.log("total cards start: " + totalCards);

const handleResponse = (xhr, parseResponse) => {

	const content = document.querySelector(`#content`);
	const status = document.getElementById("status");
	
	switch(xhr.status){
		case 200: //success in getting
			if(parseResponse){
				displayCards(content,xhr);
			}
			break;
		case 201: //success in creating
			if(parseResponse){
				createCard(content, xhr);
			}
			status.innerText = "Card added";
			break;
		case 204: //updated
			//update the cards by simulating a click for the search button
			$("#searchButton").trigger( 'click' );
			status.innerText = "Card edited";
			break;
		case 400: //bad request
			//content.innerHTML = '<h1>Bad Request</h1>';
			break;
		case 404: //not found
			break;
		default:
			//content.innerHTML = `<h1>Resource Not Found</h1>`;
			break;
	}
};

const addCard = (e, addForm) =>{
	//grab the forms action (url to go to)
	//and method (HTTP method - POST in this case)
	const action = addForm.getAttribute('action');
	const method = addForm.getAttribute('method');

	//grab the form's name and age fields so we can check user input
	const topicField = addForm.querySelector('#topicField');
	const questionField = addForm.querySelector('#questionField');
	const answerField = addForm.querySelector('#answerField');

	const xhr = new XMLHttpRequest();

	xhr.open(method, action);
	xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	xhr.setRequestHeader('Accept', 'application/json');

	//if get request or head request
	if(method == 'post') {
		//set onload to parse request and get json message
		xhr.onload = () => handleResponse(xhr, true);
	} 
	else{
		xhr.onload = () => handleResponse(xhr, false);
	}

	//build our x-www-form-urlencoded format
	const formData = `topic=${topicField.value}&question=${questionField.value}&answer=${answerField.value}`;

	xhr.send(formData);

	//cancel browser's default action
	e.preventDefault();
	//return false to prevent page redirection from a form
	return false;
};

const createCard = (content, xhr) =>{

	const obj = JSON.parse(xhr.response);

	if(Object.keys(obj.cards)){

		totalCards++;

		//last card in object
		var cardName= Object.keys(obj.cards)[Object.keys(obj.cards).length-1];
		var card = obj.cards[cardName];
		console.log(obj.cards);
		//console.log(cardName);

		createTemplate(totalCards, card.topic, card.question, card.answer);
	}
};

const getCards = (e, searchForm) =>{

	//grab the forms action (url to go to)
	//and method (HTTP method - POST in this case)
	const action = searchForm.getAttribute('action');
	const method = searchForm.getAttribute('method');

	const xhr = new XMLHttpRequest();

	xhr.open(method, action);
	xhr.setRequestHeader('Accept', 'application/json');

	//if get request or head request
	if(method == 'get') {
		//set onload to parse request and get json message
		xhr.onload = () => handleResponse(xhr, true);
	} else {
		//set onload to check meta data and NOT message
		//There are no body responses in a head request
		xhr.onload = () => handleResponse(xhr, false);
	}

  xhr.send();
	//cancel browser's default action
	e.preventDefault();
	//return false to prevent page redirection from a form
	return false;
};

const displayCards= (content,xhr) =>{
	
	const obj = JSON.parse(xhr.response);

	const subjectField = document.querySelector('#subjectField');

	if(Object.keys(obj.cards)){ //if card obj list is not empty

		var cardLength = Object.keys(obj.cards).length;
		//clear content
		content.innerHTML = "";

		for(var i=0; i<cardLength; i++){

			var cardName= Object.keys(obj.cards)[i];
			var card = obj.cards[cardName];

			//if topic is all
			if(subjectField.value === 'all'){
					createTemplate(i, card.topic, card.question, card.answer);
					//console.log("displaying only certain cards");
			}
			else{
				//if card topic matches with the search topic
				if(card.topic === subjectField.value){
					//send only the filtered topic
					createTemplate(card.num, card.topic, card.question, card.answer);
					//console.log("displaying only certain cards");
				}
			}
		}
	}
};


//dead code
//const requestEdit= () =>{
//	console.log("edit clicked");
//};

const createTemplate = (num,topic, question, answer) =>{
	var html= "";

	//do some concatenation
	html+="<div class='card' id='card-" + num + "'>"; //card number

	html+="<div class='front'>";
	html+="<div class= 'topicId'>Topic: "+ topic + "</div>"; //card topic
	html+="<div class='cardContent'>";
	html+="<p><strong>Q: </strong>" + question + "</p>";
	html+= "</div>";
	html+= "</div>";

	html+="<div class='back'>";
	html+="<div class= 'topicId'>Topic: "+ topic + "</div>"; //card topic
	html+="<div class='cardContent'>";
	html+="<p><strong>A: </strong>" + answer + "</p>";
	html+= "</div>";
	//html+= "<button class='editButton'>Edit</button>";
	html+= "</div>";

	html+= "</div>";

	content.innerHTML +=html;

	$("div[id^=card-]").flip(); //apply flip animations

	//reset cards to question side
	$("div[id^=card-]").trigger( "click" );
	$("div[id^=card-]").trigger( "click" );
	
//	$(".editButton").click(function() {
//		requestEdit();
//	});
};

const init = () => {
	//grab form
	const addForm = document.querySelector('#addForm');
	const searchForm = document.querySelector('#searchForm');
		
	const questionField = document.querySelector('#questionField');	
	const answerField = document.querySelector('#answerField');	
	
	$("#searching").on('click', function(e){ 
		$('#searching').fadeIn(1000);
		$('#searching').fadeOut(2000);
	});
	
	$("#status").on('click',function(e){ 
		$('#status').fadeIn(1000);
		$('#status').fadeOut(2000);
	});

	addForm.addEventListener('submit', (e) => {
		addCard(e, addForm);
		questionField.value=''; //empty out field
		answerField.value='';	//empty out field
		
		document.getElementById("status").innerText = "";
		$("#status").trigger('click');
	});

	searchForm.addEventListener('submit', (e) => {

		getCards(e,searchForm);
		$("#searching").trigger('click');
	});
};

window.onload = init;