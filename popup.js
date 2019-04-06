let dataJSON = {};
$.getJSON('config.json', function(data) {
	dataJSON = data;
});

// chrome.tabs.create({ url: baseUrl });

let titleDiv = document.getElementById('titleDiv');

let search = document.getElementById('search');

search.onclick = function(element) {
	let city = document.getElementById('city');
	let contract = document.getElementById('contract');
	let typology = document.getElementById('typology');
	let maxPrice = document.getElementById('maxPrice');
	let minSurface = document.getElementById('minSurface');
};


titleDiv.onclick = function(element){
	$(document.body).toggleClass('light');
	$(document.body).toggleClass('dark');

	$(this).toggleClass('light');
	$(this).toggleClass('dark');
};

$(function () {
	$('[data-toggle="tooltip"]').tooltip()
})