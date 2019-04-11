let countryConfig = {};
let globalConfig = {};
let config = {};
let titleDiv = $("#titleDiv");
let search =  $("#search");
let countryList = $("#country-list");
let siteList =  $("#site-list");
let menu =  $("#menu");
let closeMenu =  $("#closeMenu");
let theme = $(".theme");
let sideNav = $("#sideNav");


//TODO: spostare in un file di utils.js
String.prototype.replaceAll = function (find, replace) {
    var str = this;
    return str.replace(new RegExp(find.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g'), replace);
};

menu.click(function(element) {
	sideNav[0].style.width = "250px";
});

closeMenu.click(function(element) {
	sideNav[0].style.width = "0";
});

var redrawSiteList = function(config, selectedFields){
	var disabled = false;
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
	
	$.getJSON('config.json', function(data) {
		globalConfig = data;
		
		$.getJSON('country.json', function(data) {
			countryConfig = data;
			_.forOwn(countryConfig.countries, function(value){
				countryList.append('<img id="'+value.code+'" class="country" src="'+value.image+'">');			
			});
			let country = $(".country");
			country.click(function(element){

				Language.setLanguage(element.currentTarget.id);
				//TODO: salvare il codice del country nello storage prima di andare alla pagina successiva
				$("#containerCountry").hide();
				$("#containerSearch").show();
				sideNav[0].style.width = "0";
			});
		});

		//TODO: salvare nello storage la preferenza del tema
		theme.click(function(element){

			var isHidden = $("#themeLight")[0].hidden;
			if(!isHidden){
				$("#themeBlack").show();
				$("#themeLight").hide();
			}else{
				$("#themeBlack").hide();
				$("#themeLight").show();
			}

			$(document.body).toggleClass('light');
			$(document.body).toggleClass('dark');

			$(titleDiv).toggleClass('light');
			$(titleDiv).toggleClass('dark');

			$(sideNav).toggleClass('light');
			$(sideNav).toggleClass('dark');
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
		
		//TODO: recuperare la preferenza salvata nello storage settata al click
		let state = "it";
		config = globalConfig[state];

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

	});
});