String.prototype.replaceAll = function (find, replace) {
    var str = this;
    return str.replace(new RegExp(find.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g'), replace);
};

var saveFormModel = function(nameSearch){
	var deferred = Q.defer();
	try {
		//Salviamo nelle preferenza dell'utente
		if(nameSearch){
			chrome.storage.sync.set({ [nameSearch]: 
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

var loadFormModel = function(nameSearch){
	var deferred = Q.defer();
	try {
		//Carichiamo dalle preferenza dell'utente oppure il form di sessione
		var savedName = nameSearch || 'formModel';
		chrome.storage.sync.get( savedName, function(data) {
            if(data && data.formModel){
                $('#city').val(data.formModel.city),
                $('#contract').val(data.formModel.contract),
                $('#typology').val(data.formModel.typology),
                $('#minPrice').val(data.formModel.minPrice),
                $('#maxPrice').val(data.formModel.maxPrice),
                $('#minArea').val(data.formModel.minArea),
                $('#maxArea').val(data.formModel.maxArea)
                deferred.resolve(data.formModel);
            } else {
				deferred.resolve();
			}
		});
	} catch(e){
		deferred.resolve();
	}
	return deferred.promise;
}