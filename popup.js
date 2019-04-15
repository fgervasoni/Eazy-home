let globalConfig = {};
let config = {};
let titleDiv = $("#titleDiv");
let search =  $("#search");
let siteList =  $("#site-list");
let browserLang = navigator.language ? navigator.language.split("-")[0] : ( navigator.userLanguage ? navigator.userLanguage.split("-")[0] : "en");


var redrawSiteList = function(config){
	let disabled = false;
	let checked = true;

	loadFormModel().then(function(model){
		let contractSelected = model ? model.contract : null;
		let typologySelected = model ? model.typology : null;
		
		siteList.empty();
		_.forOwn(config, function(value, key){
			//Check site to disable
			if(!config[key].contract[contractSelected] || !config[key].typology[typologySelected]) {
				disabled = true;
				checked = false;
			} else {
				siteList.append('' +
					'<span class="searchBtn">'+
					  '<label class="checkbox-inline">'+
						'<input type="checkbox" data-toggle="toggle"  data-size="xs" value="'+key+'" ' + (checked ? 'checked' : '' ) + ' ' + (disabled ? 'disabled' : '' )+ '>' +
						'<img data-toggle="tooltip" data-placement="top" title="' + key +'" src="'+ value.icon +'" class="icon">' +
					  '</label>'+
					'</span>');
				$('input:checkbox').bootstrapToggle(); //Workaround injectio from js
			}
		});
	})
	
}

//INIT FUNCTION
$(function () {
	$('[data-toggle="tooltip"]').tooltip();
	Theme.init();
	
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
				let url = siteConfig.base_url + siteConfig.required_filters.replaceAll("{{contract}}", siteConfig.contract[contract]).replaceAll("{{typology}}", siteConfig.typology[typology]).replaceAll("{{city}}", city); 
				_.forOwn(filters, function(value, key){
					if(!_.isEmpty(value)){
						url += siteConfig.optional_filters[key].replace("{{"+key+"}}", value) + '&';
					}
				});
				if(url[url.length-1] == '&') url = url.slice(0, -1);
				urls.push(url);
			});

			if(!_.isEmpty(city)) {
				//Open Tabs
				_.forEach(urls, function (url) {
					chrome.tabs.create({url: url})
				});
			}else{
				$('#city')[0].style.border = "1px solid red"
			}
		});
		

		//TODO: si posso riunire?
		$("#city").change(function() {
			saveFormModel();
		});
		$("#minPrice").change(function() {
			saveFormModel();
		});
		$("#maxPrice").change(function() {
			saveFormModel();
		});
		$("#minArea").change(function() {
			saveFormModel();
		});
		$("#maxArea").change(function() {
			saveFormModel();
		});

		$("#contract").change(function() {
			saveFormModel().then(function(){
				redrawSiteList(config);
			})
		});

		$("#typology").change(function() {
			saveFormModel().then(function(){
				redrawSiteList(config);
			})
		});
	});
}