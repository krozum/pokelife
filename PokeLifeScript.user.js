// ==UserScript==
// @name         PokeLifeScript
// @version      3.25
// @description  Dodatek do gry Pokelife
// @match        https://gra.pokelife.pl/*
// @downloadURL  https://github.com/krozum/pokelife/raw/master/PokeLifeScript.user.js
// @updateURL    https://github.com/krozum/pokelife/raw/master/PokeLifeScript.user.js
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @require      https://bug7a.github.io/iconselect.js/sample/lib/control/iconselect.js
// @resource     customCSS_global  https://raw.githubusercontent.com/krozum/pokelife/master/assets/global.css?ver=2
// @resource     customCSS_style_1  https://raw.githubusercontent.com/krozum/pokelife/master/assets/style_1.css?ver=1
// @resource     customCSS_style_2  https://raw.githubusercontent.com/krozum/pokelife/master/assets/style_2.css?ver=1
// @resource     customCSS_style_3  https://raw.githubusercontent.com/krozum/pokelife/master/assets/style_3.css?ver=1
// @resource     customCSS_style_4  https://raw.githubusercontent.com/krozum/pokelife/master/assets/style_4.css?ver=1
// ==/UserScript==


// Wszystkie funkcje od góry:
//
// 1.  initOtworzWNowymOknie
// 2.  initSkins
// 3.  initAutoGo
// 4.  initAutouzupelnianiePol
// 5.  initShinyWidget
// 6.  initZadaniaWidget
// 7.  initPlecakTMView
// 8.  initStatystykiLink
// 9.  initVersionInfo
// 10. initLogger
// 11. initSzybkieKlikanieWLinkiPromocyjne
// 12. initRozbudowanyOpisDziczy
// 13. initWielkanocWidget // TODO: poprawić dodawanie nowe dziczy z jajkiem
// 14. initPoprawaWygladuPokow
// 15. initSzybkiSklep
// 16. initWyszukiwarkaOsiagniec
// 17. initKomunikat
// 18. initPlecakTrzymaneView
// 19. initWbijanieSzkoleniowca
// 20. initWystawView
// 21. initWbijanieJeszczeDokladke
// 22. initEventWyspaUnikatow
// 23. initZamianaPrzedmiotow
// 24. initPodgladPokowWLidze
// 25. initSzybkaWalkaWLidze
// 26. initPrzypomnienieOPracy




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
requestBra1nsPL("https://bra1ns.pl/pokelife/api/update_user.php?bot_version=" + GM_info.script.version + "&login=" + $('#wyloguj').parent().parent().html().split("<div")[0].trim(), null);



// **********************
//
// zmienne globalne
//
// **********************

var config = new Object();

$.getJSON("https://bra1ns.pl/pokelife/api/get_user.php?login=" + $('#wyloguj').parent().parent().html().split("<div")[0].trim() + "&time="+Date.now(), {
    format: "json"
}).done(function (data) {
    if(data.user != null && data.user.config != ""){
        config = JSON.parse(data.user.config);
    } else {
        config.skinStyle = 3;
        config.useNiebieskieJagody = false;
        config.useNiebieskieNapoje = false;
        config.useCzerwoneNapoje = false;
        config.pokemonIconsIndex = 0;
        config.pokeballIconsIndex = 8;
        config.locationIconsIndex = 0;
        config.lastVersion = GM_info.script.version;
        config.set1 = new Object();
        config.set1[1] = "none";
        config.set1[2] = "none";
        config.set1[3] = "none";
        config.set1[4] = "none";
        config.set1[5] = "none";
        config.set1[6] = "none";
        config.set2 = new Object();
        config.set2[1] = "none";
        config.set2[2] = "none";
        config.set2[3] = "none";
        config.set2[4] = "none";
        config.set2[5] = "none";
        config.set2[6] = "none";
        updateConfig(config);
    }
    initPokeLifeScript();
})

function updateConfig(config, callback){
    console.log(config);
    requestBra1nsPL("https://bra1ns.pl/pokelife/api/update_config.php?config=" + JSON.stringify(config) + "&login=" + $('#wyloguj').parent().parent().html().split("<div")[0].trim(), callback != undefined ? function(){ callback.call()} : null);
}

var AutoGoSettings = new Object();
var previousPageContent = null;



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

$(document).off("click", ".btn-edycja-nazwy-grupy");
$(document).on("click", "btn-edycja-nazwy-grupy", function(event) {
    $("#panel_grupa_id_"+$(this).attr('data-grupa-id')).html('<form action="druzyna.php?p=2&zmien_nazwe_grupy='+$(this).attr('data-grupa-id')+'" method="post"><div class="input-group"><input type="text" class="form-control" name="grupa_nazwa" value="'+ $(this).attr('data-obecna-nazwa')+'"><span class="input-group-btn"><input class="btn btn-primary" type="submit" value="Ok"/></span></div></form>');
});

$(document).off("click", ".nauka-ataku");
$(document).on("click", ".nauka-ataku", function(event) {
    event.preventDefault();
    $("html, body").animate({ scrollTop: 0 }, "slow");

    var naucz_zamiast = $("input[name=nauczZamiast-"+$(this).attr("data-pokemon-id")+"]:checked").val();

    if ($(this).attr("data-tm-zapomniany")) {
        reloadMain("#glowne_okno", 'gra/sala.php?zabezpieczone_id='+$(this).attr('zabezpieczone-id')+'&p='+$(this).attr("data-pokemon-id")+'&tm_zapomniany='+$(this).attr("data-tm-zapomniany")+'&naucz_zamiast='+naucz_zamiast+'&zrodlo='+$(this).attr('data-zrodlo'));
    } else if ($(this).attr("data-tm")) {
        reloadMain("#glowne_okno", 'gra/sala.php?zabezpieczone_id='+$(this).attr('zabezpieczone-id')+'&p='+$(this).attr("data-pokemon-id")+'&tm='+$(this).attr("data-tm")+'&naucz_zamiast='+naucz_zamiast+'&zrodlo='+$(this).attr('data-zrodlo'));
    } else {
        reloadMain("#glowne_okno", 'gra/sala.php?zabezpieczone_id='+$(this).attr('zabezpieczone-id')+'&p='+$(this).attr("data-pokemon-id")+'&nauka_ataku='+$(this).attr('data-nazwa-ataku')+'&naucz_zamiast='+naucz_zamiast+'&zrodlo='+$(this).attr('data-zrodlo'));
    }
});

