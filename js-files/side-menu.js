var SideMenu = {
    sideNav : $("#sideNav"),
	openBtn : $("#menu"),
	closeBtn :  $("#closeMenu"),
	LanguageButton : $("#language-menu"),
	CountryButton: $("#country-menu"),
	SavedSearchesButton: $("#savedsearch-menu"),
	Open : function(){
		SideMenu.sideNav[0].style.width = "250px";
	},
	Close : function(){
		SideMenu.sideNav[0].style.width = "0";
	}
}

SideMenu.openBtn.click(function(element) {
	SideMenu.Open();
});

SideMenu.closeBtn.click(function(element) {
	SideMenu.Close();
});

SideMenu.CountryButton.click(function(element){
	Country.showCountryPageSelection().then(function(countryCode){	
		initApp();
	});
});

SideMenu.SavedSearchesButton.click(function(){

	$("#savedsearch-dropdown").show();
	let dropdown =  $("#savedsearch-dropdown .dropdown-menu");
	dropdown.empty();
	chrome.storage.sync.get('savedSearches', function(data) { 
		if(data && data.savedSearches){
			_.forOwn(data.savedSearches, function(value, key){
				dropdown.append('<li id="'+ key +'">'+ key +'</li>'); 
			});
		}

		$("#savedsearch-dropdown li").click(function(element){
			loadFormModel(element.target.id).then(function(){
				SideMenu.Close();
			});
		});
	});
	
})

// SideMenu.LanguageButton.click(function(element){
	// Language.showLanguagePageSelection();
// });

