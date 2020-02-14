// ==UserScript==
// @name         PokeLifeScript: AntyBan Edition
// @version      5.2
// @description  Dodatek do gry Pokelife
// @match        https://gra.pokelife.pl/*
// @downloadURL  https://github.com/krozum/pokelife/raw/master/PokeLifeScript.user.js
// @updateURL    https://github.com/krozum/pokelife/raw/master/PokeLifeScript.user.js
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @require      https://bug7a.github.io/iconselect.js/sample/lib/control/iconselect.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/blueimp-md5/2.5.0/js/md5.min.js
// @resource     customCSS_global  https://raw.githubusercontent.com/krozum/pokelife/master/assets/global.css?ver=5
// @resource     customCSS_style_1  https://raw.githubusercontent.com/krozum/pokelife/master/assets/style_1.css?ver=1
// @resource     customCSS_style_2  https://raw.githubusercontent.com/krozum/pokelife/master/assets/style_2.css?ver=1
// @resource     customCSS_style_3  https://raw.githubusercontent.com/krozum/pokelife/master/assets/style_3.css?ver=1
// @resource     customCSS_style_4  https://raw.githubusercontent.com/krozum/pokelife/master/assets/style_4.css?ver=1
// ==/UserScript==


// **********************
//
// zmienne globalne
//
// **********************

var config = new Object();
var AutoGoSettings = new Object();
var previousPageContent = null;
var pokemonData;
var region;
var lastSeeShoutId;
var timeoutMin = 200;
var timeoutMax = 300;


// **********************
//
// funkcja do zapisu do bra1ns.pl
//
// **********************
function requestBra1nsPL(url, callback){
    $.ajax(url)
        .done(data => callback == null ? "" : callback(data))
        .fail((xhr, status) => console.log('error:', status));
}
requestBra1nsPL("https://bra1ns.pl/pokelife/api/update_user.php?bot_version=" + GM_info.script.version + "&login=" + $('#wyloguj').parent().parent().html().split("<div")[0].trim() + "&poziom=" + $('button[data-original-title="Poziom Trenera Pokemon"]').html(), null);


// **********************
//
// eventy do wykorzystania przy pisaniu dodatków
//
// **********************
window.onReloadSidebarFunctions = [];
function onReloadSidebar(fn) {
    window.onReloadSidebarFunctions.push(fn);
}

window.onReloadMainFunctions = [];
function onReloadMain(fn) {
    window.onReloadMainFunctions.push(fn);
}

window.afterReloadMainFunctions = [];
function afterReloadMain(fn) {
    window.afterReloadMainFunctions.push(fn);
}

function getPreviousPageContent() {
    return previousPageContent;
}


// **********************
//
// loggery
//
// **********************
function updateEvent(text, eventTypeId, dzicz){
    if(dzicz != null){
        requestBra1nsPL("https://bra1ns.pl/pokelife/api/update_event.php?login=" + $('#wyloguj').parent().parent().html().split("<div")[0].trim() + "&text="+text + "&event_type_id=" + eventTypeId + "&dzicz=" + dzicz + "&time="+Date.now(), function(response){
            console.log("updateEvent: "+eventTypeId+" => "+ text);
        })
    } else {
        requestBra1nsPL("https://bra1ns.pl/pokelife/api/update_event.php?login=" + $('#wyloguj').parent().parent().html().split("<div")[0].trim() + "&text="+text + "&event_type_id=" + eventTypeId + "&time="+Date.now(), function(response){
            console.log("updateEvent: "+eventTypeId+" => "+ text);
        })
    }
}

function updateStats(name, value){
    requestBra1nsPL("https://bra1ns.pl/pokelife/api/update_stats.php?login=" + $('#wyloguj').parent().parent().html().split("<div")[0].trim() + "&stats_name="+name + "&value=" + value + "&time="+Date.now(), function(response){
        console.log("UpdateStats: "+name+" => "+ value);
    })
}

function updateStatsDoswiadczenie(json){
    requestBra1nsPL("https://bra1ns.pl/pokelife/api/update_stats_doswiadczenie.php?login=" + $('#wyloguj').parent().parent().html().split("<div")[0].trim() + "&json="+json + "&time="+Date.now(), function(response){
        console.log("updateStatsDoswiadczenie: " + json);
    })
}


// **********************
//
// nadpisanie glownych funkcji jQuery i funkcji gry
//
// **********************

function reloadMain(selector, url, callback, callback2){
    previousPageContent = $('body').html();
    $.get(url, function(data) {
        var THAT = $('<div>').append($(data).clone());
        window.onReloadMainFunctions.forEach(function(item) {
            item.call(THAT, url);
        })
        if(callback2 != undefined && callback2 != null){
            callback2.call(THAT, url);
        }
        var html2 = THAT.html().replace('<script src="js/okno_glowne_reload.js"></script>',"").replace("http://api.jquery.com/scripts/events.js", "https://gra.pokelife.pl/js/zegar.js").replace("$(\"#glowne_okno\").load('gra/stowarzyszenie.php?p=2&id_budynku='++'&pozycja_x='+$( \"#buduj\" ).position().left/16+'&pozycja_y='+$( \"#buduj\" ).position().top/16+'&nic');", "");
        $(""+selector).html(html2);

        if(url.indexOf("napraw") != -1){
            $("html, body").animate({ scrollTop: 0 }, "fast");
        }
        $.get('inc/stan.php', function(data) {
            $("#sidebar").html(data);
            window.afterReloadMainFunctions.forEach(function(item) {
                item.call();
            })
            if(callback != undefined && callback != null){
                callback.call();
            }
        });
    });
}

function reloadMainPOST(selector, url, postData, callback, callback2){
    previousPageContent = $('body').html();
    $.ajax({
        type : 'GET',
        url : url,
        data: {
            postData : postData
        },
        success:function (data) {
            var THAT = $('<div>').append($(data).clone());
            window.onReloadMainFunctions.forEach(function(item) {
                item.call(THAT, url);
            })
            if(callback2 != undefined && callback2 != null){
                callback2.call(THAT, url);
            }
            $(""+selector).html(THAT.html().replace('<script src="js/okno_glowne_reload.js"></script>',""));
            $.get('inc/stan.php', function(data) {
                $("#sidebar").html(data);
                window.afterReloadMainFunctions.forEach(function(item) {
                    item.call();
                })
                if(callback != undefined && callback != null){
                    callback.call();
                }
            });
        }
    });
}

var pa_before = $('#sidebar .progress-bar:contains("PA")').attr("aria-valuenow");
const oldShow = jQuery.fn.html
jQuery.fn.html = function() {
    const ret = oldShow.apply(this, arguments)
    var THAT = this;
    if(this.selector == "#sidebar"){
        var pa_after = this.find('.progress-bar:contains("PA")').attr("aria-valuenow");

        if(Number(pa_after) < Number(pa_before)){
            updateStats("wyklikanych_pa", Number(pa_before)-Number(pa_after));
        }
        pa_before = pa_after;

        if(typeof window.onReloadSidebarFunctions != undefined){
            window.onReloadSidebarFunctions.forEach(function(item) {
                item.call(THAT);
            });
        }
    }
    return ret
}


$(document).on('click', '#zaloguj_chat', function(e) {
    $("#shout_refresher").load("gra/chat/shout.php?refresh=0");
})


$(document).off("click", "nav a");
$(document).on("click", "nav a", function(event) {
    if($(this).attr('href').charAt(0)!='#' && !$(this).hasClass( "link" )) {
        event.preventDefault();

        var new_buffer = $(this).attr('href');
        new_buffer = new_buffer.substr(4);
        remember_back(new_buffer);

        var url = $(this).attr('href');
        if(url.indexOf('index.php?url=') != -1){
            url = url.replace('index.php?url=', '');
        }
        if(url.indexOf('gra/') == -1){
            url = 'gra/'+url;
        }

        reloadMain("#glowne_okno", url);

        $('.collapse-hidefix').collapse('hide');
    }
});

var zarobek;
$(document).off("click", ".btn-akcja");
$(document).on("click", ".btn-akcja", function(event) {
    var url = $(this).attr('href');
    if($('#hodowla-glowne b').length > 1){
        zarobek = $('#hodowla-glowne b:nth(1)').html().split("¥")[0].replace('.', '').replace('.', '').replace('.', '');
    }

    event.preventDefault();
    if(this.id != 'back_button') {

    } else {
        if($(this).prop('prev1') != '') {
            $('#back_button').attr('href', $('#back_button').attr('prev1') );
            $('#back_button').attr('prev1', $('#back_button').attr('prev2') );
            $('#back_button').attr('prev2', $('#back_button').attr('prev3') );
            $('#back_button').attr('prev3', $('#back_button').attr('prev4') );
            $('#back_button').attr('prev4', $('#back_button').attr('prev5') );
            $('#back_button').attr('prev5', '' );
        } else {
            $(this).prop('disabled',true);
        }
    }

    if($('body').hasClass('modal-open')) {
        $('body').removeClass('modal-open');
        $('body').css({"padding-right":"0px"});
        $('.modal-backdrop').remove();
    }

    $(this).attr("disabled", "disabled");

    if(url.startsWith("hodowla.php?sprzedaj_wszystkie=")){
        updateStats("zarobki_z_hodowli", zarobek);
    }

    reloadMain("#glowne_okno", 'gra/'+$(this).attr('href'));
});


$(document).off("click", ".btn-edycja-nazwy-grupy");
$(document).on("click", ".btn-edycja-nazwy-grupy", function(event) {
    $("#panel_grupa_id_"+$(this).attr('data-grupa-id')).html('<form action="druzyna.php?p=2&zmien_nazwe_grupy='+$(this).attr('data-grupa-id')+'" method="post"><div class="input-group"><input type="text" class="form-control" name="grupa_nazwa" value="'+ $(this).attr('data-obecna-nazwa')+'"><span class="input-group-btn"><input class="btn btn-primary" type="submit" value="Ok"/></span></div></form>');
});

