let dataJSON = {};
$.getJSON('config.json', function(data) {
	dataJSON = data;
});

// chrome.tabs.create({ url: baseUrl });

let titleDiv = $("#titleDiv");

let search =  $("#search");

search.click(function(element) {
	console.log("search click")
	let city = $('#city');
	let contract = $('#contract');
	let typology = $('#typology');
	let minPrice = $('#minPrice');
	let maxPrice = $('#maxPrice');
	let minArea = $('#minArea');
	let maxArea = $('#maxArea');
});


titleDiv.click(function(element){
	$(document.body).toggleClass('light');
	$(document.body).toggleClass('dark');

	$(this).toggleClass('light');
	$(this).toggleClass('dark');
});


$(function () {
	$('[data-toggle="tooltip"]').tooltip()
})