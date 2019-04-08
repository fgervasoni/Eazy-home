let globalConfig = {};
let config = {};
let titleDiv = $("#titleDiv");
let search =  $("#search");
let siteList =  $("#site-list");


//INIT FUNCTION
$(function () {
	$('[data-toggle="tooltip"]').tooltip();
	
	$.getJSON('config.json', function(data) {
		globalConfig = data;
		
		//TODO: spostare click su tema, in un pulsante a destra e salvare nello storage la preferenza
		titleDiv.click(function(element){
			$(document.body).toggleClass('light');
			$(document.body).toggleClass('dark');

			$(this).toggleClass('light');
			$(this).toggleClass('dark');
		});
		
		//TODO: select state flag e salvare nello storage la preferenza
		let state = "it";
		config = globalConfig[state];

		//Draw site list
		_.forOwn(config, function(value, key){
			siteList.append('<span class="searchBtn">' +
                    '<input type="checkbox" value="'+key+'"/>' +
                   ' <img data-toggle="tooltip" data-placement="top" title="' + key +'" src="'+ value.icon +'" class="icon">' +
               '</span>');
		});
		
		
		//Bind click ricerca
		search.click(function(element) {
			let city = $('#city');
			let contract = $('#contract');
			let typology = $('#typology');
			let minPrice = $('#minPrice');
			let maxPrice = $('#maxPrice');
			let minArea = $('#minArea');
			let maxArea = $('#maxArea');
			
			var checkedValues = $('#site-list input:checkbox:checked').map(function() {
				return this.value;
			}).get();
			
			let urls = [];
			_.forEach(checkedValues, function(value){
				let siteConfig = config[value];
				//TODO: creare url dal config
				urls.push(siteConfig.base_url);
			});
			
			//Open Tabs
			_.forEach(urls, function(url){
				chrome.tabs.create({ url: url })
			});
		});

	});
})