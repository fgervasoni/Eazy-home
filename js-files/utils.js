String.prototype.replaceAll = function (find, replace) {
    var str = this;
    return str.replace(new RegExp(find.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g'), replace);
};

var saveFormModel = function(){
	var deferred = Q.defer();
	try {
		chrome.storage.sync.set({formModel: 
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

var loadFormModel = function(){
	var deferred = Q.defer();
	try {
		chrome.storage.sync.get('formModel', function(data) {
            if(data){
                $('#city').val(data.formModel.city),
                $('#contract').val(data.formModel.contract),
                $('#typology').val(data.formModel.typology),
                $('#minPrice').val(data.formModel.minPrice),
                $('#maxPrice').val(data.formModel.maxPrice),
                $('#minArea').val(data.formModel.minArea),
                $('#maxArea').val(data.formModel.maxArea)
                deferred.resolve(data.formModel);
            }
		});
	} catch(e){
		deferred.resolve();
	}
	return deferred.promise;
}