$(document).off("click", ".nauka-ataku");
$(document).on("click", ".nauka-ataku", function(event) {
    event.preventDefault();

    $("html, body").animate({ scrollTop: 0 }, "slow");

    var naucz_zamiast = $("input[name=nauczZamiast-"+$(this).attr("data-pokemon-id")+"]:checked").val();

    //$("#glowne_okno").html('Wczytywanie...');
    if ($(this).attr("data-tm-zapomniany")) {
        reloadMain("#glowne_okno", 'gra/sala.php?zabezpieczone_id='+$(this).attr('zabezpieczone-id')+'&p='+$(this).attr("data-pokemon-id")+'&tm_zapomniany='+$(this).attr("data-tm-zapomniany")+'&naucz_zamiast='+naucz_zamiast+'&zrodlo='+$(this).attr('data-zrodlo'));
    } else if ($(this).attr("data-tm")) {
        reloadMain("#glowne_okno", 'gra/sala.php?zabezpieczone_id='+$(this).attr('zabezpieczone-id')+'&p='+$(this).attr("data-pokemon-id")+'&tm='+$(this).attr("data-tm")+'&naucz_zamiast='+naucz_zamiast+'&zrodlo='+$(this).attr('data-zrodlo'));
    } else {
        reloadMain("#glowne_okno", 'gra/sala.php?zabezpieczone_id='+$(this).attr('zabezpieczone-id')+'&p='+$(this).attr("data-pokemon-id")+'&nauka_ataku='+$(this).attr('data-nazwa-ataku')+'&naucz_zamiast='+naucz_zamiast+'&zrodlo='+$(this).attr('data-zrodlo'));
    }
});


$(document).off('submit', 'form');
$(document).on('submit', 'form', function(e) {
    if (!$(this).attr("form-normal-submit")) {

        e.preventDefault();

        $("html, body").animate({ scrollTop: 0 }, "fast");

        //Obejście modali
        if($('body').hasClass('modal-open') && $(this).attr("dont-close-modal") != 1) {
            $('body').removeClass('modal-open');
            $('body').css({"padding-right":"0px"});
            $('.modal-backdrop').remove();
        } else {
            $(".modal").animate({ scrollTop: 0 }, "fast");
        }

        var postData = $(this).serializeArray();

        if ($(this).attr("form-target")) {
            //$($(this).attr('form-target')).html(loadingbar);
            //$($(this).attr('form-target')).load('gra/'+$(this).attr('action'),  postData );


            reloadMainPOST($(this).attr('form-target'), 'gra/'+$(this).attr('action'), postData);
        } else {
            $("html, body").animate({ scrollTop: 0 }, "fast");
            //$("#glowne_okno").html(loadingbar);
            //$("#glowne_okno").load('gra/'+$(this).attr('action'),  postData );

            //$.post( 'gra/'+$(this).attr('action') , postData , function( data ) {
            //	alert( "Data Loaded: " + postData );
            //	$( "#glowne_okno" ).html( data );
            //});

            reloadMainPOST("#glowne_okno", 'gra/'+$(this).attr('action'), postData);
        }
        var submit = $(this).closest("form").find(":submit");
        submit.attr("disabled", "disabled");
    }
});


$(document).off("change", ".select-submit");
$(document).on("change", ".select-submit", function(e) {
    e.preventDefault();
    $("html, body").animate({ scrollTop: 0 }, "slow");

    //Obejście modali
    $('body').removeClass('modal-open');
    $('body').css({"padding-right":"0px"});
    $('.modal-backdrop').remove();

    var postData = $(this).closest('form').serializeArray();

    $("html, body").animate({ scrollTop: 0 }, "fast");

    reloadMainPOST("#glowne_okno", 'gra/'+$(this).closest('form').attr('action'), postData);
});

$(document).off("click", "#zatwierdz_reprezentacje");
$(document).on("click", "#zatwierdz_reprezentacje", function(e) {
    $("html, body").animate({ scrollTop: 0 }, "slow");

    //Obejście modali
    $('body').removeClass('modal-open');
    $('body').css({"padding-right":"0px"});
    $('.modal-backdrop').remove();

    var postData = $(this).closest('form').serializeArray();
    $("html, body").animate({ scrollTop: 0 }, "fast");


    reloadMainPOST("#glowne_okno", 'gra/'+$(this).closest('form').attr('action'), postData);

    e.preventDefault();
});

$(document).off("click", ".collapse_toggle_icon");
$(document).on("click", ".collapse_toggle_icon", function(e) {
    if($( ".collapse_toggle_icon" ).hasClass( "glyphicon-chevron-down" )) {
        $( ".collapse_toggle_icon").removeClass( "glyphicon-chevron-down" ).addClass( "glyphicon-chevron-up" );
    } else {
        $( ".collapse_toggle_icon").removeClass( "glyphicon-chevron-up" ).addClass( "glyphicon-chevron-down" );
    }
});



