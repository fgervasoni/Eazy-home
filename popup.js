let globalConfig = {};
let config = {};
let titleDiv = $("#titleDiv");
let search =  $("#search");
let siteList =  $("#site-list");
let browserLang = navigator.language ? navigator.language.split("-")[0] : ( navigator.userLanguage ? navigator.userLanguage.split("-")[0] : "en");


var redrawSiteList = function(config, selectedFields){
	var disabled = false;
	siteList.empty();
	_.forOwn(config, function(value, key){
		siteList.append('<span class="searchBtn">' +
			'<input type="checkbox" checked value="'+key+'" ' + (disabled ? 'disabled' : '' )+ '/>' +
		   ' <img data-toggle="tooltip" data-placement="top" title="' + key +'" src="'+ value.icon +'" class="icon">' +
	    '</span>');
	});
}

//INIT FUNCTION
$(function () {
	$('[data-toggle="tooltip"]').tooltip();
	
	$.getJSON('json-files/config.json', function(data) {
		globalConfig = data;
		
		//Se non è salvato un country aprire la pagina, altrimenti andare al form di ricerca
		chrome.storage.sync.get('country', function(data) {
		  if (!data.country) {
			Country.showCountryPageSelection().then(function(countryCode){
				Language.setLanguage(browserLang).then(function(){
					initApp();
				});
			})
		  } else {
				Language.setLanguage(browserLang).then(function(){
					initApp();
				});
		  }
		});
		
	});
});

var initApp = function(){
	chrome.storage.sync.get('country', function(data) {
		config = globalConfig[data.country];
		
		
		$("#containerFlags").hide();
		$("#containerSearch").show();

		//Draw site list
		redrawSiteList(config);
		
		//Bind click ricerca
		search.click(function(element) {
			let city = $('#city').val().toLowerCase();
			let contract = $('#contract').val();
			let typology = $('#typology').val();
			let filters = {
				minPrice : $('#minPrice').val(),
				maxPrice : $('#maxPrice').val(),
				minArea : $('#minArea').val(),
				maxArea : $('#maxArea').val()
			};

			var checkedValues = $('#site-list input:checkbox:checked').map(function() {
				return this.value;
			}).get();

			let urls = [];
			_.forEach(checkedValues, function(value){
				let siteConfig = config[value];
				let url = siteConfig.base_url + siteConfig.required_filters.replaceAll("{{typeRentSell}}", siteConfig.typeRentSell[contract]).replaceAll("{{typeHouse}}", siteConfig.typeHouse[typology]).replaceAll("{{city}}", city); 
				_.forOwn(filters, function(value, key){
					if(!_.isEmpty(value)){
						url += siteConfig.optional_filters[key].replace("{{"+key+"}}", value) + '&';
					}
				});
				urls.push(url);
			});

			if(!_.isEmpty(city)) {
				//Open Tabs
				_.forEach(urls, function (url) {
					chrome.tabs.create({url: url})
				});
			}else{
				// $('#city').style.border = "1px solid red"
			}
		});
		
		
		$("#contract").change(function() {
//	TODO: abilitare checkbox in base alla presenza o meno nel config.json delle condizioni imposte dalla select
// 	es: select --> vendita --> disabilitare checkbox mioaffitto
			console.log($(this).val())
		});

		$("#typology").change(function() {
//	TODO: abilitare checkbox in base alla presenza o meno nel config.json delle condizioni imposte dalla select
// 	es: select --> vendita --> disabilitare checkbox mioaffitto
			console.log($(this).val())
		});
	});
}