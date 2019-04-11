var SideMenu = {
	openBtn : $("#menu"),
	closeBtn :  $("#closeMenu"),
	LanguageButton : $("#language-menu"),
	CountryButton: $("#country-menu"),
}

SideMenu.openBtn.click(function(element) {
	sideNav[0].style.width = "250px";
});

SideMenu.closeBtn.click(function(element) {
	sideNav[0].style.width = "0";
});

SideMenu.CountryButton.click(function(element){
	Country.showCountryPageSelection().then(function(countryCode){	
		initApp();
	});
});

// SideMenu.LanguageButton.click(function(element){
	// Language.showLanguagePageSelection();
// });

