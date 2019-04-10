let globalConfig = {};
let config = {};
let titleDiv = $("#titleDiv");
let search =  $("#search");
let siteList =  $("#site-list");
let menu =  $("#menu");
let closeMenu =  $("#closeMenu");
let theme = $(".theme");
let sideNav = $("#sideNav");
let country = $(".country");
let lang = $("#lang");


//TODO: spostare in un file di utils.js
String.prototype.replaceAll = function (find, replace) {
    var str = this;
    return str.replace(new RegExp(find.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g'), replace);
};

lang.click(function(element){
	$("#containerCountry")[0].hidden = false;
	$("#containerSearch")[0].hidden = true;
});


country.click(function(element){
	$("#containerCountry")[0].hidden = true;
	$("#containerSearch")[0].hidden = false;
	sideNav[0].style.width = "0";
});

menu.click(function(element) {
	sideNav[0].style.width = "250px";
});

closeMenu.click(function(element) {
	sideNav[0].style.width = "0";
});

//INIT FUNCTION
$(function () {
	$('[data-toggle="tooltip"]').tooltip();
	
	$.getJSON('config.json', function(data) {
		globalConfig = data;

		//TODO: spostare click su tema, in un pulsante a destra e salvare nello storage la preferenza
		theme.click(function(element){

			var isHidden = $("#themeLight")[0].hidden;
			if(!isHidden){
				$("#themeBlack")[0].hidden = false;
				$("#themeLight")[0].hidden = true;
			}else{
				$("#themeBlack")[0].hidden = true;
				$("#themeLight")[0].hidden = false;
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
		
		//TODO: select state flag e salvare nello storage la preferenza
		let state = "it";
		config = globalConfig[state];

		//Draw site list
		_.forOwn(config, function(value, key){
			siteList.append('<span class="searchBtn">' +
                    '<input type="checkbox" checked value="'+key+'"/>' +
                   ' <img data-toggle="tooltip" data-placement="top" title="' + key +'" src="'+ value.icon +'" class="icon">' +
               '</span>');
		});


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
			}

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

			if(city[0].value !== "") {
                //Open Tabs
                _.forEach(urls, function (url) {
                    chrome.tabs.create({url: url})
                });
            }else{
				city[0].style.border = "1px solid red"
            }
		});

	});
})