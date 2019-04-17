String.prototype.replaceAll = function (find, replace) {
    var str = this;
    return str.replace(new RegExp(find.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g'), replace);
};

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
		chrome.storage.sync.set({ 'formModel': 
			{
				city : $('#city').val().toLowerCase(),
				contract : $('#contract').val(),
				typology : $('#typology').val(),
				minPrice : $('#minPrice').val(),
				maxPrice : $('#maxPrice').val(),
				minArea : $('#minArea').val(),
				maxArea : $('#maxArea').val()
			}
		});
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
            })
		}
		deferred.resolve();
	} catch(e){
		deferred.reject();
	}
	return deferred.promise;
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