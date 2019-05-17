var Theme = {
	icon : $(".theme"),
	addClickListener: function(){
		//TODO: salvare nello storage la preferenza del tema
		Theme.icon.click(function(element){
		
			//Icona navbar
			$("#themeBlack").toggle();
			$("#themeLight").toggle();

			//Cambio tema body
			$(document.body).toggleClass('light');
			$(document.body).toggleClass('dark');

            //Cambio tema navbar
			$(titleDiv).toggleClass('light');
            $(titleDiv).toggleClass('dark');

			//Cambio tema sidebar
			$(sideNav).toggleClass('light');
			$(sideNav).toggleClass('dark');
			
			chrome.storage.sync.set({'theme': element.target.id});
		});
	},
	init : function(){
		chrome.storage.sync.get('theme', function(data) {
			if(data.theme == "themeBlack") {
				$("#themeBlack").hide();
				$("#themeLight").show();	
				//Cambio tema body
				$(document.body).removeClass('light');
				$(document.body).addClass('dark');

                //Cambio tema navbar
                $(titleDiv).toggleClass('light');
                $(titleDiv).toggleClass('dark');

				//Cambio tema sidebar
				$(sideNav).removeClass('light');
				$(sideNav).addClass('dark');
			}
			Theme.addClickListener();
		});
	}
}