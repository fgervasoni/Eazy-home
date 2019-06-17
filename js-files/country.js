var Country = {
    flagsList: $("#flags-list"),
    showCountryPageSelection: function (countries) {
        var deferred = Q.defer();
        containerSearch.hide();
        titleDiv.hide();
        containerFlags.show();
        try {
            if (Country.flagsList.is(':empty')) {
                $.getJSON('../json-files/flags.json', function (flags) {
                    _.forOwn(flags, function (value) {
                        if (value.disable)
                            Country.flagsList.append('<img style="opacity: 0.2; cursor: not-allowed; pointer-events: none" id="' + value.code + '" class="flag" src="' + value.image + '"><span style="margin-left: -100px; font-family: cursive; font-size: 16px; margin-right: 16px">Coming Soon</span>');
                        else
                            Country.flagsList.append('<img id="' + value.code + '" class="flag" src="' + value.image + '">');
                    });
                    Country.addClickListener(deferred);
                });
            } else {
                Country.addClickListener(deferred);
            }
        } catch (e) {
            deferred.reject("Fail to load country config");
        }
        return deferred.promise;
    },
    setCountry: function (element) {
        var deferred = Q.defer();
        try {
            chrome.storage.sync.set({country: element.target.id});
            containerFlags.hide();
            titleDiv.show();
            containerSearch.show();
            sideNav[0].style.width = "0";
            deferred.resolve(element.target.id);
        } catch (e) {
            deferred.reject("Fail to load languages config");
        }
        return deferred.promise;
    },
    addClickListener: function (deferred) {
        $(".flag").click(function (element) {
            Country.setCountry(element).then(function (countryCode) {
                deferred.resolve(countryCode);
            })
        });
    }
};
