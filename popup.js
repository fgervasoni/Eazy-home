let config = {};


// chrome.tabs.create({ url: baseUrl });

let titleDiv = $("#titleDiv");

let search =  $("#search");

search.click(function(element) {
	
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


//INIT FUNCTION
$(function () {
	$('[data-toggle="tooltip"]').tooltip();
	
	$.getJSON('config.json', function(data) {
		config = data;
		
		//TODO: select state flag
		let state = "it";

		_.forOwn(config[state], function(value, key){
			$("#site-list").append('<span class="searchBtn">' +
                    '<input type="checkbox" />' +
                   ' <img data-toggle="tooltip" data-placement="top" title="' + key +'" src="'+ value.icon +'" class="icon">' +
               '</span>');
		});
	});
})