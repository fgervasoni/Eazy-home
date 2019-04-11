var Language = {
	langButton : $("#lang"),
	setLanguage : function(language){
		$.getJSON('languages.json', function(data) {
			languagesConfig = data;
			let translator = $('body').translate({lang: language, t: languagesConfig.dictionary});
		});
	}

}

Language.langButton.click(function(element){
	$("#containerCountry").hide();
	$("#containerSearch").show();
});