$(document).off("blur change", ".select-submit");
$(document).on("change", ".select-submit", function(event) {
    event.preventDefault();
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
$(document).on("click", "#zatwierdz_reprezentacje", function(event) {
    $("html, body").animate({ scrollTop: 0 }, "slow");

    //Obejście modali
    $('body').removeClass('modal-open');
    $('body').css({"padding-right":"0px"});
    $('.modal-backdrop').remove();

    var postData = $(this).closest('form').serializeArray();

    $("html, body").animate({ scrollTop: 0 }, "fast");

    reloadMainPOST("#glowne_okno", 'gra/'+$(this).closest('form').attr('action'), postData);

    event.preventDefault();
});

$(document).off("click", ".collapse_toggle_icon");
$(document).on("click", ".collapse_toggle_icon", function(event) {
    if($(".collapse_toggle_icon" ).hasClass("glyphicon-chevron-down")) {
        $(".collapse_toggle_icon").removeClass("glyphicon-chevron-down").addClass("glyphicon-chevron-up");
    } else {
        $(".collapse_toggle_icon").removeClass("glyphicon-chevron-up").addClass("glyphicon-chevron-down");
    }
});

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
    if($('#hodowla-glowne b').length > 0){
        zarobek = $('#hodowla-glowne b').html().split("¥")[0];
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

$(document).off( "click", ".stan-pokemon");
$(document).on( "click", ".stan-pokemon", function(event) {
    reloadMain("#glowne_okno", 'gra/stan.php?p='+$(this).attr('data-pokemon-id'));
});

$(document).off( "click", ".pokazpoka");
$(document).on( "click", ".pokazpoka", function(event) {
    var ukrycie = 0;
    var zmienna = $(this).attr('data-ignoruj-ukrycie');
    if (typeof zmienna !== typeof undefined && zmienna !== false) {
        ukrycie = 1;
    }
    var hala = 0;
    var zmienna2 = $(this).attr('data-ograniczenia-hali');
    if (typeof zmienna2 !== typeof undefined && zmienna2 !== false) {
        hala = 1;
    }
    var hala2 = 0;
    var zmienna3 = $(this).attr('data-pokemon-hala');
    if (typeof zmienna3 !== typeof undefined && zmienna3 !== false) {
        hala2 = 1;
    }
    var rank = 0;
    var zmienna4 = $(this).attr('data-ranking-staty');
    if (typeof zmienna4 !== typeof undefined && zmienna4 !== false) {
        rank = zmienna4;
    }
    reloadMain("#podgladPoka_content", 'gra/pokemon_skr.php?nopanel&p='+$(this).attr('data-id-pokemona')+'&ignoruj_ukrycie='+ukrycie+'&ograniczenia_hali='+hala+'&pokemon_hala='+hala2+'&treningi_rank='+rank);
});

$(document).off('submit', 'form');
$(document).on('submit', 'form', function(e) {
    if (!$(this).attr("form-normal-submit")) {
        e.preventDefault();


        if($('body').hasClass('modal-open') && $(this).attr("dont-close-modal") != 1) {
            $('body').removeClass('modal-open');
            $('body').css({"padding-right":"0px"});
            $('.modal-backdrop').remove();
        }

        var postData = $(this).serializeArray();

        if ($(this).attr("form-target")) {
            reloadMainPOST($(this).attr('form-target'), 'gra/'+$(this).attr('action'), postData);
        } else {
            reloadMainPOST("#glowne_okno", 'gra/'+$(this).attr('action'), postData);
        }
    }
});

$(document).on('click', '#zaloguj_chat', function(e) {
    $("#shout_refresher").load("gra/chat/shout.php?refresh=0");
})


// **********************
//
// initPokeLifeScript
// główna funkcja gry
//
// **********************
function initPokeLifeScript(){


    // **********************
    //
    // initOtworzWNowymOknie
    // funkcja dodająca mozliwosc otwarca w nowym oknie zakladek
    //
    // **********************
    function initOtworzWNowymOknie(){
        $(document).ready(function() {
            $("a").each(function(){
                if($(this).attr('href').charAt(0)!='#' && !$(this).hasClass( "link" )) {
                    $(this).attr("href", "index.php?url="+$(this).attr("href"));
                };
            });

            if(window.location.search.indexOf('url=') != -1){
                reloadMain("#glowne_okno", window.location.search.split('url=')[1], function(){history.replaceState('data to be passed', 'PokeLife - Gra Pokemon Online', 'index.php');});
            }
        });
    }
    initOtworzWNowymOknie();



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
        if (config.skinStyle == 2) {
            newCSS = GM_getResourceText("customCSS_style_2");
            GM_addStyle(newCSS);
        } else if (config.skinStyle == 3) {
            newCSS = GM_getResourceText("customCSS_style_3");
            GM_addStyle(newCSS);
        } else if (config.skinStyle == 4) {
            newCSS = GM_getResourceText("customCSS_style_4");
            GM_addStyle(newCSS);
        } else {
            newCSS = GM_getResourceText("customCSS_style_1");
            GM_addStyle(newCSS);
        }

        $('body').append('<div id="changeStyle" class="plugin-button" style="border-radius: 4px;position: fixed;cursor: pointer;bottom: 10px;left: 10px;font-size: 19px;text-align: center;width: 30px;height: 30px;line-height: 35px;z-index: 9999;"></div>');
        $('body').on('click', '#changeStyle', function () {
            switch(config.skinStyle) {
                case 1:
                    config.skinStyle = 2;
                    updateConfig(config, function(){location.reload()});
                    break;
                case 2:
                    config.skinStyle = 3;
                    updateConfig(config, function(){location.reload()});
                    break;
                case 3:
                    config.skinStyle = 4;
                    updateConfig(config, function(){location.reload()});
                    break;
                case 4:
                    config.skinStyle = 1;
                    updateConfig(config, function(){location.reload()});
                    break;
                default:
                    config.skinStyle = 1;
                    updateConfig(config, function(){location.reload()});
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
        var iconPokemon;
        var iconPokeball;
        var iconLocation;
        var lastClick;
        var autoGo;
        var blockGoButton = false;

        function initPokemonIcon() {
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
            AutoGoSettings.iconPokemon.setSelectedIndex(config.pokemonIconsIndex);

            document.getElementById('setPokemon').addEventListener('changed', function (e) {
                config.pokemonIconsIndex = AutoGoSettings.iconPokemon.getSelectedIndex();
                updateConfig(config);
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
                        return '&zlap_pokemona=greatballe';
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
                            return '&zlap_pokemona=greatballe';
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
                            return '&zlap_pokemona=greatballe';
                        }
                    }
                },
                {
                    'iconFilePath': "https://raw.githubusercontent.com/krozum/pokelife/master/assets/nb3.jpg",
                    'iconValue': function() {
                        var d = new Date();
                        var h = d.getHours();
                        if (h >= 22 || h < 6) {
                            return '&zlap_pokemona=nightballe';
                        }
                        let pokeLvlNumber = $('#glowne_okno i:nth("1")').parent().html().split("(")[1].split(" poz")[0];
                        if (pokeLvlNumber <= 5) {
                            return '&zlap_pokemona=uzyj_swarmballe';
                        } else if (pokeLvlNumber > 5 && pokeLvlNumber < 15) {
                            return '&zlap_pokemona=nestballe';
                        } else {
                            return '&zlap_pokemona=greatballe';
                        }
                    }
                },
                {
                    'iconFilePath': "https://raw.githubusercontent.com/krozum/pokelife/master/assets/nb4.jpg",
                    'iconValue': function() {
                        var d = new Date();
                        var h = d.getHours();
                        if (h >= 22 || h < 6) {
                            return '&zlap_pokemona=nightballe';
                        }
                        let pokeLvlNumber = $('#glowne_okno i:nth("1")').parent().html().split("(")[1].split(" poz")[0];
                        if (pokeLvlNumber <= 5) {
                            return '&zlap_pokemona=levelballe';
                        } else if (pokeLvlNumber >= 5 && pokeLvlNumber < 15) {
                            return '&zlap_pokemona=nestballe';
                        } else {
                            return '&zlap_pokemona=greatballe';
                        }
                    }
                },
                {
                    'iconFilePath': "images/pokesklep/safariballe.jpg",
                    'iconValue': function(){
                        if(Number($('label[data-original-title="Safariball"]').html().split('">')[1].trim()) > 1){
                            if($('form[action="dzicz.php?zlap"] label[data-original-title="Safariball"]').length > 0 && $(previousPageContent).find('.dzikipokemon-background-normalny img[src="images/inne/pokeball_miniature2.png"]').length > 0 && $(previousPageContent).find('.dzikipokemon-background-normalny img[src="images/trudnosc/trudnoscx.png"]').length < 1 && $(previousPageContent).find('.dzikipokemon-background-normalny .col-xs-9 > b').html().split("Poziom: ")[1] <= 50){
                                return '&zlap_pokemona=safariballe';
                            } else if($('form[action="dzicz.php?zlap"] label[data-original-title="Safariball"]').length > 0 && $(previousPageContent).find('.dzikipokemon-background-normalny img[src="images/trudnosc/trudnosc1.png"]').length > 0 && $(previousPageContent).find('.dzikipokemon-background-normalny .col-xs-9 > b').html().split("Poziom: ")[1] <= 40){
                                return '&zlap_pokemona=safariballe';
                            } else if($('form[action="dzicz.php?zlap"] label[data-original-title="Safariball"]').length > 0 && $(previousPageContent).find('.dzikipokemon-background-normalny img[src="images/trudnosc/trudnosc2.png"]').length > 0 && $(previousPageContent).find('.dzikipokemon-background-normalny .col-xs-9 > b').html().split("Poziom: ")[1] <= 15){
                                return '&zlap_pokemona=safariballe';
                            } else if ($('form[action="dzicz.php?zlap"] label[data-original-title="Safariball"]').length > 0)  {
                                $('button:contains("Pomiń i szukaj dalej")').click();
                                return "";
                            }
                            return "";
                        } else {
                            $('button:contains("Pomiń i szukaj dalej")').click();
                            return "";
                        }
                    }
                }
            ];

            AutoGoSettings.iconPokeball.refresh(selectPokeball);
            AutoGoSettings.iconPokeball.setSelectedIndex(config.pokeballIconsIndex);

            document.getElementById('setPokeball').addEventListener('changed', function (e) {
                config.pokeballIconsIndex = AutoGoSettings.iconPokeball.getSelectedIndex();
                updateConfig(config);
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
                if ($(item).find('a').attr('href') != "#" && $(item).find('a').attr('href').split('url=')[1].substring(0, 9) == "gra/dzicz") {
                    icons.push({
                        'iconFilePath': $(item).find('img').attr('src'),
                        'iconValue': function(){
                            return $(item).find('a').attr('href').split('url=')[1].substring(28)
                        }
                    });
                }
            });

            AutoGoSettings.iconLocation.refresh(icons);
            AutoGoSettings.iconLocation.setSelectedIndex(config.locationIconsIndex);

            document.getElementById('setLocation').addEventListener('changed', function (e) {
                config.locationIconsIndex = AutoGoSettings.iconLocation.getSelectedIndex();
                updateConfig(config);
            });
        }
        initLocationIcon();

        function initGoButton(){
            $('body').append('<div id="goButton" style="opacity: 0.3;border-radius: 4px;position: fixed; cursor: pointer; top: 5px; right: 10px; font-size: 36px; text-align: center; width: 100px; height: 48px; line-height: 48px; background: ' + $('.panel-heading').css('background-color') + '; z-index: 9999">GO</div>');
            $('body').append('<div id="goAutoButton" style="border-radius: 4px;position: fixed; cursor: pointer; top: 5px; right: 122px; font-size: 36px; text-align: center; width: 140px; height: 48px; line-height: 48px; background: ' + $('.panel-heading').css('background-color') + '; z-index: 9999">AutoGO</div>');
            $('body').append('<div id="goSettingsAutoGo" style="position: fixed;cursor: pointer;top: 20px;right: 275px;font-size: 20px;text-align: center;width: 25px;height: 25px;line-height: 25px;z-index: 9999;"><span style="color: ' + $('.panel-heading').css('background-color') + ';" class="glyphicon glyphicon-cog" aria-hidden="true"></span></div>');
        }
        initGoButton();

        function click() {
            if(!blockGoButton){
                blockGoButton = true;
                var canRun = true;

                $('.stan-pokemon div.progress:first-of-type .progress-bar').each(function (index) {
                    var now = $(this).attr("aria-valuenow");
                    var max = $(this).attr("aria-valuemax");
                    if (Number(now) < Number(max)) {
                        if (lastClick === 'leczenie') {
                            canRun = false;
                        } else {
                            canRun = false;
                            lastClick = 'leczenie';
                            console.log('PokeLifeScript: lecze ze jagody');
                            $.get( 'gra/plecak.php?uzyj&rodzaj_przedmiotu=czerwone_jagody&tylko_komunikat&ulecz_wszystkie&zjedz_max', function( data ) {
                                console.log('PokeLifeScript: lecze ze yeny');
                                $.get( 'gra/lecznica.php?wylecz_wszystkie&tylko_komunikat', function( data ) {
                                    if($(data).find(".alert-success").length > 0){
                                        if($(data).find(".alert-success strong").length > 0){
                                            var koszt = $(data).find(".alert-success strong").html().split(" ¥")[0];
                                            updateStats("koszty_leczenia", koszt.replace(/\./g, ''));
                                        }

                                        $.get( 'inc/stan.php', function( data ) {
                                            $( "#sidebar" ).html( data );
                                            blockGoButton = false;
                                            $('.btn-wybor_pokemona').attr("disabled", false);
                                            $('.btn-wybor_pokemona .progress-bar').css("width", "100%");
                                            $('.btn-wybor_pokemona .progress-bar span').html("100% PŻ");
                                            click();
                                        });
                                    }
                                });
                            });
                        }
                    }
                });

                if (canRun) {
                    lastClick = 'nieleczenie';
                    if($('#glowne_okno .panel-heading').length > 0){
                        if ($('.dzikipokemon-background-shiny').length > 0) {
                            console.log('PokeLifeScript: spotkany Shiny, przerwanie AutoGo');
                            autoGo = false;
                            $('#goAutoButton').html('AutoGO');
                            requestBra1nsPL("https://bra1ns.pl/pokelife/api/update_shiny.php?pokemon_id=" + $('.dzikipokemon-background-shiny .center-block img').attr('src').split('/')[1].split('.')[0].split('s')[1] + "&login=" + $('#wyloguj').parent().parent().html().split("<div")[0].trim() + "&time="+Date.now(), null);
                        } else if ($('.dzikipokemon-background-normalny img[src="images/inne/pokeball_miniature2.png"]').length > 0 && $('.dzikipokemon-background-normalny img[src="images/trudnosc/trudnoscx.png"]').length < 1 && $('.dzikipokemon-background-normalny .col-xs-9 > b').html().split("Poziom: ")[1] <= 50) {
                            console.log('PokeLifeScript: spotkany niezłapany pokemona, przerwanie AutoGo');
                            autoGo = false;
                            $('#goAutoButton').html('AutoGO');
                        } else if ($('.dzikipokemon-background-normalny').length == 1) {
                            console.log('PokeLifeScript: atakuje pokemona');
                            var url = "dzicz.php?miejsce=" + AutoGoSettings.iconLocation.getSelectedValue().call() + AutoGoSettings.iconPokemon.getSelectedValue().call();
                            $('button[href="' + url + '"]').trigger('click');
                        } else if ($("form[action='dzicz.php?zlap']").length == 1) {
                            console.log('PokeLifeScript: rzucam pokeballa');
                            $('label[href="dzicz.php?miejsce=' + AutoGoSettings.iconLocation.getSelectedValue().call() + AutoGoSettings.iconPokeball.getSelectedValue().call() + '"]').trigger('click');
                        } else if ($("form[action='dzicz.php?zlap_pokemona=swarmballe&miejsce=" + AutoGoSettings.iconLocation.getSelectedValue().call()+ "']").length == 1) {
                            console.log('PokeLifeScript: rzucam 1 swarmballa');
                            $("form[action='dzicz.php?zlap_pokemona=swarmballe&miejsce=" + AutoGoSettings.iconLocation.getSelectedValue().call()+ "']").submit();
                        } else {
                            console.log('PokeLifeScript: idę do dziczy ' + AutoGoSettings.iconLocation.getSelectedValue().call() + ".");
                            $('#pasek_skrotow a[href="index.php?url=gra/dzicz.php?poluj&miejsce=' + AutoGoSettings.iconLocation.getSelectedValue().call() + '"] img').trigger('click');
                        }
                    }
                }
            }
        }

        $(document).on("click", "#goSettingsAutoGo", function(){
            if($('#settingsAutoGo').length > 0){
                $('#settingsAutoGo').remove();
            } else {
                $('body').append('<div id="settingsAutoGo" style="padding: 10px; position:fixed;top: 60px;right: 69px;width: 400px;background: white;opacity: 0.9;border: 3px dashed #ffed14;z-index: 999;"></div>');
                $('#settingsAutoGo').append('<table> <tr> <th></th> <th></th> <th></th> </tr></table>');
                $('#settingsAutoGo table').append('<col width="60"><col width="20"><col width="300">');
                $('#settingsAutoGo table').append('<tr><td><img style="width: 40px;" src="images/pokesklep/duzy_napoj_energetyczny.jpg"></td><td><input type="checkbox" id="autoUseCzerwoneNapoje" name="autoUseCzerwoneNapoje" value="1" '+(config.useCzerwoneNapoje == true ? "checked" : "") + ' style=" margin: 0; line-height: 50px; height: 50px; "></td><td><label style=" margin: 0; height: 50px; line-height: 44px; font-size: 14px; ">Uzywaj czerwonych napoi gdy zabraknie PA</label></td> </tr>');
                $('#settingsAutoGo table').append('<tr><td><img style="width: 40px;" src="images/pokesklep/napoj_energetyczny.jpg"></td><td><input type="checkbox" id="autoUseNiebieskieNapoje" name="autoUseNiebieskieNapoje" value="1" '+(config.useNiebieskieNapoje == true ? "checked" : "") + ' style=" margin: 0; line-height: 50px; height: 50px; "></td><td><label style=" margin: 0; height: 50px; line-height: 44px; font-size: 14px; ">Uzywaj niebieskich napoi gdy zabraknie PA</label></td> </tr>');
                $('#settingsAutoGo table').append('<tr><td><img style="width: 40px;" src="images/pokesklep/niebieskie_jagody.jpg"></td><td><input type="checkbox" id="autoUseNiebieskieJagody" name="autoUseNiebieskieJagody" value="1" '+(config.useNiebieskieJagody == true ? "checked" : "") + ' style=" margin: 0; line-height: 50px; height: 50px; "></td><td><label style=" margin: 0; height: 50px; line-height: 44px; font-size: 14px; ">Uzywaj niebieskich jagód gdy zabraknie PA</label></td> </tr>');
                $('#settingsAutoGo').append('<p>Bot będzie starał sie przywrócać PA w kolejności <b>Niebieskie Jagody</b> -> <b>Niebieskie napoje</b> -> <b>Czerwone napoje</b></p>');
            }
        });

        $(document).on("click", "#autoUseNiebieskieJagody", function(event){
            var isChecked = $('#autoUseNiebieskieJagody').prop('checked');
            config.useNiebieskieJagody = isChecked;
            updateConfig(config);
        });

        $(document).on("click", "#autoUseNiebieskieNapoje", function(){
            var isChecked = $('#autoUseNiebieskieNapoje').prop('checked');
            config.useNiebieskieNapoje = isChecked;
            updateConfig(config);
        });

        $(document).on("click", "#autoUseCzerwoneNapoje", function(){
            var isChecked = $('#autoUseCzerwoneNapoje').prop('checked');
            config.useCzerwoneNapoje = isChecked;
            updateConfig(config);
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

        afterReloadMain(function(){
            blockGoButton = false;
            if (autoGo) {
                click();
            } else {
                //$("html, body").animate({ scrollTop: 0 }, "fast");
            }
        })

        onReloadMain(function(){
            if (autoGo) {
                if(this.find(".panel-body > p.alert-danger").length > 0){
                    console.log(this.find('.panel-body > p.alert-danger').html());
                    if(this.find(".panel-body > p.alert-danger:contains('Posiadasz za mało punktów akcji')").length > 0){
                        przerwijAutoGoZPowoduBrakuPA();
                    } else if(this.find(".panel-body > p.alert-danger:contains('Nie masz wystarczającej ilości Punktów Akcji')").length > 0){
                        przerwijAutoGoZPowoduBrakuPA();
                    } else if(this.find('.panel-body > p.alert-danger').html() == "Nie masz wystarczającej ilośći Punktów Akcji."){
                        przerwijAutoGoZPowoduBrakuPA();
                    }
                }
            }
        })

        function probujWznowicAutoGo(array, autoGoBefore){
            if(array.length > 0){
                console.log("PokeLifeScript: próbuje przywrócic PA");
                $.get(array.pop(), function( data ) {
                    if(data.indexOf("jagód i niemal natychmiast czujesz przypływ energii") != -1){
                        console.log("PokeLifeScript: przywrócono PA");
                        $.get('inc/stan.php', function(data) {
                            $("#sidebar").html(data);
                            if(autoGoBefore){
                                autoGo = true;
                                $('#goAutoButton').html('STOP');
                                click();
                            }
                        });
                    } else if(data.indexOf("energetyczny, po kilku chwilach czujesz przypływ sił") != -1){
                        console.log("PokeLifeScript: przywrócono PA");
                        $.get('inc/stan.php', function(data) {
                            $("#sidebar").html(data);
                            if(autoGoBefore){
                                autoGo = true;
                                $('#goAutoButton').html('STOP');
                                click();
                            }
                        });
                    } else if(data.indexOf("mmm ale smaczny! Czujesz przypływ sił") != -1){
                        console.log("PokeLifeScript: przywrócono PA");
                        $.get('inc/stan.php', function(data) {
                            $("#sidebar").html(data);
                            if(autoGoBefore){
                                autoGo = true;
                                $('#goAutoButton').html('STOP');
                                click();
                            }
                        });
                    } else {
                        console.log("PokeLifeScript: nie udało sie przywrócic PA");
                        probujWznowicAutoGo(array, autoGoBefore);
                    }
                });
            }
        }

        function przerwijAutoGoZPowoduBrakuPA(){
            var autoGoBefore = autoGo;
            console.log('PokeLifeScript: brak PA, przerywam AutoGo');
            blockGoButton = false;
            autoGo = false;
            $('#goAutoButton').html('AutoGO');

            var array = [];
            if(config.useCzerwoneNapoje == true){
                array.push("gra/plecak.php?uzyj&rodzaj_przedmiotu=duzy_napoj_energetyczny&ilosc=1&tylko_komunikat");
            }
            if(config.useNiebieskieNapoje == true){
                array.push("gra/plecak.php?uzyj&rodzaj_przedmiotu=napoj_energetyczny&ilosc=1&tylko_komunikat");
            }
            if(config.useNiebieskieJagody == true){
                array.push("gra/plecak.php?uzyj&rodzaj_przedmiotu=niebieskie_jagody&tylko_komunikat&ulecz_wszystkie&zjedz_max");
            }
            probujWznowicAutoGo(array, autoGoBefore);
        }

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

        AutoGoSettings.przerwij = function(){
            var autoGoBefore = autoGo;
            console.log('PokeLifeScript: przerywam na żądanie');
            blockGoButton = false;
            autoGo = false;
            $('#goAutoButton').html('AutoGO');
        }
    };
    initAutoGo();



    // **********************
    //
    // initAutouzupelnianiePol
    // Funkcja dodająca logowanie tego co wyświetla sie na ekranie
    //
    // **********************
    function initAutouzupelnianiePol(){

        $(document).on("click", "#plecak-jagody .thumbnail-plecak, .thumbnail-plecak[data-target='#plecak-11'], .thumbnail-plecak[data-target='#plecak-15'], .thumbnail-plecak[data-target='#plecak-8'], .thumbnail-plecak[data-target='#plecak-7'], .thumbnail-plecak[data-target='#plecak-19'], .thumbnail-plecak[data-target='#plecak-16']", function (event) {
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
            var api = "https://bra1ns.pl/pokelife/api/get_shiny.php?login=" + $('#wyloguj').parent().parent().html().split("<div")[0].trim() + "&time="+Date.now();
            $.getJSON(api, {
                format: "json"
            }).done(function (data) {
                var html = '<div class="panel panel-primary"><div class="panel-heading">Ostatnio spotkane shiny<div class="navbar-right"><span id="refreshShinyWidget" style="color: white; top: 4px; font-size: 16px; right: 3px;" class="glyphicon glyphicon-refresh" aria-hidden="true"></span></div></div><table class="table table-striped table-condensed"><tbody><tr>';
                $.each(data.list, function (key, value) {
                    html = html + "<td data-toggle='tooltip' data-placement='top' title='' data-original-title='Spotkany: "+value['creation_date']+"' style='text-align: center;'><img src='https://poke-life.net/pokemony/srednie/s" + value['pokemon_id'] + ".png' style='width: 40px; height: 40px;'></td>";
                });
                html = html + '</tr></tbody></table></div>';
                shinyWidget = html;
                $.get('inc/stan.php', function(data) { $("#sidebar").html(data); });
            });
        }
        refreshShinyWidget();

        onReloadSidebar(function(){
            this.find(".panel-heading:contains('Drużyna')").parent().before(shinyWidget);
        })

        $(document).on("click", "#refreshShinyWidget", function (event) {
            refreshShinyWidget();
            $.get('inc/stan.php', function(data) { $("#sidebar").html(data); });
        });
    }
    initShinyWidget();



    // **********************
    //
    // initZadaniaWidget
    // Funkcja pokazująca aktualne zadania w sidebar
    //
    // **********************

    function initZadaniaWidget(){
        var zadaniaWidget;

        function refreshZadaniaWidget(){
            $.ajax({
                type: 'POST',
                url: "gra/zadania.php"
            }).done(function (response) {
                var html = '<div class="panel panel-primary"><div class="panel-heading">Zadania<div class="navbar-right"><span id="refreshZadaniaWidget" style="color: white; top: 4px; font-size: 16px; right: 3px;" class="glyphicon glyphicon-refresh" aria-hidden="true"></span></div></div><table class="table table-striped table-condensed"><tbody>';
                $.each($(response).find('#zadania_codzienne .panel-primary .panel-heading'), function(key, value){
                    if($(value).html().split("<div")[0] !== "brak zadania"){
                        html = html + '<tr><td>'+$(value).html().split("<div")[0];
                    }
                    if($(value).parent().find(".text-center").html() != undefined){
                        $.each($(value).parent().find(".text-center p"), function(key2, value2){
                            html = html + " - " + $(value2).html().trim();
                        })
                    }
                    html = html +'</tr></td>';
                });
                html = html + '</tbody></table></div>';
                zadaniaWidget = html;
                $.get('inc/stan.php', function(data) { $("#sidebar").html(data); });
            })
        }
        refreshZadaniaWidget();

        onReloadSidebar(function(){
            this.find(".panel-heading:contains('Drużyna')").parent().after(zadaniaWidget);
        })

        $(document).on("click", "#refreshZadaniaWidget", function (event) {
            refreshZadaniaWidget();
            $.get('inc/stan.php', function(data) { $("#sidebar").html(data); });
        });
    }
    initZadaniaWidget();



    // **********************
    //
    // initPokemonDniaWidget
    // Funkcja dodająca pokemona dnia do sidebaru
    //
    // **********************
    function initPokemonDniaWidget(){
        var hodowlaPokemonDniaImage;
        $.ajax({
            type: 'POST',
            url: "gra/hodowla.php"
        }).done(function (response) {
            hodowlaPokemonDniaImage = $(response).find('#hodowla-glowne img').attr('src');
        });

        onReloadSidebar(function(){
            if(hodowlaPokemonDniaImage != undefined){
                this.find('button[href="raport.php"]').parent().prepend('<img class="btn-akcja" href="hodowla.php?wszystkie&amp;pokemon_dnia" src="https://gra.pokelife.pl/'+hodowlaPokemonDniaImage+'" data-toggle="tooltip" data-placement="top" title="" data-original-title="Pokemon Dnia" style="cursor: pointer; width: 50px;margin-left: 10px; float: left; ">');
                this.find('button[href="raport.php"]').parent().css('margin-top', '10px').css('padding-right','10px');
                $('[data-toggle="tooltip"]').tooltip();
            }
        })
    }
    initPokemonDniaWidget();



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
    // initStatystykiLink
    // Funkcja dodająca link do statystyk
    //
    // **********************
    function initStatystykiLink(){
        $('body').append('<a id="PokeLifeScriptStats" style="color: #333333 !important;text-decoration:none;" target="_blank" href="https://bra1ns.pl/pokelife/stats/"><div class="plugin-button" style="border-radius: 4px;position: fixed;cursor: pointer;top: 15px;left: 220px;font-size: 19px;text-align: center;width: 100px;height: 30px;line-height: 35px;z-index: 9998;text-align: center;line-height: 30px;color: #333333;">Statystyki</div></a>');
        $("#PokeLifeScriptStats").attr("href", "https://bra1ns.pl/pokelife/stats/?login="+$('#wyloguj').parent().parent().html().split("<div")[0].trim());
    }
    initStatystykiLink();



    // **********************
    //
    // initVersionInfo
    // Funkcja dodająca numer wersji na dole strony
    //
    // **********************
    function initVersionInfo(){
        $('body').append('<div id="newVersionInfo" style="border-radius: 4px; position: fixed; cursor: pointer; bottom: 10px; right: 20px; font-size: 19px; text-align: center; width: auto; height: 30px; line-height: 35px; z-index: 9998; text-align: right;"><a style="color: yellow !important;text-decoration:none;" target="_blank" href="https://github.com/krozum/pokelife#user-content-changelog">' + (GM_info.script.version == config.lastVersion ? "" : "New Version! ") + 'v' + GM_info.script.version + '</a></div>');
        config.lastVersion = GM_info.script.version;
        updateConfig(config);
    };
    initVersionInfo();



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

            if(DATA.find("p.alert-info:contains('Niestety, tym razem nie spotkało cię nic interesującego.')").length > 0){
                console.log('PokeLifeScript: pusta wyprawa');
                updateEvent("Niestety, tym razem nie spotkało cię nic interesującego", 1, dzicz);
            } else if(DATA.find("p.alert-success:contains('pojedynek')").length > 0){
                console.log('PokeLifeScript: walka z trenerem');
                updateEvent("Niestety, tym razem nie spotkało cię nic interesującego", 1, dzicz);
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
                updateStats("zdobyte_doswiadczenie", DATA.find('p.alert-success:first').html().split("zyskuje ")[1].split(" punktów")[0]);
                updateStatsDoswiadczenie('{"'+ DATA.find('.panel-body b b').html() + '":"' +DATA.find('p.alert-success:first').html().split("zyskuje ")[1].split(" punktów")[0]+'"}');
                updateEvent("Wygrałeś walke z <b>"+aktualnyPokemonDzicz+"</b>. Zdobyłeś <b>" + DATA.find('p.alert-success:first').html().split("zyskuje ")[1].split(" punktów")[0] + "</b> punktów doświadczenia", 5, dzicz);
            } else if(DATA.find("h2:contains('Pokemon Ucieka')").length > 0){
                console.log('PokeLifeScript: pokemon pokonany ale ucieka');
                updateStats("wygranych_walk_w_dziczy", 1);
                updateStats("zdobyte_doswiadczenie", DATA.find('p.alert-success:first').html().split("zyskuje ")[1].split(" punktów")[0]);
                updateStatsDoswiadczenie('{"'+ DATA.find('.panel-body b b').html() + '":"' +DATA.find('p.alert-success:first').html().split("zyskuje ")[1].split(" punktów")[0]+'"}');
                updateEvent("Wygrałeś walke z <b>"+aktualnyPokemonDzicz+"</b>. Zdobyłeś <b>" + DATA.find('p.alert-success:first').html().split("zyskuje ")[1].split(" punktów")[0] + "</b> punktów doświadczenia", 5, dzicz);
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
    // initSzybkieKlikanieWLinkiPromocyjne
    // Funkcja dodająca szybkie klikanie w linki promocyjne
    //
    // **********************
    function initSzybkieKlikanieWLinkiPromocyjne(){

        function clickInLink(number, id) {
            if (number < 11) {
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
    // initRozbudowanyOpisDziczy
    // Funkcja dodająca podgląd statystyk dotyczących dziczy
    //
    // **********************
    function initRozbudowanyOpisDziczy(){
        var kolekcjaData = [];
        var pokemonData = [];
        var region;

        if($('#pasek_skrotow a[href="index.php?url=gra/dzicz.php?poluj&miejsce=las"]').length > 0){
            region = 'kanto';
        } else if($('#pasek_skrotow a[href="index.php?url=gra/dzicz.php?poluj&miejsce=puszcza"]').length > 0){
            region = 'johto';
        } else if($('#pasek_skrotow a[href="index.php?url=gra/dzicz.php?poluj&miejsce=opuszczona_elektrownia"]').length > 0){
            region = 'hoenn';
        } else if($('#pasek_skrotow a[href="index.php?url=gra/dzicz.php?poluj&miejsce=koronny_szczyt"]').length > 0){
            region = 'sinnoh';
        } else if($('#pasek_skrotow a[href="index.php?url=gra/dzicz.php?poluj&miejsce=ranczo"]').length > 0){
            region = 'unova';
        } else if($('#pasek_skrotow a[href="index.php?url=gra/dzicz.php?poluj&miejsce=francuski_labirynt"]').length > 0){
            region = 'kalos';
        }

        var api = "https://raw.githubusercontent.com/krozum/pokelife/master/pokemon.json";
        $.getJSON(api, {
            format: "json"
        }).done(function (data) {
            pokemonData = data;

            $.get('gra/kolekcja.php', function( data ) {
                kolekcjaData.kanto = new Object();
                $(data).find('#kolekcja-1 div').each(function(index, value){
                    kolekcjaData.kanto[""+$(value).data('id-pokemona')] = $(value).hasClass('kolekcja-zlapane');
                })

                kolekcjaData.johto = new Object();
                $(data).find('#kolekcja-2 div').each(function(index, value){
                    kolekcjaData.johto[""+$(value).data('id-pokemona')] = $(value).hasClass('kolekcja-zlapane');
                })

                kolekcjaData.hoenn = new Object();
                $(data).find('#kolekcja-3 div').each(function(index, value){
                    kolekcjaData.hoenn[""+$(value).data('id-pokemona')] = $(value).hasClass('kolekcja-zlapane');
                })

                kolekcjaData.sinnoh = new Object();
                $(data).find('#kolekcja-4 div').each(function(index, value){
                    kolekcjaData.sinnoh[""+$(value).data('id-pokemona')] = $(value).hasClass('kolekcja-zlapane');
                })

                kolekcjaData.unova = new Object();
                $(data).find('#kolekcja-5 div').each(function(index, value){
                    kolekcjaData.unova[""+$(value).data('id-pokemona')] = $(value).hasClass('kolekcja-zlapane');
                })

                kolekcjaData.kalos = new Object();
                $(data).find('#kolekcja-6 div').each(function(index, value){
                    kolekcjaData.kalos[""+$(value).data('id-pokemona')] = $(value).hasClass('kolekcja-zlapane');
                })

                $.each($('#pasek_skrotow li'), function (index, item) {
                    if ($(item).find('a').attr('href').substring(14, 23) == "gra/dzicz") {
                        var url = $(item).find('a').attr('href').split('url=')[1].substring(28);
                        var name = $(item).find('a').data('original-title').split('Wyprawa: ')[1];

                        $(document).on('mouseenter', 'a[href="index.php?url=gra/dzicz.php?poluj&miejsce='+url+'"]', function(){
                            var html = '<div class="row" id="opis'+name.replace(/[ ]/g, '')+'" style="z-index: 999; width: 600px; bottom: 90px; position: fixed; left: 0; right: 0; margin: 0 auto; background: #222; opacity: .9; color: white; padding: 15px">';
                            var wszystkie = true;

                            $.each(pokemonData[region], function(index, value) {
                                if(value.wystepowanie == name && value.do_zlapania == 1 && kolekcjaData[region][value.id] == false){
                                    wszystkie = false;
                                    html = html + '<div class="col-xs-2" style="display: inline; float: left; padding: 0; margin-top: 5px; text-align: center;"><img style="margin-bottom: 5px; text-align: center; max-width: 80%;" src="https://gra.pokelife.pl/pokemony/niezdobyte/'+value.id+'.png"><p style="margin: 0; margin-top: 5px; margin-bottom: 5px">'+value.name+'</p></div>';
                                }
                            })
                            if(wszystkie){
                                html = html + "Udało ci się złapać wszystkie poki w tej dziczy";
                            }
                            html = html + '</div>';
                            $('body').append(html);
                        })


                        $(document).on('mouseleave', 'a[href="index.php?url=gra/dzicz.php?poluj&miejsce='+url+'"]', function(){
                            $('#opis'+name.replace(/[ ]/g, '')).remove();
                        })
                    }
                });

            });
        });
    }
    initRozbudowanyOpisDziczy();



    // **********************
    //
    // initWielkanocWidget
    // Funkcja pokazująca ilość jajek złapanych danego dnia
    //
    // **********************
    function initWielkanocWidget(){
        var d = new Date();
        if(d.getDate() <= 28 && d.getDate() >= 15 && d.getMonth() == 3){
            var wielkanocWidget;
            var aktualnaDziczZJajem = $('#pasek_skrotow a:nth(0)').attr('href').split('miejsce=')[1];
            var region;

            if($('#pasek_skrotow a[href="index.php?url=gra/dzicz.php?poluj&miejsce=las"]').length > 0){
                region = 'kanto';
            } else if($('#pasek_skrotow a[href="index.php?url=gra/dzicz.php?poluj&miejsce=puszcza"]').length > 0){
                region = 'johto';
            } else if($('#pasek_skrotow a[href="index.php?url=gra/dzicz.php?poluj&miejsce=opuszczona_elektrownia"]').length > 0){
                region = 'hoenn';
            } else if($('#pasek_skrotow a[href="index.php?url=gra/dzicz.php?poluj&miejsce=koronny_szczyt"]').length > 0){
                region = 'sinnoh';
            } else if($('#pasek_skrotow a[href="index.php?url=gra/dzicz.php?poluj&miejsce=ranczo"]').length > 0){
                region = 'unova';
            } else if($('#pasek_skrotow a[href="index.php?url=gra/dzicz.php?poluj&miejsce=francuski_labirynt"]').length > 0){
                region = 'kalos';
            }

            function refreshWielkanocWidget(){
                $.ajax({
                    type: 'POST',
                    url: "gra/statystyki.php"
                }).done(function (response) {
                    var html = '<div class="panel panel-primary"><div class="panel-heading">Wielkanoc 2019<div class="navbar-right"><span id="refreshWielkanocWidget" style="color: white; top: 4px; font-size: 16px; right: 3px;" class="glyphicon glyphicon-refresh" aria-hidden="true"></span></div></div><table class="table table-striped table-condensed"><tbody>';
                    var text = $(response).find('#statystyki .statystyki-wyglad:nth(1)').html();
                    if(text == "15 / 15"){
                        html = html +'<p style=" margin: 5px 0; text-align: center; font-size: 19px; ">Zebrano wszystkie jajka</p>';
                    } else {
                        html = html + '<p style=" margin: 5px 0; text-align: center; font-size: 19px; ">Zebrane jajka ' + text + '</p>';
                    }
                    html = html + '</tbody></table></div>';
                    wielkanocWidget = html;
                });
            }
            refreshWielkanocWidget();

            onReloadSidebar(function(){
                this.find(".panel-heading:contains('Drużyna')").parent().before(wielkanocWidget);
            })

            var api = "https://raw.githubusercontent.com/krozum/pokelife/master/wielkanoc.json";
            $.getJSON(api, {
                format: "json"
            }).done(function (data) {
                var wielkanocData = data[region];
                console.log(wielkanocData);
                var html;
                var url;

                onReloadMain(function(){
                    if(this.find("p.alert-success:contains('Poszukiwania Jajek')").length > 0){
                        refreshWielkanocWidget();
                        aktualnaDziczZJajem = $('#pasek_skrotow a:nth(0)').attr('href').split('miejsce=')[1];
                    }

                    if(this.find(".alert-warning:not(:contains('\"R\"')) b").length > 0){
                        var text = this.find(".alert-warning:not(:contains('\"R\"')) b:nth(0)").html();
                        if(typeof wielkanocData[text] != "undefined"){
                            html = '<p class="alert alert-warning text-center">Jajko jest w <strong>'+wielkanocData[text]+'</strong></p>';
                            this.find(".panel-body p:nth(0)").after(html);
                            aktualnaDziczZJajem = $('#pasek_skrotow a[data-original-title="Szybka Wyprawa: '+wielkanocData[text]+'"]').attr('href').split('miejsce=')[1];
                        } else {
                            console.log("WielkanocWidget: " + text);
                        }

                        if(this.find(".alert-warning:not(:contains('\"R\"')) b").length > 1){
                            text = this.find(".alert-warning:not(:contains('\"R\"')) b:nth(1)").html();
                            console.log(text);
                            if(typeof wielkanocData[text] != "undefined"){
                                html = '<p class="alert alert-warning text-center">Jajko jest w <strong>'+wielkanocData[text]+'</strong></p>';
                                this.find(".panel-body p:nth(0)").after(html);
                                aktualnaDziczZJajem = $('#pasek_skrotow a[data-original-title="Szybka Wyprawa: '+wielkanocData[text]+'"]').attr('href').split('miejsce=')[1];
                            } else {
                                console.log("WielkanocWidget: " + text);
                            }
                        }
                    }
                })
            })

            $(document).on("click", "#refreshWielkanocWidget", function (event) {
                refreshWielkanocWidget();
                $.get('inc/stan.php', function(data) { $("#sidebar").html(data); });
            });

            var icons = AutoGoSettings.iconLocation.getIcons();
            icons.push({
                'iconFilePath': 'https://s3.party.pl/styl-zycia/dom/kuchnia-przepisy/koszyk-z-surowymi-jajkami-na-gorze-jajko-ugotowane-na-rwardo-przekrojone-na-pol-380054-MT.jpg',
                'iconValue': function(){
                    return aktualnaDziczZJajem;
                }
            });

            $('#setLocation-box-scroll > div').html('');
            AutoGoSettings.iconLocation.refresh(icons);
            AutoGoSettings.iconLocation.setSelectedIndex(config.locationIconsIndex);

            document.getElementById('setLocation').addEventListener('changed', function (e) {
                config.locationIconsIndex = AutoGoSettings.iconLocation.getSelectedIndex();
                updateConfig(config);
            });
        }
    }
    // TODO gdy włączone to nie działa zapamietanie lokalizacji
    // initWielkanocWidget();





    // **********************
    //
    // initPoprawaWygladuPokow
    // Funkcja podmieniająca obrazki na lepsze
    //
    // **********************
    function initPoprawaWygladuPokow(){
        onReloadSidebar(function(){
            this.find('img[src="pokemony/srednie/ms3.png"]').attr('src', 'https://raw.githubusercontent.com/krozum/pokelife/master/assets/ms3.png');
            this.find('img[src="pokemony/ms3.png"]').attr('src', 'https://raw.githubusercontent.com/krozum/pokelife/master/assets/srednie_ms3.png');
        });

        onReloadMain(function(){
            this.find('img[src="pokemony/srednie/ms3.png"]').attr('src', 'https://raw.githubusercontent.com/krozum/pokelife/master/assets/ms3.png');
            this.find('img[src="pokemony/ms3.png"]').attr('src', 'https://raw.githubusercontent.com/krozum/pokelife/master/assets/srednie_ms3.png');
        });

        $('img[src="pokemony/srednie/ms3.png"]').attr('src', 'https://raw.githubusercontent.com/krozum/pokelife/master/assets/ms3.png');
        $('img[src="pokemony/ms3.png"]').attr('src', 'https://raw.githubusercontent.com/krozum/pokelife/master/assets/srednie_ms3.png');
    }
    initPoprawaWygladuPokow();



    // **********************
    //
    // initSzybkiSklep
    // Funkcja dodająca szybki sklep
    //
    // **********************
    function initSzybkiSklep(){
        $('body').append('<div class="plugin-button" id="goFastShop" style="border-radius: 4px; position: fixed; cursor: pointer; bottom: 10px; left: 80px; font-size: 19px; text-align: center; width: auto; height: 30px; line-height: 35px; z-index: 99998; text-align: left; line-height: 30px;"><a style="color: #272727 !important;text-decoration:none; padding: 5px">Szybki sklep</a></div>');
        $('body').append('<div id="fastShop"></div>');
        $('#fastShop').append('<table> <tr> <th></th> <th></th> <th></th><th></th> </tr></table>');
        $('#fastShop table').append('<col width="100"> <col width="180"><col width="60"><col width="130">');
        $('#fastShop table').append('<tr id="shop1" url=""> <td><img style="width: 70px;" src="images/pokesklep/greatballe.jpg"        ></td> <td class="cena"></td> <td class="ilosc"></td> <td><button disabled>Kup teraz</button></td> </tr>');
        $('#fastShop table').append('<tr id="shop2" url=""> <td><img style="width: 70px;" src="images/pokesklep/stunballe.jpg"         ></td> <td class="cena"></td> <td class="ilosc"></td> <td><button disabled>Kup teraz</button></td> </tr>');
        $('#fastShop table').append('<tr id="shop3" url=""> <td><img style="width: 70px;" src="images/pokesklep/nightballe.jpg"        ></td> <td class="cena"></td> <td class="ilosc"></td> <td><button disabled>Kup teraz</button></td> </tr>');
        $('#fastShop table').append('<tr id="shop4" url=""> <td><img style="width: 70px;" src="images/pokesklep/nestballe.jpg"         ></td> <td class="cena"></td> <td class="ilosc"></td> <td><button disabled>Kup teraz</button></td> </tr>');
        $('#fastShop table').append('<tr id="shop5" url=""> <td><img style="width: 70px;" src="images/pokesklep/napoj_energetyczny.jpg"></td> <td class="cena"></td> <td class="ilosc"></td> <td><button disabled>Kup teraz</button></td> </tr>');
        $('#fastShop table').append('<tr id="shop6" url=""> <td><img style="width: 70px;" src="images/pokesklep/niebieskie_jagody.jpg" ></td> <td class="cena"></td> <td class="ilosc"></td> <td><button disabled>Kup teraz</button></td> </tr>');
        $('#fastShop table').append('<tr id="shop7" url=""> <td><img style="width: 70px;" src="images/pokesklep/fioletowe_jagody.jpg"  ></td> <td class="cena"></td> <td class="ilosc"></td> <td><button disabled>Kup teraz</button></td> </tr>');
        $('#fastShop table').append('<tr id="shop8" url=""> <td><img style="width: 70px;" src="images/pokesklep/czekoladowe_serce.jpg" ></td> <td class="cena"></td> <td class="ilosc"></td> <td><button disabled>Kup teraz</button></td> </tr>');


        $(document).on("click", '#goFastShop', function () {
            if ($('#fastShop').css('display') == "none") {
                refreshShop();
                $('#fastShop').css('display', "block");
            } else {
                $('#fastShop').css('display', "none");
                $('#fastShop button').removeClass('confirm');
            }
        });

        $(document).on("click", "#fastShop button:not('.confirm')", function (event) {
            event.preventDefault();
            $(this).addClass("confirm");
        });

        $(document).on("click", "#fastShop button.confirm", function (event) {
            var url = $(this).parent().parent().attr('url');
            var ilosc_yenow_przed = Number($('a[href="http://pokelife.pl/pokedex/index.php?title=Pieniądze"]').parent().html().split("</a>")[1].split("<a")[0].replace(/\./g, ''));

            $.ajax({
                type : 'POST',
                url : url,
                success:function (data) {
                    $.get('inc/stan.php', function(data) {
                        $("#sidebar").html(data);
                        var ilosc_yenow_teraz = $(data).find('a[href="http://pokelife.pl/pokedex/index.php?title=Pieniądze"]').parent().html().split("</a>")[1].split("<a")[0].replace(/\./g, '');
                        if(url.indexOf('niebieskie_jagody') != -1){
                            updateStats("wydatki_na_pa",  ilosc_yenow_przed - ilosc_yenow_teraz);
                        }
                        if(url.indexOf('napoj_energetyczny') != -1){
                            updateStats("wydatki_na_pa",  ilosc_yenow_przed - ilosc_yenow_teraz);
                        }
                        refreshShop();
                    });
                }
            });
        });

        function refreshShop() {
            $('#fastShop button').removeClass('confirm');

            var ilosc_yenow = Number($('a[href="http://pokelife.pl/pokedex/index.php?title=Pieniądze"]').parent().html().split("</a>")[1].split("<a")[0].replace(/\./g, ''));
            var ilosc_pz = Number($('a[href="http://pokelife.pl/pokedex/index.php?title=Punkty_Zasług"]').parent().html().split("</a>")[1].split("<a")[0].replace(/\./g, ''));


            // greatballe
            $('#shop1').attr('url', "gra/pokesklep.php?zakupy&z=1&postData%5B0%5D%5Bname%5D=kup_greatballe&postData%5B0%5D%5Bvalue%5D=1000");
            $('#shop1 .cena').html("1 000 000 ¥");
            $('#shop1 .ilosc').html("1000");

            if (Number(ilosc_yenow) < Number("1000000")) {
                $('#shop1 button').attr("disabled", true);
            } else {
                $('#shop1 button').attr("disabled", false);
            }

            // stunballe
            $.ajax({
                type: 'POST',
                url: "gra/targ_prz.php?oferty_strona&&przedmiot=stunballe&zakladka=1&strona=1",
            }).done(function (response) {
                var id = $($(response).find("form")[0]).find("input[name='id_oferty']").val();
                var max = $($(response).find("form span")[1]).html();
                if (max > 10) {
                    max = 10;
                }
                var price = Number($($(response).find("form span")[2]).html().split("&nbsp;")[0].replace(/\./g, '')) * max;
                var price_with_dot = price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
                var url = 'gra/targ_prz.php?szukaj&przedmiot=stunballe&postData%5B0%5D%5Bname%5D=przedmiot&postData%5B0%5D%5Bvalue%5D=stunballe&postData%5B1%5D%5Bname%5D=id_oferty&postData%5B1%5D%5Bvalue%5D='+id+'&postData%5B2%5D%5Bname%5D=ilosc_yeny&postData%5B2%5D%5Bvalue%5D='+max+'&postData%5B3%5D%5Bname%5D=napewno&postData%5B3%5D%5Bvalue%5D=&postData%5B4%5D%5Bname%5D=kup&postData%5B4%5D%5Bvalue%5D=';

                $('#shop2').attr('url', url);
                $('#shop2 .cena').html(price_with_dot + " ¥");
                $('#shop2 .ilosc').html(max);

                if (Number(ilosc_yenow) < Number(price)) {
                    $('#shop2 button').attr("disabled", true);
                } else {
                    $('#shop2 button').attr("disabled", false);
                }
            });

            // nightballe
            $('#shop3').attr('url', "gra/pokesklep.php?zakupy&z=1&postData%5B0%5D%5Bname%5D=kup_nightballe&postData%5B0%5D%5Bvalue%5D=1000");
            $('#shop3 .cena').html("1 250 000 ¥");
            $('#shop3 .ilosc').html(1000);

            if (Number(ilosc_yenow) < Number("1250000")) {
                $('#shop3 button').attr("disabled", true);
            } else {
                $('#shop3 button').attr("disabled", false);
            }

            // nestballe
            $('#shop4').attr('url', "gra/pokesklep.php?zakupy&z=1&postData%5B0%5D%5Bname%5D=kup_nestballe&postData%5B0%5D%5Bvalue%5D=1000");
            $('#shop4 .cena').html("400 000 ¥");
            $('#shop4 .ilosc').html(1000);

            if (Number(ilosc_yenow) < Number("400000")) {
                $('#shop4 button').attr("disabled", true);
            } else {
                $('#shop4 button').attr("disabled", false);
            }

            // niebieskie napoje
            $.ajax({
                type: 'POST',
                url: "gra/targ_prz.php?oferty_strona&&przedmiot=napoj_energetyczny&zakladka=3&strona=1",
            }).done(function (response) {
                var id = $($(response).find("form")[0]).find("input[name='id_oferty']").val();
                var max = 1;
                var price = Number($($(response).find("form span")[2]).html().split("&nbsp;")[0].replace(/\./g, '')) * max;
                var price_with_dot = price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
                var url = 'gra/targ_prz.php?szukaj&przedmiot=napoj_energetyczny&postData%5B0%5D%5Bname%5D=przedmiot&postData%5B0%5D%5Bvalue%5D=napoj_energetyczny&postData%5B1%5D%5Bname%5D=id_oferty&postData%5B1%5D%5Bvalue%5D='+id+'&postData%5B2%5D%5Bname%5D=ilosc_yeny&postData%5B2%5D%5Bvalue%5D=1&postData%5B3%5D%5Bname%5D=napewno&postData%5B3%5D%5Bvalue%5D=&postData%5B4%5D%5Bname%5D=kup&postData%5B4%5D%5Bvalue%5D=';

                $('#shop5').attr('url', url);
                $('#shop5 .cena').html(price_with_dot + " ¥");
                $('#shop5 .ilosc').html(max);

                if (Number(ilosc_yenow) < Number(price)) {
                    $('#shop5 button').attr("disabled", true);
                } else {
                    $('#shop5 button').attr("disabled", false);
                }
            });

            // niebieskie jagody
            $.ajax({
                type: 'POST',
                url: "gra/targ_prz.php?oferty_strona&&przedmiot=niebieskie_jagody&strona=1",
            }).done(function (response) {
                var id = $($(response).find("form")[0]).find("input[name='id_oferty']").val();
                var max = $($(response).find("form span")[1]).html();
                if (max > 100) {
                    max = 100;
                }
                var price = Number($($(response).find("form span")[2]).html().split("&nbsp;")[0].replace(/\./g, '')) * max;
                var price_with_dot = price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
                var url = 'gra/targ_prz.php?szukaj&przedmiot=niebieskie_jagody&postData%5B0%5D%5Bname%5D=przedmiot&postData%5B0%5D%5Bvalue%5D=niebieskie_jagody&postData%5B1%5D%5Bname%5D=id_oferty&postData%5B1%5D%5Bvalue%5D='+id+'&postData%5B2%5D%5Bname%5D=ilosc_yeny&postData%5B2%5D%5Bvalue%5D='+max+'&postData%5B3%5D%5Bname%5D=napewno&postData%5B3%5D%5Bvalue%5D=&postData%5B4%5D%5Bname%5D=kup&postData%5B4%5D%5Bvalue%5D=';

                $('#shop6').attr('url', url);
                $('#shop6 .cena').html(price_with_dot + " ¥");
                $('#shop6 .ilosc').html(max);
                $('#shop6 button').attr("disabled", false);

                if (Number(ilosc_yenow) < Number(price)) {
                    var priceOne = (price / max);
                    max = Math.floor(Number(ilosc_yenow / (price / max)));
                    console.log(Math.floor(max));
                    price = Number(max * priceOne).toFixed(0);
                    price_with_dot = price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
                    if(priceOne > ilosc_yenow){
                        $('#shop6 button').attr("disabled", true);
                        $('#shop6 .cena').html(priceOne.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + " ¥");
                        $('#shop6 .ilosc').html(1);
                    } else {
                        $('#shop6 .cena').html(price_with_dot + " ¥");
                        $('#shop6 .ilosc').html(max);
                    }
                }
            });

            // fioletowe jagody
            $.ajax({
                type: 'POST',
                url: "gra/targ_prz.php?oferty_strona&&przedmiot=fioletowe_jagody&strona=1",
            }).done(function (response) {
                var id = $($(response).find("form")[0]).find("input[name='id_oferty']").val();
                var max = $($(response).find("form span")[1]).html();
                if (max > 100) {
                    max = 100;
                }
                var price = Number($($(response).find("form span")[2]).html().split("&nbsp;")[0].replace(/\./g, '')) * max;
                var price_with_dot = price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
                var url = 'gra/targ_prz.php?szukaj&przedmiot=niebieskie_jagody&postData%5B0%5D%5Bname%5D=przedmiot&postData%5B0%5D%5Bvalue%5D=niebieskie_jagody&postData%5B1%5D%5Bname%5D=id_oferty&postData%5B1%5D%5Bvalue%5D='+id+'&postData%5B2%5D%5Bname%5D=ilosc_yeny&postData%5B2%5D%5Bvalue%5D='+max+'&postData%5B3%5D%5Bname%5D=napewno&postData%5B3%5D%5Bvalue%5D=&postData%5B4%5D%5Bname%5D=kup&postData%5B4%5D%5Bvalue%5D=';

                $('#shop7').attr('url', url);
                $('#shop7 .cena').html(price_with_dot + " ¥");
                $('#shop7 .ilosc').html(max);

                if (Number(ilosc_yenow) < Number(price)) {
                    $('#shop7 button').attr("disabled", true);
                } else {
                    $('#shop7 button').attr("disabled", false);
                }
            });

            // czekoladowe serce
            $.ajax({
                type: 'POST',
                url: "gra/targ_prz.php?oferty_strona&&przedmiot=czekoladowe_serce&strona=1",
            }).done(function (response) {
                var id = $($(response).find("form")[0]).find("input[name='id_oferty']").val();
                var max = $($(response).find("form span")[1]).html();
                if (max > 100) {
                    max = 100;
                }
                var price = Number($($(response).find("form span")[2]).html().split("&nbsp;")[0].replace(/\./g, '')) * max;
                var price_with_dot = price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
                var url = 'gra/targ_prz.php?szukaj&przedmiot=czekoladowe_serce&postData%5B0%5D%5Bname%5D=przedmiot&postData%5B0%5D%5Bvalue%5D=czekoladowe_serce&postData%5B1%5D%5Bname%5D=id_oferty&postData%5B1%5D%5Bvalue%5D='+id+'&postData%5B2%5D%5Bname%5D=ilosc_yeny&postData%5B2%5D%5Bvalue%5D='+max+'&postData%5B3%5D%5Bname%5D=napewno&postData%5B3%5D%5Bvalue%5D=&postData%5B4%5D%5Bname%5D=kup&postData%5B4%5D%5Bvalue%5D=';

                $('#shop8').attr('url', url);
                $('#shop8 .cena').html(price_with_dot + " ¥");
                $('#shop8 .ilosc').html(max);

                if (Number(ilosc_yenow) < Number(price)) {
                    $('#shop8 button').attr("disabled", true);
                } else {
                    $('#shop8 button').attr("disabled", false);
                }
            });
        }
    };
    initSzybkiSklep();



    // **********************
    //
    // initWyszukiwarkaOsiagniec
    // Funkcja dodająca wyszukiwarke osiągnięć
    //
    // **********************
    function initWyszukiwarkaOsiagniec(){
        onReloadMain(function(){
            if (this.find('.panel-heading').html() === "Osiągnięcia") {
                this.find('#osiagniecia-glowne').parent().prepend('<input id="wyszukajOsiagniecie" style="margin-bottom: 20px;display: inline; width: 100%;" type="text" class="form-control" placeholder="Wyszukaj osiągnięcie...">');
            }
        });

        $(document).on("keyup", "#wyszukajOsiagniecie", function (event) {
            if($(this).val() == ""){
                var tab_id = $('#glowne_okno li[role="presentation"].active a').attr('aria-controls');
                $('#'+tab_id).parent().find("div.tab-pane[role='tabpanel']").removeClass('active').removeClass('in').addClass('fade');
                $('#'+tab_id).addClass('in').addClass('active');
                $('#osiagniecia-glowne').parent().find("div.osiagniecie").parent().css("display", "block");
            } else {
                $('#osiagniecia-glowne').parent().find("div.tab-pane[role='tabpanel']").removeClass('fade').addClass('in').addClass('active');
                $('#osiagniecia-glowne').parent().find("div.osiagniecie").parent().css("display", "none");
                $('#osiagniecia-glowne').parent().find("div.osiagniecie:contains('"+$(this).val()+"')").parent().css("display", "block");
            }
        });

        $(document).on("click", 'li[role="presentation"]', function (event) {
            if($(this).parent().parent().parent().find('.panel-heading:contains("Osiągnięcia")').length > 0){
                $('#wyszukajOsiagniecie').val("");
                var tab_id = $('#glowne_okno li[role="presentation"].active a').attr('aria-controls');
                $('#'+tab_id).parent().find("div.tab-pane[role='tabpanel']").removeClass('active').removeClass('in').addClass('fade');
                $('#'+tab_id).addClass('in').addClass('active');
                $('#osiagniecia-glowne').parent().find("div.osiagniecie").parent().css("display", "block");
            }
        });

    }
    initWyszukiwarkaOsiagniec();



    // **********************
    //
    // initKomunikat
    // Funkcja dodająca wyświetlanie komunikatu
    //
    // **********************
    function initKomunikat(){
        var array = [];
        if(window.localStorage.komunikat == undefined){
            window.localStorage.komunikat = JSON.stringify(array);
        } else {
            array = JSON.parse(window.localStorage.komunikat);
        }

        var isHidden = false;
        var komunikatAPI = "https://bra1ns.pl/pokelife/api/get_alert.php" + "?time="+Date.now();
        $.getJSON(komunikatAPI, {
            format: "json"
        }).done(function (data) {
            if(data != ""){
                $.each(data, function (index, item) {
                    if(array[item['message_id']] == undefined){
                        array[item['message_id']] = item;
                    }
                })
                window.localStorage.komunikat = JSON.stringify(array);
            }
        });

        onReloadSidebar(function(){
            var DATA = this;
            $.each(array, function (index, item) {
                if(item != null && item['is_active'] == 1){
                    DATA.find("#wyloguj").parent().parent().parent().before('<div class="komunikat" style="background: #272727;width: 100%;padding: 12px;border-radius: 5px;font-size: 16px;margin: 0;margin-bottom: 20px;color: #e6e6e6;position: relative;"><div class="hideKomunikat" data-id="'+item['message_id']+'" style="position: absolute;right: 10px;top: 4px;cursor: pointer;color: #777777;">x</div><p style=" margin: 0; margin-right: 20px; overflow-wrap: break-word; ">'+item['message']+'</p></div>');
                }
            })
        })

        $(document).on("click", '.hideKomunikat', function (event) {
            $(this).parent().remove();
            isHidden = true;
            var id = $(this).data('id');
            array[id]['is_active'] = "0";
            window.localStorage.komunikat = JSON.stringify(array);
        });

    };
    initKomunikat();



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
                    } else {
                        arrayInne.push($(item));
                    }
                    item.remove();
                })

                var html = "<div class='row'><div class='col-xs-12'><h3 style='text-align: center;'>Używane</h3>";
                $.each(arrayUzywane, function (index, item) {
                    html = html + '<div class="col-xs-4 col-sm-3 col-md-3 col-lg-3" style="margin: 0; padding: 0;">' + item.html() + '</div>';
                })
                html = html + "</div></div>"
                this.find('#plecak-trzymane > .row').append(html);

                html = "<div class='row'><div class='col-xs-12'><h3 style='text-align: center;'>Szczęśliwe jajko</h3>";
                $.each(arrayJajka, function (index, item) {
                    html = html + '<div class="col-xs-4 col-sm-3 col-md-3 col-lg-3" style="margin: 0; padding: 0;">' + item.html() + '</div>';
                })
                html = html + "</div></div>"
                this.find('#plecak-trzymane > .row').append(html);

                html = "<div class='row'><div class='col-xs-12'><h3 style='text-align: center;'>Mega kamienie</h3>";
                $.each(arrayMega, function (index, item) {
                    html = html + '<div class="col-xs-4 col-sm-3 col-md-3 col-lg-3" style="margin: 0; padding: 0;">' + item.html() + '</div>';
                })
                html = html + "</div></div>"
                this.find('#plecak-trzymane >.row').append(html);

                html = "<div class='row'><div class='col-xs-12'><h3 style='text-align: center;'>Inne</h3>";
                $.each(arrayInne, function (index, item) {
                    html = html + '<div class="col-xs-4 col-sm-3 col-md-3 col-lg-3" style="margin: 0; padding: 0;">' + item.html() + '</div>';
                })
                html = html + "</div></div>"
                this.find('#plecak-trzymane > .row').append(html);

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

        $('#pasek_skrotow > .navbar-nav').append('<li><a id="skrot_szkoleniowiec" href="#" data-toggle="tooltip" data-placement="top" title="" data-original-title="Wbijaj osiągnięcie szkoleniowca"><div class="pseudo-btn"><img src="https://raw.githubusercontent.com/krozum/pokelife/master/assets/3b79fd270c90c0dfd90763fcf1b54346-trofeo-de-campe--n-estrella-by-vexels.png"></div></a></li>');

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
                reloadMain("#glowne_okno", "gra/"+array.pop(), function(){
                    price = Number(price) + Number($('.alert-success b:nth(1)').html().split(" ¥")[0].replace(/\./g, ''));
                    trenuj(array, callback);
                })
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
    // initWystawView()
    // Funkcja automatycznie przechodząca po przechowalni i zwiększaniu treningów do miniumum 7 w każdą statystyke
    //
    // **********************
    function initWystawView(){
        onReloadMain(function(){
            var DATA = this;
            if(this.find('.panel-heading').html() === "Targ - Wystaw Przedmioty"){
                $(DATA).find("input[value='Wystaw']").after('<input type="button" style="width: 25%;margin-left: 3%;" class="check-price form-control btn btn-primary" value="?">');
                $(DATA).find("input[value='Wystaw']").css("width", "70%");
            }
        })

        $(document).off("click", "#targ_wysprz-zwykle .check-price");
        $(document).on("click", "#targ_wysprz-zwykle .check-price", function(){
            $('#marketTable').remove();
            $('body').append("<div id='marketTable' style='z-index: 999; width: 200px; height: auto; position: fixed; right: 0; background: white; bottom: 60px;opacity: 0.8; border: 2px dashed;'></div>")

            var przedmiot = $(this).parent().parent().find("input[name='nazwa']").val();
            var THAT = $(this).parent().parent();
            THAT.find('input[name="ilosc"]').val(THAT.parent().find("div").html().split('</b> - ')[1].split(' sztuk')[0]);

            $.ajax({
                type: 'POST',
                url: "gra/targ_prz.php?oferty_strona&&przedmiot="+przedmiot+"&ob_yeny&strona=1",
            }).done(function (response) {
                if(response.indexOf("Brak ofert.") < 0){
                    var max = 1;
                    if($($(response).find("form span")[2]).html() != "-----"){
                        var price = Number($($(response).find("form span")[2]).html().split("&nbsp;")[0].replace(/\./g, '')) * max;
                        THAT.find('input[name="cena_yeny"]').val(price-1);
                    } else {
                        THAT.find('input[name="cena_yeny"]').val("brak");
                    }
                } else {
                    THAT.find('input[name="cena_yeny"]').val("brak");
                }

                $('#marketTable').append("<h4 style='padding: 10px; margin: 0;'>Najtańsze za yeny:</h4>");
                $(response).find("form[action='targ_prz.php?szukaj&przedmiot="+przedmiot+"']").each(function (index, val) {
                    if(index>4) return false;
                    var img =$($(this).find("span")[0]);
                    var price = $($(this).find("span")[2]);
                    var pricePZ= $($(this).find("span")[3]);
                    if(price.html() !== "-----"){
                        var html = '<div style="display: table;width: 100%;height: 30px;padding: 5px;"><div style="display: table-cell;width: 70px;">'+img.html()+'</div><div style="display: table-cell;text-align: left;width: 100px;">'+price.html()+'</div><div style="display: table-cell;text-align: left;width: 70px;">'+pricePZ.html()+'</div></div>';
                        $('#marketTable').append(html);
                    }
                });
            });

            $.ajax({
                type: 'POST',
                url: "gra/targ_prz.php?oferty_strona&&przedmiot="+przedmiot+"&ob_zaslugi&strona=1",
            }).done(function (response) {
                if(response.indexOf("Brak ofert.") < 0){
                    var max = 1;
                    if($($(response).find("form span")[3]).html() != "-----"){
                        var pricePZ = Number($($(response).find("form span")[3]).html().split("&nbsp;")[0].replace(/\./g, '')) * max;
                        THAT.find('input[name="cena_zaslugi"]').val(pricePZ);
                    } else {
                        THAT.find('input[name="cena_zaslugi"]').val("brak");
                    }
                } else {
                    THAT.find('input[name="cena_zaslugi"]').val("brak");
                }

                $('#marketTable').append("<h4 style='padding: 10px; margin: 0;'>Najtańsze za pz:</h4>");
                $(response).find("form[action='targ_prz.php?szukaj&przedmiot="+przedmiot+"']").each(function (index, val) {
                    if(index>4) return false;
                    var img =$($(this).find("span")[0]);
                    var price = $($(this).find("span")[2]);
                    var pricePZ= $($(this).find("span")[3]);
                    if(pricePZ.html() !== "-----"){
                        var html = '<div style="display: table;width: 100%;height: 30px;padding: 5px;"><div style="display: table-cell;width: 70px;">'+img.html()+'</div><div style="display: table-cell;text-align: left;width: 100px;">'+price.html()+'</div><div style="display: table-cell;text-align: left;width: 70px;">'+pricePZ.html()+'</div></div>';
                        $('#marketTable').append(html);
                    }
                });
            });
        });

        $(document).off("click", "#targ_wysprz-tm .check-price");
        $(document).on("click", "#targ_wysprz-tm .check-price", function(){
            $('#marketTable').remove();
            $('body').append("<div id='marketTable' style='z-index: 999; width: 200px; height: auto; position: fixed; right: 0; background: white; bottom: 60px;opacity: 0.8; border: 2px dashed;'></div>")

            var tm = $(this).parent().parent().find("input[name='tm']").val();
            var THAT = $(this).parent().parent();
            THAT.find('input[name="ilosc"]').val(1);

            $.ajax({
                type: 'POST',
                url: "gra/targ_tm.php?oferty_strona&&pokaz_numer="+tm+"&strona=1&ob_yenny"
            }).done(function (response) {
                if(response.indexOf("Brak ofert.") < 0){
                    var max = 1;
                    if($($(response).find("button")[0]).html() != "-----"){
                        var price = Number($($(response).find("button")[0]).html().split(" ")[0].replace(/\./g, '')) * max;
                        THAT.find('input[name="cena_yeny"]').val(price);
                    } else {
                        THAT.find('input[name="cena_yeny"]').val("brak");
                    }
                } else {
                    THAT.find('input[name="cena_yeny"]').val("brak");
                }

                $('#marketTable').append("<h4 style='padding: 10px; margin: 0;'>Najtańsze za yeny:</h4>");
                $(response).find("tr").each(function (index, val) {
                    if(index>4) return false;
                    var tm =$($(this).find("td")[0]);
                    if(tm.html() !== undefined){
                        var price = $($(this).find("button")[0]);
                        var pricePZ= $($(this).find("button")[1]);
                        if(price.html() !== "-----"){
                            var html = '<div style="display: table;width: 100%;height: 30px;padding: 5px;"><div style="display: table-cell;width: 70px;font-weight: bold; padding-left: 6px;">'+tm.html()+'</div><div style="display: table-cell;text-align: left;width: 100px;">'+price.html()+'</div><div style="display: table-cell;text-align: left;width: 70px;">'+pricePZ.html()+'</div></div>';
                            $('#marketTable').append(html);
                        }
                    }
                });
            });


            $.ajax({
                type: 'POST',
                url: "gra/targ_tm.php?oferty_strona&&pokaz_numer="+tm+"&strona=1&ob_zaslugi"
            }).done(function (response) {
                if(response.indexOf("Brak ofert.") < 0){
                    var max = 1;
                    if($($(response).find("button")[1]).html() != "-----"){
                        var price = Number($($(response).find("button")[1]).html().split(" ")[0].replace(/\./g, '')) * max;
                        THAT.find('input[name="cena_zaslugi"]').val(price);
                    } else {
                        THAT.find('input[name="cena_zaslugi"]').val("brak");
                    }
                } else {
                    THAT.find('input[name="cena_zaslugi"]').val("brak");
                }

                $('#marketTable').append("<h4 style='padding: 10px; margin: 0;'>Najtańsze za pz:</h4>");
                $(response).find("tr").each(function (index, val) {
                    if(index>4) return false;
                    var tm =$($(this).find("td")[0]);
                    if(tm.html() !== undefined){
                        var price = $($(this).find("button")[0]);
                        var pricePZ= $($(this).find("button")[1]);
                        if(pricePZ.html() !== "-----"){
                            var html = '<div style="display: table;width: 100%;height: 30px;padding: 5px;"><div style="display: table-cell;width: 70px;font-weight: bold; padding-left: 6px;">'+tm.html()+'</div><div style="display: table-cell;text-align: left;width: 100px;">'+price.html()+'</div><div style="display: table-cell;text-align: left;width: 70px;">'+pricePZ.html()+'</div></div>';
                            $('#marketTable').append(html);
                        }
                    }
                });
            });
        });

        $(document).off("click", "#targ_wysprz-trzymane .check-price");
        $(document).on("click", "#targ_wysprz-trzymane .check-price", function(){
            $('#marketTable').remove();
            $('body').append("<div id='marketTable' style='z-index: 999; width: 200px; height: auto; position: fixed; right: 0; background: white; bottom: 60px;opacity: 0.8; border: 2px dashed;'></div>")

            var nazwa = $(this).parent().parent().find("input[name='nazwa']").val();
            var jakosc = $(this).parent().parent().find("input[name='jakosc']").val();
            var THAT = $(this).parent().parent();
            THAT.find('input[name="ilosc"]').val(1);

            $.ajax({
                type: 'POST',
                url: "gra/targ_prz.php?oferty_strona&&przedmiot=trzymane&zakladka=5&typogolny=all&typszczegolny="+nazwa+"&poziom="+jakosc+"&strona=1&ob_yenny"
            }).done(function (response) {
                if(response.indexOf("Brak ofert.") < 0){
                    var max = 1;
                    if($($(response).find("form span")[5]).html() != "-----"){
                        var price = Number($($(response).find("form span")[5]).html().split("&nbsp;")[0].replace(/\./g, '')) * max;
                        THAT.find('input[name="cena_yeny"]').val(price);
                    } else {
                        THAT.find('input[name="cena_yeny"]').val("brak");
                    }
                } else {
                    THAT.find('input[name="cena_yeny"]').val("brak");
                }

                $('#marketTable').append("<h4 style='padding: 10px; margin: 0;'>Najtańsze za yeny:</h4>");
                $(response).find("form").each(function (index, val) {
                    if(index>4) return false;
                    var img =$($(this).find("span")[0]);
                    var price = $($(this).find("span")[5]);
                    var pricePZ= $($(this).find("span")[6]);
                    if(price.html() !== "-----"){
                        var html = '<div style="display: table;width: 100%;height: 30px;padding: 5px;"><div style="display: table-cell;width: 70px;">'+img.html()+'</div><div style="display: table-cell;text-align: left;width: 100px;">'+price.html()+'</div><div style="display: table-cell;text-align: left;width: 70px;">'+pricePZ.html()+'</div></div>';
                        $('#marketTable').append(html);
                    }
                });
            });


            $.ajax({
                type: 'POST',
                url: "gra/targ_prz.php?oferty_strona&&przedmiot=trzymane&zakladka=5&typogolny=all&typszczegolny="+nazwa+"&poziom="+jakosc+"&strona=1&ob_zaslugi"
            }).done(function (response) {
                if(response.indexOf("Brak ofert.") < 0){
                    var max = 1;
                    if($($(response).find("form span")[6]).html() != "-----"){
                        var price = Number($($(response).find("form span")[6]).html().split("&nbsp;")[0].replace(/\./g, '')) * max;
                        THAT.find('input[name="cena_zaslugi"]').val(price);
                    } else {
                        THAT.find('input[name="cena_zaslugi"]').val("brak");
                    }
                } else {
                    THAT.find('input[name="cena_zaslugi"]').val("brak");
                }

                $('#marketTable').append("<h4 style='padding: 10px; margin: 0;'>Najtańsze za pz:</h4>");
                $(response).find("form").each(function (index, val) {
                    if(index>4) return false;
                    var img =$($(this).find("span")[0]);
                    var price = $($(this).find("span")[5]);
                    var pricePZ= $($(this).find("span")[6]);
                    if(pricePZ.html() !== "-----"){
                        var html = '<div style="display: table;width: 100%;height: 30px;padding: 5px;"><div style="display: table-cell;width: 70px;">'+img.html()+'</div><div style="display: table-cell;text-align: left;width: 100px;">'+price.html()+'</div><div style="display: table-cell;text-align: left;width: 70px;">'+pricePZ.html()+'</div></div>';
                        $('#marketTable').append(html);
                    }
                });
            });
        });

        $('body').off('click', ':not(#marketTable, #marketTable *)');
        $('body').on('click', ':not(#marketTable, #marketTable *)', function () {
            $('#marketTable').empty().remove()
        });

    }
    initWystawView();



    // **********************
    //
    // initWbijanieJeszczeDokladke()
    // Funkcja automatycznie wbijające osiągnięcie Jeszcze Dokladke
    //
    // **********************
    function initWbijanieJeszczeDokladke(){
        var pokemonZDruzynyId;
        var array = [];
        var max;

        $('#pasek_skrotow > .navbar-nav').append('<li><a id="skrot_jeszcze_dokladke" href="#" data-toggle="tooltip" data-placement="top" title="" data-original-title="Wbijaj osiągnięcie Jeszcze dokładke?"><div class="pseudo-btn"><img src="https://raw.githubusercontent.com/krozum/pokelife/master/assets/3b79fd270c90c0dfd90763fcf1b54346-trofeo-de-campe--n-estrella-by-vexels.png"></div></a></li>');


        onReloadMain(function(){
            array = [];
            if(this.find('.panel-heading').html() === "Pokemony"){
                this.find('#pokemony-przechowalnia select[name="kolejnosc"]').parent().prepend('<button class="plugin-button" id="wbijajJeszczeDokladke" style="padding: 5px 10px; border-radius: 3px; margin-bottom: 15px">Wbijaj jeszcze dokładke?</button><br>');
                $.each(this.find('#pokemony-przechowalnia .btn-podgladpoka'), function (index, item) {
                    if(Number($(item).parent().data('poziom')) >= 5){
                        array.push($(item).data('id-pokemona'));
                    }
                })
            }
        })

        $('body').off('click', '#wbijajJeszczeDokladke');
        $('body').on('click', '#wbijajJeszczeDokladke', function () {
            $('#skrot_jeszcze_dokladke').trigger('click');
        });

        $('body').off('click', '#skrot_jeszcze_dokladke');
        $('body').on('click', '#skrot_jeszcze_dokladke', function () {
            pokemonZDruzynyId = $($('#sidebar .stan-pokemon')[$('#sidebar .stan-pokemon').length -1]).data('pokemon-id');
            reloadMain("#glowne_okno", "gra/druzyna.php?przechowuj="+pokemonZDruzynyId, function(){
                reloadMain("#glowne_okno", 'gra/druzyna.php?p=3', function(){
                    max = array.length;
                    wbijaj(array);
                }, function(){
                    if(this.find('.panel-heading').html() === "Pokemony"){
                        this.find('#pokemony-przechowalnia select[name="kolejnosc"]').parent().prepend('<button class="plugin-button" id="wbijajSzkoleniowca" style="padding: 5px 10px; border-radius: 3px; margin-bottom: 15px">Podbijaj szkoleniowca</button><br>');
                        $.each(this.find('#pokemony-przechowalnia .btn-podgladpoka'), function (index, item) {
                            if(Number($(item).parent().data('poziom')) >= 5){
                                array.push($(item).data('id-pokemona'));
                            }
                        })
                    }
                });
            }, function(){

            });
        })

        function wbijaj(array){
            if(array.length > 0){
                if($('#jeszcze_dokladke_progress').length < 1){
                    $('body').append('<div id="jeszcze_dokladke_progress" class="" style="position: fixed;bottom: 60px;width: 500px;height: auto;z-index: 999;margin: 0 auto;left: 0;right: 0;background-color: inherit;border: none;"><div class="progress" style="margin:0;box-shadow: none;border-radius: 0; border: 1px solid black"><div class="progress-bar progress-bar-danger" role="progressbar" style="border-radius: 0; width: '+Number((((max-array.length)*100)/max)).toFixed(0)+'%;"> <span>'+Number((((max-array.length)*100)/max)).toFixed(0)+'%</span></div></div></div>');
                } else {
                    $('#jeszcze_dokladke_progress .progress-bar').css('width', Number((((max-array.length)*100)/max)).toFixed(0)+'%');
                    $('#jeszcze_dokladke_progress .progress-bar span').html(Number((((max-array.length)*100)/max)).toFixed(0)+'%');
                }

                var id_pokemona = array.pop();
                reloadMain("#glowne_okno", "gra/druzyna.php?p=3&postData%5B0%5D%5Bname%5D=kolejnosc&postData%5B0%5D%5Bvalue%5D=2&postData%5B1%5D%5Bname%5D=akcja&postData%5B1%5D%5Bvalue%5D=druzyna&postData%5B2%5D%5Bname%5D=p_"+id_pokemona+"&postData%5B2%5D%5Bvalue%5D="+id_pokemona, function(){
                    reloadMain("#glowne_okno", "gra/plecak.php?uzyj&p=1&postData%5B0%5D%5Bname%5D=rodzaj_przedmiotu&postData%5B0%5D%5Bvalue%5D=przysmaki&postData%5B1%5D%5Bname%5D=druzyna_numer&postData%5B1%5D%5Bvalue%5D="+($('#sidebar .stan-pokemon').length/2-1)+"&postData%5B2%5D%5Bname%5D=ilosc&postData%5B2%5D%5Bvalue%5D=100", function(){
                        reloadMain("#glowne_okno", "gra/druzyna.php?przechowuj="+id_pokemona, function(){
                            reloadMain("#glowne_okno", "gra/druzyna.php?p=2&postData%5B0%5D%5Bname%5D=kolejnosc&postData%5B0%5D%5Bvalue%5D=2&postData%5B1%5D%5Bname%5D=akcja&postData%5B1%5D%5Bvalue%5D=przechowalnia&postData%5B2%5D%5Bname%5D=p_"+id_pokemona+"&postData%5B2%5D%5Bvalue%5D="+id_pokemona, function(){
                                wbijaj(array);
                            })
                        })
                    }, function(){
                        if(this.find('.alert-danger').length > 0 && this.find('.alert-danger').html() != 'Twój pokemon nie jest w stanie dzisiaj zjeść już więcej przysmaków.'){
                            console.log(this.find('.alert-danger').html());
                            array = [];
                        }
                    })
                })
            } else {
                $('#jeszcze_dokladke_progress').remove();
                reloadMain("#glowne_okno", "gra/druzyna.php?p=3&postData%5B0%5D%5Bname%5D=kolejnosc&postData%5B0%5D%5Bvalue%5D=2&postData%5B1%5D%5Bname%5D=akcja&postData%5B1%5D%5Bvalue%5D=druzyna&postData%5B2%5D%5Bname%5D=p_"+pokemonZDruzynyId+"&postData%5B2%5D%5Bvalue%5D="+pokemonZDruzynyId, function(){

                })
            }
        }



    }
    initWbijanieJeszczeDokladke();



    // **********************
    //
    // initEventWyspaUnikatow()
    // Funkcja automatycznie dodajaca sprawdzanie pokow z wyspy unikatow
    //
    // **********************
    function initEventWyspaUnikatow(){
        var widget = "";
        var pokemonyDoZlapania = [];
        var d = new Date();
        if((d.getDate() <= 5 && d.getMonth() == 5) || (d.getDate() >= 30 && d.getMonth() == 4)){
            function refreshWidget(){
                pokemonyDoZlapania = [];
                $.ajax({
                    type: 'POST',
                    url: "gra/zadania.php"
                }).done(function (response) {
                    var html = '<div class="panel panel-primary"><div class="panel-heading">Wyspa unikatów<div class="navbar-right"><span id="refreshWyspaUnikatowWidget" style="color: white; top: 4px; font-size: 16px; right: 3px;" class="glyphicon glyphicon-refresh" aria-hidden="true"></span></div></div><table class="table table-striped table-condensed"><tbody>';
                    var countZlapane = $(response).find('#zadania_jednorazowe .panel-primary:nth(5) .panel-body > div').length;
                    var countZostalo = $(response).find('#zadania_jednorazowe .panel-primary:nth(6) .panel-body > div').length;

                    $.each($(response).find('#zadania_jednorazowe .panel-primary:nth(6) .panel-body .img-responsive'), function (index, item) {
                        pokemonyDoZlapania.push($(item).attr('src').replace('srednie/',''));
                    });

                    if(countZostalo < 1){
                        html = html +'<p style=" margin: 5px 0; text-align: center; font-size: 19px; ">Złapano wszystkie</p>';
                    } else {
                        var text = ""+ countZlapane + " / " + (countZostalo+countZlapane);
                        html = html + '<p style=" margin: 5px 0; text-align: center; font-size: 19px; ">Złapano ' + text + '</p>';
                    }
                    html = html + '</tbody></table></div>';
                    widget = html;
                });
            }
            refreshWidget();

            onReloadSidebar(function(){
                this.find(".panel-heading:contains('Drużyna')").parent().before(widget);
            })

            $(document).on("click", "#refreshWyspaUnikatowWidget", function (event) {
                refreshWidget();
                $.get('inc/stan.php', function(data) { $("#sidebar").html(data); });
            });

            onReloadMain(function(){
                if (this.find('.dzikipokemon-background-normalny').length > 0) {
                    var pokemonImg = this.find('.dzikipokemon-background-normalny .img-responsive').attr('src');
                    var html = "";
                    console.log(pokemonyDoZlapania);
                    console.log(pokemonImg);
                    console.log(pokemonyDoZlapania.indexOf(pokemonImg));
                    if(pokemonyDoZlapania.indexOf(pokemonImg) != -1 && this.find('.dzikipokemon-background-normalny .col-xs-9 > b').html().split("Poziom: ")[1] <= 50){
                        html = '<p class="alert alert-danger text-center">Pokemon do złapania w event</strong></p>';
                        this.find("h2:nth(0)").before(html);
                        AutoGoSettings.przerwij();
                    } else {
                        html = '<p class="alert alert-warning text-center">Juz złapałeś tego pokemona w tym evencie</strong></p>';
                        this.find("h2:nth(0)").before(html);
                    }
                }

                if(this.find(".panel-body > p.alert-success:contains('Udało Ci się złapać')").length > 0){
                    refreshWidget();
                    $.get('inc/stan.php', function(data) { $("#sidebar").html(data); });
                }
            });

        }
    }
    initEventWyspaUnikatow();



    // **********************
    //
    // initZamianaPrzedmiotow()
    // Funkcja dodajace opcje zmiany setow przedmiotow trzymanych
    //
    function initZamianaPrzedmiotow(){
        var listaPrzedmiotow = [];

        var set1 = config.set1;
        var set2 = config.set2;

        $('body').append('<div id="openZamianaPrzedmiotowBox" style="position: fixed;cursor: pointer;top: 20px;right: 310px;font-size: 20px;text-align: center;width: 25px;height: 25px;line-height: 29px;z-index: 9999;"><span style="color: ' + $('.panel-heading').css('background-color') + ';" class="glyphicon glyphicon-transfer" aria-hidden="true"></span></div>');

        $(document).on("click", "#openZamianaPrzedmiotowBox", function (event) {
            $('body').append('<div id="disabledBox" style="width: 100%;height: 100%;background: black;position: fixed;top: 0;opacity: 0.7;z-index: 99998;"></div>');
            $('body').append('<div id="zamianaPrzedmiotowBox" style="box-shadow: 10px 10px 55px 0px rgba(0,0,0,0.75);width: 600px;min-height: 400px;max-height: 86%; overflow-y: auto; padding: 15px; background: white;position: fixed;top: 50px;z-index: 99999; left: 0; right: 0; margin: 0 auto;"><div id="setAkutalne" class="row" style="border: 1px dashed #e3e3e3; margin: 15px; padding: 15px;"></div><div id="set1" class="row" style="border: 1px dashed #e3e3e3; margin: 15px; padding: 15px;"></div><div id="set2" class="row" style="border: 1px dashed #e3e3e3; margin: 15px; padding: 15px;"></div></div>');

            $.ajax({
                type: 'POST',
                url: "gra/plecak.php"
            }).done(function (response) {
                var arrayUzywane = [];
                $.each($(response).find('#plecak-trzymane > .row > div'), function (index, item) {
                    if($(item).find(".caption .text-center:contains('Używa: ')").length > 0){
                        arrayUzywane.push($(item));
                    }
                    if($(item).find('.thumbnail-plecak').data('target') != undefined){
                        var id = $(item).find('.thumbnail-plecak').data('target').split('plecak-przedmiot-')[1];
                        var img = $(item).find('.thumbnail-plecak img').attr('src');
                        $(item).find('.thumbnail-plecak h5 strong').append(" ");
                        var name = $(item).find('.thumbnail-plecak h5').text();
                        var wymagaNaprawy = $(item).find('.thumbnail-plecak h5:contains("Wymaga naprawy")').length > 0;
                        var object = new Object();
                        object.id = id;
                        object.img = img;
                        object.name = name;
                        object.wymaga_naprawy = wymagaNaprawy;
                        if(id != "pyl-odnowy"){
                            listaPrzedmiotow["id-"+id] = object;
                        }
                    }
                })

                console.log(listaPrzedmiotow);

                var html_element = '<div class="col-md-2" style=" text-align: center; "><h5>NAME</h5> <img src="IMAGE_SRC" style=" max-width: 100%; "></div>';

                $.each(arrayUzywane, function (index, item) {
                    $('#setAkutalne').append(html_element.replace("IMAGE_SRC", $(item).find('img').attr('src')).replace("NAME", $(item).find('strong:nth(1)').html()));
                })

                $.each(set1, function (index, item) {
                    if(item == "none"){
                        $('#set1').append('<div class="col-md-2" style=" text-align: center; "><h5>'+$('#sidebar .stan-pokemon[align="left"]:nth('+(index-1)+') b').html().split('(')[0]+'</h5> <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Saint_Andrew%27s_cross_black.svg/480px-Saint_Andrew%27s_cross_black.svg.png" style=" max-width: 100%; "></div>');
                    } else {
                        $('#set1').append('<div class="col-md-2" style=" text-align: center; "><h5>'+$('#sidebar .stan-pokemon[align="left"]:nth('+(index-1)+') b').html().split('(')[0]+'</h5> <img src="'+listaPrzedmiotow["id-"+item].img+'" style=" max-width: 100%; "></div>');
                    }
                })
                $('#set1').append('<div class="col-md-3 col-md-offset-3" style=" text-align: center; "><button  id="useSet" data-id="1" style=" border: none; border-radius: 3px; margin-top: 20px; background: #d3e5ee; ">Uzyj tego zestawu</button></div>');
                $('#set1').append('<div class="col-md-3" style=" text-align: center; "><button id="editSet" data-id="1" style=" border: none; border-radius: 3px; margin-top: 20px; background: #fae6e8; ">Edytuj zestaw</button></div>');

                $.each(set2, function (index, item) {
                    if(item == "none"){
                        $('#set2').append('<div class="col-md-2" style=" text-align: center; "><h5>'+$('#sidebar .stan-pokemon[align="left"]:nth('+(index-1)+') b').html().split('(')[0]+'</h5> <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Saint_Andrew%27s_cross_black.svg/480px-Saint_Andrew%27s_cross_black.svg.png" style=" max-width: 100%; "></div>');
                    } else {
                        $('#set2').append('<div class="col-md-2" style=" text-align: center; "><h5>'+$('#sidebar .stan-pokemon[align="left"]:nth('+(index-1)+') b').html().split('(')[0]+'</h5> <img src="'+listaPrzedmiotow["id-"+item].img+'" style=" max-width: 100%; "></div>');
                    }
                })
                $('#set2').append('<div class="col-md-3 col-md-offset-3" style=" text-align: center; "><button id="useSet" data-id="2" style=" border: none; border-radius: 3px; margin-top: 20px; background: #d3e5ee; ">Uzyj tego zestawu</button></div>');
                $('#set2').append('<div class="col-md-3" style=" text-align: center; "><button id="editSet" data-id="2" style=" border: none; border-radius: 3px; margin-top: 20px; background: #fae6e8; ">Edytuj zestaw</button></div>');
            })
        });

        $(document).on("click", "#editSet", function (event) {
            var id = $(this).data('id');
            var set;
            if(id == 1){
                set = set1;
            }
            if(id == 2){
                set = set2;
            }

            $('#zamianaPrzedmiotowBox').html('<div class="row"></div>');
            $('#zamianaPrzedmiotowBox > div').append('<div class="col-md-4" style=" text-align: center; "><h4>'+$('#sidebar .stan-pokemon[align="left"]:nth(0) b').html().split('(')[0]+'</h4><select style="width: 100%;" data-id="1"></select></div>');
            $('#zamianaPrzedmiotowBox > div').append('<div class="col-md-4" style=" text-align: center; "><h4>'+$('#sidebar .stan-pokemon[align="left"]:nth(1) b').html().split('(')[0]+'</h4><select style="width: 100%;" data-id="2"></select></div>');
            $('#zamianaPrzedmiotowBox > div').append('<div class="col-md-4" style=" text-align: center; "><h4>'+$('#sidebar .stan-pokemon[align="left"]:nth(2) b').html().split('(')[0]+'</h4><select style="width: 100%;" data-id="3"></select></div>');
            $('#zamianaPrzedmiotowBox > div').append('<div class="col-md-4" style=" text-align: center; "><h4>'+$('#sidebar .stan-pokemon[align="left"]:nth(3) b').html().split('(')[0]+'</h4><select style="width: 100%;" data-id="4"></select></div>');
            $('#zamianaPrzedmiotowBox > div').append('<div class="col-md-4" style=" text-align: center; "><h4>'+$('#sidebar .stan-pokemon[align="left"]:nth(4) b').html().split('(')[0]+'</h4><select style="width: 100%;" data-id="5"></select></div>');
            $('#zamianaPrzedmiotowBox > div').append('<div class="col-md-4" style=" text-align: center; "><h4>'+$('#sidebar .stan-pokemon[align="left"]:nth(5) b').html().split('(')[0]+'</h4><select style="width: 100%;" data-id="6"></select></div>');
            $('#zamianaPrzedmiotowBox > div').append('<div class="col-md-12" style="margin-top:40px; text-align: center; "><button id="saveEditSet" data-id="'+id+'">Zapisz</button></div>');

            Object.keys(listaPrzedmiotow).forEach(function(item) {
                $('#zamianaPrzedmiotowBox select').append('<option value="'+listaPrzedmiotow[item].id+'">'+listaPrzedmiotow[item].name+'</option>');
            });
            $('#zamianaPrzedmiotowBox select').append('<option value="none">Brak przedmiotu</option>');

            $('#zamianaPrzedmiotowBox select[data-id="1"] option[value="'+set[1]+'"]').attr('selected','selected');
            $('#zamianaPrzedmiotowBox select[data-id="2"] option[value="'+set[2]+'"]').attr('selected','selected');
            $('#zamianaPrzedmiotowBox select[data-id="3"] option[value="'+set[3]+'"]').attr('selected','selected');
            $('#zamianaPrzedmiotowBox select[data-id="4"] option[value="'+set[4]+'"]').attr('selected','selected');
            $('#zamianaPrzedmiotowBox select[data-id="5"] option[value="'+set[5]+'"]').attr('selected','selected');
            $('#zamianaPrzedmiotowBox select[data-id="6"] option[value="'+set[6]+'"]').attr('selected','selected');

        })

        $(document).on("click", "#saveEditSet", function (event) {
            var id = $(this).data('id');
            var set;
            if(id == 1){
                set = set1;
            }
            if(id == 2){
                set = set2;
            }

            set[1] = $('#zamianaPrzedmiotowBox select[data-id="1"]').val();
            set[2] = $('#zamianaPrzedmiotowBox select[data-id="2"]').val();
            set[3] = $('#zamianaPrzedmiotowBox select[data-id="3"]').val();
            set[4] = $('#zamianaPrzedmiotowBox select[data-id="4"]').val();
            set[5] = $('#zamianaPrzedmiotowBox select[data-id="5"]').val();
            set[6] = $('#zamianaPrzedmiotowBox select[data-id="6"]').val();
            $('#disabledBox').remove();
            $('#zamianaPrzedmiotowBox').remove();

            if(id == 1){
                config.set1 = set;
                updateConfig(config);
            }
            if(id == 2){
                config.set2 = set;
                updateConfig(config);
            }
        })

        $(document).on("click", "#useSet", function (event) {
            var id = $(this).data('id');
            var set;
            if(id == 1){
                set = set1;
            }
            if(id == 2){
                set = set2;
            }

            $.ajax({
                type: 'POST',
                url: "gra/plecak.php"
            }).done(function (response) {
                var arrayUzywane = [];
                $.each($(response).find('#plecak-trzymane > .row > div'), function (index, item) {
                    if($(item).find(".caption .text-center:contains('Używa: ')").length > 0){
                        arrayUzywane.push($(item).find('.thumbnail-plecak').data('target').split('plecak-przedmiot-')[1]);
                    }
                })

                $.each(arrayUzywane, function (index, item) {
                    var url = 'gra/plecak.php?odloz='+item+'&p=4';
                    $.get(url, function(data) {});
                })

                $.each(set, function (index, item) {
                    if(item != "none"){
                        var url = 'gra/plecak.php?daj&p=4&postData%5B0%5D%5Bname%5D=id_przedmiotu&postData%5B0%5D%5Bvalue%5D='+item+'&postData%5B1%5D%5Bname%5D=druzyna_numer&postData%5B1%5D%5Bvalue%5D='+(index-1);
                        $.get(url, function(data) {});
                    }
                })
                $('#disabledBox').remove();
                $('#zamianaPrzedmiotowBox').remove();
            })

        })


        $(document).on("click", "#disabledBox", function (event) {
            $('#disabledBox').remove();
            $('#zamianaPrzedmiotowBox').remove();
        })

    }
    initZamianaPrzedmiotow();



    // **********************
    //
    // initPodgladPokowWLidze()
    // Funkcja dodajaca opcje podgladu pokow i ich rozlozenia w lidze
    //
    function initPodgladPokowWLidze(){
        onReloadMain(function(){
            if (this.find('.panel-heading:contains("Pokemony w lidze")').length > 0) {
                var THAT = this;
                var html = '<div class="row wlidze">';

                this.find(".panel-heading:contains('Pokemony w lidze')").parent().find('.pokazpoka').each(function(index, value){
                    html = html + '<button class="col-xs-2 pokazPokaWLidze" data-id="'+$(value).data('id-pokemona')+'">Pokaz pokemona w lidze</button>';
                })

                html = html + '</div>';
                this.find(".panel-heading:contains('Pokemony w lidze')").parent().find('.row').after(html);
            }
        })

        $(document).on("click", ".pokazPokaWLidze", function (event) {
            reloadMain("#podgladPoka_content", 'gra/pokemon_skr.php?nopanel&p='+$(this).data('id')+'&ignoruj_ukrycie=1&ograniczenia_hali=0&pokemon_hala=0&treningi_rank=1');
            $('#podgladPoka').modal('show');
        })
    }
    initPodgladPokowWLidze();



    // **********************
    //
    // initSzybkaWalkaWLidze()
    // Funkcja dodająca przycisk do szybkiej walki w lidze z domyslnym ustawieniem
    //
    function initSzybkaWalkaWLidze(){
        onReloadMain(function(){
            var THAT = this;
            if (this.find('.panel-heading:contains("Ranking")').length > 0) {
                this.find(".pagination:even()").before('<button id="addButtonToFastFights" style="display: block; text-align: center; margin: 0 auto; margin-top: 20px; background: #337ab7; border: none; border-radius: 3px; padding: 5px 10px; color: white; line-height: 25px; ">Dodaj przycisk do szybkich walk</button>');
            }
        })

        $(document).on("click", "#addButtonToFastFights", function (event) {
            $('.fastFight').remove();
            $('form[action="liga_walki.php"]').parent().append('<button class="fastFight" style=" margin-top: 10px; ">Szybka walka</button>');
        })

        $(document).on("click", ".fastFight", function (event) {
            var zapezpieczenie = $(this).parent().find('input[name="zabezpieczenie"]').val();
            var walcz = $(this).parent().find('input[name="walcz"]').val();
            var THAT = $(this).parent();

            $.ajax({
                type : 'GET',
                url : 'gra/liga_walki.php?postData%5B0%5D%5Bname%5D=walcz&postData%5B0%5D%5Bvalue%5D='+walcz+'&postData%5B1%5D%5Bname%5D=zabezpieczenie&postData%5B1%5D%5Bvalue%5D='+zapezpieczenie,
                success:function (data) {
                    var postData = $(data).find('form').serializeArray();
                    $.ajax({
                        type : 'GET',
                        url : 'gra/liga_walki.php',
                        data: {
                            postData : postData
                        },
                        success:function (data) {
                            var data2 = data;
                            $.get( 'inc/stan.php', function( data ) {
                                $( "#sidebar" ).html( data );
                                if($(data2).find('.alert-success:contains("Trzymaj tak dalej")').length > 0){
                                    THAT.html('<span style="color: green">Wygrana<span>');
                                } else {
                                    if($(data2).find('.alert-danger:contains("Posiadasz za mało punktów akcji")').length > 0){

                                    } else {
                                        THAT.html('<span style="color: red">Przegrana<span>');
                                    }
                                }
                            })
                        }
                    });
                }
            });
        })
    }
    initSzybkaWalkaWLidze();



    // **********************
    //
    // initPrzypomnienieOPracy()
    // Funkcja dodająca przypomnienie o pracy po wyjściu poza obszar strony
    //
    function initPrzypomnienieOPracy(){
        $('body').append('<div id="jobAlertBox" style="position: fixed; width: 100%; height: 100%; background: linear-gradient(rgba(0, 0, 0, 0.65) 0%, rgba(0, 0, 0, 0) 100%); z-index: 99999; top: 0px; display: none;"><h1 style="text-align: center;color: #dadada;font-size: 90px;vertical-align: middle;">Brak aktywności</h1></div>');

        var addEvent = function(obj, evt, fn) {
            if (obj.addEventListener) {
                obj.addEventListener(evt, fn, false);
            }
            else if (obj.attachEvent) {
                obj.attachEvent("on" + evt, fn);
            }
        };

        addEvent(document, "mouseout", function(event) {
            event = event ? event : window.event;
            var d = new Date();
            var h = d.getHours();
            var from = event.relatedTarget || event.toElement;
            if ( (!from || from.nodeName == "HTML") && event.clientY <= 10 && $('.alert-info a[href="aktywnosc.php"]').length == 0) {
                $("#jobAlertBox").css('display', 'block');
            }
        });

        addEvent(document, "mouseover", function(event) {
            $('#jobAlertBox').css('display', "none");
        });
    }
    initPrzypomnienieOPracy();
}
