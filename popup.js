let globalConfig = {};
let config = {};
let titleDiv = $("#titleDiv");
let search = $("#search");
let siteList = $("#site-list");
let themeLight = $("#themeLight");
let themeBlack = $("#themeBlack");
let contract = $("#contract");
let minArea = $("#minArea");
let maxArea = $("#maxArea");
let minPrice = $("#minPrice");
let maxPrice = $("#maxPrice");
let city = $("#city");
let openSaveSearchBtn = $("#openSaveSearchBtn");
let saveSearchModal = $('#saveSearchModal');
let savedSearchName = $('#savedSearchName');
let saveSearch = $("#saveSearch");
let containerSearch = $("#containerSearch");
let containerFlags = $("#containerFlags");
let selectCountry = $("#selectCountry");
let firstSelectCountry = $("#firstSelectCountry");
let modalCustom = $("#modalCustom");
let sideNav = $("#sideNav");
let trash = $("#trash");
let savedSearchSelect = $(".savedSearchSelect");
let dropdownMenuCustom = $(".dropdown-menu-custom");
$.notify.defaults({ className: "success" });

let browserLang = navigator.language ? navigator.language.split("-")[0] : (navigator.userLanguage ? navigator.userLanguage.split("-")[0] : "en");

var redrawSiteList = function (config) {
    let disabled = false;
    let checked = true;

    loadFormModel('formModel').then(function (model) {
        let contractSelected = model ? model.contract : "rent";
        let typologySelected = model ? model.typology : "flat";

		updateSaveIcon(model);

        siteList.empty();

        _.forOwn(config, function (value, key) {

            //Check site to disable
            if (!config[key].contract[contractSelected] || !config[key].typology[typologySelected]) {
                disabled = true;
                checked = false;
            } else {
                siteList.append('' +
                    '<span class="searchBtn" style="margin-left:10px">' +
                    '<label class="checkbox-inline">' +
                    '<input type="checkbox" data-onstyle="outline-primary" data-offstyle="outline-secondary" ' +
                    'data-onlabel="<img data-toggle=\'tooltip\' data-placement=\'top\' title=\'' + key + '\' src=\'' + value.icon + '\' class=\'icon\'>" ' +
                    'data-offlabel="<img data-toggle=\'tooltip\' data-placement=\'top\' style=\'filter: grayscale(100%)\' title=\'' + key + '\' src=\'' + value.icon + '\' class=\'icon\'>" ' +
                    'value="' + key + '" ' + (checked ? 'checked' : '') + ' ' + (disabled ? 'disabled' : '') + '>' +
                    '</label>' +
                    '</span>');
                $('input:checkbox').each(function () {
                    $(this)[0].switchButton(); //because inject from js
                })
            }
        });
    })
};

//INIT FUNCTION
$(function () {
    $('[data-toggle="tooltip"]').tooltip();
    Theme.init();

    //Nascondi stellina primo avvio
    $("#openSaveSearchBtn").hide();

    //WORKAROUND for first country selection
    selectCountry.hide();
    firstSelectCountry.show();

    $.getJSON('json-files/config.json', function (data) {
        globalConfig = data;

        //Se non è salvato un country aprire la pagina, altrimenti andare al form di ricerca
        chrome.storage.sync.get('country', function (data) {
            if (!data.country) {
                Country.showCountryPageSelection().then(function (countryCode) {
                    Language.setLanguage(browserLang).then(function () {
                        initApp();
                    });
                })
            } else {
                Language.setLanguage(browserLang).then(function () {
                    initApp();
                });
            }
        });
    });
});