// **********************
//
// initPokeLifeScript
// główna funkcja gry
//
// **********************
function initPokeLifeScript(){



    // **********************
    //
    // initSkins
    // Funkcja dodająca nowe skórki do gry
    //
    // **********************
    function initSkins(){

        var globalCSS = GM_getResourceText("customCSS_global");
        GM_addStyle(globalCSS);

        var newCSS;
        if (window.localStorage.skinStyle == 2) {
            newCSS = GM_getResourceText("customCSS_style_2");
            GM_addStyle(newCSS);
        } else if (window.localStorage.skinStyle == 3) {
            newCSS = GM_getResourceText("customCSS_style_3");
            GM_addStyle(newCSS);
        } else if (window.localStorage.skinStyle == 4) {
            newCSS = GM_getResourceText("customCSS_style_4");
            GM_addStyle(newCSS);
        } else {
            window.localStorage.skinStyle = 1;
            newCSS = GM_getResourceText("customCSS_style_1");
            GM_addStyle(newCSS);
        }

        $('body').append('<div id="changeStyle" class="plugin-button" style="border-radius: 4px;position: fixed;cursor: pointer;bottom: 10px;left: 10px;font-size: 19px;text-align: center;width: 30px;height: 30px;line-height: 35px;z-index: 9999;"></div>');
        $(document).on('click', '#changeStyle', function () {
            console.log(window.localStorage.skinStyle);
            switch(window.localStorage.skinStyle) {
                case "1":
                    window.localStorage.skinStyle = 2;
                    location.reload()
                    break;
                case "2":
                    window.localStorage.skinStyle = 3;
                    location.reload()
                    break;
                case "3":
                    window.localStorage.skinStyle = 4;
                    location.reload()
                    break;
                case "4":
                    window.localStorage.skinStyle = 1;
                    location.reload()
                    break;
                default:
                    window.localStorage.skinStyle = 1;
                    location.reload()
            }
        });
    }
    initSkins();


    // **********************
    //
    // initAutoGo
    // Funkcja dodająca automatyczne klikanie w wyprawy
    //
    // **********************
    function initAutoGo(){
        var blocked = false;
        var autoGo;

        window.localStorage.useCzerwoneNapoje == undefined ? window.localStorage.useCzerwoneNapoje = false : "";
        window.localStorage.useNiebieskieNapoje == undefined ? window.localStorage.useNiebieskieNapoje = false : "";
        window.localStorage.useZieloneNapoje == undefined ? window.localStorage.useZieloneNapoje = false : "";
        window.localStorage.useNiebieskieJagody == undefined ? window.localStorage.useNiebieskieJagody = false : "";
        window.localStorage.useFontanna == undefined ? window.localStorage.useFontanna = false : "";
        window.localStorage.useOnlyInNight == undefined ? window.localStorage.useOnlyInNight = false : "";

        function initGoButton(){
            $('body').append('<div id="goSettingsAutoGo" style="position: fixed;cursor: pointer;top: 20px;right: 275px;font-size: 20px;text-align: center;width: 25px;height: 25px;line-height: 25px;z-index: 9999;"><span style="color: ' + $('.panel-heading').css('background-color') + ';" class="glyphicon glyphicon-cog" aria-hidden="true"></span></div>');
            $('body').append('<div id="goButton" style="opacity: 0.3;border-radius: 4px;position: fixed; cursor: pointer; top: 5px; right: 10px; font-size: 36px; text-align: center; width: 100px; height: 48px; line-height: 48px; background: ' + $('.panel-heading').css('background-color') + '; z-index: 9999">GO</div>');
            $('body').append('<div id="goAutoButton" style="border-radius: 4px;position: fixed; cursor: pointer; top: 5px; right: 122px; font-size: 36px; text-align: center; width: 140px; height: 48px; line-height: 48px; background: ' + $('.panel-heading').css('background-color') + '; z-index: 9999">AutoGO</div>');
        }
        initGoButton();

        function initPokemonIcon() {
            $('#setPokemon').remove();
            $('body').append('<div id="setPokemon" style="position: fixed; cursor: pointer; top: 0; left: 10px; z-index: 9999"></div>');

            IconSelect.COMPONENT_ICON_FILE_PATH = "";

            AutoGoSettings.iconPokemon = new IconSelect("setPokemon", {
                'selectedIconWidth': 48,
                'selectedIconHeight': 48,
                'selectedBoxPadding': 1,
                'iconsWidth': 48,
                'iconsHeight': 48,
                'boxIconSpace': 1,
                'vectoralIconNumber': 1,
                'horizontalIconNumber': 6
            });

            var selectPokemon = [];
            let i = 0;
            $.each($('.stan-pokemon'), function (index, item) {
                let src = $(item).find('img').attr('src');
                if (src != "undefined" && src != undefined) {
                    selectPokemon.push({
                        'iconFilePath': $(item).find('img').attr('src'),
                        'iconValue': function(){
                            return "&wybierz_pokemona=" + AutoGoSettings.iconPokemon.getSelectedIndex();
                        }
                    });
                    i = i + 1;
                }
            });

            AutoGoSettings.iconPokemon.refresh(selectPokemon);
            AutoGoSettings.iconPokemon.setSelectedIndex(window.localStorage.pokemonIconsIndex);

            document.getElementById('setPokemon').addEventListener('changed', function (e) {
                window.localStorage.pokemonIconsIndex = AutoGoSettings.iconPokemon.getSelectedIndex();
            });
        }
        initPokemonIcon();


        function initPokeballIcon() {
            $('body').append('<div id="setPokeball" style="position: fixed; cursor: pointer; top: 0; left: 60px; z-index: 9999"></div>');

            AutoGoSettings.iconPokeball = new IconSelect("setPokeball", {
                'selectedIconWidth': 48,
                'selectedIconHeight': 48,
                'selectedBoxPadding': 1,
                'iconsWidth': 48,
                'iconsHeight': 48,
                'boxIconSpace': 1,
                'vectoralIconNumber': 1,
                'horizontalIconNumber': 6
            });

            var selectPokeball = [
                {
                    'iconFilePath': "images/pokesklep/pokeballe.jpg",
                    'iconValue': function(){
                        return '&zlap_pokemona=pokeballe';
                    }
                },
                {
                    'iconFilePath': "images/pokesklep/greatballe.jpg",
                    'iconValue': function(){
                        return '&zlap_pokemona=greatballee';
                    }
                },
                {
                    'iconFilePath': "images/pokesklep/nestballe.jpg",
                    'iconValue': function(){
                        return '&zlap_pokemona=nestballe';
                    }
                },
                {
                    'iconFilePath': "images/pokesklep/friendballe.jpg",
                    'iconValue': function(){
                        return '&zlap_pokemona=friendballe';
                    }
                },
                {
                    'iconFilePath': "images/pokesklep/nightballe.jpg",
                    'iconValue': function(){
                        return '&zlap_pokemona=nightballe';
                    }
                },
                {
                    'iconFilePath': "images/pokesklep/cherishballe.jpg",
                    'iconValue': function(){
                        return '&zlap_pokemona=cherishballe';
                    }
                },
                {
                    'iconFilePath': "images/pokesklep/lureballe.jpg",
                    'iconValue': function(){
                        return '&zlap_pokemona=lureballe';
                    }
                },
                {
                    'iconFilePath': "https://raw.githubusercontent.com/krozum/pokelife/master/assets/nb1.jpg",
                    'iconValue': function(){
                        let pokeLvlNumber = $('#glowne_okno i:nth("1")').parent().html().split("(")[1].split(" poz")[0];
                        if (pokeLvlNumber < 15) {
                            return '&zlap_pokemona=nestballe';
                        } else {
                            return '&zlap_pokemona=greatballee';
                        }
                    }
                },
                {
                    'iconFilePath': "https://raw.githubusercontent.com/krozum/pokelife/master/assets/nb2.png",
                    'iconValue': function(){
                        var d = new Date();
                        var h = d.getHours();
                        if (h >= 22 || h < 6) {
                            return '&zlap_pokemona=nightballe';
                        }
                        let pokeLvlNumber = $('#glowne_okno i:nth("1")').parent().html().split("(")[1].split(" poz")[0];
                        if (pokeLvlNumber < 15) {
                            return '&zlap_pokemona=nestballe';
                        } else {
                            return '&zlap_pokemona=greatballee';
                        }
                    }
                }

            ];

            AutoGoSettings.iconPokeball.refresh(selectPokeball);
            AutoGoSettings.iconPokeball.setSelectedIndex(window.localStorage.pokeballIconsIndex);

            document.getElementById('setPokeball').addEventListener('changed', function (e) {
                window.localStorage.pokeballIconsIndex = AutoGoSettings.iconPokeball.getSelectedIndex();
            });
        }
        initPokeballIcon();


        function initLocationIcon() {
            $('body').append('<div id="setLocation" style="position: fixed; cursor: pointer; top: 0; left: 117px; z-index: 9999"></div>');

            AutoGoSettings.iconLocation = new IconSelect("setLocation", {
                'selectedIconWidth': 48,
                'selectedIconHeight': 48,
                'selectedBoxPadding': 1,
                'iconsWidth': 48,
                'iconsHeight': 48,
                'boxIconSpace': 1,
                'vectoralIconNumber': 1,
                'horizontalIconNumber': 6
            });

            var icons = [];
            $.each($('#pasek_skrotow li'), function (index, item) {
                if ($(item).find('a').attr('href') != "#" && $(item).find('a').attr('href').substring(0, 9) == "gra/dzicz") {
                    icons.push({
                        'iconFilePath': $(item).find('img').attr('src'),
                        'iconValue': function(){
                            return $(item).find('a').attr('href').substring(28)
                        }
                    });
                }
            });

            AutoGoSettings.iconLocation.refresh(icons);
            AutoGoSettings.iconLocation.setSelectedIndex(window.localStorage.locationIconsIndex);

            document.getElementById('setLocation').addEventListener('changed', function (e) {
                window.localStorage.locationIconsIndex = AutoGoSettings.iconLocation.getSelectedIndex();
            });
        }
        initLocationIcon();


        function click(poLeczeniu) {
            if(poLeczeniu != true){
                poLeczeniu = false;
            }
            var canRun = true;

            if(blocked){
                console.log('blocked');
                canRun = false;
            } else {
                blocked = true;
                setTimeout(function(){ blocked = false }, timeoutMin);
            }

            $('.stan-pokemon div.progress:first-of-type .progress-bar').each(function (index) {
                var now = $(this).attr("aria-valuenow");
                if (Number(now) < Number(1)) {
                    if(!poLeczeniu){
                        $.get( 'gra/lecznica.php?wylecz_wszystkie&tylko_komunikat', function( data ) {
                            if($(data).find(".alert-success").length > 0){
                                console.log('PokeLifeScript: wyleczono');
                                if($(data).find(".alert-success strong").length > 0){
                                    var koszt = $(data).find(".alert-success strong").html().split(" ¥")[0];
                                    updateStats("koszty_leczenia", koszt.replace(/\./g, ''));
                                }

                                $.get( 'inc/stan.php', function( data ) {
                                    $( "#sidebar" ).html( data );
                                    $('.btn-wybor_pokemona').attr("disabled", false);
                                    $('.btn-wybor_pokemona .progress-bar').css("width", "100%");
                                    $('.btn-wybor_pokemona .progress-bar span').html("100% PŻ");
                                    setTimeout(function(){
                                        click(true)
                                    }, (timeoutMax - timeoutMin) + timeoutMin);
                                });
                            }
                        });
                    }
                    canRun = false;
                }
            });

            if (canRun) {
                if($('#glowne_okno .panel-heading').length > 0){
                    if ($('.dzikipokemon-background-shiny').length > 0) {
                        console.log('PokeLifeScript: spotkany Shiny, przerwanie AutoGo');
                        autoGo = false;
                        $('#goAutoButton').html('AutoGO');
                        $('#refreshShinyWidget').trigger('click');
                        requestBra1nsPL("https://bra1ns.pl/pokelife/api/update_shiny.php?pokemon_id=" + $('.dzikipokemon-background-shiny .center-block img').attr('src').split('/')[1].split('.')[0].split('s')[1] + "&login=" + $('#wyloguj').parent().parent().html().split("<div")[0].trim() + "&time="+Date.now(), null);
                    } else if ($('.dzikipokemon-background-normalny img[src="images/inne/pokeball_miniature2.png"]').length > 0 && $('.dzikipokemon-background-normalny img[src="images/trudnosc/trudnoscx.png"]').length < 1 && $('.dzikipokemon-background-normalny .col-xs-9 > b').html().split("Poziom: ")[1] <= 50) {
                        if($('#setPokeball .selected-box .selected-icon img').attr('src') == "images/pokesklep/safariballe.jpg"){
                            console.log('PokeLifeScript: spotkany niezłapany pokemona');
                            console.log('PokeLifeScript: atakuje pokemona');
                            var url = "dzicz.php?miejsce=" + AutoGoSettings.iconLocation.getSelectedValue().call() + AutoGoSettings.iconPokemon.getSelectedValue().call();
                            $('button[href="' + url + '"]').trigger('click');
                        } else {
                            console.log('PokeLifeScript: spotkany niezłapany pokemona, przerwanie AutoGo');
                            autoGo = false;
                            $('#goAutoButton').html('AutoGO');
                        }
                    } else if ($('.dzikipokemon-background-normalny').length == 1) {
                        console.log('PokeLifeScript: atakuje pokemona');
                        var url = "dzicz.php?miejsce=" + AutoGoSettings.iconLocation.getSelectedValue().call() + AutoGoSettings.iconPokemon.getSelectedValue().call();
                        $('button[href="' + url + '"]').trigger('click');
                    } else if ($("form[action='dzicz.php?zlap']").length == 1) {
                        var button = $('label[href="dzicz.php?miejsce=' + AutoGoSettings.iconLocation.getSelectedValue().call() + AutoGoSettings.iconPokeball.getSelectedValue().call() + '"]');
                        if(button.length > 0){
                            console.log('PokeLifeScript: rzucam pokeballa');
                            $('label[href="dzicz.php?miejsce=' + AutoGoSettings.iconLocation.getSelectedValue().call() + AutoGoSettings.iconPokeball.getSelectedValue().call() + '"]').trigger('click');
                        } else {
                            autoGo = false;
                            $('#goAutoButton').html('AutoGO');
                            $("#goStopReason").html("Brak odpowiedniego pokeballa").show();
                            console.log('PokeLifeScript: brak odpowiedniego balla');
                        }
                    } else if ($("form[action='dzicz.php?zlap_pokemona=swarmballe&miejsce=" + AutoGoSettings.iconLocation.getSelectedValue().call()+ "']").length == 1) {
                        console.log('PokeLifeScript: rzucam 1 swarmballa');
                        $("form[action='dzicz.php?zlap_pokemona=swarmballe&miejsce=" + AutoGoSettings.iconLocation.getSelectedValue().call()+ "']").submit();
                    } else {
                        console.log('PokeLifeScript: idę do dziczy ' + AutoGoSettings.iconLocation.getSelectedValue().call() + ".");
                        $('#pasek_skrotow a[href="gra/dzicz.php?poluj&miejsce=' + AutoGoSettings.iconLocation.getSelectedValue().call() + '"] img').trigger('click');
                    }
                }
            }
        }

        $(document).on("click", "#goSettingsAutoGo", function(){
            if($('#settingsAutoGo').length > 0){
                $('#settingsAutoGo').remove();
            } else {
                $('body').append('<div id="settingsAutoGo" style="padding: 10px; position:fixed;top: 60px;right: 69px;width: 440px;background: white;opacity: 1;border: 3px dashed #ffed14;z-index: 999;"></div>');
                $('#settingsAutoGo').append('<table> <tr> <th></th> <th></th> <th></th> </tr></table>');
                $('#settingsAutoGo table').append('<col width="60"><col width="20"><col width="340">');
                $('#settingsAutoGo table').append('<tr><td><img style="width: 40px;" src="images/pokesklep/duzy_napoj_energetyczny.jpg"></td><td><input type="checkbox" id="autoUseCzerwoneNapoje" name="autoUseCzerwoneNapoje" value="1" '+(window.localStorage.useCzerwoneNapoje == "true" ? "checked" : "") + ' style=" margin: 0; line-height: 50px; height: 50px; "></td><td><label style=" margin: 0; height: 50px; line-height: 44px; font-size: 14px; ">Uzywaj czerwonych napojów gdy zabraknie PA</label></td> </tr>');
                $('#settingsAutoGo table').append('<tr><td><img style="width: 40px;" src="images/pokesklep/napoj_energetyczny.jpg"></td><td><input type="checkbox" id="autoUseNiebieskieNapoje" name="autoUseNiebieskieNapoje" value="1" '+(window.localStorage.useNiebieskieNapoje == "true" ? "checked" : "") + ' style=" margin: 0; line-height: 50px; height: 50px; "></td><td><label style=" margin: 0; height: 50px; line-height: 44px; font-size: 14px; ">Uzywaj niebieskich napojów gdy zabraknie PA</label></td> </tr>');
                $('#settingsAutoGo table').append('<tr><td><img style="width: 40px;" src="images/pokesklep/zielony_napoj.jpg"></td><td><input type="checkbox" id="autoUseZieloneNapoje" name="autoUseZieloneNapoje" value="1" '+(window.localStorage.useZieloneNapoje == "true" ? "checked" : "") + ' style=" margin: 0; line-height: 50px; height: 50px; "></td><td><label style=" margin: 0; height: 50px; line-height: 44px; font-size: 14px; ">Uzywaj zielonych napojów gdy zabraknie PA</label></td> </tr>');
                $('#settingsAutoGo table').append('<tr><td><img style="width: 40px;" src="images/pokesklep/niebieskie_jagody.jpg"></td><td><input type="checkbox" id="autoUseNiebieskieJagody" name="autoUseNiebieskieJagody" value="1" '+(window.localStorage.useNiebieskieJagody == "true" ? "checked" : "") + ' style=" margin: 0; line-height: 50px; height: 50px; "></td><td><label style=" margin: 0; height: 50px; line-height: 44px; font-size: 14px; ">Uzywaj niebieskich jagód gdy zabraknie PA</label></td> </tr>');
                $('#settingsAutoGo table').append('<tr><td></td><td><input type="checkbox" id="useOnlyInNight" name="useOnlyInNight" value="1" '+(window.localStorage.useOnlyInNight == "true" ? "checked" : "") + ' style=" margin: 0; line-height: 50px; height: 50px; "></td><td><label style=" margin: 0; height: 50px; line-height: 44px; font-size: 14px; ">Uzywaj wznawiania PA tylko pomiędzy 22-6</label></td> </tr>');
                $('#settingsAutoGo').append('<p>Bot będzie starał sie przywrócać PA w kolejności <b>Niebieskie Jagody</b> -> <b>Zielone napoje</b> -> <b>Niebieskie napoje</b> -> <b>Czerwone napoje</b></p>');
            }
        });

        $(document).on("click", "#autoUseNiebieskieJagody", function(event){
            var isChecked = $('#autoUseNiebieskieJagody').prop('checked');
            window.localStorage.useNiebieskieJagody = isChecked;
        });

        $(document).on("click", "#autoUseNiebieskieNapoje", function(){
            var isChecked = $('#autoUseNiebieskieNapoje').prop('checked');
            window.localStorage.useNiebieskieNapoje = isChecked;
        });

        $(document).on("click", "#autoUseZieloneNapoje", function(){
            var isChecked = $('#autoUseZieloneNapoje').prop('checked');
            window.localStorage.useZieloneNapoje = isChecked;
        });

        $(document).on("click", "#autoUseCzerwoneNapoje", function(){
            var isChecked = $('#autoUseCzerwoneNapoje').prop('checked');
            window.localStorage.useCzerwoneNapoje = isChecked;
        });

        $(document).on("click", "#useOnlyInNight", function(){
            var isChecked = $('#useOnlyInNight').prop('checked');
            window.localStorage.useOnlyInNight = isChecked;
        });


        $(document).on("click", "#goButton", function(){
            click();
        });

        $(document).on("click", '#goAutoButton', function () {
            if (autoGo) {
                autoGo = false;
                $('#goAutoButton').html('AutoGO');
            } else {
                autoGo = true;
                $('#goAutoButton').html('STOP');
                click();
            }
        });

        $(window).keypress(function (e) {
            if (e.key === ' ' || e.key === 'Spacebar') {
                if ($('input:focus').length == 0 && $('textarea:focus').length == 0 && $('#glowne_okno .panel-heading').length == 0){
                    e.preventDefault();
                    click();
                } else if ($('input:focus').length == 0 && $('textarea:focus').length == 0 && $('#glowne_okno .panel-heading').html() !== "Poczta" && !$('#glowne_okno .panel-heading').html().startsWith("Stowarzyszenie")) {
                    e.preventDefault();
                    click();
                }
            }
        });

        onReloadMain(function(){
            if (autoGo) {
                if(this.find(".panel-body > p.alert-danger").length > 0){
                    console.log(this.find('.panel-body > p.alert-danger').html());
                    if(this.find(".panel-body > p.alert-danger:contains('Posiadasz za mało punktów akcji')").length > 0){
                        przerwijAutoGoZPowoduBrakuPA(true);
                    } else if(this.find(".panel-body > p.alert-danger:contains('Nie masz wystarczającej ilości Punktów Akcji')").length > 0){
                        przerwijAutoGoZPowoduBrakuPA(true);
                    } else if(this.find('.panel-body > p.alert-danger').html() == "Nie masz wystarczającej ilośći Punktów Akcji."){
                        przerwijAutoGoZPowoduBrakuPA(true);
                    } else if(this.find('.panel-body > p.alert-danger').html() == "Baterie w twojej latarce się wyczerpały, kup nowe."){
                        przerwijAutoGoZPowoduBrakuPA(false);
                    }
                }
            }
        })


        function probujWznowicAutoGo(array, autoGoBefore){
            if(array.length > 0 && autoGoBefore){
                var text = array.pop();
                switch(text){
                    case "useNiebieskieJagody":
                        console.log('Próbuje przywrócić PA za pomocą niebieskich jagód');
                        if($("a[href='gra/statystyki.php']").length > 0){
                            reloadMain("#glowne_okno", "gra/statystyki.php", function(){
                                setTimeout(function(){
                                    if($("#statystyki b:contains('Niebieskie Jagody:')").parent().next().html().split('/')[0].trim() != $("#statystyki b:contains('Niebieskie Jagody:')").parent().next().html().split('/')[1].trim()){
                                        if($("a[href='gra/plecak.php']").length > 0){
                                            reloadMain("#glowne_okno", "gra/plecak.php", function(){
                                                if($('.thumbnail-plecak[data-target="#plecak-48"] h5').length > 0){
                                                    var ile = $('.thumbnail-plecak[data-target="#plecak-48"] h5').html().split(' x Niebieskie')[0];

                                                    if(ile > 40){
                                                        ile = 40;
                                                    }

                                                    reloadMain("#glowne_okno", "gra/plecak.php?uzyj&p=3&postData%5B0%5D%5Bname%5D=rodzaj_przedmiotu&postData%5B0%5D%5Bvalue%5D=niebieskie_jagody&postData%5B1%5D%5Bname%5D=ilosc&postData%5B1%5D%5Bvalue%5D=" + ile, function(){
                                                        autoGo = true;
                                                        $('#goAutoButton').html('STOP');
                                                        console.log('Przywrócono PA');
                                                        setTimeout(function(){
                                                            click();
                                                        }, 2000);
                                                    });
                                                } else {
                                                    console.log('Brak jagód');
                                                    probujWznowicAutoGo(array, autoGoBefore);
                                                }
                                            })
                                        }
                                    } else {
                                        console.log('Wykorzystałeś limit niebieskich jagód na dzisiaj');
                                        probujWznowicAutoGo(array, autoGoBefore);
                                    }
                                }, 2000);
                            });
                        }
                        break;
                    case "useZieloneNapoje":
                        console.log('Próbuje przywrócić PA za pomocą zielonych napojów');
                        if($("a[href='gra/statystyki.php']").length > 0){
                            reloadMain("#glowne_okno", "gra/statystyki.php", function(){
                                setTimeout(function(){
                                    if(Number($("#statystyki b:contains('Napoje Energetyczne:')").parent().next().html().split('/')[0].trim()) < (Number($("#statystyki b:contains('Napoje Energetyczne:')").parent().next().html().split('/')[1].trim()) - 1)){
                                        if($("a[href='gra/plecak.php']").length > 0){
                                            reloadMain("#glowne_okno", "gra/plecak.php", function(){
                                                if($('.thumbnail-plecak[data-target="#plecak-1"] h5').length > 0){
                                                    reloadMain("#glowne_okno", "gra/plecak.php?uzyj&p=1&postData%5B0%5D%5Bname%5D=rodzaj_przedmiotu&postData%5B0%5D%5Bvalue%5D=zielony_napoj&postData%5B1%5D%5Bname%5D=ilosc&postData%5B1%5D%5Bvalue%5D=1", function(){
                                                        autoGo = true;
                                                        $('#goAutoButton').html('STOP');
                                                        console.log('Przywrócono PA');
                                                        setTimeout(function(){
                                                            click();
                                                        }, 2000);
                                                    });
                                                } else {
                                                    console.log('Brak napojów');
                                                    probujWznowicAutoGo(array, autoGoBefore);
                                                }
                                            })
                                        }
                                    } else {
                                        console.log('Wykorzystałeś limit napojów na dzisiaj');
                                        probujWznowicAutoGo(array, autoGoBefore);
                                    }
                                }, 2000);
                            });
                        }
                        break;
                    case "useNiebieskieNapoje":
                        console.log('Próbuje przywrócić PA za pomocą niebieskich napojów');
                        if($("a[href='gra/statystyki.php']").length > 0){
                            reloadMain("#glowne_okno", "gra/statystyki.php", function(){
                                setTimeout(function(){
                                    if(Number($("#statystyki b:contains('Napoje Energetyczne:')").parent().next().html().split('/')[0].trim()) < (Number($("#statystyki b:contains('Napoje Energetyczne:')").parent().next().html().split('/')[1].trim()) - 1)){
                                        if($("a[href='gra/plecak.php']").length > 0){
                                            reloadMain("#glowne_okno", "gra/plecak.php", function(){
                                                if($('.thumbnail-plecak[data-target="#plecak-4"] h5').length > 0){
                                                    reloadMain("#glowne_okno", "gra/plecak.php?uzyj&p=1&postData%5B0%5D%5Bname%5D=rodzaj_przedmiotu&postData%5B0%5D%5Bvalue%5D=napoj_energetyczny&postData%5B1%5D%5Bname%5D=ilosc&postData%5B1%5D%5Bvalue%5D=1", function(){
                                                        autoGo = true;
                                                        $('#goAutoButton').html('STOP');
                                                        console.log('Przywrócono PA');
                                                        setTimeout(function(){
                                                            click();
                                                        }, 2000);
                                                    });
                                                } else {
                                                    console.log('Brak napojów');
                                                    probujWznowicAutoGo(array, autoGoBefore);
                                                }
                                            })
                                        }
                                    } else {
                                        console.log('Wykorzystałeś limit napojów na dzisiaj');
                                        probujWznowicAutoGo(array, autoGoBefore);
                                    }
                                }, 2000);
                            });
                        }
                        break;
                    case "useCzerwoneNapoje":
                        console.log('Próbuje przywrócić PA za pomocą czerwonych napojów');
                        if($("a[href='gra/statystyki.php']").length > 0){
                            reloadMain("#glowne_okno", "gra/statystyki.php", function(){
                                setTimeout(function(){
                                    if($("a[href='gra/plecak.php']").length > 0){
                                        reloadMain("#glowne_okno", "gra/plecak.php", function(){
                                            if($('.thumbnail-plecak[data-target="#plecak-5"] h5').length > 0){
                                                reloadMain("#glowne_okno", "gra/plecak.php?uzyj&p=1&postData%5B0%5D%5Bname%5D=rodzaj_przedmiotu&postData%5B0%5D%5Bvalue%5D=duzy_napoj_energetyczny&postData%5B1%5D%5Bname%5D=ilosc&postData%5B1%5D%5Bvalue%5D=1", function(){
                                                    autoGo = true;
                                                    $('#goAutoButton').html('STOP');
                                                    console.log('Przywrócono PA');
                                                    setTimeout(function(){
                                                        click();
                                                    }, 2000);
                                                });
                                            } else {
                                                console.log('Brak napojów');
                                                probujWznowicAutoGo(array, autoGoBefore);
                                            }
                                        })
                                    }
                                }, 2000);
                            });
                        }
                        break;
                    default:
                        // code block
                }
            }
        }


        function przerwijAutoGoZPowoduBrakuPA(wznawiaj){
            var autoGoBefore = autoGo;
            console.log('PokeLifeScript: brak PA, przerywam AutoGo');
            autoGo = false;
            $('#goAutoButton').html('AutoGO');

            if(wznawiaj){
                var array = [];
                if(window.localStorage.useCzerwoneNapoje == "true" || window.localStorage.useCzerwoneNapoje == true){
                    array.push("useCzerwoneNapoje");
                }
                if(window.localStorage.useNiebieskieNapoje == "true" || window.localStorage.useNiebieskieNapoje == true){
                    array.push("useNiebieskieNapoje");
                }
                if(window.localStorage.useZieloneNapoje == "true" || window.localStorage.useZieloneNapoje == true){
                    array.push("useZieloneNapoje");
                }
                if(window.localStorage.useNiebieskieJagody == "true" || window.localStorage.useNiebieskieJagody == true){
                    array.push("useNiebieskieJagody");
                }
                console.log(array);
                if(window.localStorage.useOnlyInNight == "true" || window.localStorage.useOnlyInNight == true){
                    var d = new Date();
                    var h = d.getHours();
                    if (h >= 22 || h < 6) {
                        probujWznowicAutoGo(array, autoGoBefore);
                    }
                } else {
                    probujWznowicAutoGo(array, autoGoBefore);
                }
            }
        }


        afterReloadMain(function(){
            if (autoGo) {
                setTimeout(function(){ click() }, (timeoutMax - timeoutMin) + timeoutMin);
            }
        })
    }
    initAutoGo();



    // **********************
    //
    // initVersionInfo
    // Funkcja dodająca numer wersji na dole strony
    //
    // **********************
    function initVersionInfo(){
        $('body').append('<div id="newVersionInfo" style="border-radius: 4px; position: fixed; cursor: pointer; bottom: 10px; right: 20px; font-size: 19px; text-align: center; width: auto; height: 30px; line-height: 35px; z-index: 9998; text-align: right;"><a style="color: yellow !important;text-decoration:none;" target="_blank" href="https://github.com/krozum/pokelife#user-content-changelog">' + 'v' + GM_info.script.version + '</a></div>');
    };
    initVersionInfo();





    // **********************
    //
    // initAutouzupelnianiePol
    // Funkcja dodająca logowanie tego co wyświetla sie na ekranie
    //
    // **********************
    function initAutouzupelnianiePol(){

        $(document).on("click", "#plecak-jagody .thumbnail-plecak, .thumbnail-plecak[data-target='#plecak-11'], .thumbnail-plecak[data-target='#plecak-14'], .thumbnail-plecak[data-target='#plecak-15'], .thumbnail-plecak[data-target='#plecak-8'], .thumbnail-plecak[data-target='#plecak-7'], .thumbnail-plecak[data-target='#plecak-19'], .thumbnail-plecak[data-target='#plecak-16']", function (event) {
            var id = $(this).data("target");
            var ilosc = $(this).find("h5").html().split(" ")[0];
            $(id+' input[name="ilosc"]').val(ilosc);
        });

        onReloadMain(function(){
            if (this.find('.panel-heading').html() === "Centrum wymiany Punktów Zasług") {
                var dostepne = Number(this.find('.panel-body big').html().split(" ")[0]);
                var cena_zakupu = Number(this.find('#target0').parent().find("b").html().split("¥")[0].replace(/\./g, ''));
                var ilosc_yenow = Number($('a[href="http://pokelife.pl/pokedex/index.php?title=Pieniądze"]').parent().html().split("</a>")[1].split("<a")[0].replace(/\./g, ''));

                var ile_moge_kupic = Number((ilosc_yenow / cena_zakupu).toFixed());

                if (ile_moge_kupic > dostepne) {
                    ile_moge_kupic = dostepne;
                }

                console.log('PokeLifeScript: dostępnych PZ do kupienia: ' + ile_moge_kupic);
                this.find('#target0').attr("value", ile_moge_kupic);
            }
        })
    }
    initAutouzupelnianiePol();




    // **********************
    //
    // initShinyWidget
    // Funkcja pokazująca ostatnie 3 złapane shiny na rynku
    //
    // **********************

    function initShinyWidget(){
        var shinyWidget;

        function refreshShinyWidget(){
            var api = "https://bra1ns.pl/pokelife/api/get_shiny.php?login=" + $('#wyloguj').parent().parent().html().split("<div")[0].trim();
            $.getJSON(api, {
                format: "json"
            }).done(function (data) {
                var html = '<div class="panel panel-primary"><div class="panel-heading">Ostatnio spotkane shiny<div class="navbar-right"><span id="refreshShinyWidget" style="color: white; top: 4px; font-size: 16px; right: 3px;" class="glyphicon glyphicon-refresh" aria-hidden="true"></span></div></div><table class="table table-striped table-condensed"><tbody><tr>';
                $.each(data.list, function (key, value) {
                    var wystepowanie = "";
                    var nazwa = "";
                    if(pokemonData != undefined){
                        if(pokemonData['kanto'][value['pokemon_id']] != undefined){
                            wystepowanie =  "Kanto, " + pokemonData['kanto'][value['pokemon_id']].wystepowanie;
                            nazwa = pokemonData['kanto'][value['pokemon_id']].name;
                        } else if (pokemonData['johto'][value['pokemon_id']] != undefined){
                            wystepowanie =  "Johto, " + pokemonData['johto'][value['pokemon_id']].wystepowanie;
                            nazwa = pokemonData['johto'][value['pokemon_id']].name;
                        } else if (pokemonData['hoenn'][value['pokemon_id']] != undefined){
                            wystepowanie =  "Hoenn, " + pokemonData['hoenn'][value['pokemon_id']].wystepowanie;
                            nazwa = pokemonData['sinnoh'][value['pokemon_id']].name;
                        } else if (pokemonData['sinnoh'][value['pokemon_id']] != undefined){
                            wystepowanie =  "Sinnoh, " + pokemonData['sinnoh'][value['pokemon_id']].wystepowanie;
                            nazwa = pokemonData['sinnoh'][value['pokemon_id']].name;
                        } else if (pokemonData['unova'][value['pokemon_id']] != undefined){
                            wystepowanie =  "Unova, " + pokemonData['unova'][value['pokemon_id']].wystepowanie;
                            nazwa = pokemonData['unova'][value['pokemon_id']].name;
                        }
                    }
                    html = html + "<td data-toggle='tooltip' data-placement='top' title='' data-original-title='Spotkany : "+value['creation_date']+"' style='text-align: center;'><a target='_blank' href='https://pokelife.pl/pokedex/index.php?title=" + nazwa + "'><img src='pokemony/srednie/s" + value['pokemon_id'] + ".png' style='width: 40px; height: 40px;'></a></td>";
                });
                html = html + '</tr></tbody></table></div>';
                shinyWidget = html;
                $.get('inc/stan.php', function(data) { $("#sidebar").html(data); });
            });
        }
        refreshShinyWidget();

        onReloadSidebar(function(){
            this.find(".panel-heading:contains('Drużyna')").parent().before(shinyWidget);
            $('[data-toggle="tooltip"]').tooltip();
        })

        $(document).on("click", "#refreshShinyWidget", function (event) {
            refreshShinyWidget();
        });
    }
    initShinyWidget();




    // **********************
    //
    // initPlecakTMView
    // Funkcja dodająca nowy widok do zakładki z TM w plecaku
    //
    // **********************

    function initPlecakTMView(){
        var tmData;

        var api = "https://raw.githubusercontent.com/krozum/pokelife/master/tm.json";
        $.getJSON(api, {
            format: "json"
        }).done(function (data) {
            tmData = data;
        });

        onReloadMain(function(){
            if(this.find('.panel-heading').html() === "Plecak"){
                this.find('#plecak-tm > .row > div.col-xs-4').each(function (index, val) {
                    var id = $(this).find('h3').html().split(" ")[1];
                    $(this).find("br").remove();
                    if (tmData["tm"][id - 1]["category_id"] == 1) {
                        $(this).children().css("background-color", "#f9856e");
                    }
                    if (tmData["tm"][id - 1]["category_id"] == 2) {
                        $(this).children().css("background-color", "#4d98b0");
                    }
                    if (tmData["tm"][id - 1]["category_id"] == 3) {
                        $(this).children().css("background-color", "#bdbcbb");
                    }
                    $(this).children().prepend('<br><img src="https://pokelife.pl/images/typy/' + tmData["tm"][id - 1]["type_id"] + '.png" style="width: 40px;">');
                });
            }
        })
    }
    initPlecakTMView();




    // **********************
    //
    // initPlecakTrzymaneView
    // Funkcja zmieniająca wygląd plecaka
    //
    // **********************
    function initPlecakTrzymaneView(){
        onReloadMain(function(){
            if(this.find('.panel-heading').html() === "Plecak"){
                var DATA = this;
                var arrayUzywane = [];
                var arrayJajka = [];
                var arrayMega = [];
                var arrayInne = [];
                var arrayInne2 = [];
                var arrayInne3 = [];
                var arrayInne4 = [];
                var arrayInne5 = [];
                var arrayModal = [];
                $.each(this.find('#plecak-trzymane > .row > div'), function (index, item) {
                    if($(item).find(".modal-dialog").length > 0){
                        arrayModal.push(item)
                    } else if($(item).find(".caption .text-center:contains('Używa: ')").length > 0){
                        arrayUzywane.push($(item));
                    } else if($(item).find("img[src='images/przedmioty/100x100/lucky_egg.png']").length > 0){
                        arrayJajka.push($(item));
                    } else if($(item).find(".caption:contains('ite V')").length > 0){
                        arrayMega.push($(item));
                    } else if($(item).find(".caption:contains('ite X V')").length > 0){
                        arrayMega.push($(item));
                    } else if($(item).find(".caption:contains('ite Y V')").length > 0){
                        arrayMega.push($(item));
                    } else if($(item).find(".caption:contains(' V')").length > 0){
                        arrayInne5.push($(item));
                    } else if($(item).find(".caption:contains(' IV')").length > 0){
                        arrayInne4.push($(item));
                    } else if($(item).find(".caption strong:contains(' III')").length > 0){
                        arrayInne3.push($(item));
                    } else if($(item).find(".caption strong:contains(' II')").length > 0){
                        arrayInne2.push($(item));
                    } else {
                        arrayInne.push($(item));
                    }
                    item.remove();
                })

                if(arrayUzywane.length > 0){
                    var html = "<div class='row'><div class='col-xs-12'><h3 style='text-align: center;'>Używane</h3>";
                    $.each(arrayUzywane, function (index, item) {
                        html = html + '<div class="col-xs-4 col-sm-3 col-md-3 col-lg-3" style="margin: 0; padding: 0;">' + item.html() + '</div>';
                    })
                    html = html + "</div></div>"
                    this.find('#plecak-trzymane > .row').append(html);
                }

                if(arrayJajka.length > 0){
                    html = "<div class='row'><div class='col-xs-12'><h3 style='text-align: center;'>Szczęśliwe jajko</h3>";
                    $.each(arrayJajka, function (index, item) {
                        html = html + '<div class="col-xs-4 col-sm-3 col-md-3 col-lg-3" style="margin: 0; padding: 0;">' + item.html() + '</div>';
                    })
                    html = html + "</div></div>"
                    this.find('#plecak-trzymane > .row').append(html);
                }

                if(arrayMega.length > 0){
                    html = "<div class='row'><div class='col-xs-12'><h3 style='text-align: center;'>Mega kamienie</h3>";
                    $.each(arrayMega, function (index, item) {
                        html = html + '<div class="col-xs-4 col-sm-3 col-md-3 col-lg-3" style="margin: 0; padding: 0;">' + item.html() + '</div>';
                    })
                    html = html + "</div></div>"
                    this.find('#plecak-trzymane >.row').append(html);
                }

                if(arrayInne5.length > 0){
                    html = "<div class='row'><div class='col-xs-12'><h3 style='text-align: center;'>Inne V</h3>";
                    $.each(arrayInne5, function (index, item) {
                        html = html + '<div class="col-xs-4 col-sm-3 col-md-3 col-lg-3" style="margin: 0; padding: 0;">' + item.html() + '</div>';
                    })
                    html = html + "</div></div>"
                    this.find('#plecak-trzymane > .row').append(html);
                }

                if(arrayInne4.length > 0){
                    html = "<div class='row'><div class='col-xs-12'><h3 style='text-align: center;'>Inne IV</h3>";
                    $.each(arrayInne4, function (index, item) {
                        html = html + '<div class="col-xs-4 col-sm-3 col-md-3 col-lg-3" style="margin: 0; padding: 0;">' + item.html() + '</div>';
                    })
                    html = html + "</div></div>"
                    this.find('#plecak-trzymane > .row').append(html);
                }

                if(arrayInne3.length > 0){
                    html = "<div class='row'><div class='col-xs-12'><h3 style='text-align: center;'>Inne III</h3>";
                    $.each(arrayInne3, function (index, item) {
                        html = html + '<div class="col-xs-4 col-sm-3 col-md-3 col-lg-3" style="margin: 0; padding: 0;">' + item.html() + '</div>';
                    })
                    html = html + "</div></div>"
                    this.find('#plecak-trzymane > .row').append(html);
                }

                if(arrayInne2.length > 0){
                    html = "<div class='row'><div class='col-xs-12'><h3 style='text-align: center;'>Inne II</h3>";
                    $.each(arrayInne2, function (index, item) {
                        html = html + '<div class="col-xs-4 col-sm-3 col-md-3 col-lg-3" style="margin: 0; padding: 0;">' + item.html() + '</div>';
                    })
                    html = html + "</div></div>"
                    this.find('#plecak-trzymane > .row').append(html);
                }

                if(arrayInne.length > 0){
                    html = "<div class='row'><div class='col-xs-12'><h3 style='text-align: center;'>Inne</h3>";
                    $.each(arrayInne, function (index, item) {
                        html = html + '<div class="col-xs-4 col-sm-3 col-md-3 col-lg-3" style="margin: 0; padding: 0;">' + item.html() + '</div>';
                    })
                    html = html + "</div></div>"
                    this.find('#plecak-trzymane > .row').append(html);
                }

                var THAT = this;
                $.each(arrayModal, function (index, item) {
                    $(item).appendTo(THAT.find('#plecak-trzymane > .row'));
                })
            }
        })
    }
    initPlecakTrzymaneView();




    // **********************
    //
    // initSzybkieKlikanieWLinkiPromocyjne
    // Funkcja dodająca szybkie klikanie w linki promocyjne
    //
    // **********************
    function initSzybkieKlikanieWLinkiPromocyjne(){

        function clickInLink(number, id) {
            if (number < 6) {
                var w = window.open("", "myWindow", "width=200,height=100");
                w.location.href = 'http://pokelife.pl/index.php?k=' + number + '&g=' + id;
                $(w).load(setTimeout(function () {
                    w.close();
                    $('#klikniecie-' + number).html('TAK');
                    console.log('PokeLifeScript: klikam link ' + number);
                    setTimeout(function () { clickInLink(number + 1, id); }, 300);
                }, 300));
            } else {
                setTimeout(function () {
                    $.get('inc/stan.php', function(data) { $("#sidebar").html(data); });
                }, 100);
            }
        }

        onReloadMain(function(){
            var DATA = this;
            if (DATA.find('.panel-heading').html() === "Promuj stronę") {
                var html = '<div class="col-xs-12" style=" text-align: center; "><button id="clickAllLinks" style=" background-color: ' + $('.panel-heading').css('background-color') + '; border: 1px solid ' + $('.panel-heading').css('background-color') + '; border-radius: 5px; padding: 2px 20px; line-height: 20px; height: 30px; ">Wyklikaj wszystkie</button></div>';
                DATA.find('.panel-body>div:first-of-type').append(html);
            }
        })

        $(document).on("click", "#clickAllLinks", function (event) {
            var id = $('#klikniecie-1').parent().find("a").attr("onclick").split(",")[1].split(")")[0];
            setTimeout(function () { clickInLink(1, id); }, 200);
        });
    }
    initSzybkieKlikanieWLinkiPromocyjne();




    // **********************
    //
    // initStatystykiLink
    // Funkcja dodająca link do statystyk
    //
    // **********************
    function initStatystykiLink(){
        $('body').append('<a id="PokeLifeScriptStats" style="color: #333333 !important;text-decoration:none;" target="_blank" href="https://bra1ns.pl/pokelife/stats/"><div class="plugin-button" style="border-radius: 4px;position: fixed;cursor: pointer;top: 15px;left: 220px;font-size: 19px;text-align: center;width: 100px;height: 30px;line-height: 35px;z-index: 9998;text-align: center;line-height: 30px;color: #333333;">Statystyki</div></a>');
        $("#PokeLifeScriptStats").attr("href", "https://bra1ns.pl/pokelife/stats/?login="+md5($('#wyloguj').parent().parent().html().split("<div")[0].trim()));
    }
    initStatystykiLink();




    // **********************
    //
    // initLogger
    // Funkcja dodająca logowanie tego co wyświetla sie na ekranie
    // eventTypeId:
    // 1 - pusta wyprawa
    // 2 - walka z trenerem wygrana
    // 3 - walka z trenerem przegrana
    // 4 - spotkany pokemon
    // 5 - walka wygrana
    // 6 - walka przegrana
    // 7 - pokemon złapany
    // 8 - pokemon niezłapany
    // 9 - zebrane jagody
    // 10 - event w dziczy
    // **********************
    function initLogger(){
        var aktualnyPokemonDzicz;
        onReloadMain(function(url){
            var dzicz = null;
            if(url != null && url.indexOf('miejsce=') != -1){
                dzicz = url.split('miejsce=')[1].split('&')[0];
            }
            var DATA = this;

            if(url == "gra/aktywnosc.php?p=praca&przerwij"){
                if(DATA.find("p.alert-success:contains('Otrzymujesz wynagrodzenie w wysokości')").length > 0){
                    var yeny = DATA.find("p.alert-success b").html().split(' ')[0].replace(/\./g, '');
                    updateStats("zarobek_z_pracy", yeny);
                }
            }


            if(DATA.find("p.alert-info:contains('Niestety, tym razem nie spotkało cię nic interesującego.')").length > 0){
                console.log('PokeLifeScript: pusta wyprawa');
                updateEvent("Niestety, tym razem nie spotkało cię nic interesującego", 1, dzicz);
            } else if(DATA.find("p.alert-success:contains('pojedynek')").length > 0){
                console.log('PokeLifeScript: walka z trenerem');
                updateStats("walki_z_trenerami", 1);
                var pd = 0;
                var json = "";
                if(DATA.find(".alert-success:not(:contains('Moc odznaki odrzutowca sprawia'))").length > 2){
                    $.each(DATA.find(".alert-success:not(:contains('Moc odznaki odrzutowca sprawia')):nth(2) b").html().split("PD<br>"), function(key, value){
                        if(value != ""){
                            pd = pd + Number(value.split("+")[1]);
                            json = json + '"'+ value.split("+")[0].trim() + '":"' + Number(value.split("+")[1]) + '",';
                        }
                    });
                    pd = pd.toFixed(2);
                    updateStats("zarobki_z_trenerow", DATA.find(".alert-success:not(:contains('Moc odznaki odrzutowca sprawia')):nth(1) b").html().split(" ¥")[0]);
                    updateStats("zdobyte_doswiadczenie", pd);
                    updateEvent("Na twojej drodze staje inny trener pokemon, który wyzywa Cię na pojedynek. Wygrywasz <b>" + DATA.find(".alert-success:not(:contains('Moc odznaki odrzutowca sprawia')):nth(1) b").html().split(" ¥")[0] + "</b> ¥. Zdobyte doświadczenie: <b>" + pd + "</b>", 2, dzicz);
                    updateStatsDoswiadczenie("{"+json.substring(0, json.length - 1)+"}");
                } else {
                    $.each(DATA.find(".alert-success:not(:contains('Moc odznaki odrzutowca sprawia')):nth(1) b").html().split("PD<br>"), function(key, value){
                        if(value != ""){
                            pd = pd + Number(value.split("+")[1]);
                            json = json + '"'+ value.split("+")[0].trim() + '":"' + Number(value.split("+")[1]) + '",';
                        }
                    });
                    pd.toFixed(2);
                    updateStats("zdobyte_doswiadczenie", pd);
                    updateEvent("Na twojej drodze staje inny trener pokemon, który wyzywa Cię na pojedynek ale niestety go przegrywasz. Zdobyte doświadczenie: <b>" + pd + "</b>", 3, dzicz);
                    updateStatsDoswiadczenie("{"+json.substring(0, json.length - 1)+"}");
                }
            } else if(DATA.find(".dzikipokemon-background-normalny").length > 0){
                console.log('PokeLifeScript: spotkany pokemon');
                updateEvent("Spotkany pokemon <b>" + DATA.find('.panel-primary i').html() + "</b>", 4, dzicz);
                aktualnyPokemonDzicz = DATA.find('.panel-primary i').html();
            } else if(DATA.find("h2:contains('Złap Pokemona')").length > 0){
                console.log('PokeLifeScript: pokemon pokonany');
                updateStats("wygranych_walk_w_dziczy", 1);
                updateStats("zdobyte_doswiadczenie", DATA.find('p.alert-success:first').html().split("Zwycięstwo! ")[1].split("</b> +")[1].split(' PD')[0]);
                updateStatsDoswiadczenie('{"'+ DATA.find('.panel-body b b').html() + '":"' + DATA.find('p.alert-success:first').html().split("Zwycięstwo! ")[1].split("</b> +")[1].split(' PD')[0] + '"}');
                updateEvent("Wygrałeś walke z <b>"+aktualnyPokemonDzicz+"</b>. Zdobyłeś <b>" + DATA.find('p.alert-success:first').html().split("Zwycięstwo! ")[1].split("</b> +")[1].split(' PD')[0] + "</b> punktów doświadczenia", 5, dzicz);
            } else if(DATA.find("h2:contains('Pokemon Ucieka')").length > 0){
                console.log('PokeLifeScript: pokemon pokonany ale ucieka');
                updateStats("wygranych_walk_w_dziczy", 1);
                updateStats("zdobyte_doswiadczenie", DATA.find('p.alert-success:first').html().split("Zwycięstwo! ")[1].split("</b> +")[1].split(' PD')[0]);
                updateStatsDoswiadczenie('{"'+ DATA.find('.panel-body b b').html() + '":"' + DATA.find('p.alert-success:first').html().split("Zwycięstwo! ")[1].split("</b> +")[1].split(' PD')[0] + '"}');
                updateEvent("Wygrałeś walke z <b>"+aktualnyPokemonDzicz+"</b>. Zdobyłeś <b>" + DATA.find('p.alert-success:first').html().split("Zwycięstwo! ")[1].split("</b> +")[1].split(' PD')[0] + "</b> punktów doświadczenia", 5, dzicz);
            } else if(DATA.find(".panel-body > p.alert-success:contains('Udało Ci się złapać')").length > 0){
                console.log('PokeLifeScript: pokemon złapany');
                updateEvent("Udało ci sie złapać <b>"+ aktualnyPokemonDzicz + "</b>.", 7, dzicz);
                updateStats("zlapanych_pokemonow", 1);
                if(DATA.find('p.alert-success:nth(1):contains("nie masz już miejsca")').length > 0){
                    var zarobek  = DATA.find('p.alert-success:nth(1):contains("nie masz już miejsca") strong').html().split(" ")[0].replace(/\./g, '');
                    updateStats("zarobki_z_hodowli", zarobek);
                }
            } else if(DATA.find(".panel-body > p.alert-danger:contains('uwolnił')").length > 0){
                console.log('PokeLifeScript: pokemon sie uwolnił');
                updateStats("niezlapanych_pokemonow", 1);
                updateEvent("<b>"+ aktualnyPokemonDzicz + "</b> się uwolnił.", 8, dzicz);
            } else if(DATA.find(".panel-body > p.alert-success").length > 0 && DATA.find('.panel-heading').html() == 'Dzicz - wyprawa'){
                console.log('PokeLifeScript: event w dziczy');
                if (DATA.find('p.alert-success:not(:contains("Moc odznaki odrzutowca sprawia")):first').html() != undefined && DATA.find('p.alert-success:not(:contains("Moc odznaki odrzutowca sprawia")):first').html().indexOf("Jagód") != -1) {
                    if(DATA.find('p.alert-success:not(:contains("Moc odznaki odrzutowca sprawia")):first b').html() == "Czerwonych Jagód"){
                        updateStats("zebrane_czerwone_jagody", DATA.find('p.alert-success:not(:contains("Moc odznaki odrzutowca sprawia")):first b:nth(1)').html());
                    } else if(DATA.find('p.alert-success:not(:contains("Moc odznaki odrzutowca sprawia")):first b').html() == "Niebieskich Jagód"){
                        updateStats("zebrane_niebieskie_jagody", DATA.find('p.alert-success:not(:contains("Moc odznaki odrzutowca sprawia")):first b:nth(1)').html());
                    } else if(DATA.find('p.alert-success:not(:contains("Moc odznaki odrzutowca sprawia")):first b').html() == "Fioletowych Jagód"){
                        updateStats("zebrane_fioletowe_jagody", DATA.find('p.alert-success:not(:contains("Moc odznaki odrzutowca sprawia")):first b:nth(1)').html());
                    } else if(DATA.find('p.alert-success:not(:contains("Moc odznaki odrzutowca sprawia")):first b').html() == "Żółtych Jagód"){
                        updateStats("zebrane_zolte_jagody", DATA.find('p.alert-success:not(:contains("Moc odznaki odrzutowca sprawia")):first b:nth(1)').html());
                    } else if(DATA.find('p.alert-success:not(:contains("Moc odznaki odrzutowca sprawia")):first b').html() == "Białych Jagód"){
                        updateStats("zebrane_biale_jagody", DATA.find('p.alert-success:not(:contains("Moc odznaki odrzutowca sprawia")):first b:nth(1)').html());
                    } else if(DATA.find('p.alert-success:not(:contains("Moc odznaki odrzutowca sprawia")):first b:nth(1)').html() == "Czerwonych Jagód"){
                        updateStats("zebrane_czerwone_jagody", DATA.find('p.alert-success:not(:contains("Moc odznaki odrzutowca sprawia")):first b:nth(0)').html());
                    } else if(DATA.find('p.alert-success:not(:contains("Moc odznaki odrzutowca sprawia")):first b:nth(1)').html() == "Niebieskich Jagód"){
                        updateStats("zebrane_niebieskie_jagody", DATA.find('p.alert-success:not(:contains("Moc odznaki odrzutowca sprawia")):first b:nth(0)').html());
                    } else if(DATA.find('p.alert-success:not(:contains("Moc odznaki odrzutowca sprawia")):first b:nth(1)').html() == "Fioletowych Jagód"){
                        updateStats("zebrane_fioletowe_jagody", DATA.find('p.alert-success:not(:contains("Moc odznaki odrzutowca sprawia")):first b:nth(0)').html());
                    } else if(DATA.find('p.alert-success:not(:contains("Moc odznaki odrzutowca sprawia")):first b:nth(1)').html() == "Żółtych Jagód"){
                        updateStats("zebrane_zolte_jagody", DATA.find('p.alert-success:not(:contains("Moc odznaki odrzutowca sprawia")):first b:nth(0)').html());
                    } else if(DATA.find('p.alert-success:not(:contains("Moc odznaki odrzutowca sprawia")):first b:nth(1)').html() == "Białych Jagód"){
                        updateStats("zebrane_biale_jagody", DATA.find('p.alert-success:not(:contains("Moc odznaki odrzutowca sprawia")):first b:nth(0)').html());
                    } else if(DATA.find('p.alert-success:not(:contains("Moc odznaki odrzutowca sprawia")):first b:nth(1)').html().indexOf("Jagód") != -1){
                        updateStats("zebrane_inne_jagody", DATA.find('p.alert-success:not(:contains("Moc odznaki odrzutowca sprawia")):first b:nth(0)').html());
                    } else {
                        updateStats("zebrane_inne_jagody", DATA.find('p.alert-success:not(:contains("Moc odznaki odrzutowca sprawia")):first b:nth(1)').html());
                    }
                    updateEvent(DATA.find('.panel-body > p.alert-success').html(), 9, dzicz);
                } else if(DATA.find('.panel-heading').html() == 'Dzicz - wyprawa') {
                    updateEvent(DATA.find('.panel-body > p.alert-success').html(), 10, dzicz);
                }
            } else if(DATA.find(".panel-body > p.alert-info").length > 0 && DATA.find('.panel-heading').html() == 'Dzicz - wyprawa'){
                console.log('PokeLifeScript: event w dziczy');
                updateEvent(DATA.find('.panel-body > p.alert-info').html(), 10, dzicz);
            } else if(DATA.find(".panel-body > p.alert-warning").length > 0 && DATA.find('.panel-heading').html() == 'Dzicz - wyprawa'){
                console.log('PokeLifeScript: event w dziczy');
                updateEvent(DATA.find('.panel-body > p.alert-warning').html(), 10, dzicz);
            }
        })
    }
    initLogger();






    // **********************
    //
    // initWbijanieSzkoleniowca
    // Funkcja automatycznie przechodząca po przechowalni i zwiększaniu treningów do miniumum 7 w każdą statystyke
    //
    // **********************
    function initWbijanieSzkoleniowca(){
        var array = [];
        var affected = 0;
        var price = 0;
        var max = 0;
        var now = 0;

        //$('#pasek_skrotow > .navbar-nav').append('<li><a id="skrot_szkoleniowiec" href="#" data-toggle="tooltip" data-placement="top" title="" data-original-title="Wbijaj osiągnięcie szkoleniowca"><div class="pseudo-btn"><img src="https://raw.githubusercontent.com/krozum/pokelife/master/assets/3b79fd270c90c0dfd90763fcf1b54346-trofeo-de-campe--n-estrella-by-vexels.png"></div></a></li>');

        onReloadMain(function(){
            array = [];
            if(this.find('.panel-heading').html() === "Pokemony"){
                this.find('#pokemony-przechowalnia select[name="kolejnosc"]').parent().prepend('<button class="plugin-button" id="wbijajSzkoleniowca" style="padding: 5px 10px; border-radius: 3px; margin-bottom: 15px">Wbijaj szkoleniowca</button><br>');
                $.each(this.find('#pokemony-przechowalnia .btn-podgladpoka'), function (index, item) {
                    if(Number($(item).parent().data('poziom')) >= 5){
                        array.push($(item).data('id-pokemona'));
                    }
                })
            }
        })


        $(document).on('click', '#skrot_szkoleniowiec', function(){
            reloadMain("#glowne_okno", 'gra/druzyna.php?p=3', function(){
                $('#wbijajSzkoleniowca').trigger('click');
            });
        });

        $(document).on('click', '#wbijajSzkoleniowca', function(){
            max = array.length;
            now = 0;
            wbijajSzkoleniowca(array);
        });

        function trenuj(array, callback){
            if(array.length > 0){
                setTimeout(function(){
                    reloadMain("#glowne_okno", "gra/"+array.pop(), function(){
                        price = Number(price) + Number($('.alert-success b:nth(1)').html().split(" ¥")[0].replace(/\./g, ''));
                        trenuj(array, callback);
                    })
                }, 1000);
            } else {
                callback.call();
            }
        }

        function wbijajSzkoleniowca(array){
            if(array.length > 0){
                if($('#szkoleniowiec_progress').length < 1){
                    $('body').append('<div id="szkoleniowiec_progress" class="" style="position: fixed;bottom: 60px;width: 500px;height: auto;z-index: 999;margin: 0 auto;left: 0;right: 0;background-color: inherit;border: none;"><div class="progress" style="margin:0;box-shadow: none;border-radius: 0; border: 1px solid black"><div class="progress-bar progress-bar-danger" role="progressbar" style="border-radius: 0; width: '+Number((((max-array.length)*100)/max)).toFixed(0)+'%;"> <span>'+Number((((max-array.length)*100)/max)).toFixed(0)+'%</span></div></div></div>');
                } else {
                    $('#szkoleniowiec_progress .progress-bar').css('width', Number((((max-array.length)*100)/max)).toFixed(0)+'%');
                    $('#szkoleniowiec_progress .progress-bar span').html(Number((((max-array.length)*100)/max)).toFixed(0)+'%');
                }
                var id = array.pop();
                now++;

                setTimeout(function(){
                    reloadMain("#glowne_okno", "gra/sala.php?p="+id+"&zrodlo=rezerwa", function(){
                        var treningi = [];
                        var i;
                        for(var j = 1; j <=6; j++){
                            var count = Number($('.sala_atrybuty_tabelka .row:nth('+j+') > div:nth(2)').html());
                            var ile = 0;
                            if(j != 6){
                                ile = 7 - count;
                            } else {
                                ile = 35 - count;
                                ile = ile / 5;
                            }
                            if(ile > 0){
                                affected = affected + ile;
                                treningi.push($('.sala_atrybuty_tabelka .row:nth('+j+') > div:nth(3) > form').attr('action')+"&postData%5B0%5D%5Bname%5D=ilosc&postData%5B0%5D%5Bvalue%5D=" + ile);
                            }
                        }
                        trenuj(treningi, function(){wbijajSzkoleniowca(array)});
                    })
                }, 1000);
            } else {
                $('#szkoleniowiec_progress').remove();
                reloadMain("#glowne_okno", 'gra/druzyna.php?p=3', function(){
                    $('#pokemony-przechowalnia select[name="kolejnosc"]').parent().prepend('<p class="alert alert-success text-center">Wykonano <b>'+affected+'</b> treningów o łącznej wartości <b>'+price+' ¥</b></p>');
                    price = 0;
                    affected = 0;
                });
            }
        }
    }
    initWbijanieSzkoleniowca();





    // **********************
    //
    // initChat
    // Funkcja automatycznie przechodząca po przechowalni i zwiększaniu treningów do miniumum 7 w każdą statystyke
    //
    // **********************
    function initChat(){
        window.localStorage.max_chat_id = 0;

        $('#chat-inner > ul').append('<li role="presentation" data-toggle="tooltip" data-placement="top" title="" data-original-title="Pokój widoczny wyłącznie dla użytkowników bota"><a href="#room-99999" aria-controls="room-99999" role="tab" data-toggle="tab" class="showRoomBot" data-room="99999" aria-expanded="true">Bot</a></li>');
        $('#shout_list').after('<ol style="list-style: none; display: none; margin: 0; padding: 0" id="bot_list"></ol>');
        $('#shoutbox-panel-footer').after('<div style="display: none;background: none;" id="shoutbox-bot-panel-footer" class="panel-footer input-group"><p style="width: 100%;padding: 5px;padding-left: 0px;margin: 0;color: #bbbbbb;position: absolute;z-index: 999;bottom: 55px;">Czat jest anonimowy, będziesz podpisany fałszywym nickiem</p><input id="shout_bot_message" type="text" class="form-control" placeholder="Wiadomość" name="message"> <span class="input-group-btn"> <button id="shout_bot_button" class="btn btn-primary" type="button">Wyślij</button> </span> </div>');


        $("a[href='#room-99999']").click(function(){
            $('#bot-chat-counter').css("display", "none");
            $('#bot-chat-counter').html(0);
        });

        $('.showRoomBot').click(function(){
            $('#shout_list').hide();
            $('#shoutbox-panel-footer').hide();
            $('#bot_list').show();
            $('#shoutbox-bot-panel-footer').show();
        });

        $('.showRoom').click(function(){
            $('#bot_list').hide();
            $('#shoutbox-bot-panel-footer').hide();
            $('#shout_list').show();
            $('#shoutbox-panel-footer').show();
        });

        $(document).on('click', '#zaloguj_chat', function(e) {
            var url = 'https://bra1ns.pl/pokelife/api/get_czat.php?czat_id='+window.localStorage.max_chat_id;
            $.getJSON(url, {
                format: "json"
            }).done(function (data) {
                if(data['list'] != undefined){
                    var messages = data['list'].reverse();
                    $.each(messages, function (key, value) {
                        $("#bot_list").append('<li style="padding: 1px 5px 1px 5px;font-family: Georgia, \'Times New Roman\', Times, serif; font-size: 14px;"><span class="shout_post_date">('+value["creation_date"].split(" ")[1]+') </span><span class="shout_post_name">'+value["false_login"]+'</span>: '+value["message"]+'</li>');
                        window.localStorage.max_chat_id = value["czat_id"];
                    });
                }

                setInterval(function(){
                    var url = 'https://bra1ns.pl/pokelife/api/get_czat.php?czat_id='+window.localStorage.max_chat_id;
                    $.getJSON(url, {
                        format: "json"
                    }).done(function (data) {
                        if(data['list'] != undefined){
                            var messages = data['list'].reverse();
                            $.each(messages, function (key, value) {
                                $("#bot_list").append('<li style="padding: 1px 5px 1px 5px;font-family: Georgia, \'Times New Roman\', Times, serif; font-size: 14px;"><span class="shout_post_date">('+value["creation_date"].split(" ")[1]+') </span><span class="shout_post_name">'+value["false_login"]+'</span>: '+value["message"]+'</li>');
                                window.localStorage.max_chat_id = value["czat_id"];
                            });
                        }
                    });
                }, 2500);
            })
        })

        function wyslij() {
            var msg = $("#shout_bot_message").val();
            var value =  $("#shout_button").val();
            if(msg.length > 255) {
                alert("Wiadomość za długa o " + (msg.length - 255));
            } else {
                $("#shout_button").val('Wysyłanie...');

                var url = 'https://bra1ns.pl/pokelife/api/update_czat.php';
                $.getJSON(url, {
                    format: "json",
                    message: msg,
                    login: $('#wyloguj').parent().parent().html().split("<div")[0].trim()
                }).done(function (data) {
                    $("#shout_bot_button").val(value);
                    $("#shout_bot_message").val('');
                });
            }
        }

        $('#shout_bot_message').keypress(function(event) {
            if (event.keyCode == 13) {
                wyslij();
            }
        });

        $("#shout_bot_button").click(function() {
            wyslij();
        });
    }
    initChat();

}




$.getJSON("https://raw.githubusercontent.com/krozum/pokelife/master/pokemon.json", {
    format: "json"
}).done(function (data) {
    pokemonData = data;
    if($('#pasek_skrotow a[href="gra/dzicz.php?poluj&miejsce=las"]').length > 0){
        region = 'kanto';
    } else if($('#pasek_skrotow a[href="gra/dzicz.php?poluj&miejsce=puszcza"]').length > 0){
        region = 'johto';
    } else if($('#pasek_skrotow a[href="gra/dzicz.php?poluj&miejsce=opuszczona_elektrownia"]').length > 0){
        region = 'hoenn';
    } else if($('#pasek_skrotow a[href="gra/dzicz.php?poluj&miejsce=koronny_szczyt"]').length > 0){
        region = 'sinnoh';
    } else if($('#pasek_skrotow a[href="gra/dzicz.php?poluj&miejsce=ranczo"]').length > 0){
        region = 'unova';
    } else if($('#pasek_skrotow a[href="gra/dzicz.php?poluj&miejsce=francuski_labirynt"]').length > 0){
        region = 'kalos';
    }
    console.log("Wykryty region: " + region);
    initPokeLifeScript();
})

