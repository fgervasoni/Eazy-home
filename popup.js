//TODO sistemare ovviamente
let searchBtnIdealista = document.getElementById('searchBtnIdealista');
let searchBtnImmobiliare = document.getElementById('searchBtnImmobiliare');
let titleDiv = document.getElementById('titleDiv');

searchBtnIdealista.onclick = function(element) {
	var newURL = "https://www.idealista.it/";
	chrome.tabs.create({ url: newURL });
};
searchBtnImmobiliare.onclick = function(element) {
	var newURL = "https://www.immobiliare.it/";
	chrome.tabs.create({ url: newURL });
};

titleDiv.onclick = function(element){
	$(document.body).toggleClass('light');
	$(document.body).toggleClass('dark');

	$(this).toggleClass('light');
	$(this).toggleClass('dark');
};