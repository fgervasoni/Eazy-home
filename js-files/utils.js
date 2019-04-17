String.prototype.replaceAll = function (find, replace) {
    var str = this;
    return str.replace(new RegExp(find.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g'), replace);
};

updateSaveIcon = function(sessionModel){
	
	var iconFull = false;
	
	chrome.storage.sync.get('savedSearches', function(data) {
		data.savedSearches = data.savedSearches || {};
		_.forOwn(data.savedSearches, function(value, key){
			if(_.isEqual(sessionModel, value)){
				iconFull = true;
				$("#saveSearchModal #savedSearchName").val(key);
			}
		})
		
		if(iconFull) {
			$("#openSavesearchBtn").empty().append('<i class="material-icons">star</i>');
		} else {
			$("#openSavesearchBtn").empty().append('<i class="material-icons">star_border</i>');
		}
	});	
}
	

var saveFormModel = function(nameSearch){
	var deferred = Q.defer();
	try {
		//Salviamo nelle preferenza dell'utente
		if(nameSearch){
			chrome.storage.sync.get('savedSearches', function(data) {
				data.savedSearches = data.savedSearches || {};
				data.savedSearches[nameSearch] = {
					city : $('#city').val().toLowerCase(),
					contract : $('#contract').val(),
					typology : $('#typology').val(),
					minPrice : $('#minPrice').val(),
					maxPrice : $('#maxPrice').val(),
					minArea : $('#minArea').val(),
					maxArea : $('#maxArea').val()
				}
				chrome.storage.sync.set({ savedSearches: data.savedSearches });
			});
		}
		
		//Salviamo nel form di sessione
		var formSession = {
				city : $('#city').val().toLowerCase(),
				contract : $('#contract').val(),
				typology : $('#typology').val(),
				minPrice : $('#minPrice').val(),
				maxPrice : $('#maxPrice').val(),
				minArea : $('#minArea').val(),
				maxArea : $('#maxArea').val()
			}
		chrome.storage.sync.set({ 'formModel': formSession});
		
		updateSaveIcon(formSession);
		
		deferred.resolve();
	} catch(e){
		deferred.reject();
	}
	return deferred.promise;
}

var deleteFormModel = function(nameSearch){
	var deferred = Q.defer();
	try {
		//Salviamo nelle preferenza dell'utente
		if(nameSearch){
			chrome.storage.sync.get('savedSearches', function(data) {
                delete data.savedSearches[nameSearch];
                chrome.storage.sync.set({ savedSearches: data.savedSearches });
				deferred.resolve();
            })
		} else {
			deferred.resolve();
		}
	} catch(e){
		deferred.reject();
	}
	return deferred.promise;
}

var redrawDropdown = function(dropdown){
    dropdown.empty();
    chrome.storage.sync.get('savedSearches', function(data) {
        if (data && data.savedSearches) {
            _.forOwn(data.savedSearches, function (value, key) {
                dropdown.append('<li class="savedSearch" id="' + key + '">' + key + '<i id="removeSavedSearch" class="material-icons">' + "clear" + '</i>' + '</li>');
            });
        }
    })
}

var loadFormModel = function(nameSearch){
	var deferred = Q.defer();
	try {
		if(nameSearch != 'formModel') {
			//Carichiamo dalle preferenza dell'utente
			chrome.storage.sync.get('savedSearches', function(data) {
				if(data && data.savedSearches && data.savedSearches[nameSearch]){
					let obj = data.savedSearches[nameSearch];
					$('#city').val(obj.city),
					$('#contract').val(obj.contract),
					$('#typology').val(obj.typology),
					$('#minPrice').val(obj.minPrice),
					$('#maxPrice').val(obj.maxPrice),
					$('#minArea').val(obj.minArea),
					$('#maxArea').val(obj.maxArea)
					deferred.resolve(obj);
				} else {
					deferred.resolve();
				}
			});
		} else {
			//Carichiamo il form di sessione
			chrome.storage.sync.get('formModel', function(data) {
				if(data && data['formModel']){
					$('#city').val(data['formModel'].city),
					$('#contract').val(data['formModel'].contract),
					$('#typology').val(data['formModel'].typology),
					$('#minPrice').val(data['formModel'].minPrice),
					$('#maxPrice').val(data['formModel'].maxPrice),
					$('#minArea').val(data['formModel'].minArea),
					$('#maxArea').val(data['formModel'].maxArea)
					deferred.resolve(data['formModel']);
				} else {
					deferred.resolve();
				}
			});
		}
	} catch(e){
		deferred.resolve();
	}
	return deferred.promise;
}