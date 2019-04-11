let theme = $(".theme");

//TODO: salvare nello storage la preferenza del tema
theme.click(function(element){
    $("#themeBlack").toggle();
    $("#themeLight").toggle();

    $(document.body).toggleClass('light');
    $(document.body).toggleClass('dark');

    $(titleDiv).toggleClass('light');
    $(titleDiv).toggleClass('dark');

    $(sideNav).toggleClass('light');
    $(sideNav).toggleClass('dark');
});