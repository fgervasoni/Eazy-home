var SideMenu = {
    sideNav: $("#sideNav"),
    openBtn: $("#menu"),
    closeBtn: $("#closeMenu"),
    LanguageButton: $("#language-menu"),
    CountryButton: $("#country-menu"),
    SavedSearchesButton: $("#savedsearch-dropdown button"),
    RemoveSavedSearch: $("#removeSavedSearch"),
    Open: function () {
        SideMenu.sideNav[0].style.width = "250px";
    },
    Close: function () {
        SideMenu.sideNav[0].style.width = "0";
    }
}

SideMenu.openBtn.click(function (element) {
    SideMenu.Open();
});

SideMenu.closeBtn.click(function (element) {
    SideMenu.Close();
});

SideMenu.CountryButton.click(function (element) {
    Country.showCountryPageSelection().then(function (countryCode) {
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
				dropdown.append('<li id="'+ key +'" class="row" style="margin-right:0; margin-left:0">'+ '<span class="savedSearch col-8">'+ key +'</span>' +'<i id="removeSavedSearch" class="material-icons col col-1">'+"clear"+'</i>'+'</li>');
			});
		}

		$("#savedsearch-dropdown li .savedSearch").click(function(element){
			var searchName = element.target.id;
			loadFormModel(searchName).then(function(model){
				SideMenu.Close();
				$("#openSaveSearchBtn").show();
				updateSaveIcon(model);
				saveFormModel();
			});
		});

        $("#savedsearch-dropdown li #removeSavedSearch").click(function(element){
			deleteFormModel((element.target.parentElement.id)).then(function(){
                redrawDropdown(dropdown);
			});
        });
    });
});

