var Theme = {
    icon: $(".theme"),
    addClickListener: function () {
        Theme.icon.click(function (element) {

            //Icona navbar
            themeBlack.toggle();
            themeLight.toggle();

            //Cambio tema body
            $(document.body).toggleClass('light');
            $(document.body).toggleClass('dark');

            modalCustom.toggleClass('light');
            modalCustom.toggleClass('dark');

            //Cambio tema sidebar
            sideNav.toggleClass('light');
            sideNav.toggleClass('dark');

            //Trick cambio colore select ricerche salvate e icona preferiti
            if (themeBlack[0].style.display === 'none') {
                savedSearchSelect.css({"color": "#FAFAFA", "transition": "500ms"});
                openSaveSearchBtn.css({"color": "#FAFAFA", "transition": "500ms"})
            }
            else {
                savedSearchSelect.css({"color": "#4a4c4f", "transition": "500ms"});
                openSaveSearchBtn.css({"color": "#4a4c4f", "transition": "500ms"});
            }

            chrome.storage.sync.set({'theme': element.target.id});
        });
    },
    init: function () {
        chrome.storage.sync.get('theme', function (data) {
            if (data.theme === "themeBlack") {
                themeBlack.hide();
                themeLight.show();

                //Cambio tema body
                $(document.body).removeClass('light');
                $(document.body).addClass('dark');

                modalCustom.toggleClass('light');
                modalCustom.toggleClass('dark');

                //Cambio tema sidebar
                sideNav.removeClass('light');
                sideNav.addClass('dark');

                //Trick cambio colore select ricerche salvate e icona preferiti
                if (themeBlack[0].style.display === 'none') {
                    savedSearchSelect.css({"color": "#FAFAFA", "transition": "500ms"});
                    openSaveSearchBtn.css({"color": "#FAFAFA", "transition": "500ms"})
                }
                else {
                    savedSearchSelect.css({"color": "#4a4c4f", "transition": "500ms"});
                    openSaveSearchBtn.css({"color": "#4a4c4f", "transition": "500ms"});
                }
            }
            Theme.addClickListener();
        });
    }
};