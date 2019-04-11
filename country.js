var Country = {
	menuButton: $("#country-menu"),
	showCountryPageSelection: function(countries){
		var deferred = Q.defer();
		//TODO: cambiare title "Scegli country"
		$("#containerSearch").hide();
		$("#containerFlags").show();
		try {
			if(flagsList.is(':empty')){
				$.getJSON('flags.json', function(flags) {
					_.forOwn(flags, function(value){
						flagsList.append('<img id="'+value.code+'" class="flag" src="'+value.image+'">');			
					});
					Country.addClickListener(deferred);
				});
			} else {
				Country.addClickListener(deferred);
			}
		} catch(e) {
			deferred.reject("Fail to load country config");
		}
		return deferred.promise;
	},
	setCountry: function(element){
		var deferred = Q.defer();
		try {
			//TODO: salvare il codice del country nello storage prima di andare alla pagina successiva
			$("#containerFlags").hide();
			$("#containerSearch").show();
			sideNav[0].style.width = "0";
			deferred.resolve(element.target.id);
		} catch(e) {
			deferred.reject("Fail to load languages config");
		}
		return deferred.promise;
	},
	addClickListener: function(deferred){
		$(".flag").click(function(element){
			Country.setCountry(element).then(function(countryCode){
				deferred.resolve(countryCode);
			})
		});
	}
}


Country.menuButton.click(function(element){
	Country.showCountryPageSelection();
});