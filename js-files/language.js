var Language = {
	flagsList : $("#flags-list"),
	selectLanguage: $("#language-menu-select"),
	showLanguagePageSelection: function(){
		var deferred = Q.defer();
		$("#containerSearch").hide();
		$("#containerFlags").show();
		try {
			if(Language.flagsList.is(':empty')){
				$.getJSON('flags.json', function(flags) {
					_.forOwn(flags, function(value){
						Language.flagsList.append('<img id="'+value.code+'" class="flag" src="'+value.image+'">');
						Language.selectLanguage.append($('<option>', {
							id: value.code,
							text: value.language,
							value: value.code,
						}));
					});
					Language.addClickListener(deferred);
				});
			} else {
				Language.addClickListener(deferred);
			}
		} catch(e) {
			deferred.reject("Fail to load flags config");
		}
		return deferred.promise;
	},
	setLanguage : function(language){
		var deferred = Q.defer();
		try {
			$.getJSON('json-files/languages.json', function(languagesConfig) {
				chrome.storage.sync.set({language: language})
				var translator = $('body').translate({lang: language, t: languagesConfig.dictionary});
				$("#containerFlags").hide();
				$("#containerSearch").show();
				deferred.resolve();
			});
		} catch(e) {
			deferred.reject("Fail to load languages config");
		}
		return deferred.promise;
	},
	addClickListener: function(){
		$(".flag").click(function(element){
			Language.setLanguage(element.target.id);
		});
	}
}
