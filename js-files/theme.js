let theme = $(".theme");
var isHidden = $("#themeLight")[0].hidden;

//TODO: salvare nello storage la preferenza del tema
theme.click(function(element){
    if(!isHidden){
        $("#themeBlack").show();
        $("#themeLight").hide();
    }else{
        $("#themeBlack").hide();
        $("#themeLight").show();
    }

    $(document.body).toggleClass('light');
    $(document.body).toggleClass('dark');

    $(titleDiv).toggleClass('light');
    $(titleDiv).toggleClass('dark');

    $(sideNav).toggleClass('light');
    $(sideNav).toggleClass('dark');
});