var initApp = function () {

    chrome.storage.sync.get('country', function (data) {
        config = globalConfig[data.country];

        containerFlags.hide();
        containerSearch.show();

        //Draw site list
        redrawSiteList(config);

        //Bind click ricerca
        search.click(function (element) {
            let city = $('#city').val().toLowerCase();
            let contract = $('#contract').val();
            let typology = $('#typology').val();
            let filters = {
                minPrice: minPrice.val(),
                maxPrice: maxPrice.val(),
                minArea: minArea.val(),
                maxArea: maxArea.val()
            };

            var checkedValues = $('#site-list input:checkbox:checked').map(function () {
                return this.value;
            }).get();

            let urls = [];
            _.forEach(checkedValues, function (value) {
                let siteConfig = config[value];
                let url = siteConfig.base_url + siteConfig.required_filters.replaceAll("{{contract}}", siteConfig.contract[contract]).replaceAll("{{typology}}", siteConfig.typology[typology]).replaceAll("{{city}}", city);
                _.forOwn(filters, (value, key) => {
                    if (!_.isEmpty(value)) {
                        var fieldKey;
                        for (var prop in siteConfig.optional_filters) {
                            if (_.startsWith(prop, key)) fieldKey = prop;
                        }
                        if (fieldKey) {
                            fieldKey.split(',').forEach(function (subKey) {
                                siteConfig.optional_filters[fieldKey] = siteConfig.optional_filters[fieldKey].replace("{{" + subKey + "}}", filters[subKey]);
                            });
                            siteConfig.optional_filters[fieldKey] = siteConfig.optional_filters[fieldKey].replace(/{{[0-9a-zA-Z]+}}/g, ""); //remove all empty placeholder
                            url += siteConfig.optional_filters[fieldKey] + siteConfig.optional_filters.separator;
                        }
                    }
                });
                if (siteConfig.end_url) url += siteConfig.end_url;
                if (url[url.length - 1] == siteConfig.optional_filters.separator) url = url.slice(0, -1);
                if (siteConfig.parserFunctionName) url = parserFunctions[siteConfig.parserFunctionName](url);
                urls.push(url);
            });

            if (!_.isEmpty(city)) {
                //Open Tabs
                _.forEach(urls, function (url) {
                    chrome.tabs.create({url: url})
                });
            } else {
                $('#city')[0].style.border = "1px solid red"
            }
        });

        saveSearch.click(function () {
            var name = savedSearchName.val();
            saveFormModel(name).then(function () {
                $.notify("Success", { position:"bottom right"});
                redrawDropdown($("#savedsearch-dropdown .dropdown-menu"));
                saveSearchModal.modal('hide');
            });
        });

        //Controllo nome ricerche già salvate o nulle
        savedSearchName.on('change textInput input', function(){
            var savedSearches = [];

            //TODO capire perchè non sempre trova gli elementi
            _.each(dropdownMenuCustom[0].childNodes, function(child){
                savedSearches.push(child.id);
            });

            var name = savedSearchName.val();
            var regex = new RegExp("^[a-zA-Z0-9\\@_-]+$");

            if (_.isEmpty(name) || _.find(savedSearches, function(child) { return child === name; })) {
                saveSearch.prop("disabled", true);
            }
            else {
                if(regex.test(name)) {
                    saveSearch.prop("disabled", false);
                }else {
                    saveSearch.prop("disabled", true);
                }
            }
        });

        //cancella input all'uscita dalla modale
        saveSearchModal.on('hidden.bs.modal', function () {
            savedSearchName[0].value = '';
        });

        openSaveSearchBtn.click(function(){
            savedSearchName[0].value = '';
        });

        let resetFilter = function(){
            city[0].value = null;
            minPrice[0].value = null;
            maxPrice[0].value = null;
            minArea[0].value = null;
            maxArea[0].value = null;
            saveFormModel();
        };

        trash.click(function(){
            resetFilter();
            $("#openSaveSearchBtn").hide();
        });

		//TODO: si posso riunire?
		city.on('input',function(element) {
            $('#city')[0].style.border = "1px solid #ced4da";
			if (element.currentTarget.value !== ""){
				$("#openSaveSearchBtn").show();
			}else{
				$("#openSaveSearchBtn").hide();
			}
            saveFormModel();
		});
        minPrice.change(function () {
            saveFormModel();
        });
        maxPrice.change(function () {
            saveFormModel();
        });
        minArea.change(function () {
            saveFormModel();
        });
        maxArea.change(function () {
            saveFormModel();
        });

		contract.change(function() {
            minPrice[0].value = null;
            maxPrice[0].value = null;
            contract[0].value === "rent" ? minPrice.prop("step", 50) : minPrice.prop("step", 5000);
            contract[0].value === "rent" ? maxPrice.prop("step", 50) : maxPrice.prop("step", 5000);
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
};