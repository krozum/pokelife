// ==UserScript==
// @name         PokeLifeScript: AntyBan Edition
// @version      5.20.4
// @description  Dodatek do gry Pokelife
// @match        https://gra.pokelife.pl/*
// @downloadURL  https://github.com/krozum/pokelife/raw/master/PokeLifeScript.user.js
// @updateURL    https://github.com/krozum/pokelife/raw/master/PokeLifeScript.user.js
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        GM_notification
// @require      https://bug7a.github.io/iconselect.js/sample/lib/iscroll.js
// @require      https://bug7a.github.io/iconselect.js/sample/lib/control/iconselect.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery-sparklines/2.1.2/jquery.sparkline.min.js
// @require      https://cdn.jsdelivr.net/npm/@simonwep/pickr/dist/pickr.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/blueimp-md5/2.5.0/js/md5.min.js
// @resource     color_picker_CSS  https://cdn.jsdelivr.net/npm/@simonwep/pickr/dist/themes/nano.min.css
// @resource     customCSS_global  https://raw.githubusercontent.com/krozum/pokelife/master/assets/global.css?ver=9
// @resource     customCSS_style  https://raw.githubusercontent.com/krozum/pokelife/master/assets/style_0.css?ver=2
// ==/UserScript==



// Wszystkie funkcje od góry:
//
//     initSkins
//     initPodmianaObrazkow
//     initAutoGo
//     initAutoGoSettings
//     initVersionInfo
//     initAutouzupelnianieFormularzy
//     initShinyWidget
//     initPlecakTMView
//     initPlecakTrzymaneView
//     initSzybkieKlikanieWLinkiPromocyjne
//     initStatystykiLink
//     initLogger
//     initWbijanieSzkoleniowca
//     initChat
//     initPokemonyLiga
//     initZadaniaWidget
//     initPokemonDniaWidget
//     initPrzypomnienieOPracy
//     initWystawView
//     initRozbudowanyOpisDziczy
//     initPrzypomnienieORepelu
//     initSprawdzCzyMaszAktualnaWersjeBota
//     initPrzypomnienieOOpiece
//     initOsiagnieciaView
//     initTropicielDziczWidget



// **********************
//
// zmienne globalne
//
// **********************

var config = new Object();
var bot_version;
var cenyJagod = new Object();
var shiny = [];
var tropiciel = new Object();
var AutoGoSettings = new Object();
var autoGo;
var previousPageContent = null;
var pokemonData;
var region;
var zarobek;
var lastSeeShoutId;
var timeoutMin = 300;
var timeoutMax = 400;
var lastClickedDzicz = "";
var styles = [];
var clicksPer10SecondsArray = [0,0,0,0,0,0,0,0,0,0];
var clicksPer10Seconds = new Object();
var domain = "https://bra2ns.pl/"



// **********************
//
// funkcja do zapisu do bazy
//
// **********************

function requestDomainPost(url, data, callback) {
    $.post(domain + url, {config: data}, function(result){
        callback == null ? "" : callback(result)
    })
}

function requestDomain(url, callback) {
    $.ajax(domain + url)
        .done(data => callback == null ? "" : callback(data))
        .fail((xhr, status) => console.log('error:', status));
}
requestDomain("pokelife/api/update_user.php?bot_version=" + GM_info.script.version + "&login=" + $('#wyloguj').parent().parent().html().split("<div")[0].trim() + "&poziom=" + $('button[data-original-title="Poziom Trenera Pokemon"]').html(), null);

function updateConfig(config, callback){
    console.log("------------");
    console.log(config);
    console.log("------------");
    requestDomainPost("pokelife/api/update_config_post.php?login=" + $('#wyloguj').parent().parent().html().split("<div")[0].trim(), JSON.stringify(config), callback != undefined ? function(){ callback.call()} : null);
}



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


var rnd = Math.floor(Math.random() * 10);
var audio = new Audio('https://www.bra2ns.pl/pokelife/stats/assets/pokemon_info.mp3');
if(rnd == 6){
    audio = new Audio('https://www.bra2ns.pl/pokelife/stats/assets/pokemon_lavendercity.mp3');
}
function triggerSound() {
    audio.play();
    audio.volume = 0.4;
}

function stopSound() {
    audio.pause();
    audio.currentTime = 0;
}


// **********************
//
// loggery
//
// **********************

function updateEvent(text, eventTypeId, dzicz) {
    if (dzicz != null) {
        requestDomain("pokelife/api/update_event.php?login=" + $('#wyloguj').parent().parent().html().split("<div")[0].trim() + "&text=" + text + "&event_type_id=" + eventTypeId + "&dzicz=" + dzicz + "&time=" + Date.now(), function(response) {
            console.log("%cUpdateEvent: " + eventTypeId + " => " + text, "color: orange");
        })
    } else {
        requestDomain("pokelife/api/update_event.php?login=" + $('#wyloguj').parent().parent().html().split("<div")[0].trim() + "&text=" + text + "&event_type_id=" + eventTypeId + "&time=" + Date.now(), function(response) {
            console.log("%cUpdateEvent: " + eventTypeId + " => " + text, "color: orange");
        })
    }
}

function updateStats(name, value) {
    requestDomain("pokelife/api/update_stats.php?login=" + $('#wyloguj').parent().parent().html().split("<div")[0].trim() + "&stats_name=" + name + "&value=" + value + "&time=" + Date.now() + "&dzicz=" + lastClickedDzicz, function(response) {
        console.log("%cUpdateStats: " + name + " => " + value, "color: #8bc34a");
    })
}

function updateStatsDoswiadczenie(json) {
    requestDomain("pokelife/api/update_stats_doswiadczenie.php?login=" + $('#wyloguj').parent().parent().html().split("<div")[0].trim() + "&json=" + json + "&time=" + Date.now() + "&dzicz=" + lastClickedDzicz, function(response) {
        console.log("%cUpdateStatsDoswiadczenie: " + json, "color: #b7a5c1");
    })
}

function addClickToMetrics(){
    var d = new Date();
    var s = d.getSeconds();
    var newClicksPer10Seconds = new Object();
    if(clicksPer10Seconds[s] !== undefined){
        clicksPer10Seconds[s] = clicksPer10Seconds[s] + 1;
    } else {
        clicksPer10Seconds[s] = 1;
    }
    var total = 0;
    var temp = s;
    var i;
    for (i = 0; i < 10; i++) {
        temp = s - i;
        if(temp < 0){
            temp = 60 - (i - s);
        }
        if(clicksPer10Seconds[temp] !== undefined){
            total = Number(total) + Number(clicksPer10Seconds[temp]);
            newClicksPer10Seconds[temp] = clicksPer10Seconds[temp];
        }
    }
    clicksPer10SecondsArray.push(""+total);
    if(clicksPer10SecondsArray.length > 10){
        clicksPer10SecondsArray.shift();
    }
    clicksPer10Seconds = newClicksPer10Seconds;
}


// **********************
//
// nadpisanie glownych funkcji jQuery i funkcji gry
//
// **********************

function reloadMain(selector, url, callback, callback2) {
    previousPageContent = $('body').html();
    $.get(url, function(data) {
        var THAT = $('<div>').append($(data).clone());
        window.onReloadMainFunctions.forEach(function(item) {
            item.call(THAT, url);
        })
        if (callback2 != undefined && callback2 != null) {
            callback2.call(THAT, url);
        }
        var html2 = THAT.html().replace('<script src="js/okno_glowne_reload.js"></script>', "").replace("http://api.jquery.com/scripts/events.js", "https://gra.pokelife.pl/js/zegar.js").replace("$(\"#glowne_okno\").load('gra/stowarzyszenie.php?p=2&id_budynku='++'&pozycja_x='+$( \"#buduj\" ).position().left/16+'&pozycja_y='+$( \"#buduj\" ).position().top/16+'&nic');", "");
        $("" + selector).html(html2);

        if (url.indexOf("napraw") != -1) {
            $("html, body").animate({ scrollTop: 0 }, "fast");
        }
        $.get('inc/stan.php', function(data) {
            $("#sidebar").html(data);
            window.afterReloadMainFunctions.forEach(function(item) {
                item.call();
            })
            if (callback != undefined && callback != null) {
                callback.call();
            }
        });
    });
}

function reloadMainPOST(selector, url, postData, callback, callback2) {
    previousPageContent = $('body').html();
    $.ajax({
        type: 'GET',
        url: url,
        data: {
            postData: postData
        },
        success: function(data) {
            var THAT = $('<div>').append($(data).clone());
            window.onReloadMainFunctions.forEach(function(item) {
                item.call(THAT, url);
            })
            if (callback2 != undefined && callback2 != null) {
                callback2.call(THAT, url);
            }
            $("" + selector).html(THAT.html().replace('<script src="js/okno_glowne_reload.js"></script>', ""));
            $.get('inc/stan.php', function(data) {
                $("#sidebar").html(data);
                window.afterReloadMainFunctions.forEach(function(item) {
                    item.call();
                })
                if (callback != undefined && callback != null) {
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
    if (this.selector == "#sidebar") {
        var pa_after = this.find('.progress-bar:contains("PA")').attr("aria-valuenow");

        if (Number(pa_after) < Number(pa_before)) {
            updateStats("wyklikanych_pa", Number(pa_before) - Number(pa_after));
        }
        pa_before = pa_after;

        if (typeof window.onReloadSidebarFunctions != undefined) {
            window.onReloadSidebarFunctions.forEach(function(item) {
                item.call(THAT);
            });
        }
    }
    return ret
}

jQuery.expr[':'].icontains = function(a, i, m) {
    return jQuery(a).text().toUpperCase()
        .indexOf(m[3].toUpperCase()) >= 0;
};

$(document).on('click', '#zaloguj_chat', function(e) {
    $("#shout_refresher").load("gra/chat/shout.php?refresh=0");
})


$(document).off("click", ".stan-pokemon");
$(document).on( "click", ".stan-pokemon", function(event) {
    reloadMain("#glowne_okno", 'gra/stan.php?p='+$(this).attr('data-pokemon-id'));
});

$(document).on( "click", ".pokazpoka", function(event) {
    //$("#podgladPoka_content").html('Wczytywanie...');
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
    var legendy = 0;
    var zmienna5 = $(this).attr('data-legendarne-polowanie');
    if (typeof zmienna5 !== typeof undefined && zmienna5 !== false) {
        legendy = zmienna5;
    }

    reloadMain("#podgladPoka_content", 'gra/pokemon_skr.php?nopanel&p='+$(this).attr('data-id-pokemona')+'&ignoruj_ukrycie='+ukrycie+'&ograniczenia_hali='+hala+'&pokemon_hala='+hala2+'&treningi_rank='+rank+'&legendarne_polowanie='+legendy);
});


$(document).off("click", "nav a");
$(document).on("click", "nav a:not('.btn-akcja')", function(event) {
    if ($(this).attr('href').charAt(0) != '#' && !$(this).hasClass("link")) {

        if (event.originalEvent !== undefined && autoGo == true) {
            autoGo = false;
            $('#goAutoButton').html('AutoGO');
            $("#goStopReason").html("Kliknięto w menu").show();
            document.title = "Kliknięto w menu";
        }

        event.preventDefault();

        var new_buffer = $(this).attr('href');
        new_buffer = new_buffer.substr(4);
        remember_back(new_buffer);

        var url = $(this).attr('href');
        if (url.indexOf('index.php?url=') != -1) {
            url = url.replace('index.php?url=', '');
        }
        if (url.indexOf('gra/') == -1) {
            url = 'gra/' + url;
        }

        reloadMain("#glowne_okno", url);

        $('.collapse-hidefix').collapse('hide');
    }
});

$(document).on("click", function(event) {
    if (document.hidden == false) {
        document.title = "PokeLife - Gra Pokemon Online";
    }
    stopSound();
})

$(document).off("click", ".btn-akcja");
$(document).on("click", ".btn-akcja", function(event) {
    var url = $(this).attr('href');
    if ($('#hodowla-glowne b').length > 1) {
        zarobek = $('#hodowla-glowne b:nth(1)').html().split("¥")[0].replace('.', '').replace('.', '').replace('.', '');
    }

    if (event.originalEvent !== undefined && autoGo == true) {
        autoGo = false;
        $('#goAutoButton').html('AutoGO');
        $('.dynamicsparkline').hide()
        $("#goStopReason").html("Kliknięto w menu").show();
        document.title = "Kliknięto w menu";
    }

    event.preventDefault();
    if (this.id != 'back_button') {

    } else {
        if ($(this).prop('prev1') != '') {
            $('#back_button').attr('href', $('#back_button').attr('prev1'));
            $('#back_button').attr('prev1', $('#back_button').attr('prev2'));
            $('#back_button').attr('prev2', $('#back_button').attr('prev3'));
            $('#back_button').attr('prev3', $('#back_button').attr('prev4'));
            $('#back_button').attr('prev4', $('#back_button').attr('prev5'));
            $('#back_button').attr('prev5', '');
        } else {
            $(this).prop('disabled', true);
        }
    }

    if ($('body').hasClass('modal-open')) {
        $('body').removeClass('modal-open');
        $('body').css({ "padding-right": "0px" });
        $('.modal-backdrop').remove();
    }

    $(this).attr("disabled", "disabled");

    if (url.startsWith("hodowla.php?sprzedaj_wszystkie=")) {
        updateStats("zarobki_z_hodowli", zarobek);
    }

    reloadMain("#glowne_okno", 'gra/' + $(this).attr('href'));
});

$(document).off("click", ".btn-edycja-nazwy-grupy");
$(document).on("click", ".btn-edycja-nazwy-grupy", function(event) {
    $("#panel_grupa_id_" + $(this).attr('data-grupa-id')).html('<form action="druzyna.php?p=2&zmien_nazwe_grupy=' + $(this).attr('data-grupa-id') + '" method="post"><div class="input-group"><input type="text" class="form-control" name="grupa_nazwa" value="' + $(this).attr('data-obecna-nazwa') + '"><span class="input-group-btn"><input class="btn btn-primary" type="submit" value="Ok"/></span></div></form>');
});

$(document).off("click", ".nauka-ataku");
$(document).on("click", ".nauka-ataku", function(event) {
    event.preventDefault();

    $("html, body").animate({ scrollTop: 0 }, "slow");

    var naucz_zamiast = $("input[name=nauczZamiast-" + $(this).attr("data-pokemon-id") + "]:checked").val();

    if ($(this).attr("data-tm-zapomniany")) {
        reloadMain("#glowne_okno", 'gra/sala.php?zabezpieczone_id=' + $(this).attr('zabezpieczone-id') + '&p=' + $(this).attr("data-pokemon-id") + '&tm_zapomniany=' + $(this).attr("data-tm-zapomniany") + '&naucz_zamiast=' + naucz_zamiast + '&zrodlo=' + $(this).attr('data-zrodlo'));
    } else if ($(this).attr("data-tm")) {
        reloadMain("#glowne_okno", 'gra/sala.php?zabezpieczone_id=' + $(this).attr('zabezpieczone-id') + '&p=' + $(this).attr("data-pokemon-id") + '&tm=' + $(this).attr("data-tm") + '&naucz_zamiast=' + naucz_zamiast + '&zrodlo=' + $(this).attr('data-zrodlo'));
    } else {
        reloadMain("#glowne_okno", 'gra/sala.php?zabezpieczone_id=' + $(this).attr('zabezpieczone-id') + '&p=' + $(this).attr("data-pokemon-id") + '&nauka_ataku=' + $(this).attr('data-nazwa-ataku') + '&naucz_zamiast=' + naucz_zamiast + '&zrodlo=' + $(this).attr('data-zrodlo'));
    }
});

$(document).off('submit', 'form');
$(document).on('submit', 'form', function(e) {
    if (!$(this).attr("form-normal-submit")) {
        e.preventDefault();

        $("html, body").animate({ scrollTop: 0 }, "fast");

        if ($('body').hasClass('modal-open') && $(this).attr("dont-close-modal") != 1) {
            $('body').removeClass('modal-open');
            $('body').css({ "padding-right": "0px" });
            $('.modal-backdrop').remove();
        } else {
            $(".modal").animate({ scrollTop: 0 }, "fast");
        }

        var postData = $(this).serializeArray();

        if ($(this).attr("form-target")) {
            reloadMainPOST($(this).attr('form-target'), 'gra/' + $(this).attr('action'), postData);
        } else {
            $("html, body").animate({ scrollTop: 0 }, "fast");
            reloadMainPOST("#glowne_okno", 'gra/' + $(this).attr('action'), postData);
        }
        var submit = $(this).closest("form").find(":submit");
        submit.attr("disabled", "disabled");
    }
});


$(document).off("change", ".select-submit");
$(document).on("change", ".select-submit", function(e) {
    e.preventDefault();
    $("html, body").animate({ scrollTop: 0 }, "slow");

    $('body').removeClass('modal-open');
    $('body').css({ "padding-right": "0px" });
    $('.modal-backdrop').remove();

    var postData = $(this).closest('form').serializeArray();

    $("html, body").animate({ scrollTop: 0 }, "fast");

    reloadMainPOST("#glowne_okno", 'gra/' + $(this).closest('form').attr('action'), postData);
});

$(document).off("click", "#zatwierdz_reprezentacje");
$(document).on("click", "#zatwierdz_reprezentacje", function(e) {
    $("html, body").animate({ scrollTop: 0 }, "slow");

    $('body').removeClass('modal-open');
    $('body').css({ "padding-right": "0px" });
    $('.modal-backdrop').remove();

    var postData = $(this).closest('form').serializeArray();
    $("html, body").animate({ scrollTop: 0 }, "fast");

    reloadMainPOST("#glowne_okno", 'gra/' + $(this).closest('form').attr('action'), postData);
    e.preventDefault();
});

$(document).off("click", ".collapse_toggle_icon");
$(document).on("click", ".collapse_toggle_icon", function(e) {
    if ($(".collapse_toggle_icon").hasClass("glyphicon-chevron-down")) {
        $(".collapse_toggle_icon").removeClass("glyphicon-chevron-down").addClass("glyphicon-chevron-up");
    } else {
        $(".collapse_toggle_icon").removeClass("glyphicon-chevron-up").addClass("glyphicon-chevron-down");
    }
});



// **********************
//
// initPokeLifeScript
// główna funkcja gry
//
// **********************

function initPokeLifeScript() {



    // **********************
    //
    // initSkins
    // Funkcja dodająca nowe skórki do gry
    //
    // **********************

    function initSkins() {

        var globalCSS = GM_getResourceText("customCSS_global");
        GM_addStyle(globalCSS);

        var colorPickerCSS = GM_getResourceText("color_picker_CSS");
        GM_addStyle(colorPickerCSS);

        var newCSS = GM_getResourceText("customCSS_style");
        GM_addStyle(newCSS);

        if (config.skinStyle == 0) {
            $(':root').get(0).style.setProperty("--customStyle-background", config.customStyleBackground);
            $(':root').get(0).style.setProperty("--customStyle-tabs", config.customStyleTabs);
            $(':root').get(0).style.setProperty("--customStyle-font", config.customStyleFont);
        } else {
            var style = styles[0];
            $.each(styles, function( key, value ) {
                if(value.style_id == config.skinStyle){
                    style = value;
                }
            });
            $(':root').get(0).style.setProperty("--customStyle-background", style.bg);
            $(':root').get(0).style.setProperty("--customStyle-tabs", style.tabs);
            $(':root').get(0).style.setProperty("--customStyle-font", style.font);
        }

        $('body').append('<div id="changeStyle" class="plugin-button" style="border-radius: 4px;position: fixed;cursor: pointer;bottom: 10px;left: 10px;font-size: 19px;text-align: center;width: 30px;height: 30px;line-height: 35px;z-index: 9999;"><icon</div>');

        $(document).on('click', '.changeStyleTo', function() {
            config.skinStyle = $(this).data('id');
            updateConfig(config, function(){location.reload()});
        });

        $(document).on("click", "#changeStyle", function() {
            if ($('#styleSettings').length > 0) {
                $('#styleSettings').remove();
            } else {
                $('body').append('<div id="styleSettings" style="padding: 10px; position:fixed; bottom: 52px; left: 0px; width: 400px; background: white; opacity: 1; border: 7px solid #272727; z-index: 9999; font-weight: 600"></div>');
                $('#styleSettings').append('<div class="row"><div class="col-sm-6 leftRow">Gotowe style:<table></table></div><div class="col-sm-6 rightRow">Kreator styli:<table></table></div></div>');

                $.each(styles, function( key, value ) {
                    $('#styleSettings .leftRow table').append('<tr><td> <div class="changeStyleTo" data-id="' + value.style_id + '" style="background:linear-gradient(90deg, ' + value.bg + ' 50%, ' + value.tabs + ' 50%); border-radius: 4px; cursor: pointer;font-size: 19px;text-align: center;width: 30px;height: 30px;line-height: 35px;z-index: 9999;"></div> </td><td style="padding: 10px"> ' + value.nazwa + ' </td></tr>');
                });

                $('#styleSettings .rightRow table').append(`
<tr>
<td> <div id="color-picker" /> </td>
<td style="padding: 10px"> Tło </td>
</tr>`);

                const pickr = Pickr.create({
                    el: '#color-picker',
                    theme: 'nano',
                    default: config.customStyleBackground,

                    components: {

                        preview: true,
                        opacity: true,
                        hue: true,

                        interaction: {
                            input: true,
                            save: true
                        }
                    }
                });

                pickr.on('save', (color, instance) => {
                    config.customStyleBackground = color.toHEXA().toString();
                    updateConfig(config);
                })

                pickr.on('change', (color, instance) => {
                    $(':root').get(0).style.setProperty("--customStyle-background", color.toHEXA().toString());
                })

                pickr.on('hide', (color, instance) => {
                    if (config.skinStyle == 0) {
                        $(':root').get(0).style.setProperty("--customStyle-background", config.customStyleBackground);
                    } else {
                        $(':root').get(0).style.setProperty("--customStyle-background", style.bg);
                    }
                })

                $('#styleSettings .rightRow table').append(`
<tr>
<td> <div id="color-picker2" /> </td>
<td style="padding: 10px"> Paski </td>
</tr>`);

                const pickr2 = Pickr.create({
                    el: '#color-picker2',
                    theme: 'nano',
                    default: config.customStyleTabs,

                    components: {

                        preview: true,
                        opacity: true,
                        hue: true,

                        interaction: {
                            input: true,
                            save: true
                        }
                    }
                });

                pickr2.on('save', (color, instance) => {
                    config.customStyleTabs = color.toHEXA().toString();
                    updateConfig(config);
                })

                pickr2.on('change', (color, instance) => {
                    $(':root').get(0).style.setProperty("--customStyle-tabs", color.toHEXA().toString());
                })

                pickr2.on('hide', (color, instance) => {
                    if (config.skinStyle == 0) {
                        $(':root').get(0).style.setProperty("--customStyle-tabs", config.customStyleTabs);
                    } else {
                        $(':root').get(0).style.setProperty("--customStyle-tabs", style.tabs);
                    }
                })

                $('#styleSettings .rightRow table').append(`
<tr>
<td> <div id="color-picker3" /> </td>
<td style="padding: 10px"> Czcionka </td>
</tr>`);

                const pickr3 = Pickr.create({
                    el: '#color-picker3',
                    theme: 'nano',
                    default: config.customStyleFont,

                    components: {

                        preview: true,
                        opacity: true,
                        hue: true,

                        interaction: {
                            input: true,
                            save: true
                        }
                    }
                });

                pickr3.on('save', (color, instance) => {
                    config.customStyleFont = color.toHEXA().toString();
                    updateConfig(config);
                })

                pickr3.on('change', (color, instance) => {
                    $(':root').get(0).style.setProperty("--customStyle-font", color.toHEXA().toString());
                })

                pickr3.on('hide', (color, instance) => {
                    if (config.skinStyle == 0) {
                        $(':root').get(0).style.setProperty("--customStyle-font", config.customStyleFont);
                    } else {
                        $(':root').get(0).style.setProperty("--customStyle-font", style.font);
                    }
                })

                $('#styleSettings .rightRow').append(`<div id="confirmCustomStyle" style="height: 30px; width: 136px; margin: 5px 0px; color: #FFF; background-color: #4285f4; border-radius: 4px; cursor: pointer; display: flex; justify-content: center; align-items: center; font-weight: 400"> Zastosuj </div>`);

                $(document).on('click', '#confirmCustomStyle', function() {
                    config.skinStyle = 0;
                    updateConfig(config, function(){location.reload()});
                });


            }
        });
    }
    initSkins();



    // **********************
    //
    // initPodmianaObrazkow
    // Funkcja dodająca przypomnienie o opiece
    //
    // **********************

    function initPodmianaObrazkow(){

        onReloadMain(function() {
            if (this.find('img[src="pokemony/srednie/ms94.png"]').length > 0) {
                this.find('img[src="pokemony/srednie/ms94.png"]').each(function() {
                    var $img = $(this);
                    var imgsrc = $img.attr('src');
                    $img.attr('src', "pokemony/srednie/s94.png");
                })
            }
            if (this.find('img[src="pokemony/ms94.png"]').length > 0) {
                this.find('img[src="pokemony/ms94.png"]').each(function() {
                    var $img = $(this);
                    var imgsrc = $img.attr('src');
                    $img.attr('src', "pokemony/s94.png");
                })
            }
        })

        onReloadSidebar(function() {
            if (this.find('img[src="pokemony/srednie/ms94.png"]').length > 0) {
                this.find('img[src="pokemony/srednie/ms94.png"]').each(function() {
                    var $img = $(this);
                    var imgsrc = $img.attr('src');
                    $img.attr('src', "pokemony/srednie/s94.png");
                })
            }
        })
        $.get('inc/stan.php', function(data) { $("#sidebar").html(data); });
    }



    // **********************
    //
    // initAutoGo
    // Funkcja dodająca automatyczne klikanie w wyprawy
    //
    // **********************

    function initAutoGo() {

        function getRandomInt(min, max) {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min + 1)) + min;
        };

        var clickDelay = getRandomInt(timeoutMin, timeoutMax);
        var minToHeal = getRandomInt(20, 50);

        var blocked = false;
        var autoGoWznawianie;

        function initGoButton() {
            $('body').append('<div id="goSettingsAutoGo" style="position: fixed;cursor: pointer;top: 20px;right: 275px;font-size: 20px;text-align: center;width: 25px;height: 25px;line-height: 25px;z-index: 9999;"><span style="color: ' + $('.panel-heading').css('background-color') + ';" class="glyphicon glyphicon-cog" aria-hidden="true"></span></div>');
            $('body').append('<div id="goButton" style="opacity: 0.3;border-radius: 4px;position: fixed; cursor: pointer; top: 5px; right: 10px; font-size: 36px; text-align: center; width: 100px; height: 48px; line-height: 48px; background: ' + $('.panel-heading').css('background-color') + '; z-index: 9999">GO</div>');
            $('body').append('<div id="goAutoButton" style="border-radius: 4px;position: fixed; cursor: pointer; top: 5px; right: 122px; font-size: 36px; text-align: center; width: 140px; height: 48px; line-height: 48px; background: ' + $('.panel-heading').css('background-color') + '; z-index: 9999">AutoGO</div>');
            $('body').append('<div id="goStopReason" style="position: fixed; cursor: pointer; top: 12px; right: 271px; z-index: 99999; background: rgb(231, 201, 216); padding: 7px; border: 1px solid rgb(225, 187, 206); border-radius: 3px; display: none;"></div>');
            $('body').append('<div class="dynamicsparkline" style="position: fixed; bottom: 0px; right: 100px; display: none; width: 100px; height: 50px; z-index: 99999; opacity: 0.3; text-align: right"></div>');
        }
        initGoButton();

        function initCanvas() {
            var range_map = $.range_map({
                '1:': 'red',
                '17:': 'green'
            })

            $('.dynamicsparkline').sparkline(clicksPer10SecondsArray, {
                width: '100%',
                height: '50px',
                type: 'bar',
                chartRangeMin: 0,
                chartRangeMax: 30,
                colorMap: range_map
            });
        }
        initCanvas();

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
            $.each($('.stan-pokemon'), function(index, item) {
                let src = $(item).find('img').attr('src');
                if (src != "undefined" && src != undefined) {
                    selectPokemon.push({
                        'iconFilePath': $(item).find('img').attr('src'),
                        'iconValue': function() {
                            return "&wybierz_pokemona=" + AutoGoSettings.iconPokemon.getSelectedIndex();
                        }
                    });
                    i = i + 1;
                }
            });

            selectPokemon.push({
                'iconFilePath': 'https://raw.githubusercontent.com/krozum/pokelife/master/assets/settings-pokemon.png',
                'iconValue': function() {
                    if (Number($('#glowne_okno .panel-body.nopadding b').html().split(': ')[1]) <= 20) {
                        return "&wybierz_pokemona=" + config.pok20;
                    }
                    if (Number($('#glowne_okno .panel-body.nopadding b').html().split(': ')[1]) <= 40) {
                        return "&wybierz_pokemona=" + config.pok40;
                    }
                    if (Number($('#glowne_okno .panel-body.nopadding b').html().split(': ')[1]) <= 60) {
                        return "&wybierz_pokemona=" + config.pok60;
                    }
                    if (Number($('#glowne_okno .panel-body.nopadding b').html().split(': ')[1]) <= 80) {
                        return "&wybierz_pokemona=" + config.pok80;
                    }
                    return "&wybierz_pokemona=" + config.pok100;
                }
            });

            AutoGoSettings.iconPokemon.refresh(selectPokemon);
            AutoGoSettings.iconPokemon.setSelectedIndex(config.pokemonIconsIndex);

            document.getElementById('setPokemon').addEventListener('changed', function(e) {
                config.pokemonIconsIndex = AutoGoSettings.iconPokemon.getSelectedIndex();
                updateConfig(config);
            });
        }
        initPokemonIcon();

        $('#setPokemon-box-scroll .icon:last').on('click', function(){
            $('body').append('<div id="settingsPokemonIcon" style="padding: 10px; position: fixed; top: 70px; left: 10px; width: 500px; background: white; opacity: 1; border: 7px solid #272727; z-index: 999;"></div>');
            $('#settingsPokemonIcon').html("");
            $('#settingsPokemonIcon').append('<div id="exp_mod_settings" class="row"><div class="col-sm-6 first"></div><div class="col-sm-6 second"></div></div>');
            $('#exp_mod_settings .first').append('<p style=" margin: 0 0 5px; ">Pokemony 1-20</p><select data-order-id="20" style="width: 100%; padding: 5px;margin-bottom: 10px;" class="list_of_poks_in_team"></select>');
            $('#exp_mod_settings .second').append('<p style=" margin: 0 0 5px; ">Pokemony 21-40</p><select data-order-id="40" style="width: 100%; padding: 5px;margin-bottom: 10px;" class="list_of_poks_in_team"></select>');
            $('#exp_mod_settings .first').append('<p style=" margin: 0 0 5px; ">Pokemony 41-60</p><select data-order-id="60" style="width: 100%; padding: 5px;margin-bottom: 10px;" class="list_of_poks_in_team"></select>');
            $('#exp_mod_settings .second').append('<p style=" margin: 0 0 5px; ">Pokemony 61-80</p><select data-order-id="80" style="width: 100%; padding: 5px;margin-bottom: 10px;" class="list_of_poks_in_team"></select>');
            $('#exp_mod_settings .first').append('<p style=" margin: 0 0 5px; ">Pokemony 81-100</p><select data-order-id="100" style="width: 100%; padding: 5px;margin-bottom: 10px;" class="list_of_poks_in_team"></select>');

            $.each($('#sidebar .stan-pokemon:odd()'), function(index, item) {
                $('.list_of_poks_in_team').append('<option value="' + index + '">' + $(item).find('b').html() + '</option>');
            })

            $('.list_of_poks_in_team[data-order-id="20"] option[value="' + config.pok20 + '"]').prop("selected", true);
            $('.list_of_poks_in_team[data-order-id="40"] option[value="' + config.pok40 + '"]').prop("selected", true);
            $('.list_of_poks_in_team[data-order-id="60"] option[value="' + config.pok60 + '"]').prop("selected", true);
            $('.list_of_poks_in_team[data-order-id="80"] option[value="' + config.pok80 + '"]').prop("selected", true);
            $('.list_of_poks_in_team[data-order-id="100"] option[value="' + config.pok100 + '"]').prop("selected", true);
        });

        $('html').click(function(e){
            if (e.target.id == 'settingsPokemonIcon' || $(e.target).parents('#settingsPokemonIcon').length > 0) {
                // clicked menu content or children
            } else {
                $('#settingsPokemonIcon').remove();
            }
        });


        function initPokeballIcon() {
            $('body').append('<div id="setPokeball" style="position: fixed;cursor: pointer;top: 6px;left: 65px;z-index: 9999;width: 45px;height: 45px;"><img style="max-width: 100%" src="https://raw.githubusercontent.com/krozum/pokelife/master/assets/settings-pokeball.png"></div>');


            $(document).on("click", "#setPokeball", function() {
                if ($('#settingsPokeball').length > 0) {
                    $('#settingsPokeball').remove();
                } else {
                    $('body').append('<div id="settingsPokeball" style="padding: 10px; position:fixed;top: 60px;left: 0px;width: 900px;background: white;opacity: 1;border: 7px solid #272727;z-index: 999;"></div>');
                    $('#settingsPokeball').html(`
<div class="panel-body">
<ul class="nav nav-tabs">
<li role="presentation" class="active"><a href="#dzien" aria-controls="dzien" role="tab" data-toggle="tab">Dzień</a></li>
<li role="presentation"><a href="#noc" aria-controls="noc" role="tab" data-toggle="tab">Noc</a></li>
<li role="presentation"><a href="#informacje" aria-controls="informacje" role="tab" data-toggle="tab">Informacje</a></li>
</ul><br>
<div class="tab-content">
<div role="tabpanel" class="tab-pane  in active" id="dzien">
<div class="row" style="height: 50px; margin-bottom: 15px">
<div class="col-xs-3" style=" height: 100%; "></div>
<div class="col-xs-2">
<p style="margin: 0;font-size: 17px;display: inline-block;background: #eaeaea;padding: 15px;border-radius: 7px;">1-3</p>
</div>
<div class="col-xs-2">
<p style="margin: 0;font-size: 17px;display: inline-block;background: #eaeaea;padding: 15px;border-radius: 7px;">4-15</p>
</div>
<div class="col-xs-2">
<p style="margin: 0;font-size: 17px;display: inline-block;background: #eaeaea;padding: 15px;border-radius: 7px;">16-`+(config.maxLapanyLvl-1)+`</p>
</div>
<div class="col-xs-2">
<p style="margin: 0;font-size: 17px;display: inline-block;background: #eaeaea;padding: 15px;border-radius: 7px;">`+config.maxLapanyLvl+`</p>
</div>
</div>
<div class="row" style="height: 50px; margin-bottom: 15px">
<div class="col-xs-3" style=" height: 100%; "> <p style="margin: 0;font-size: 17px;display: block;background: #eaeaea;padding: 15px;border-radius: 7px;">Trudność I</p> </div>
<div class="col-xs-2">
<div class="changePokeball" data-type="dzien" id="pokeballConfigIdDzien11">
</div>
</div>
<div class="col-xs-2">
<div class="changePokeball" data-type="dzien" id="pokeballConfigIdDzien12">
</div>
</div>
<div class="col-xs-2">
<div class="changePokeball" data-type="dzien" id="pokeballConfigIdDzien14">
</div>
</div>
<div class="col-xs-2">
<div class="changePokeball" data-type="dzien" id="pokeballConfigIdDzien13">
</div>
</div>
</div>
<div class="row" style="height: 50px; margin-bottom: 15px">
<div class="col-xs-3" style=" height: 100%; "> <p style="margin: 0;font-size: 17px;display: block;background: #eaeaea;padding: 15px;border-radius: 7px;">Trudność II</p> </div>
<div class="col-xs-2">
<div class="changePokeball" data-type="dzien" id="pokeballConfigIdDzien21">
</div>
</div>
<div class="col-xs-2">
<div class="changePokeball" data-type="dzien" id="pokeballConfigIdDzien22">
</div>
</div>
<div class="col-xs-2">
<div class="changePokeball" data-type="dzien" id="pokeballConfigIdDzien24">
</div>
</div>
<div class="col-xs-2">
<div class="changePokeball" data-type="dzien" id="pokeballConfigIdDzien23">
</div>
</div>
</div>
<div class="row" style="height: 50px; margin-bottom: 15px">
<div class="col-xs-3" style=" height: 100%; "> <p style="margin: 0;font-size: 17px;display: block;background: #eaeaea;padding: 15px;border-radius: 7px;">Trudność III</p> </div>
<div class="col-xs-2">
<div class="changePokeball" data-type="dzien" id="pokeballConfigIdDzien31">
</div>
</div>
<div class="col-xs-2">
<div class="changePokeball" data-type="dzien" id="pokeballConfigIdDzien32">
</div>
</div>
<div class="col-xs-2">
<div class="changePokeball" data-type="dzien" id="pokeballConfigIdDzien34">
</div>
</div>
<div class="col-xs-2">
<div class="changePokeball" data-type="dzien" id="pokeballConfigIdDzien33">
</div>
</div>
</div>
<div class="row" style="height: 50px; margin-bottom: 15px">
<div class="col-xs-3" style=" height: 100%; "> <p style="margin: 0;font-size: 17px;display: block;background: #eaeaea;padding: 15px;border-radius: 7px;">Trudność IV</p> </div>
<div class="col-xs-2">
<div class="changePokeball" data-type="dzien" id="pokeballConfigIdDzien41">
</div>
</div>
<div class="col-xs-2">
<div class="changePokeball" data-type="dzien" id="pokeballConfigIdDzien42">
</div>
</div>
<div class="col-xs-2">
<div class="changePokeball" data-type="dzien" id="pokeballConfigIdDzien44">
</div>
</div>
<div class="col-xs-2">
<div class="changePokeball" data-type="dzien" id="pokeballConfigIdDzien43">
</div>
</div>
</div>
<div class="row" style="height: 50px; margin-bottom: 15px">
<div class="col-xs-3" style=" height: 100%; "> <p style="margin: 0;font-size: 17px;display: block;background: #eaeaea;padding: 15px;border-radius: 7px;">Trudność V</p> </div>
<div class="col-xs-2">
<div class="changePokeball" data-type="dzien" id="pokeballConfigIdDzien51">
</div>
</div>
<div class="col-xs-2">
<div class="changePokeball" data-type="dzien" id="pokeballConfigIdDzien52">
</div>
</div>
<div class="col-xs-2">
<div class="changePokeball" data-type="dzien" id="pokeballConfigIdDzien54">
</div>
</div>
<div class="col-xs-2">
<div class="changePokeball" data-type="dzien" id="pokeballConfigIdDzien53">
</div>
</div>
</div>

<div class="row">
<div class="col-xs-10">
</div>
<div class="col-xs-2">
<button data-type="dzien" class="zapiszconfigi btn btn-success">Zapisz</button>
</div>
</div>

<div class="row" style="margin-top: 20px">
<div class="col-xs-1">
</div>
<div class="col-xs-10">
<pre class="printConfig" data-type="dzien" style="background: #eaeaea; display: none;">
</pre>
</div>
</div>

</div>
<div role="tabpanel" class="tab-pane fade" id="noc">

<div class="row" style="height: 50px; margin-bottom: 15px">
<div class="col-xs-3" style=" height: 100%; "></div>
<div class="col-xs-2">
<p style="margin: 0;font-size: 17px;display: inline-block;background: #eaeaea;padding: 15px;border-radius: 7px;">1-3</p>
</div>
<div class="col-xs-2">
<p style="margin: 0;font-size: 17px;display: inline-block;background: #eaeaea;padding: 15px;border-radius: 7px;">4-15</p>
</div>
<div class="col-xs-2">
<p style="margin: 0;font-size: 17px;display: inline-block;background: #eaeaea;padding: 15px;border-radius: 7px;">16-`+(config.maxLapanyLvl-1)+`</p>
</div>
<div class="col-xs-2">
<p style="margin: 0;font-size: 17px;display: inline-block;background: #eaeaea;padding: 15px;border-radius: 7px;">`+config.maxLapanyLvl+`</p>
</div>
</div>
<div class="row" style="height: 50px; margin-bottom: 15px">
<div class="col-xs-3" style=" height: 100%; "> <p style="margin: 0;font-size: 17px;display: block;background: #eaeaea;padding: 15px;border-radius: 7px;">Trudność I</p> </div>
<div class="col-xs-2">
<div class="changePokeball" data-type="noc" id="pokeballConfigIdNoc11">
</div>
</div>
<div class="col-xs-2">
<div class="changePokeball" data-type="noc" id="pokeballConfigIdNoc12">
</div>
</div>
<div class="col-xs-2">
<div class="changePokeball" data-type="noc" id="pokeballConfigIdNoc14">
</div>
</div>
<div class="col-xs-2">
<div class="changePokeball" data-type="noc" id="pokeballConfigIdNoc13">
</div>
</div>
</div>
<div class="row" style="height: 50px; margin-bottom: 15px">
<div class="col-xs-3" style=" height: 100%; "> <p style="margin: 0;font-size: 17px;display: block;background: #eaeaea;padding: 15px;border-radius: 7px;">Trudność II</p> </div>
<div class="col-xs-2">
<div class="changePokeball" data-type="noc" id="pokeballConfigIdNoc21">
</div>
</div>
<div class="col-xs-2">
<div class="changePokeball" data-type="noc" id="pokeballConfigIdNoc22">
</div>
</div>
<div class="col-xs-2">
<div class="changePokeball" data-type="noc" id="pokeballConfigIdNoc24">
</div>
</div>
<div class="col-xs-2">
<div class="changePokeball" data-type="noc" id="pokeballConfigIdNoc23">
</div>
</div>
</div>
<div class="row" style="height: 50px; margin-bottom: 15px">
<div class="col-xs-3" style=" height: 100%; "> <p style="margin: 0;font-size: 17px;display: block;background: #eaeaea;padding: 15px;border-radius: 7px;">Trudność III</p> </div>
<div class="col-xs-2">
<div class="changePokeball" data-type="noc" id="pokeballConfigIdNoc31">
</div>
</div>
<div class="col-xs-2">
<div class="changePokeball" data-type="noc" id="pokeballConfigIdNoc32">
</div>
</div>
<div class="col-xs-2">
<div class="changePokeball" data-type="noc" id="pokeballConfigIdNoc34">
</div>
</div>
<div class="col-xs-2">
<div class="changePokeball" data-type="noc" id="pokeballConfigIdNoc33">
</div>
</div>
</div>
<div class="row" style="height: 50px; margin-bottom: 15px">
<div class="col-xs-3" style=" height: 100%; "> <p style="margin: 0;font-size: 17px;display: block;background: #eaeaea;padding: 15px;border-radius: 7px;">Trudność IV</p> </div>
<div class="col-xs-2">
<div class="changePokeball" data-type="noc" id="pokeballConfigIdNoc41">
</div>
</div>
<div class="col-xs-2">
<div class="changePokeball" data-type="noc" id="pokeballConfigIdNoc42">
</div>
</div>
<div class="col-xs-2">
<div class="changePokeball" data-type="noc" id="pokeballConfigIdNoc44">
</div>
</div>
<div class="col-xs-2">
<div class="changePokeball" data-type="noc" id="pokeballConfigIdNoc43">
</div>
</div>
</div>
<div class="row" style="height: 50px; margin-bottom: 15px">
<div class="col-xs-3" style=" height: 100%; "> <p style="margin: 0;font-size: 17px;display: block;background: #eaeaea;padding: 15px;border-radius: 7px;">Trudność V</p> </div>
<div class="col-xs-2">
<div class="changePokeball" data-type="noc" id="pokeballConfigIdNoc51">
</div>
</div>
<div class="col-xs-2">
<div class="changePokeball" data-type="noc" id="pokeballConfigIdNoc52">
</div>
</div>
<div class="col-xs-2">
<div class="changePokeball" data-type="noc" id="pokeballConfigIdNoc54">
</div>
</div>
<div class="col-xs-2">
<div class="changePokeball" data-type="noc" id="pokeballConfigIdNoc53">
</div>
</div>
</div>

<div class="row">
<div class="col-xs-10">
</div>
<div class="col-xs-2">
<button data-type="noc" class="zapiszconfigi btn btn-success">Zapisz</button>
</div>
</div>

<div class="row" style="margin-top: 20px">
<div class="col-xs-1">
</div>
<div class="col-xs-10">
<pre class="printConfig" data-type="noc" style="background: #eaeaea; display: none;">
</pre>
</div>
</div>

</div>
<div role="tabpanel" class="tab-pane fade" id="informacje">
<div class="row" style="margin-bottom: 20px;">
<div class="col-xs-12">
<b>Q: Co w przypadku safari?</b> Od teraz bot wie że jest w dziczy safarii i będzie uzywał w niej safariballa bez konieczności wyboru go w panelu. W przypadku opcji Łap safariballem tylko niezłapane pokemony będzie rzucał safariballe w niezłapane a pozostałe pomijał. W przypadku odznaczenia tej opcji rzuca w każdego pokeballa aż zostanie mu tylko jeden safariball. Póżniej juz pomija wszystkie pokemony.
</div>
</div>
<div class="row" style="margin-bottom: 20px;">
<div class="col-xs-12">
<b>Q: Co się stanie w przypadku braku pokeballa którego powinien rzucić?</b> Bot zatrzyma sie i poinformuje o brak odpowiedniego pokeballa.
</div>
</div>
<div class="row" style="margin-bottom: 20px;">
<div class="col-xs-12">
<b>Q: Co gdy mam wybrane Rzucaj cherishballe w niezłapane IV i V?</b> Po wybraniu tej opcji bot ignoruje ustawienia pokeballi dla niezłapanych IV i V i rzuca w nie cherishballe. Dla innych niezłapanych postępuje zgodnie z ustawieniami. W przypadku opcji Nie zatrzymuj rzuca zawsze zgodnie z ustawieniami pokeballi.
</div>
</div>
<div class="row" style="margin-bottom: 20px;">
<div class="col-xs-12">
<b>Q: Co oznacza ikonka przekreślonego pokeballa?</b> W tym przypadku bot pomija akcje i przechodzi do kolejnej wyprawy.
</div>
</div>
<div class="row" style="margin-bottom: 20px;">
<div class="col-xs-12">
<b>Q: Ile swarmballi będzie rzucał bot po wybraniu tej opcji?</b> Rzuca 1 swarmballa więc zaleca się ich używanie dla niskich poziomów
</div>
</div>
</div>

</div>
`);


                    var pokeballs = [];
                    pokeballs.push({
                        'iconFilePath': "images/pokesklep/pokeballe.jpg",
                        'iconValue': function() {
                            return '&zlap_pokemona=pokeballe'
                        }
                    });
                    pokeballs.push({
                        'iconFilePath': "images/pokesklep/nestballe.jpg",
                        'iconValue': function() {
                            return '&zlap_pokemona=nestballe'
                        }
                    });
                    pokeballs.push({
                        'iconFilePath': "images/pokesklep/greatballe.jpg",
                        'iconValue': function() {
                            return '&zlap_pokemona=greatballe'
                        }
                    });
                    pokeballs.push({
                        'iconFilePath': "images/pokesklep/friendballe.jpg",
                        'iconValue': function() {
                            return '&zlap_pokemona=friendballe'
                        }
                    });
                    pokeballs.push({
                        'iconFilePath': "images/pokesklep/nightballe.jpg",
                        'iconValue': function() {
                            return '&zlap_pokemona=nightballe'
                        }
                    });
                    pokeballs.push({
                        'iconFilePath': "images/pokesklep/lureballe.jpg",
                        'iconValue': function() {
                            return '&zlap_pokemona=lureballe'
                        }
                    });
                    pokeballs.push({
                        'iconFilePath': "images/pokesklep/levelballe.jpg",
                        'iconValue': function() {
                            return '&zlap_pokemona=levelballe'
                        }
                    });
                    pokeballs.push({
                        'iconFilePath': "images/pokesklep/luxuryballe.jpg",
                        'iconValue': function() {
                            return '&zlap_pokemona=luxuryballe'
                        }
                    });
                    pokeballs.push({
                        'iconFilePath': "images/pokesklep/premierballe.jpg",
                        'iconValue': function() {
                            return '&zlap_pokemona=premierballe'
                        }
                    });
                    pokeballs.push({
                        'iconFilePath': "images/pokesklep/cherishballe.jpg",
                        'iconValue': function() {
                            return '&zlap_pokemona=cherishballe'
                        }
                    });
                    pokeballs.push({
                        'iconFilePath': "https://raw.githubusercontent.com/krozum/pokelife/master/assets/pokesklep/empty.png",
                        'iconValue': function() {
                            return 'empty'
                        }
                    });
                    pokeballs.push({
                        'iconFilePath': "images/pokesklep/ultraballe.jpg",
                        'iconValue': function() {
                            return '&zlap_pokemona=ultraballe'
                        }
                    });
                    pokeballs.push({
                        'iconFilePath': "images/pokesklep/swarmballe.jpg",
                        'iconValue': function() {
                            return '&zlap_pokemona=uzyj_swarmballe'
                        }
                    });

                    $.each($('.changePokeball'), function(index, item) {
                        var id = $(item).attr('id');

                        var ic = new IconSelect(id, {
                            'selectedIconWidth': 48,
                            'selectedIconHeight': 48,
                            'selectedBoxPadding': 1,
                            'iconsWidth': 48,
                            'iconsHeight': 48,
                            'boxIconSpace': 1,
                            'vectoralIconNumber': 1,
                            'horizontalIconNumber': 6
                        });
                        ic.refresh(pokeballs);


                        var type = $("#"+id).data('type');
                        var typeC = "Noc";
                        if(type == "dzien"){
                            typeC = "Dzien";
                        }

                        var pokeball = config[type]["data" + id.split(typeC)[1]];


                        switch(pokeball){
                            case "pokeballe":
                                ic.setSelectedIndex(0);
                                break;
                            case "nestballe":
                                ic.setSelectedIndex(1);
                                break;
                            case "greatballe":
                                ic.setSelectedIndex(2);
                                break;
                            case "friendballe":
                                ic.setSelectedIndex(3);
                                break;
                            case "nightballe":
                                ic.setSelectedIndex(4);
                                break;
                            case "lureballe":
                                ic.setSelectedIndex(5);
                                break;
                            case "levelballe":
                                ic.setSelectedIndex(6);
                                break;
                            case "luxuryballe":
                                ic.setSelectedIndex(7);
                                break;
                            case "premierballe":
                                ic.setSelectedIndex(8);
                                break;
                            case "cherishballe":
                                ic.setSelectedIndex(9);
                                break;
                            case "empty":
                                ic.setSelectedIndex(10);
                                break;
                            case "ultraballe":
                                ic.setSelectedIndex(11);
                                break;
                            case "swarmballe":
                                ic.setSelectedIndex(12);
                                break;
                        }
                    });


                    $(document).off("click", ".zapiszconfigi");
                    $(document).on("click", ".zapiszconfigi", function() {
                        var type = $(this).data('type');
                        var typeC = "Noc";
                        if(type == "dzien"){
                            typeC = "Dzien";
                        }
                        config[type].data11 = $('#pokeballConfigId'+typeC+'11 img').attr('src').split('pokesklep/')[1].split('.')[0].trim();
                        config[type].data12 = $('#pokeballConfigId'+typeC+'12 img').attr('src').split('pokesklep/')[1].split('.')[0].trim();
                        config[type].data13 = $('#pokeballConfigId'+typeC+'13 img').attr('src').split('pokesklep/')[1].split('.')[0].trim();
                        config[type].data14 = $('#pokeballConfigId'+typeC+'14 img').attr('src').split('pokesklep/')[1].split('.')[0].trim();
                        config[type].data21 = $('#pokeballConfigId'+typeC+'21 img').attr('src').split('pokesklep/')[1].split('.')[0].trim();
                        config[type].data22 = $('#pokeballConfigId'+typeC+'22 img').attr('src').split('pokesklep/')[1].split('.')[0].trim();
                        config[type].data23 = $('#pokeballConfigId'+typeC+'23 img').attr('src').split('pokesklep/')[1].split('.')[0].trim();
                        config[type].data24 = $('#pokeballConfigId'+typeC+'24 img').attr('src').split('pokesklep/')[1].split('.')[0].trim();
                        config[type].data31 = $('#pokeballConfigId'+typeC+'31 img').attr('src').split('pokesklep/')[1].split('.')[0].trim();
                        config[type].data32 = $('#pokeballConfigId'+typeC+'32 img').attr('src').split('pokesklep/')[1].split('.')[0].trim();
                        config[type].data33 = $('#pokeballConfigId'+typeC+'33 img').attr('src').split('pokesklep/')[1].split('.')[0].trim();
                        config[type].data34 = $('#pokeballConfigId'+typeC+'34 img').attr('src').split('pokesklep/')[1].split('.')[0].trim();
                        config[type].data41 = $('#pokeballConfigId'+typeC+'41 img').attr('src').split('pokesklep/')[1].split('.')[0].trim();
                        config[type].data42 = $('#pokeballConfigId'+typeC+'42 img').attr('src').split('pokesklep/')[1].split('.')[0].trim();
                        config[type].data43 = $('#pokeballConfigId'+typeC+'43 img').attr('src').split('pokesklep/')[1].split('.')[0].trim();
                        config[type].data44 = $('#pokeballConfigId'+typeC+'44 img').attr('src').split('pokesklep/')[1].split('.')[0].trim();
                        config[type].data51 = $('#pokeballConfigId'+typeC+'51 img').attr('src').split('pokesklep/')[1].split('.')[0].trim();
                        config[type].data52 = $('#pokeballConfigId'+typeC+'52 img').attr('src').split('pokesklep/')[1].split('.')[0].trim();
                        config[type].data53 = $('#pokeballConfigId'+typeC+'53 img').attr('src').split('pokesklep/')[1].split('.')[0].trim();
                        config[type].data54 = $('#pokeballConfigId'+typeC+'54 img').attr('src').split('pokesklep/')[1].split('.')[0].trim();

                        updateConfig(config, function(){ $('#settingsPokeball').remove() });
                    })
                }
            })
        }
        initPokeballIcon();


        function getPokeball() {
            var miejsce = $(previousPageContent).find('button[href*="dzicz.php?miejsce="]').attr('href').split("&")[0].split('miejsce=')[1].trim();
            if(miejsce == "meteorytowa_gora" || miejsce == "park_narodowy" || miejsce == "wielkie_bagna" || miejsce == "reliktowy_zamek" || miejsce == "safari" || miejsce == "przyjazne_safari"){
                switch(Number(config.safariMode)){
                    case 1:
                        if(isNiezlapany()){
                            zatrzymajAutoGo("Spotkany niezłapany pokemon", true);
                        } else {
                            $('button:contains("Pomiń i szukaj dalej")').click();
                        }
                        return "";
                        break;
                    case 2:
                        if(isNiezlapany()){
                            if ($('label[data-original-title="Safariball"]').length > 0) {
                                if (Number($('label[data-original-title="Safariball"]').html().split('">')[1].trim()) > 1) {
                                    return '&zlap_pokemona=safariballe';
                                } else {
                                    $('button:contains("Pomiń i szukaj dalej")').click();
                                    return "";
                                }
                            } else {
                                zatrzymajAutoGo("Brak odpowiedniego pokeballa", true);
                            }
                        } else {
                            $('button:contains("Pomiń i szukaj dalej")').click();
                            return "";
                        }
                        break;
                    case 3:
                        if ($('label[data-original-title="Safariball"]').length > 0) {
                            if (Number($('label[data-original-title="Safariball"]').html().split('">')[1].trim()) > 1) {
                                return '&zlap_pokemona=safariballe';
                            } else {
                                $('button:contains("Pomiń i szukaj dalej")').click();
                                return "";
                            }
                        } else {
                            zatrzymajAutoGo("Brak odpowiedniego pokeballa", true);
                        }
                        break;

                }
            } else {
                if(Number(config.niezlapaneMode) == 4){
                    if(isNiezlapany()){
                        return '&zlap_pokemona=cherishballe';
                    }
                }
                if ($(previousPageContent).find('h2:contains("Wybierz Pokemona")').length > 0 && $(previousPageContent).find('.panel-body.nopadding').attr('style').indexOf("background-color: #FFBB") == -1) {
                    if(Number(config.shinyMode) == 3){
                        return '&zlap_pokemona=cherishballe';
                    }
                }

                var d = new Date();
                var h = d.getHours();
                var type = "dzien";
                if (h >= 22 || h < 6) {
                    type = "noc";
                }
                let pokeLvlNumber = $('#glowne_okno i:nth("1")').parent().html().split("(")[1].split(" poz")[0];

                let lvlType = 4;
                if (pokeLvlNumber == config.maxLapanyLvl){
                    lvlType = 3;
                } else if (pokeLvlNumber <= 3) {
                    lvlType = 1;
                } else if (pokeLvlNumber <= 15) {
                    lvlType = 2;
                }
                let trudnoscType = 1;
                if($(previousPageContent).find('.panel-body.nopadding img[src="images/trudnosc/trudnosc5.png"]').length > 0){
                    trudnoscType = 5;
                } else if($(previousPageContent).find('.panel-body.nopadding img[src="images/trudnosc/trudnosc4.png"]').length > 0){
                    trudnoscType = 4;
                } else if($(previousPageContent).find('.panel-body.nopadding img[src="images/trudnosc/trudnosc3.png"]').length > 0){
                    trudnoscType = 3;
                } else if($(previousPageContent).find('.panel-body.nopadding img[src="images/trudnosc/trudnosc2.png"]').length > 0){
                    trudnoscType = 2;
                }

                var pokeball = config[type]["data" + trudnoscType + lvlType];

                if(pokeball == "empty"){
                    $('button:contains("Pomiń i szukaj dalej")').click();
                    return "";
                } else {

                    if (pokeball == "greatballe") {
                        pokeball = "greatballee";
                    }
                    if (pokeball == "swarmballe") {
                        pokeball = "uzyj_swarmballe";
                    }

                    return '&zlap_pokemona=' + pokeball;
                }
            }
        }

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
            $.each($('#pasek_skrotow li'), function(index, item) {
                if ($(item).find('a').attr('href') != "#" && $(item).find('a').attr('href').substring(0, 9) == "gra/dzicz") {
                    icons.push({
                        'iconFilePath': $(item).find('img').attr('src'),
                        'iconValue': function() {
                            return $(item).find('a').attr('href').substring(28)
                        }
                    });
                }
            });

            AutoGoSettings.iconLocation.refresh(icons);
            AutoGoSettings.iconLocation.setSelectedIndex(config.locationIconsIndex);

            document.getElementById('setLocation').addEventListener('changed', function(e) {
                config.locationIconsIndex = AutoGoSettings.iconLocation.getSelectedIndex();
                updateConfig(config);
            });
        }
        initLocationIcon();

        function click(poLeczeniu) {
            addClickToMetrics();
            initCanvas();

            var miejsce;

            if (poLeczeniu != true) {
                poLeczeniu = false;
            }
            var canRun = true;

            if (blocked) {
                console.log('blocked');
                canRun = false;
            } else {
                blocked = true;
                window.setTimeout(function() { blocked = false }, clickDelay);
            }

            var minHealth = 100;

            $('.stan-pokemon div.progress:first-of-type .progress-bar').each(function(index) {
                var now = $(this).attr("style").replace(/^\D+/g, '').replace('%', '').replace(';', '');
                if (minHealth > Number(now)) {
                    minHealth = Number(now);
                }
            });

            if (Number(minHealth) < Number(minToHeal)) {
                if (!poLeczeniu) {

                    var healOption = 'gra/lecznica.php?wylecz_wszystkie&tylko_komunikat'

                    if (config.useCzerwoneJagody == "true" || config.useCzerwoneJagody == true) {
                        healOption = 'gra/plecak.php?uzyj&rodzaj_przedmiotu=czerwone_jagody&tylko_komunikat&ulecz_wszystkie&zjedz_max'
                    }

                    $.get(healOption, function(data) {

                        if ($(data).hasClass("alert-danger")) {
                            console.log('Brak czerwonych jagód');
                            config.useCzerwoneJagody = false;
                            updateConfig(config);
                            window.setTimeout(function() {
                                if (autoGo) {
                                    click(poLeczeniu)
                                }
                            }, clickDelay);
                        };

                        if ($(data).find(".alert-success").length > 0 || $(data).hasClass("alert-success")) {

                            console.log('PokeLifeScript: wyleczono');

                            if ($(data).find(".alert-success strong").length > 0) {
                                var koszt = $(data).find(".alert-success strong").html().split(" ¥")[0];
                                updateStats("koszty_leczenia", koszt.replace(/\./g, ''));
                            }

                            $.get('inc/stan.php', function(data) {
                                $("#sidebar").html(data);
                                $('.btn-wybor_pokemona').attr("disabled", false);
                                $('.btn-wybor_pokemona .progress-bar').css("width", "100%");
                                $('.btn-wybor_pokemona .progress-bar span').html("100% PŻ");
                                window.setTimeout(function() {
                                    if (autoGo) {
                                        click(true)
                                    }
                                }, clickDelay);
                            });
                        }
                    });
                }
                canRun = false;
            }

            if (canRun) {
                if ($('#glowne_okno .panel-heading').length > 0) {
                    if ($('#glowne_okno').find(".panel-heading:contains('Dzienne Przeliczenie')").length > 0) {
                        console.log('%cPokeLifeScript: Dzienne Przeliczenie, przerwanie AutoGo', 'color: #cb404b');
                        autoGo = false;
                        $('#goAutoButton').html('AutoGO');
                        $('.dynamicsparkline').hide()
                        $("#goStopReason").html("Dzienne Przeliczenie").show();
                        document.title = "Dzienne Przeliczenie";
                    } else if ($('#glowne_okno').find(".alert-danger:contains('Nie możesz wyruszać w inne miejsca przebywając')").length > 0) {
                        console.log('%cPokeLifeScript: Jesteś w dziczy weekendowej, przerwanie AutoGo', 'color: #cb404b');
                        autoGo = false;
                        $('#goAutoButton').html('AutoGO');
                        $('.dynamicsparkline').hide()
                        $("#goStopReason").html("Jesteś w dziczy weekendowej").show();
                        document.title = "Jesteś w dziczy weekendowej";
                    } else if ($('#glowne_okno').find(".panel-heading:contains('Łapanie Jajka')").length > 0) {
                        console.log('%cPokeLifeScript: idę do dziczy ' + AutoGoSettings.iconLocation.getSelectedValue().call() + ".", 'color: #cb404b');
                        $('#pasek_skrotow a[href="gra/dzicz.php?poluj&miejsce=' + AutoGoSettings.iconLocation.getSelectedValue().call() + '"] img').trigger('click');
                    } else if ($('h2:contains("Wybierz Pokemona")').length > 0 && $('.panel-body.nopadding').attr('style').indexOf("background-color: #FFBB") == -1) {
                        requestDomain("pokelife/api/update_shiny.php?pokemon_name=" + $('.panel-body.nopadding i').html().trim() + "&login=" + $('#wyloguj').parent().parent().html().split("<div")[0].trim() + "&time=" + Date.now(), null);
                        $('#refreshShinyWidget').trigger('click');
                        switch(Number(config.shinyMode)){
                            case 1:
                                zatrzymajAutoGo("Spotkany shiny pokemon", true);
                                break;
                            case 2:
                            case 3:
                                console.log('%cPokeLifeScript: spotkany Shiny', 'color: #cb404b');
                                atakujPokemona();
                                break;
                        }
                    } else if ($('h2:contains("Wybierz Pokemona")').length && isNiezlapany() && $('.panel-body.nopadding img[src="images/trudnosc/trudnoscx.png"]').length < 1 && $('.panel-body.nopadding .col-xs-9 > b').html().split("Poziom: ")[1] <= config.maxLapanyLvl) {
                        miejsce = $('button[href*="dzicz.php?miejsce="]').attr('href').split("&")[0].split('miejsce=')[1].trim();
                        if(miejsce == "meteorytowa_gora" || miejsce == "park_narodowy" || miejsce == "wielkie_bagna" || miejsce == "reliktowy_zamek" || miejsce == "safari" || miejsce == "przyjazne_safari"){
                            switch(Number(config.safariMode)){
                                case 1:
                                    zatrzymajAutoGo("Spotkany niezłapany pokemon", true);
                                    break;
                                case 2:
                                case 3:
                                    atakujPokemona();
                                    break;
                            }
                        } else {
                            switch(Number(config.niezlapaneMode)){
                                case 1:
                                    zatrzymajAutoGo("Spotkany niezłapany pokemon", true);
                                    break;
                                case 2:
                                    if($('.panel-body.nopadding img[src="images/trudnosc/trudnosc4.png"]').length > 0 || $('.panel-body.nopadding img[src="images/trudnosc/trudnosc5.png"]').length > 0){
                                        zatrzymajAutoGo("Spotkany niezłapany pokemon", true);
                                    } else {
                                        console.log('%cPokeLifeScript: spotkany niezłapany pokemona', 'color: #cb404b');
                                        atakujPokemona();
                                    }
                                    break;
                                case 3:
                                case 4:
                                    console.log('%cPokeLifeScript: spotkany niezłapany pokemona', 'color: #cb404b');
                                    atakujPokemona();
                                    break;
                            }
                        }
                    } else if ($('h2:contains("Wybierz Pokemona")').length == 1) {
                        atakujPokemona();
                    } else if ($("form[action='dzicz.php?zlap']").length == 1) {
                        if (getPokeball() !== "") {
                            var button = $('label[href="dzicz.php?miejsce=' + AutoGoSettings.iconLocation.getSelectedValue().call() + getPokeball() + '"]');
                            if (button.length > 0) {
                                console.log('%cPokeLifeScript: rzucam pokeballa', 'color: #cb404b');
                                $('label[href="dzicz.php?miejsce=' + AutoGoSettings.iconLocation.getSelectedValue().call() + getPokeball() + '"]').trigger('click');
                            } else {
                                zatrzymajAutoGo("Brak odpowiedniego pokeballa", true);
                            }
                        }
                    } else if ($("form[action='dzicz.php?zlap_pokemona=swarmballe&miejsce=" + AutoGoSettings.iconLocation.getSelectedValue().call() + "']").length == 1) {
                        console.log('%cPokeLifeScript: rzucam 1 swarmballa', 'color: #cb404b');
                        $("form[action='dzicz.php?zlap_pokemona=swarmballe&miejsce=" + AutoGoSettings.iconLocation.getSelectedValue().call() + "']").submit();
                    } else {
                        console.log('%cPokeLifeScript: idę do dziczy ' + AutoGoSettings.iconLocation.getSelectedValue().call() + ".", 'color: #cb404b');
                        $('#pasek_skrotow a[href="gra/dzicz.php?poluj&miejsce=' + AutoGoSettings.iconLocation.getSelectedValue().call() + '"] img').trigger('click');
                    }
                } else {
                    if($('#glowne_okno p:contains("Nie możesz podróżować po dziczy, ponieważ wszystkie twoje pokemony są ranne! Musisz je najpierw wyleczyć.")').length > 0){
                        $('#glowne_okno button[href="dzicz.php?poluj&miejsce=laka"]').trigger('click');
                    }
                }
            }
        }

        function zatrzymajAutoGo(reason, makeVoice){
            console.log('PokeLifeScript: ' + reason + ', przerwanie AutoGo');
            autoGo = false;
            $('#goAutoButton').html('AutoGO');
            $('.dynamicsparkline').hide()
            $("#goStopReason").html(reason).show();
            document.title = reason;
            if(makeVoice == true || makeVoice == "true"){
                triggerSound();
            }
        }

        function atakujPokemona(){
            console.log('%cPokeLifeScript: atakuje pokemona', 'color: #cb404b');
            var url = "dzicz.php?miejsce=" + AutoGoSettings.iconLocation.getSelectedValue().call() + AutoGoSettings.iconPokemon.getSelectedValue().call();
            if ($('button[href="' + url + '"]').length == 0) {
                autoGo = false;
                $('#goAutoButton').html('AutoGO');
                $('.dynamicsparkline').hide()
                $("#goStopReason").html("Dzicz została zmieniona").show();
                document.title = "Dzicz została zmieniona";
            } else {
                $('button[href="' + url + '"]').trigger('click');
            }
        }


        function isNiezlapany(){
            return ($(previousPageContent).find('.panel-body.nopadding img[src="images/inne/pokeball_miniature2.png"]').length > 0) || ($('.panel-body.nopadding img[src="images/inne/pokeball_miniature2.png"]').length > 0);
        }

        $(document).on("change", ".list_of_poks_in_team", function(event) {
            var orderId = $(this).data('order-id');
            if (orderId == 20) {
                config.pok20 = Number($(this).val());
            }
            if (orderId == 40) {
                config.pok40 = Number($(this).val());
            }
            if (orderId == 60) {
                config.pok60 = Number($(this).val());
            }
            if (orderId == 80) {
                config.pok80 = Number($(this).val());
            }
            if (orderId == 100) {
                config.pok100 = Number($(this).val());
            }
            updateConfig(config);
        });

        $(document).on("click", "#goButton", function() {
            click();
        });

        $(document).on("click", '#goAutoButton', function() {
            if (autoGo) {
                autoGo = false;
                autoGoWznawianie = false;
                $('#goAutoButton').html('AutoGO');
                $('.dynamicsparkline').hide();
            } else {
                autoGo = true;
                autoGoWznawianie = false;
                $('#goAutoButton').html('STOP');
                clicksPer10SecondsArray = [0,0,0,0,0,0,0,0,0,0];
                $('.dynamicsparkline').show();
                click();
            }
        });

        $(window).keypress(function(e) {
            if (e.key === ' ' || e.key === 'Spacebar') {
                if ($('input:focus').length == 0 && $('textarea:focus').length == 0 && $('#glowne_okno .panel-heading').length == 0) {
                    e.preventDefault();
                    click();
                } else if ($('input:focus').length == 0 && $('textarea:focus').length == 0 && $('#glowne_okno .panel-heading').html() !== "Poczta" && $('#glowne_okno .panel-heading').html() !== "Opcje Konta" && !$('#glowne_okno .panel-heading').text().trim().startsWith("Stowarzyszenie")) {
                    e.preventDefault();
                    click();
                }
            }
        });

        onReloadMain(function() {
            if (autoGo && !autoGoWznawianie) {
                if (this.find(".panel-body > p.alert-danger").length > 0) {
                    console.log(this.find('.panel-body > p.alert-danger').html());
                    if (this.find(".panel-body > p.alert-danger:contains('Posiadasz za mało punktów akcji')").length > 0) {
                        przerwijAutoGoZPowoduBrakuPA(true);
                    } else if (this.find(".panel-body > p.alert-danger:contains('Nie masz wystarczającej ilości Punktów Akcji')").length > 0) {
                        przerwijAutoGoZPowoduBrakuPA(true);
                    } else if (this.find('.panel-body > p.alert-danger').html() == "Nie masz wystarczającej ilośći Punktów Akcji.") {
                        przerwijAutoGoZPowoduBrakuPA(true);
                    } else if (this.find('.panel-body > p.alert-danger').html() == "Baterie w twojej latarce się wyczerpały, kup nowe.") {
                        przerwijAutoGoZPowoduBrakuPA(false);
                        $("#goStopReason").html("Brak baterii").show();
                        document.title = "Brak baterii";
                    }
                }
            }
        })


        function probujWznowicAutoGo(array, autoGoBefore) {
            if (autoGoBefore) {
                if (array.length > 0) {
                    var text = array.pop();
                    switch (text) {
                        case "useNiebieskieJagody":
                            console.log('Próbuje przywrócić PA za pomocą niebieskich jagód');
                            if ($("a[href='gra/statystyki.php']").length > 0 && autoGo) {
                                reloadMain("#glowne_okno", "gra/statystyki.php", function() {
                                    window.setTimeout(function() {
                                        if ($("#statystyki b:contains('Niebieskie Jagody:')").parent().next().html().split('/')[0].trim() != $("#statystyki b:contains('Niebieskie Jagody:')").parent().next().html().split('/')[1].trim()) {
                                            if ($("a[href='gra/plecak.php']").length > 0 && autoGo) {
                                                reloadMain("#glowne_okno", "gra/plecak.php", function() {
                                                    if ($('.thumbnail-plecak img[src="images/pokesklep/niebieskie_jagody.jpg"]').length > 0) {
                                                        var ile = $('.thumbnail-plecak h5:contains("Niebieskie Jagody")').html().split(' x Niebieskie')[0];

                                                        if (ile > 40) {
                                                            ile = 40;
                                                        }
                                                        window.setTimeout(function() {
                                                            if (autoGo) {
                                                                reloadMain("#glowne_okno", "gra/plecak.php?uzyj&p=3&postData%5B0%5D%5Bname%5D=rodzaj_przedmiotu&postData%5B0%5D%5Bvalue%5D=niebieskie_jagody&postData%5B1%5D%5Bname%5D=ilosc&postData%5B1%5D%5Bvalue%5D=" + ile, function() {
                                                                    $('#goAutoButton').html('STOP');
                                                                    console.log('Przywrócono PA');
                                                                    window.setTimeout(function() {
                                                                        if (autoGo) {
                                                                            autoGoWznawianie = false;
                                                                            click();
                                                                        }
                                                                    }, 1000);
                                                                });
                                                            }
                                                        }, 1000);
                                                    } else {
                                                        console.log('Brak jagód');
                                                        window.setTimeout(function() {
                                                            if (autoGo) {
                                                                probujWznowicAutoGo(array, autoGoBefore);
                                                            }
                                                        }, 1000);
                                                    }
                                                })
                                            }
                                        } else {
                                            console.log('Wykorzystałeś limit niebieskich jagód na dzisiaj');
                                            window.setTimeout(function() {
                                                if (autoGo) {
                                                    probujWznowicAutoGo(array, autoGoBefore);
                                                }
                                            }, 1000);
                                        }
                                    }, 1000);
                                });
                            }
                            break;
                        case "useEventoweNapoje":
                            console.log('Próbuje przywrócić PA za pomocą eventowych napojów');
                            if ($("a[href='gra/statystyki.php']").length > 0 && autoGo) {
                                reloadMain("#glowne_okno", "gra/statystyki.php", function() {
                                    window.setTimeout(function() {
                                        if ($("#statystyki button[disabled!='disabled']:contains('Wypij Eventowy Napój Energetyczny')").length > 0) {
                                            window.setTimeout(function() {
                                                if (autoGo) {
                                                    reloadMain("#glowne_okno", "gra/eventowa_wisniowka.php?wypij_eventowa_wisniowke", function() {
                                                        $('#goAutoButton').html('STOP');
                                                        console.log('Przywrócono PA');
                                                        window.setTimeout(function() {
                                                            if (autoGo) {
                                                                autoGoWznawianie = false;
                                                                click();
                                                            }
                                                        }, 1000);
                                                    });
                                                }
                                            }, 1000);
                                        } else {
                                            console.log('Wykorzystałeś limit eventowych napojów na dzisiaj');
                                            window.setTimeout(function() {
                                                if (autoGo) {
                                                    probujWznowicAutoGo(array, autoGoBefore);
                                                }
                                            }, 1000);
                                        }
                                    }, 1000);
                                });
                            }
                            break;
                        case "useZieloneNapoje":
                            console.log('Próbuje przywrócić PA za pomocą zielonych napojów');
                            if ($("a[href='gra/statystyki.php']").length > 0 && autoGo) {
                                reloadMain("#glowne_okno", "gra/statystyki.php", function() {
                                    window.setTimeout(function() {
                                        var ileJuzWypitych = Number($("#statystyki b:contains('Napoje Energetyczne:')").parent().next().html().split('/')[0].trim());
                                        var ileMozna = (Number($("#statystyki b:contains('Napoje Energetyczne:')").parent().next().html().split('/')[1].trim()));
                                        if (ileJuzWypitych < ileMozna) {
                                            if ($("a[href='gra/plecak.php']").length > 0 && autoGo) {
                                                reloadMain("#glowne_okno", "gra/plecak.php", function() {
                                                    if ($('.thumbnail-plecak img[src="images/pokesklep/zielony_napoj.jpg"]').length > 0) {
                                                        window.setTimeout(function() {
                                                            if (autoGo) {
                                                                var maxPA = $('#sidebar .progress-bar:contains(" PA")').attr('aria-valuemax');
                                                                var ile = Math.floor($('#sidebar .progress-bar:contains(" PA")').attr('aria-valuemax') / 100);
                                                                var iloscNapojow = Number($('.thumbnail-plecak[data-target="#plecak-1"] h5').html().split(' x ')[0]);

                                                                var maxDoLimitow = ileMozna - ileJuzWypitych;

                                                                if (ile > iloscNapojow) {
                                                                    ile = iloscNapojow;
                                                                }

                                                                if (ile > maxDoLimitow) {
                                                                    ile = maxDoLimitow;
                                                                }

                                                                reloadMain("#glowne_okno", "gra/plecak.php?uzyj&p=1&postData%5B0%5D%5Bname%5D=rodzaj_przedmiotu&postData%5B0%5D%5Bvalue%5D=zielony_napoj&postData%5B1%5D%5Bname%5D=ilosc&postData%5B1%5D%5Bvalue%5D=" + ile, function() {
                                                                    $('#goAutoButton').html('STOP');
                                                                    console.log('Przywrócono PA');
                                                                    window.setTimeout(function() {
                                                                        if (autoGo) {
                                                                            autoGoWznawianie = false;
                                                                            click();
                                                                        }
                                                                    }, 1000);
                                                                });
                                                            }
                                                        }, 1000);
                                                    } else {
                                                        console.log('Brak napojów');
                                                        window.setTimeout(function() {
                                                            if (autoGo) {
                                                                probujWznowicAutoGo(array, autoGoBefore);
                                                            }
                                                        }, 1000);
                                                    }
                                                })
                                            }
                                        } else {
                                            console.log('Wykorzystałeś limit napojów na dzisiaj');
                                            window.setTimeout(function() {
                                                if (autoGo) {
                                                    probujWznowicAutoGo(array, autoGoBefore);
                                                }
                                            }, 1000);
                                        }
                                    }, 1000);
                                });
                            }
                            break;
                        case "useNiebieskieNapoje":
                            console.log('Próbuje przywrócić PA za pomocą eventowych i zwykłych niebieskich napojów');
                            if ($("a[href='gra/statystyki.php']").length > 0 && autoGo) {
                                reloadMain("#glowne_okno", "gra/statystyki.php", function() {
                                    window.setTimeout(function() {
                                        var ileJuzWypitych = Number($("#statystyki b:contains('Napoje Energetyczne:')").parent().next().html().split('/')[0].trim());
                                        var ileMozna = (Number($("#statystyki b:contains('Napoje Energetyczne:')").parent().next().html().split('/')[1].trim()));
                                        if (ileJuzWypitych < ileMozna) {
                                            if ($("a[href='gra/plecak.php']").length > 0 && autoGo) {
                                                reloadMain("#glowne_okno", "gra/plecak.php", function() {
                                                    if ($('.thumbnail-plecak img[src="images/pokesklep/eventowy_napoj_energetyczny.jpg"]').length > 0) {
                                                        window.setTimeout(function() {
                                                            if (autoGo) {
                                                                reloadMain("#glowne_okno", "gra/plecak.php?uzyj&p=1&postData%5B0%5D%5Bname%5D=rodzaj_przedmiotu&postData%5B0%5D%5Bvalue%5D=eventowy_napoj_energetyczny&postData%5B1%5D%5Bname%5D=ilosc&postData%5B1%5D%5Bvalue%5D=1", function() {
                                                                    $('#goAutoButton').html('STOP');
                                                                    console.log('Przywrócono PA');
                                                                    window.setTimeout(function() {
                                                                        if (autoGo) {
                                                                            autoGoWznawianie = false;
                                                                            click();
                                                                        }
                                                                    }, 1000);
                                                                });
                                                            }
                                                        }, 1000);
                                                    } else if ($('.thumbnail-plecak img[src="images/pokesklep/napoj_energetyczny.jpg"]').length > 0) {
                                                        window.setTimeout(function() {
                                                            if (autoGo) {
                                                                reloadMain("#glowne_okno", "gra/plecak.php?uzyj&p=1&postData%5B0%5D%5Bname%5D=rodzaj_przedmiotu&postData%5B0%5D%5Bvalue%5D=napoj_energetyczny&postData%5B1%5D%5Bname%5D=ilosc&postData%5B1%5D%5Bvalue%5D=1", function() {
                                                                    $('#goAutoButton').html('STOP');
                                                                    console.log('Przywrócono PA');
                                                                    window.setTimeout(function() {
                                                                        if (autoGo) {
                                                                            autoGoWznawianie = false;
                                                                            click();
                                                                        }
                                                                    }, 1000);
                                                                });
                                                            }
                                                        }, 1000);

                                                    }else {
                                                        console.log('Brak napojów');
                                                        window.setTimeout(function() {
                                                            if (autoGo) {
                                                                probujWznowicAutoGo(array, autoGoBefore);
                                                            }
                                                        }, 1000);
                                                    }
                                                })
                                            }
                                        } else {
                                            console.log('Wykorzystałeś limit napojów na dzisiaj');
                                            window.setTimeout(function() {
                                                if (autoGo) {
                                                    probujWznowicAutoGo(array, autoGoBefore);
                                                }
                                            }, 1000);
                                        }
                                    }, 1000);
                                });
                            }
                            break;
                        case "useFontanna":
                            console.log('Próbuje przywrócić PA za pomocą fontanny');
                            if ($("a[href='gra/stowarzyszenie.php']:contains('Twoje')").length > 0 && autoGo) {
                                reloadMain("#glowne_okno", "gra/stowarzyszenie.php", function() {
                                    window.setTimeout(function() {
                                        var isFontanna = $('#stow-mapa img[src*="images/stow/18"]').length > 0;
                                        if(isFontanna && ($('button[href="stowarzyszenie.php?p=2&fontanna_wypij"]').length > 0)){
                                            reloadMain("#glowne_okno", "gra/stowarzyszenie.php?p=2&fontanna_wypij", function() {
                                                var d = new Date();
                                                var today = d.getFullYear() + "" + d.getMonth() + "" + d.getDate();
                                                config.fontannaLastUsedDate = today;
                                                updateConfig(config);
                                                $('#goAutoButton').html('STOP');
                                                console.log('Przywrócono PA');
                                                window.setTimeout(function() {
                                                    if (autoGo) {
                                                        autoGoWznawianie = false;
                                                        click();
                                                    }
                                                }, 1000);
                                            });
                                        }
                                    }, 1000);
                                });
                            }
                            break;
                        case "useCzerwoneNapoje":
                            console.log('Próbuje przywrócić PA za pomocą czerwonych napojów');
                            if ($("a[href='gra/statystyki.php']").length > 0 && autoGo) {
                                reloadMain("#glowne_okno", "gra/statystyki.php", function() {
                                    window.setTimeout(function() {
                                        if ($("a[href='gra/plecak.php']").length > 0 && autoGo) {
                                            reloadMain("#glowne_okno", "gra/plecak.php", function() {
                                                if ($('.thumbnail-plecak img[src="images/pokesklep/duzy_napoj_energetyczny.jpg"]').length > 0) {
                                                    window.setTimeout(function() {
                                                        if (autoGo) {
                                                            reloadMain("#glowne_okno", "gra/plecak.php?uzyj&postData%5B0%5D%5Bname%5D=rodzaj_przedmiotu&postData%5B0%5D%5Bvalue%5D=duzy_napoj_energetyczny&postData%5B1%5D%5Bname%5D=napewno&postData%5B1%5D%5Bvalue%5D=1&postData%5B2%5D%5Bname%5D=ilosc&postData%5B2%5D%5Bvalue%5D=1", function() {
                                                                $('#goAutoButton').html('STOP');
                                                                console.log('Przywrócono PA');
                                                                window.setTimeout(function() {
                                                                    if (autoGo) {
                                                                        autoGoWznawianie = false;
                                                                        click();
                                                                    }
                                                                }, 1000);
                                                            });
                                                        }
                                                    }, 1000);
                                                } else {
                                                    console.log('Brak napojów');
                                                    window.setTimeout(function() {
                                                        if (autoGo) {
                                                            probujWznowicAutoGo(array, autoGoBefore);
                                                        }
                                                    }, 1000);
                                                }
                                            })
                                        }
                                    }, 1000);
                                });
                            }
                            break;
                        default:
                            // code block
                    }
                } else {
                    autoGoWznawianie = false;
                    autoGo = false;
                    $('#goAutoButton').html('AutoGO');
                    $('.dynamicsparkline').hide()
                    $("#goStopReason").html("Brak PA").show();
                    document.title = "Brak PA";
                }
            } else {
                autoGoWznawianie = false;
                autoGo = false;
                $('#goAutoButton').html('AutoGO');
                $('.dynamicsparkline').hide()
            }
        }

        $(document).on("click", "#goStopReason", function() {
            $(this).hide();
        })


        function przerwijAutoGoZPowoduBrakuPA(wznawiaj) {
            var d = new Date();
            var autoGoBefore = autoGo;
            autoGoWznawianie = true;
            console.log('PokeLifeScript: brak PA, próbuje wznowić');

            if (wznawiaj) {
                var array = [];
                if (config.useCzerwoneNapoje == "true" || config.useCzerwoneNapoje == true) {
                    array.push("useCzerwoneNapoje");
                }
                if (config.useZieloneNapoje == "true" || config.useZieloneNapoje == true) {
                    array.push("useZieloneNapoje");
                }
                if (config.useNiebieskieNapoje == "true" || config.useNiebieskieNapoje == true) {
                    array.push("useNiebieskieNapoje");
                }
                if (config.useFontanna == "true" || config.useFontanna == true) {
                    var today = d.getFullYear() + "" + d.getMonth() + "" + d.getDate();
                    if (config.fontannaLastUsedDate !== today) {
                        array.push("useFontanna");
                    }
                }
                if (config.useEventoweNapoje == "true" || config.useEventoweNapoje == true) {
                    array.push("useEventoweNapoje");
                }
                if (config.useNiebieskieJagody == "true" || config.useNiebieskieJagody == true) {
                    array.push("useNiebieskieJagody");
                }
                if (config.useOnlyInNight == "true" || config.useOnlyInNight == true) {
                    var h = d.getHours();
                    if (h >= 22 || h < 6) {
                        window.setTimeout(function() {
                            probujWznowicAutoGo(array, autoGoBefore);
                        }, 1000);
                    } else {
                        autoGoWznawianie = false;
                        autoGo = false;
                        $('#goAutoButton').html('AutoGO');
                        $('.dynamicsparkline').hide()
                        $("#goStopReason").html("Brak PA").show();
                        document.title = "Brak PA";
                    }
                } else {
                    window.setTimeout(function() {
                        probujWznowicAutoGo(array, autoGoBefore);
                    }, 1000);
                }
            } else {
                autoGoWznawianie = false;
                autoGo = false;
                $('#goAutoButton').html('AutoGO');
                $('.dynamicsparkline').hide()
            }
        }


        afterReloadMain(function() {
            if (autoGo && !autoGoWznawianie) {
                window.setTimeout(function() {
                    if (autoGo) {
                        click();
                    }
                }, clickDelay);
                clickDelay = getRandomInt(timeoutMin, timeoutMax);
            }
        })
    }
    initAutoGo();



    // **********************
    //
    // initAutoGoSettings
    // Funkcja dodająca ustawienia autoGo
    //
    // **********************

    function initAutoGoSettings() {

        $(document).on("click", "#goSettingsAutoGo", function() {
            if ($('#settingsAutoGo').length > 0) {
                $('#settingsAutoGo').remove();
            } else {
                $('body').append('<div id="settingsAutoGo" style="padding: 10px; position:fixed;top: 60px;right: 69px;width: 880px;background: white;opacity: 1;border: 7px solid #272727;z-index: 999;"></div>');
                $('#settingsAutoGo').append('<div class="row"><div class="col-sm-6 wznawianieSettings"><table> <tr> <th></th> <th></th> <th></th> </tr></table></div></div>');
                $('#settingsAutoGo .wznawianieSettings table').append('<col width="60"><col width="20"><col width="340">');
                $('#settingsAutoGo .wznawianieSettings table').append('<tr><td><img style="width: 40px;" src="images/pokesklep/duzy_napoj_energetyczny.jpg"></td><td><input type="checkbox" id="autoUseCzerwoneNapoje" name="autoUseCzerwoneNapoje" value="1" ' + ((config.useCzerwoneNapoje == "true" || config.useCzerwoneNapoje == true) ? "checked" : "") + ' style=" margin: 0; line-height: 50px; height: 50px; "></td><td><label style=" margin: 0; height: 50px; line-height: 44px; font-size: 14px; ">Używaj czerwonych napojów gdy zabraknie PA</label></td> </tr>');
                $('#settingsAutoGo .wznawianieSettings table').append('<tr><td><img style="width: 40px;" src="images/pokesklep/zielony_napoj.jpg"></td><td><input type="checkbox" id="autoUseZieloneNapoje" name="autoUseZieloneNapoje" value="1" ' + ((config.useZieloneNapoje == "true" || config.useZieloneNapoje == true) ? "checked" : "") + ' style=" margin: 0; line-height: 50px; height: 50px; "></td><td><label style=" margin: 0; height: 50px; line-height: 44px; font-size: 14px; ">Używaj zielonych napojów gdy zabraknie PA</label></td> </tr>');
                $('#settingsAutoGo .wznawianieSettings table').append('<tr><td><img style="width: 40px;" src="images/pokesklep/napoj_energetyczny.jpg"></td><td><input type="checkbox" id="autoUseNiebieskieNapoje" name="autoUseNiebieskieNapoje" value="1" ' + ((config.useNiebieskieNapoje == "true" || config.useNiebieskieNapoje == true) ? "checked" : "") + ' style=" margin: 0; line-height: 50px; height: 50px; "></td><td><label style=" margin: 0; line-height: 1.1; font-size: 14px; ">Używaj niebieskich napojów gdy zabraknie PA <span style="font-size: 9px">(niebieskie eventowe + niebieskie)</span></label></td> </tr>');
                $('#settingsAutoGo .wznawianieSettings table').append('<tr><td><img style="width: 40px;" src="images/stow/18_6.png"></td><td><input type="checkbox" id="autoUseFontanna" name="autoUseFontanna" value="1" ' + ((config.useFontanna == "true" || config.useFontanna == true) ? "checked" : "") + ' style=" margin: 0; line-height: 50px; height: 50px; "></td><td><label style=" margin: 0; line-height: 1.1; font-size: 14px; ">Używaj fontanny gdy zabraknie PA</label></td> </tr>');

                //$('#settingsAutoGo .wznawianieSettings table').append('<tr><td><img style="width: 40px;" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAMAAACahl6sAAAAHlBMVEX4+PgwMDBYwNCYmJiA6PjIyMho0OBYWFjQ+PhIsMBk4eMZAAACB0lEQVR4nO3d3Y6CMBCGYZfK3/3f8CYwHHxktmkXsVN93zNZSebRBFgEfTyIiIiIiIiIiD6rcS95ja2HqynNWz9ec+vhagISLSDR6hgyermb32R/bD3xH+mrnp3SnvOuySoDEi0g0eoRUrClXdwVl60xCmScvb1dbo1FsUBeHBAgN/U5kH2cWcuuEQWS5LVPBWtkD+OBXA4IkJsCEgZiO72SEx7Z0UXQ4nQQECA3BQTITR0Q6ThDkhvdju31YckO6F5IUkkJxF58eQQECBAgbSA5QY4FBAgQIEBeDzkd78rStG7ZshbXblyFHAuHrdX2kkCAAAESFWKtBrGn2PrRICbYdxWrfkJqAs3emBZn44EAAQLkH5ChOeRp5SDaSTBtAQECBMibINPumLqHDDZdAcQVTECAAAECpApis56O5hViIz+lyQsIECBAgBRCbOdwvvclI4gK2Wf1ITYeECBAgMSB2LZ1WJ2G/d7upQvIcR7I/ScDCBAgQKJCdC5btvQI0RYJCBAgQIAAAQIECJDvgQy5gAABAgTIBYieDpoqIFLDS8qBAAECpC+Iez9LPaT9DZVAgAAB0gnEsotQ1FMC0dsSG36dyAHx3pgSiH4BOBAgQIC8KftJgdOlgElyLxPUS7f9X1dpkH41dklBf3QLSLSAROtjIGN1YTa4RERERERERERERBS1XxA3rOR3FFuIAAAAAElFTkSuQmCC"></td><td><input type="checkbox" id="autoUseEventoweNapoje" name="autoUseEventoweNapoje" value="1" ' + ((config.useEventoweNapoje == "true" || config.useEventoweNapoje == true) ? "checked" : "") + ' style=" margin: 0; line-height: 50px; height: 50px; "></td><td><label style=" margin: 0; line-height: 1.1; font-size: 14px; ">Używaj eventowych napojów gdy zabraknie PA <span style="font-size: 9px">(te z przycisku w statystykach)</span></label></td> </tr>');
                $('#settingsAutoGo .wznawianieSettings table').append('<tr><td><img style="width: 40px;" src="images/pokesklep/niebieskie_jagody.jpg"></td><td><input type="checkbox" id="autoUseNiebieskieJagody" name="autoUseNiebieskieJagody" value="1" ' + ((config.useNiebieskieJagody == "true" || config.useNiebieskieJagody == true) ? "checked" : "") + ' style=" margin: 0; line-height: 50px; height: 50px; "></td><td><label style=" margin: 0; height: 50px; line-height: 44px; font-size: 14px; ">Używaj niebieskich jagód gdy zabraknie PA</label></td> </tr>');

                $('#settingsAutoGo .wznawianieSettings').append('<p>Bot będzie starał sie przywrócać PA w kolejności <b>Niebieskie Jagody</b> -> <b>Fontanna</b> -> <b>Niebieskie napoje</b> -> <b>Zielone napoje</b> -> <b>Czerwone napoje</b></p>');

                $('#settingsAutoGo .row').append('<div class="col-sm-6 dziczSettings"><table> <tr> <th></th> <th></th> <th></th> </tr></table></div>');
                $('#settingsAutoGo .dziczSettings table').append('<<col width="20"><col width="340">');
                $('#settingsAutoGo .dziczSettings table').append('<tr><td><input type="checkbox" id="autoUseCzerwoneJagody" name="autoUseCzerwoneJagody" value="1" ' + ((config.useCzerwoneJagody == "true" || config.useCzerwoneJagody == true) ? "checked" : "") + ' style=" margin: 0; line-height: 50px; height: 50px; "></td><td><label style=" margin: 0; height: 50px; line-height: 44px; font-size: 14px; ">Używaj czerwonych jagód do leczenia</label></td> </tr>');
                $('#settingsAutoGo .dziczSettings table').append('<tr style="height: 55px;"><td></td><td><p><b>Niezłapane: </b><select id="switchNiezlapane"><option value="1" ' + (Number(config.niezlapaneMode) == 1 ? 'selected' : '') + '>Zatrzymuj gdy spotkasz</option><option value="2" ' + (Number(config.niezlapaneMode) == 2 ? 'selected' : '') + '>Zatrzymuj tylko IV i V</option><option value="3" ' + (Number(config.niezlapaneMode) == 3 ? 'selected' : '') + '>Nie zatrzymuj</option><option value="4" ' + (Number(config.niezlapaneMode) == 4 ? 'selected' : '') + '>Rzucaj cherishballe w IV i V</option><select></p></td> </tr>');
                $('#settingsAutoGo .dziczSettings table').append('<tr style="height: 55px;"><td></td><td><p><b>Shiny: </b><select id="switchShiny"><option value="1" ' + (Number(config.shinyMode) == 1 ? 'selected' : '') + '>Zatrzymuj gdy spotkasz</option><option value="2" ' + (Number(config.shinyMode) == 2 ? 'selected' : '') + '>Nie zatrzymuj</option><option value="3" ' + (Number(config.shinyMode) == 3 ? 'selected' : '') + '>Nie zatrzymuj, rzucaj cherishballe</option><select></p></td> </tr>');
                $('#settingsAutoGo .dziczSettings table').append('<tr style="height: 55px;"><td></td><td><p><b>Safari: </b><select id="switchSafari"><option value="1" ' + (Number(config.safariMode) == 1 ? 'selected' : '') + '>Zatrzymuj niezłapane, pomijaj pozostałe</option><option value="2" ' + (Number(config.safariMode) == 2 ? 'selected' : '') + '>Nie zatrzymuj, rzucaj tylko w niezłapane</option><option value="3" ' + (Number(config.safariMode) == 3 ? 'selected' : '') + '>Nie zatrzymuj, rzucaj we wszystkie</option><select></p></td> </tr>');
                $('#settingsAutoGo .dziczSettings table').append('<tr><td><input type="checkbox" id="useOnlyInNight" name="useOnlyInNight" value="1" ' + ((config.useOnlyInNight == "true" || config.useOnlyInNight == true) ? "checked" : "") + ' style=" margin: 0; line-height: 50px; height: 50px; "></td><td><label style=" margin: 0; height: 50px; line-height: 44px; font-size: 14px; ">Używaj wznawiania PA tylko pomiędzy 22-6</label></td> </tr>');
                $('#settingsAutoGo .dziczSettings table').append('<tr style="height: 55px;"><td></td><td><p><b>Maxymalny łapany lvl: </b><input style="width: 50px" id="changeMaxLapanyLvl" type="number" value="' + config.maxLapanyLvl + '"></p></td> </tr>');
                $('#settingsAutoGo .dziczSettings table').append('<tr style="height: 55px;"><td></td><td><p><b>Kolejność widgetów: </b><select id="switchWidgetOrder"><option value="1" ' + (config.kolejnoscWidgetow == 1 ? 'selected' : '') + '>Zadania - Drużyna</option><option value="2" ' + (config.kolejnoscWidgetow == 2 ? 'selected' : '') +  '>Drużyna - Zadania</option><select></p></td> </tr>');
            }
        });

        $(document).on("change", "#switchNiezlapane", function(event) {
            config.niezlapaneMode = Number($(this).val());
            updateConfig(config);
        })

        $(document).on("change", "#switchShiny", function(event) {
            config.shinyMode = Number($(this).val());
            updateConfig(config);
        })

        $(document).on("change", "#switchSafari", function(event) {
            config.safariMode = Number($(this).val());
            updateConfig(config);
        })

        $(document).on("change", "#changeMaxLapanyLvl", function(event) {
            config.maxLapanyLvl = $(this).val();
            updateConfig(config);
        })

        $(document).on("click", "#autoUseNiebieskieJagody", function(event) {
            var isChecked = $('#autoUseNiebieskieJagody').prop('checked');
            config.useNiebieskieJagody = isChecked;
            updateConfig(config);
        });

        $(document).on("click", "#autoUseCzerwoneJagody", function(event) {
            var isChecked = $('#autoUseCzerwoneJagody').prop('checked');
            config.useCzerwoneJagody = isChecked;
            updateConfig(config);
        });

        $(document).on("click", "#autoUseNiebieskieNapoje", function() {
            var isChecked = $('#autoUseNiebieskieNapoje').prop('checked');
            config.useNiebieskieNapoje = isChecked;
            updateConfig(config);
        });

        $(document).on("click", "#autoUseZieloneNapoje", function() {
            var isChecked = $('#autoUseZieloneNapoje').prop('checked');
            config.useZieloneNapoje = isChecked;
            updateConfig(config);
        });

        $(document).on("click", "#autoUseEventoweNapoje", function() {
            var isChecked = $('#autoUseEventoweNapoje').prop('checked');
            config.useEventoweNapoje = isChecked;
            updateConfig(config);
        });

        $(document).on("click", "#autoUseCzerwoneNapoje", function() {
            var isChecked = $('#autoUseCzerwoneNapoje').prop('checked');
            config.useCzerwoneNapoje = isChecked;
            updateConfig(config);
        });

        $(document).on("click", "#autoUseFontanna", function() {
            var isChecked = $('#autoUseFontanna').prop('checked');
            config.useFontanna = isChecked;
            updateConfig(config);
        });

        $(document).on("click", "#useOnlyInNight", function() {
            var isChecked = $('#useOnlyInNight').prop('checked');
            config.useOnlyInNight = isChecked;
            updateConfig(config);
        });

        $(document).on("change", "#switchWidgetOrder", function(event) {
            config.kolejnoscWidgetow = $(this).val();
            updateConfig(config);
            $.get('inc/stan.php', function(data) { $("#sidebar").html(data); });
        })

        $(document).on("change", "#changeMaxLapanyLvl", function(event) {
            config.maxLapanyLvl = $(this).val();
            updateConfig(config);
        })

    }
    initAutoGoSettings()



    // **********************
    //
    // initVersionInfo
    // Funkcja dodająca numer wersji na dole strony
    //
    // **********************

    function initVersionInfo() {
        $('body').append('<div id="newVersionInfo" style="border-radius: 4px; position: fixed; cursor: pointer; bottom: 10px; right: 20px; font-size: 19px; text-align: center; width: auto; height: 30px; line-height: 35px; z-index: 9998; text-align: right;"><a style="color: yellow !important;text-decoration:none;" target="_blank" href="https://github.com/krozum/pokelife#user-content-changelog">' + 'v' + GM_info.script.version + '</a></div>');
    };
    initVersionInfo();



    // **********************
    //
    // initAutouzupelnianieFormularzy
    // Funkcja dodająca autouzupełnienie formularzy
    //
    // **********************

    function initAutouzupelnianieFormularzy() {

        $(document).on("click", "#plecak-jagody .thumbnail-plecak, .thumbnail-plecak[data-target='#plecak-11'], .thumbnail-plecak[data-target='#plecak-14'], .thumbnail-plecak[data-target='#plecak-15'], .thumbnail-plecak[data-target='#plecak-8'], .thumbnail-plecak[data-target='#plecak-7'], .thumbnail-plecak[data-target='#plecak-19'], .thumbnail-plecak[data-target='#plecak-16']", function(event) {
            var id = $(this).data("target");
            var ilosc = $(this).find("h5").html().split(" ")[0];
            $(id + ' input[name="ilosc"]').val(ilosc);
        });

        onReloadMain(function() {
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
    initAutouzupelnianieFormularzy();



    // **********************
    //
    // initShinyWidget
    // Funkcja pokazująca ostatnie 3 złapane shiny na rynku
    //
    // **********************

    var pokemonPriceData;
    function initShinyWidget() {
        var shinyWidget;

        function refreshShinyWidget() {
            var html = '<div class="panel panel-primary"><div class="panel-heading">Ostatnio spotkane shiny<div class="navbar-right"><span id="refreshShinyWidget" style="color: white; top: 4px; font-size: 16px; right: 3px;" class="glyphicon glyphicon-refresh" aria-hidden="true"></span></div></div><table class="table table-striped table-condensed"><tbody><tr>';
            $.each(shiny, function(key, value) {
                var wystepowanie = "";
                var nazwa = "";
                if (pokemonData != undefined) {
                    wystepowanie = pokemonData[value['pokemon_id']].region + ", " + pokemonData[value['pokemon_id']].wystepowanie_shiny;
                    nazwa = pokemonData[value['pokemon_id']].name;
                }

                var id = Number(value['pokemon_id']);
                if (id > 1000) {
                    id = "" + id;
                    id = Number(id.substring(1));
                }

                html = html + "<td data-toggle='tooltip' data-html='true' data-placement='top' title='' data-original-title='Spotkany : " + value['creation_date'] + "<br>" + wystepowanie + "<br>Cena w hodowli: " + pokemonPriceData[id] + " §' style='text-align: center;'><a target='_blank' href='https://pokelife.pl/pokedex/index.php?title=" + nazwa + "'><img src='pokemony/srednie/s" + value['pokemon_id'] + ".png' style='width: 40px; height: 40px;'></a></td>";
            });
            html = html + '</tr></tbody></table></div>';
            shinyWidget = html;
            if($('#sidebar').find(".panel-heading:contains('Ostatnio spotkane shiny')").length == 0){
                $('#sidebar').find(".panel-heading:contains('Drużyna')").parent().before(shinyWidget);
            }
        }
        refreshShinyWidget();

        onReloadSidebar(function() {
            this.find(".panel-heading:contains('Drużyna')").parent().before(shinyWidget);
            $('[data-toggle="tooltip"]').tooltip();
        })

        $(document).on("click", "#refreshShinyWidget", function(event) {
            var api = domain + "pokelife/api/get_shiny.php?login=" + $('#wyloguj').parent().parent().html().split("<div")[0].trim() + "&region=" + region;
            $.getJSON(api, {
                format: "json"
            }).done(function(data) {
                shiny = data.list;
                refreshShinyWidget();
                $.get('inc/stan.php', function(data) { $("#sidebar").html(data); });
            })
        });

        var intervalShiny = setInterval(function() {
            var api = domain + "pokelife/api/get_shiny.php?login=" + $('#wyloguj').parent().parent().html().split("<div")[0].trim() + "&region=" + region;
            $.getJSON(api, {
                format: "json"
            }).done(function(data) {
                shiny = data.list;
                refreshShinyWidget();
                $.get('inc/stan.php', function(data) { $("#sidebar").html(data); });
            })
        }, 300000);
    }

    var api = "https://raw.githubusercontent.com/krozum/pokelife/master/pokemonPriceData.json";
    $.getJSON(api, {
        format: "json"
    }).done(function(data) {
        pokemonPriceData = data;
        initShinyWidget();
    });



    // **********************
    //
    // initPlecakTMView
    // Funkcja dodająca nowy widok do zakładki z TM w plecaku
    //
    // **********************

    function initPlecakTMView() {
        var tmData;

        var api = "https://raw.githubusercontent.com/krozum/pokelife/master/tm.json";
        $.getJSON(api, {
            format: "json"
        }).done(function(data) {
            tmData = data;
        });

        onReloadMain(function() {
            if (this.find('.panel-heading').html() === "Plecak") {
                this.find('#plecak-tm > .row > div.col-xs-4').each(function(index, val) {
                    var id = $(this).find('h3').html().split(" ")[1];
                    $(this).find("br").remove();
                    if (tmData["tm"][id - 1]["category_id"] == 1) {
                        $(this).children().css("background-color", "#f9856e");
                    } else if (tmData["tm"][id - 1]["category_id"] == 2) {
                        $(this).children().css("background-color", "#4d98b0");
                    } else if (tmData["tm"][id - 1]["category_id"] == 3) {
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

    function initPlecakTrzymaneView() {
        onReloadMain(function() {
            if (this.find('.panel-heading').html() === "Plecak") {
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
                $.each(this.find('#plecak-trzymane > .row > div'), function(index, item) {
                    if ($(item).find(".modal-dialog").length > 0) {
                        arrayModal.push(item)
                    } else if ($(item).find(".caption .text-center:contains('Używa: ')").length > 0) {
                        arrayUzywane.push($(item));
                    } else if ($(item).find("img[src='images/przedmioty/100x100/lucky_egg.png']").length > 0) {
                        arrayJajka.push($(item));
                    } else if ($(item).find(".caption:contains('ite V')").length > 0) {
                        arrayMega.push($(item));
                    } else if ($(item).find(".caption:contains('ite X V')").length > 0) {
                        arrayMega.push($(item));
                    } else if ($(item).find(".caption:contains('ite Y V')").length > 0) {
                        arrayMega.push($(item));
                    } else if ($(item).find(".caption:contains(' V')").length > 0) {
                        arrayInne5.push($(item));
                    } else if ($(item).find(".caption:contains(' IV')").length > 0) {
                        arrayInne4.push($(item));
                    } else if ($(item).find(".caption strong:contains(' III')").length > 0) {
                        arrayInne3.push($(item));
                    } else if ($(item).find(".caption strong:contains(' II')").length > 0) {
                        arrayInne2.push($(item));
                    } else {
                        arrayInne.push($(item));
                    }
                    item.remove();
                })

                if (arrayUzywane.length > 0) {
                    var html = "<div class='row'><div class='col-xs-12'><h3 style='text-align: center;'>Używane</h3>";
                    $.each(arrayUzywane, function(index, item) {
                        html = html + '<div class="col-xs-4 col-sm-3 col-md-3 col-lg-3" style="margin: 0; padding: 0;">' + item.html() + '</div>';
                    })
                    html = html + "</div></div>"
                    this.find('#plecak-trzymane > .row').append(html);
                }

                if (arrayJajka.length > 0) {
                    html = "<div class='row'><div class='col-xs-12'><h3 style='text-align: center;'>Szczęśliwe jajko</h3>";
                    $.each(arrayJajka, function(index, item) {
                        html = html + '<div class="col-xs-4 col-sm-3 col-md-3 col-lg-3" style="margin: 0; padding: 0;">' + item.html() + '</div>';
                    })
                    html = html + "</div></div>"
                    this.find('#plecak-trzymane > .row').append(html);
                }

                if (arrayMega.length > 0) {
                    html = "<div class='row'><div class='col-xs-12'><h3 style='text-align: center;'>Mega kamienie</h3>";
                    $.each(arrayMega, function(index, item) {
                        html = html + '<div class="col-xs-4 col-sm-3 col-md-3 col-lg-3" style="margin: 0; padding: 0;">' + item.html() + '</div>';
                    })
                    html = html + "</div></div>"
                    this.find('#plecak-trzymane >.row').append(html);
                }

                if (arrayInne5.length > 0) {
                    html = "<div class='row'><div class='col-xs-12'><h3 style='text-align: center;'>Inne V</h3>";
                    $.each(arrayInne5, function(index, item) {
                        html = html + '<div class="col-xs-4 col-sm-3 col-md-3 col-lg-3" style="margin: 0; padding: 0;">' + item.html() + '</div>';
                    })
                    html = html + "</div></div>"
                    this.find('#plecak-trzymane > .row').append(html);
                }

                if (arrayInne4.length > 0) {
                    html = "<div class='row'><div class='col-xs-12'><h3 style='text-align: center;'>Inne IV</h3>";
                    $.each(arrayInne4, function(index, item) {
                        html = html + '<div class="col-xs-4 col-sm-3 col-md-3 col-lg-3" style="margin: 0; padding: 0;">' + item.html() + '</div>';
                    })
                    html = html + "</div></div>"
                    this.find('#plecak-trzymane > .row').append(html);
                }

                if (arrayInne3.length > 0) {
                    html = "<div class='row'><div class='col-xs-12'><h3 style='text-align: center;'>Inne III</h3>";
                    $.each(arrayInne3, function(index, item) {
                        html = html + '<div class="col-xs-4 col-sm-3 col-md-3 col-lg-3" style="margin: 0; padding: 0;">' + item.html() + '</div>';
                    })
                    html = html + "</div></div>"
                    this.find('#plecak-trzymane > .row').append(html);
                }

                if (arrayInne2.length > 0) {
                    html = "<div class='row'><div class='col-xs-12'><h3 style='text-align: center;'>Inne II</h3>";
                    $.each(arrayInne2, function(index, item) {
                        html = html + '<div class="col-xs-4 col-sm-3 col-md-3 col-lg-3" style="margin: 0; padding: 0;">' + item.html() + '</div>';
                    })
                    html = html + "</div></div>"
                    this.find('#plecak-trzymane > .row').append(html);
                }

                if (arrayInne.length > 0) {
                    html = "<div class='row'><div class='col-xs-12'><h3 style='text-align: center;'>Inne</h3>";
                    $.each(arrayInne, function(index, item) {
                        html = html + '<div class="col-xs-4 col-sm-3 col-md-3 col-lg-3" style="margin: 0; padding: 0;">' + item.html() + '</div>';
                    })
                    html = html + "</div></div>"
                    this.find('#plecak-trzymane > .row').append(html);
                }

                var THAT = this;
                $.each(arrayModal, function(index, item) {
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

    function initSzybkieKlikanieWLinkiPromocyjne() {

        function clickInLink(number, id) {
            if (number < 6) {
                var w = window.open("", "myWindow", "width=200,height=100");
                w.location.href = 'http://pokelife.pl/index.php?k=' + number + '&g=' + id;
                $(w).load(window.setTimeout(function() {
                    $('#klikniecie-' + number).html('TAK');
                    console.log('PokeLifeScript: klikam link ' + number);
                    window.setTimeout(function() {
                        w.close();
                        clickInLink(number + 1, id); }, 300);
                }, 300));
            } else {
                window.setTimeout(function() {
                    $.get('inc/stan.php', function(data) { $("#sidebar").html(data); });
                }, 300);
            }
        }

        onReloadMain(function() {
            var DATA = this;
            if (DATA.find('.panel-heading').html() === "Promuj stronę") {
                var html = '<div class="col-xs-12" style=" text-align: center; "><button id="clickAllLinks" style=" background-color: ' + $('.panel-heading').css('background-color') + '; border: 1px solid ' + $('.panel-heading').css('background-color') + '; border-radius: 5px; padding: 2px 20px; line-height: 20px; height: 30px; ">Wyklikaj wszystkie</button></div>';
                DATA.find('.panel-body>div:first-of-type').append(html);
            }
        })

        $(document).on("click", "#clickAllLinks", function(event) {
            var id = $('#klikniecie-1').parent().find("a").attr("onclick").split(",")[1].split(")")[0];
            window.setTimeout(function() { clickInLink(1, id); }, 400);
        });
    }
    initSzybkieKlikanieWLinkiPromocyjne();



    // **********************
    //
    // initStatystykiLink
    // Funkcja dodająca link do statystyk
    //
    // **********************

    function initStatystykiLink() {
        $('body').append('<a id="PokeLifeScriptStats" style="color: #333333 !important;text-decoration:none;" target="_blank" href="' + domain + 'pokelife/stats/"><div class="plugin-button" style="border-radius: 4px;position: fixed;cursor: pointer;top: 15px;left: 190px;font-size: 19px;text-align: center;width: 100px;height: 30px;line-height: 35px;z-index: 9998;text-align: center;line-height: 30px;color: #333333;">Statystyki</div></a>');
        $("#PokeLifeScriptStats").attr("href", domain + "pokelife/stats/?login=" + md5($('#wyloguj').parent().parent().html().split("<div")[0].trim()));
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

    function initLogger() {

        var aktualnyPokemonDzicz;

        onReloadMain(function(url) {
            var dzicz = null;
            if (url != null && url.indexOf('miejsce=') != -1) {
                dzicz = url.split('miejsce=')[1].split('&')[0];
                lastClickedDzicz = dzicz;
            }

            var DATA = this;

            if (url == "gra/aktywnosc.php?p=praca&przerwij") {
                if (DATA.find("p.alert-success:contains('Otrzymujesz wynagrodzenie w wysokości')").length > 0) {
                    var yeny = DATA.find("p.alert-success b").html().split(' ')[0].replace(/\./g, '');
                    updateStats("zarobek_z_pracy", yeny);
                }
            }


            if (DATA.find("p.alert-danger:contains('Nie możesz podróżować po dziczy, ponieważ wszystkie twoje pokemony są ranne! Musisz je najpierw wyleczyć.')").length > 0) {
                console.log('PokeLifeScript: Nie możesz podróżować po dziczy, ponieważ wszystkie twoje pokemony są ranne! Musisz je najpierw wyleczyć.');
            } else if (DATA.find(".panel-heading:contains('Łapanie Jajka')").length == 0 && (DATA.find('img[src="images/event/jajko1.png"]').length > 0 || DATA.find('img[src="images/event/jajko2.png"]').length > 0 || DATA.find('img[src="images/event/jajko3.png"]').length > 0)) {
                console.log('PokeLifeScript: spotkano jajko');
                updateEvent("Spotkano jajko", 10, dzicz);
            } else if (DATA.find("p.alert-info:contains('Niestety, tym razem nie spotkało cię nic interesującego.')").length > 0) {
                console.log('PokeLifeScript: pusta wyprawa');
                updateEvent("Niestety, tym razem nie spotkało cię nic interesującego", 1, dzicz);
            } else if (DATA.find("p.alert-success:contains('pojedynek')").length > 0) {
                console.log('PokeLifeScript: walka z trenerem');
                updateStats("walki_z_trenerami", 1);
                var pd = 0;
                var json = "";
                if (DATA.find(".alert-success:not(:contains('Moc odznaki odrzutowca sprawia'))").length > 2) {
                    $.each(DATA.find(".alert-success:not(:contains('Moc odznaki odrzutowca sprawia')):nth(2) b").html().split("PD<br>"), function(key, value) {
                        if (value != "") {
                            pd = pd + Number(value.split("+")[1]);
                            json = json + '"' + value.split("+")[0].trim() + '":"' + Number(value.split("+")[1]) + '",';
                        }
                    });
                    pd = pd.toFixed(2);
                    updateStats("zarobki_z_trenerow", DATA.find(".alert-success:not(:contains('Moc odznaki odrzutowca sprawia')):nth(1) b").html().split(" ¥")[0]);
                    updateStats("zdobyte_doswiadczenie", pd);
                    updateEvent("Na twojej drodze staje inny trener pokemon, który wyzywa Cię na pojedynek. Wygrywasz <b>" + DATA.find(".alert-success:not(:contains('Moc odznaki odrzutowca sprawia')):nth(1) b").html().split(" ¥")[0] + "</b> ¥. Zdobyte doświadczenie: <b>" + pd + "</b>", 2, dzicz);
                    updateStatsDoswiadczenie("{" + json.substring(0, json.length - 1) + "}");
                } else {
                    $.each(DATA.find(".alert-success:not(:contains('Moc odznaki odrzutowca sprawia')):nth(1) b").html().split("PD<br>"), function(key, value) {
                        if (value != "") {
                            pd = pd + Number(value.split("+")[1]);
                            json = json + '"' + value.split("+")[0].trim() + '":"' + Number(value.split("+")[1]) + '",';
                        }
                    });
                    pd.toFixed(2);
                    updateStats("zdobyte_doswiadczenie", pd);
                    updateEvent("Na twojej drodze staje inny trener pokemon, który wyzywa Cię na pojedynek ale niestety go przegrywasz. Zdobyte doświadczenie: <b>" + pd + "</b>", 3, dzicz);
                    updateStatsDoswiadczenie("{" + json.substring(0, json.length - 1) + "}");
                }
            } else if (DATA.find('h2:contains("Wybierz Pokemona")').length > 0) {
                console.log('PokeLifeScript: spotkany pokemon');
                updateEvent("Spotkany pokemon <b>" + DATA.find('.panel-primary i').html() + "</b>", 4, dzicz);
                aktualnyPokemonDzicz = DATA.find('.panel-primary i').html();
            } else if (DATA.find("h2:contains('Złap Pokemona')").length > 0) {
                console.log('PokeLifeScript: pokemon pokonany');
                updateStats("wygranych_walk_w_dziczy", 1);
                updateStats("zdobyte_doswiadczenie", DATA.find('p.alert-success:first').html().split("Zwycięstwo! ")[1].split("</b> +")[1].split(' PD')[0]);
                updateStatsDoswiadczenie('{"' + DATA.find('.panel-body b b').html() + '":"' + DATA.find('p.alert-success:first').html().split("Zwycięstwo! ")[1].split("</b> +")[1].split(' PD')[0] + '"}');
                updateEvent("Wygrałeś walke z <b>" + aktualnyPokemonDzicz + "</b>. Zdobyłeś <b>" + DATA.find('p.alert-success:first').html().split("Zwycięstwo! ")[1].split("</b> +")[1].split(' PD')[0] + "</b> punktów doświadczenia", 5, dzicz);
            } else if (DATA.find("h2:contains('Pokemon Ucieka')").length > 0) {
                console.log('PokeLifeScript: pokemon pokonany ale ucieka');
                updateStats("wygranych_walk_w_dziczy", 1);
                updateStats("zdobyte_doswiadczenie", DATA.find('p.alert-success:first').html().split("Zwycięstwo! ")[1].split("</b> +")[1].split(' PD')[0]);
                updateStatsDoswiadczenie('{"' + DATA.find('.panel-body b b').html() + '":"' + DATA.find('p.alert-success:first').html().split("Zwycięstwo! ")[1].split("</b> +")[1].split(' PD')[0] + '"}');
                updateEvent("Wygrałeś walke z <b>" + aktualnyPokemonDzicz + "</b>. Zdobyłeś <b>" + DATA.find('p.alert-success:first').html().split("Zwycięstwo! ")[1].split("</b> +")[1].split(' PD')[0] + "</b> punktów doświadczenia", 5, dzicz);
            } else if (DATA.find(".panel-body > p.alert-success:contains('Udało Ci się złapać')").length > 0) {
                console.log('PokeLifeScript: pokemon złapany');
                updateEvent("Udało ci sie złapać <b>" + aktualnyPokemonDzicz + "</b>.", 7, dzicz);
                updateStats("zlapanych_pokemonow", 1);
                if (DATA.find('p.alert-success:nth(1):contains("nie masz już miejsca")').length > 0) {
                    var zarobek = DATA.find('p.alert-success:nth(1):contains("nie masz już miejsca") strong').html().split(" ")[0].replace(/\./g, '');
                    updateStats("zarobki_z_hodowli", zarobek);
                }
            } else if (DATA.find(".panel-body > p.alert-danger:contains('uwolnił')").length > 0) {
                console.log('PokeLifeScript: pokemon sie uwolnił');
                updateStats("niezlapanych_pokemonow", 1);
                updateEvent("<b>" + aktualnyPokemonDzicz + " się uwolnił.", 8, dzicz);
            } else if (DATA.find(".panel-body > p.alert-danger:contains('Przegrana')").length > 0) {
                console.log('PokeLifeScript: przegrana walka');
                updateStats("przegranych_walk_w_dziczy", 1);
                updateStats("zdobyte_doswiadczenie", DATA.find('p.alert-danger:first').html().split("</b> +")[1].split(' PD')[0]);
                updateStatsDoswiadczenie('{"' + DATA.find('.panel-body b b').html() + '":"' + DATA.find('p.alert-danger:first').html().split("</b> +")[1].split(' PD')[0] + '"}');
                updateEvent("Przegrana walka z <b>" + aktualnyPokemonDzicz + "</b>. Musisz uciekać. ", 6, dzicz);
            } else if (DATA.find('p.alert-success:not(:contains("Dzięki mocy odznaki pioruna")):not(:contains("Moc odznaki odrzutowca sprawia"))').length > 0 && DATA.find('.panel-heading').html() == 'Dzicz - wyprawa') {
                var TEXT = 'p.alert-success:not(:contains("Dzięki mocy odznaki pioruna")):not(:contains("Moc odznaki odrzutowca sprawia"))';
                if (DATA.find(TEXT).html().indexOf("Jagód") != -1) {
                    if (DATA.find(TEXT + ':first b').html() == "Czerwonych Jagód") {
                        updateStats("zebrane_czerwone_jagody", DATA.find(TEXT + ':first b:nth(1)').html());
                    } else if (DATA.find(TEXT + ':first b').html() == "Niebieskich Jagód") {
                        updateStats("zebrane_niebieskie_jagody", DATA.find(TEXT + ':first b:nth(1)').html());
                    } else if (DATA.find(TEXT + ':first b').html() == "Fioletowych Jagód") {
                        updateStats("zebrane_fioletowe_jagody", DATA.find(TEXT + ':first b:nth(1)').html());
                    } else if (DATA.find(TEXT + ':first b').html() == "Żółtych Jagód") {
                        updateStats("zebrane_zolte_jagody", DATA.find(TEXT + ':first b:nth(1)').html());
                    } else if (DATA.find(TEXT + ':first b').html() == "Białych Jagód") {
                        updateStats("zebrane_biale_jagody", DATA.find(TEXT + ':first b:nth(1)').html());
                    } else if (DATA.find(TEXT + ':first b:nth(1)').html() == "Czerwonych Jagód") {
                        updateStats("zebrane_czerwone_jagody", DATA.find(TEXT + ':first b:nth(0)').html());
                    } else if (DATA.find(TEXT + ':first b:nth(1)').html() == "Niebieskich Jagód") {
                        updateStats("zebrane_niebieskie_jagody", DATA.find(TEXT + ':first b:nth(0)').html());
                    } else if (DATA.find(TEXT + ':first b:nth(1)').html() == "Fioletowych Jagód") {
                        updateStats("zebrane_fioletowe_jagody", DATA.find(TEXT + ':first b:nth(0)').html());
                    } else if (DATA.find(TEXT + ':first b:nth(1)').html() == "Żółtych Jagód") {
                        updateStats("zebrane_zolte_jagody", DATA.find(TEXT + ':first b:nth(0)').html());
                    } else if (DATA.find(TEXT + ':first b:nth(1)').html() == "Białych Jagód") {
                        updateStats("zebrane_biale_jagody", DATA.find(TEXT + ':first b:nth(0)').html());
                    } else if (DATA.find(TEXT + ':first b:nth(1)').html().indexOf("Jagód") != -1) {
                        updateStats("zebrane_inne_jagody", DATA.find(TEXT + ':first b:nth(0)').html());
                    } else {
                        updateStats("zebrane_inne_jagody", DATA.find(TEXT + ':first b:nth(1)').html());
                    }
                    updateEvent(DATA.find(TEXT).html(), 9, dzicz);
                } else if (DATA.find('.panel-heading').html() == 'Dzicz - wyprawa') {
                    if (DATA.find(TEXT).html().indexOf("To Diamentowy Pył! Po przyniesieniu go do miasta, sprzedajesz go za") != -1) {
                        updateStats("zarobek_z_eventow", DATA.find(TEXT + " b").html().split(' ')[0].replace(/\./g, ''));
                    }
                    updateEvent(DATA.find(TEXT).html(), 10, dzicz);
                }
            } else if (DATA.find(".panel-body > p.alert-info").length > 0 && DATA.find('.panel-heading').html() == 'Dzicz - wyprawa') {
                console.log('PokeLifeScript: event w dziczy');
                updateEvent(DATA.find('.panel-body > p.alert-info').html(), 10, dzicz);
            } else if (DATA.find(".panel-body > p.alert-warning").length > 0 && DATA.find('.panel-heading').html() == 'Dzicz - wyprawa') {
                console.log('PokeLifeScript: event w dziczy');
                updateEvent(DATA.find('.panel-body > p.alert-warning').html(), 10, dzicz);
            } else if (DATA.find(".panel-body > p.alert-danger:not(:contains('Posiadasz za mało punktów akcji'))").length > 0 && DATA.find('.panel-heading').html() == 'Dzicz - wyprawa') {
                console.log('PokeLifeScript: event w dziczy');
                updateEvent(DATA.find('.panel-body > p.alert-danger').html(), 10, dzicz);
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

    function initWbijanieSzkoleniowca() {
        var array = [];
        var affected = 0;
        var price = 0;
        var max = 0;
        var now = 0;

        //$('#pasek_skrotow > .navbar-nav').append('<li><a id="skrot_szkoleniowiec" href="#" data-toggle="tooltip" data-placement="top" title="" data-original-title="Wbijaj osiągnięcie szkoleniowca"><div class="pseudo-btn"><img src="https://raw.githubusercontent.com/krozum/pokelife/master/assets/3b79fd270c90c0dfd90763fcf1b54346-trofeo-de-campe--n-estrella-by-vexels.png"></div></a></li>');

        onReloadMain(function() {
            array = [];
            if (this.find('.panel-heading').html() === "Pokemony") {
                this.find('#pokemony-przechowalnia select[name="kolejnosc"]').parent().prepend('<button class="plugin-button" id="wbijajSzkoleniowca" style="padding: 5px 10px; border-radius: 3px; margin-bottom: 15px">Wbijaj szkoleniowca</button><br>');
                $.each(this.find('#pokemony-przechowalnia .btn-podgladpoka'), function(index, item) {
                    if (Number($(item).parent().data('poziom')) >= 5) {
                        array.push($(item).data('id-pokemona'));
                    }
                })
            }
        })

        $(document).on('click', '#skrot_szkoleniowiec', function() {
            reloadMain("#glowne_okno", 'gra/druzyna.php?p=3', function() {
                $('#wbijajSzkoleniowca').trigger('click');
            });
        });

        $(document).on('click', '#wbijajSzkoleniowca', function() {
            max = array.length;
            now = 0;
            wbijajSzkoleniowca(array);
        });

        function trenuj(array, callback) {
            if (array.length > 0) {
                window.setTimeout(function() {
                    reloadMain("#glowne_okno", "gra/" + array.pop(), function() {
                        price = Number(price) + Number($('.alert-success b:nth(1)').html().split(" ¥")[0].replace(/\./g, ''));
                        trenuj(array, callback);
                    })
                }, 1000);
            } else {
                callback.call();
            }
        }

        function wbijajSzkoleniowca(array) {
            if (array.length > 0) {
                if ($('#szkoleniowiec_progress').length < 1) {
                    $('body').append('<div id="szkoleniowiec_progress" class="" style="position: fixed;bottom: 60px;width: 500px;height: auto;z-index: 999;margin: 0 auto;left: 0;right: 0;background-color: inherit;border: none;"><div class="progress" style="margin:0;box-shadow: none;border-radius: 0; border: 1px solid black"><div class="progress-bar progress-bar-danger" role="progressbar" style="border-radius: 0; width: ' + Number((((max - array.length) * 100) / max)).toFixed(0) + '%;"> <span>' + Number((((max - array.length) * 100) / max)).toFixed(0) + '%</span></div></div></div>');
                } else {
                    $('#szkoleniowiec_progress .progress-bar').css('width', Number((((max - array.length) * 100) / max)).toFixed(0) + '%');
                    $('#szkoleniowiec_progress .progress-bar span').html(Number((((max - array.length) * 100) / max)).toFixed(0) + '%');
                }
                var id = array.pop();
                now++;

                window.setTimeout(function() {
                    reloadMain("#glowne_okno", "gra/sala.php?p=" + id + "&zrodlo=rezerwa", function() {
                        var treningi = [];
                        var i;
                        for (var j = 1; j <= 6; j++) {
                            var count = Number($('.sala_atrybuty_tabelka .row:nth(' + j + ') > div:nth(2)').html());
                            var ile = 0;
                            if (j != 6) {
                                ile = 7 - count;
                            } else {
                                ile = 35 - count;
                                ile = ile / 5;
                            }
                            if (ile > 0) {
                                affected = affected + ile;
                                treningi.push($('.sala_atrybuty_tabelka .row:nth(' + j + ') > div:nth(3) > form').attr('action') + "&postData%5B0%5D%5Bname%5D=ilosc&postData%5B0%5D%5Bvalue%5D=" + ile);
                            }
                        }
                        trenuj(treningi, function() { wbijajSzkoleniowca(array) });
                    })
                }, 1000);
            } else {
                $('#szkoleniowiec_progress').remove();
                reloadMain("#glowne_okno", 'gra/druzyna.php?p=3', function() {
                    $('#pokemony-przechowalnia select[name="kolejnosc"]').parent().prepend('<p class="alert alert-success text-center">Wykonano <b>' + affected + '</b> treningów o łącznej wartości <b>' + price + ' ¥</b></p>');
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
    // Funkcja dodająca czat bota
    //
    // **********************

    function initChat() {
        window.localStorage.max_chat_id = 0;

        $('#chat-inner > ul').append('<li role="presentation" data-toggle="tooltip" data-placement="top" title="" data-original-title="Pokój widoczny wyłącznie dla użytkowników bota"><a href="#room-99999" aria-controls="room-99999" role="tab" data-toggle="tab" class="showRoomBot" data-room="99999" aria-expanded="true">Bot</a></li>');
        $('#shout_list').after('<ol style="list-style: none; display: none; margin: 0; padding: 0" id="bot_list"></ol>');
        $('#shoutbox-panel-footer').after('<div style="display: none;background: none;" id="shoutbox-bot-panel-footer" class="panel-footer input-group"><textarea id="shout_bot_message" maxlength="255" style="resize: none; overflow: hidden;height: 34px" type="text" class="form-control" placeholder="Wiadomość" name="message"></textarea> <span class="input-group-btn"> <button id="shout_bot_button" class="btn btn-primary" type="button">Wyślij</button> </span> </div>');

        $('#shout_bot_message').on('keydown', function(e){
            if(e.which == 13) {
                e.preventDefault();
                wyslij();
            }
        }).on('input', function(){
            $(this).height(1);
            var totalHeight = $(this).prop('scrollHeight') - parseInt($(this).css('padding-top')) - parseInt($(this).css('padding-bottom'));
            $(this).height(totalHeight);
        });

        $('.showRoomBot').click(function() {
            $('#shout_list').hide();
            $('#shoutbox-panel-footer').hide();
            $('#bot_list').show();
            $('#shout_refresher').hide();
            $('#shoutbox-bot-panel-footer').show();

            if ($('#shout_refresher:contains("tymczasowo wyłączony")').length > 0 && $('#bot_list li').length == 0) {
                $('#shouts').append("<button style='text-align: center; margin: 0 auto; display: block; margin-top: 20px;' class='btn btn-primary' id='zaloguj_czat_bot'>Zaloguj</button>");
            }
            var objDiv = document.getElementById("shouts");
            objDiv.scrollTop = objDiv.scrollHeight;
        });

        $('.showRoom').click(function() {
            $('#bot_list').hide();
            $('#shout_refresher').show();
            $('#shoutbox-bot-panel-footer').hide();
            $('#shout_list').show();
            $('#zaloguj_czat_bot').remove();
            $('#shoutbox-panel-footer').show();
        });

        var interval;
        var lastDate2;

        $(document).on('click', '#zaloguj_chat,#zaloguj_czat_bot', function(e) {
            $('#zaloguj_czat_bot').remove();
            var url = domain + 'pokelife/api/get_czat.php?czat_id=' + 0;
            $.getJSON(url, {
                format: "json"
            }).done(function(data) {
                if (data['list'] != undefined) {
                    var messages = data['list'].reverse();
                    console.log(messages);
                    var lastDate = null;
                    $.each(messages, function(key, value) {
                        var d = new Date(value["creation_date"]);
                        if(lastDate != null && d.getDay() !== lastDate.getDay()){
                            var tzoffset = (new Date()).getTimezoneOffset() * 60000;
                            var localISOTime = (new Date(d - tzoffset)).toISOString().slice(0, 10);
                            $("#bot_list").append('<li style="word-break: break-word; padding: 1px 5px 1px 5px; font-family: Arial; font-size: 14px; text-align: center; color: #777; border-radius: 3px; background: #00000008;">' + localISOTime + '</li>')
                        }
                        if (value['false_login'] == null) {
                            $("#bot_list").append('<li style="word-break: break-word;text-align: center;border-bottom: 2px dashed #aa1c00;padding-top: 3px;padding-bottom: 3px;color: #aa1c00;font-size: 18px;font-family: Arial;"><span>' + value["message"] + '</span></li>');
                        } else {
                            $("#bot_list").append('<li style="word-break: break-word;padding: 1px 5px 1px 5px;font-family: Georgia, \'Times New Roman\', Times, serif; font-size: 14px; ' + (value["message"].indexOf(window.localStorage.falseLogin) >= 0 ? "background: #fbf1a763; border-radius: 3px;" : "") + '"><span class="shout_post_date">(' + value["creation_date"].split(" ")[1] + ') </span><span class="shout_post_name2" style="cursor: pointer">'+(value["avatar"] != "" ? '<img src="'+value["avatar"]+'" style=" width: 15px; margin-right: 3px; ">': "") + value["false_login"] + '</span>: ' + value["message"] + '</li>');
                        }
                        window.localStorage.max_chat_id = value["czat_id"];
                        lastDate = new Date(value["creation_date"]);
                        lastDate2 = new Date(value["creation_date"]);
                    });
                    $('#shouts').animate({ scrollTop: $('#shouts').prop("scrollHeight") }, 500);
                }

                if (interval == undefined) {
                    interval = setInterval(function() {
                        var url = domain + 'pokelife/api/get_czat.php?czat_id=' + window.localStorage.max_chat_id;
                        $.getJSON(url, {
                            format: "json"
                        }).done(function(data) {
                            if (data['list'] != undefined) {
                                var messages = data['list'].reverse();
                                $.each(messages, function(key, value) {
                                    var d = new Date(value["creation_date"]);
                                    if(lastDate2 != null && d.getDay() !== lastDate2.getDay()){
                                        var tzoffset = (new Date()).getTimezoneOffset() * 60000;
                                        var localISOTime = (new Date(d - tzoffset)).toISOString().slice(0, 10);
                                        $("#bot_list").append('<li style="word-break: break-word; padding: 1px 5px 1px 5px; font-family: Arial; font-size: 14px; text-align: center; color: #777; border-radius: 3px; background: #00000008;">' + localISOTime + '</li>')
                                    }
                                    if (value['false_login'] == null) {
                                        $("#bot_list").append('<li style="word-break: break-word;text-align: center;border-bottom: 2px dashed #aa1c00;padding-top: 3px;padding-bottom: 3px;color: #aa1c00;font-size: 18px;font-family: Arial;"><span>' + value["message"] + '</span></li>');
                                    } else {
                                        $("#bot_list").append('<li style="word-break: break-word;padding: 1px 5px 1px 5px;font-family: Georgia, \'Times New Roman\', Times, serif; font-size: 14px; ' + (value["message"].indexOf(window.localStorage.falseLogin) >= 0 ? "background: #fbf1a763; border-radius: 3px;" : "") + '"><span class="shout_post_date">(' + value["creation_date"].split(" ")[1] + ') </span><span class="shout_post_name2" style="cursor: pointer">'+(value["avatar"] != "" ? '<img src="/images/stow/deko/176.png" style=" width: 15px; margin-right: 3px; ">': "") + value["false_login"] + '</span>: ' + value["message"] + '</li>');
                                    }
                                    window.localStorage.max_chat_id = value["czat_id"];
                                    lastDate2 = new Date(value["creation_date"]);
                                });
                                $('#shouts').animate({ scrollTop: $('#shouts').prop("scrollHeight") }, 500);
                            }
                        });
                    }, 2500);
                }
            })
        })

        function wyslij() {
            var msg = $("#shout_bot_message").val();
            var value = $("#shout_button").val();
            if (msg.length > 255) {
                alert("Wiadomość za długa o " + (msg.length - 255));
            } else {
                $("#shout_button").val('Wysyłanie...');

                var url = domain + 'pokelife/api/update_czat.php';
                $.getJSON(url, {
                    format: "json",
                    message: msg,
                    login: $('#wyloguj').parent().parent().html().split("<div")[0].trim()
                }).done(function(data) {
                    $("#shout_bot_button").val(value);
                    $("#shout_bot_message").val('').trigger('input');
                });
            }
        }

        $("#shout_bot_button").click(function() {
            wyslij();
        });

        $(document).on("click", ".shout_post_name2", function() {
            var name = $(this).text();
            $("#shout_bot_message").val($("#shout_bot_message").val() + "@" + name);
        });
    }
    initChat();



    // **********************
    //
    // initPokemonyLiga
    // Funkcja zapisuje pokemony graczy w lidze
    //
    // **********************

    function initPokemonyLiga() {
        onReloadMain(function() {
            var THAT = this;
            if (this.find('.panel-heading').html() === "Liga - pojedynek") {
                $.each(this.find('.pokazpoka[data-ignoruj-ukrycie="1"]'), function(index, item) {
                    var pokemon_id = $(item).data('id-pokemona');
                    var nazwa = $(item).val();
                    var gracz_id = THAT.find('input[name="walcz"]').val();
                    var login = THAT.find('big:nth(1)').html();
                    var url = domain + 'pokelife/api/update_pokemon_gracza.php';
                    $.getJSON(url, {
                        pokemon_id: pokemon_id,
                        gracz_id: gracz_id,
                        login: login,
                        nazwa: nazwa,
                    }).done(function(data) {});
                })
            }
        })
    }
    initPokemonyLiga();



    // **********************
    //
    // initZadaniaWidget
    // Funkcja pokazująca aktualne zadania w sidebar
    //
    // **********************

    function initZadaniaWidget() {
        var d = new Date();
        var today = d.getFullYear() + "" + d.getMonth() + "" + d.getDate();
        var login = $('#wyloguj').parent().parent().html().split("<div")[0].trim();
        var zadaniaWidget;

        function refreshZadaniaWidget() {
            $.ajax({
                type: 'POST',
                url: "gra/zadania.php"
            }).done(function(response) {
                parseResponse($(response));
                $.get('inc/stan.php', function(data) { $("#sidebar").html(data); });
            })
        }

        if (config.zadaniaWidget == undefined || !config.zadaniaWidget.includes(today) || !config.zadaniaWidget.includes(login)) {
            refreshZadaniaWidget();
        } else {
            zadaniaWidget = config.zadaniaWidget;
            if (zadaniaWidget != undefined && zadaniaWidget.length > 140 && $('#sidebar').find(".panel-heading:contains('Zadania')").length == 0) {
                if(config.kolejnoscWidgetow == 1){
                    $('#sidebar').find(".panel-heading:contains('Drużyna')").parent().before(zadaniaWidget);
                } else if(config.kolejnoscWidgetow == 2){
                    $('#sidebar').find(".panel-heading:contains('Drużyna')").parent().after(zadaniaWidget);
                }
            }
        }

        function parseResponse(THAT){
            var html = '<div class="panel panel-primary" data-login="'+login+'" data-today="'+today+'"><div class="panel-heading">Zadania<div class="navbar-right"><span id="refreshZadaniaWidget" style="color: white; top: 4px; font-size: 16px; right: 3px;" class="glyphicon glyphicon-refresh" aria-hidden="true"></span></div></div><table class="table table-striped table-condensed"><tbody>';
            var empty = true;
            $.each(THAT.find('#zadania_codzienne .panel-primary .panel-heading'), function(key, value) {
                if ($(value).html().split("<div")[0] !== "brak zadania") {
                    html = html + '<tr><td>' + $(value).html().split("<div")[0];
                    empty = false;
                }
                if ($(value).parent().find(".text-center").html() != undefined) {
                    $.each($(value).parent().find(".text-center p"), function(key2, value2) {
                        html = html + " - " + $(value2).html().trim();
                        empty = false;
                    })
                }
                html = html + '</tr></td>';
                empty = false;
            });

            if(empty){
                html = html + '<tr><td style=" text-align: center; ">brak zadań</tr></td></tbody></table></div>';
            } else {
                html = html + '</tbody></table></div>';
            }
            zadaniaWidget = html;
            config.zadaniaWidget = html;
            updateConfig(config);
        }

        onReloadSidebar(function() {
            if (zadaniaWidget != undefined && zadaniaWidget.length > 140) {
                if(config.kolejnoscWidgetow == 1){
                    this.find(".panel-heading:contains('Drużyna')").parent().before(zadaniaWidget);
                } else if(config.kolejnoscWidgetow == 2){
                    this.find(".panel-heading:contains('Drużyna')").parent().after(zadaniaWidget);
                }
            }
        })

        onReloadMain(function() {
            var THAT = this;
            if (this.find('.panel-heading').html() === "Zadania") {
                parseResponse(THAT);
            }
        })

        $(document).on("click", "#refreshZadaniaWidget", function(event) {
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

    function initPokemonDniaWidget() {
        var d = new Date();
        d.setMinutes(d.getMinutes() - 21);
        var today = d.getFullYear() + "" + d.getMonth() + "" + d.getDate();
        var hodowlaPokemonDniaImage;
        var hodowlaPokemonDniaStowarzyszenieImage;

        var login = $('#wyloguj').parent().parent().html().split("<div")[0].trim();

        if (!config.hodowlaPokemonDniaImage.includes(today) || !config.hodowlaPokemonDniaImage.includes(login)) {
            $.ajax({
                type: 'POST',
                url: "gra/hodowla.php"
            }).done(function(response) {
                parseResponse($(response));
            });
        } else {
            hodowlaPokemonDniaImage = config.hodowlaPokemonDniaImage.replace(today, "");
            hodowlaPokemonDniaImage = hodowlaPokemonDniaImage.replace(login, "");
            hodowlaPokemonDniaStowarzyszenieImage = config.hodowlaPokemonDniaStowarzyszenieImage.replace(today, "");
            hodowlaPokemonDniaStowarzyszenieImage = hodowlaPokemonDniaStowarzyszenieImage.replace(login, "");
        }

        function parseResponse(THAT){
            hodowlaPokemonDniaImage = THAT.find('#hodowla-glowne img').attr('src');
            config.hodowlaPokemonDniaImage = today + "" + login + hodowlaPokemonDniaImage;
            hodowlaPokemonDniaStowarzyszenieImage = THAT.find('#hodowla-glowne img:nth(1)').attr('src');
            if (THAT.find('.panel-heading:contains("Pokemon dnia Stowa")').length == 0) {
                hodowlaPokemonDniaStowarzyszenieImage = undefined;
            }
            config.hodowlaPokemonDniaStowarzyszenieImage = today + "" + login + hodowlaPokemonDniaStowarzyszenieImage;
            updateConfig(config);
        }

        onReloadMain(function() {
            var THAT = this;
            if (this.find('.panel-heading').html() === "Hodowla Pokemon") {
                parseResponse(THAT);
            }
        })

        onReloadSidebar(function() {
            if (hodowlaPokemonDniaImage !== undefined && hodowlaPokemonDniaImage !== "undefined") {
                this.find('button[href="raport.php"]').parent().prepend('<img class="btn-akcja" href="hodowla.php?wszystkie&pokemon_dnia" src="https://gra.pokelife.pl/' + hodowlaPokemonDniaImage + '" data-toggle="tooltip" data-placement="top" title="" data-original-title="Pokemon Dnia" style="cursor: pointer; width: 50px;margin-left: 10px; float: left; ">');
                this.find('button[href="raport.php"]').parent().css('margin-top', '10px').css('padding-right', '10px');
                $('[data-toggle="tooltip"]').tooltip();
            }
            if (hodowlaPokemonDniaStowarzyszenieImage !== undefined && hodowlaPokemonDniaStowarzyszenieImage !== "undefined") {
                this.find('button[href="raport.php"]').parent().prepend('<img class="btn-akcja" href="hodowla.php?wszystkie&pokemon_dnia_stow"" src="https://gra.pokelife.pl/' + hodowlaPokemonDniaStowarzyszenieImage + '" data-toggle="tooltip" data-placement="top" title="" data-original-title="Pokemon Dnia Stowarzyszenia" style="cursor: pointer; width: 50px;margin-left: 10px; float: left; ">');
                this.find('button[href="raport.php"]').parent().css('margin-top', '10px').css('padding-right', '10px');
                $('[data-toggle="tooltip"]').tooltip();
            }
        })

        if (hodowlaPokemonDniaImage !== undefined && hodowlaPokemonDniaImage !== "undefined") {
            $('button[href="raport.php"]').parent().prepend('<img class="btn-akcja" href="hodowla.php?wszystkie&pokemon_dnia" src="https://gra.pokelife.pl/' + hodowlaPokemonDniaImage + '" data-toggle="tooltip" data-placement="top" title="" data-original-title="Pokemon Dnia" style="cursor: pointer; width: 50px;margin-left: 10px; float: left; ">');
            $('button[href="raport.php"]').parent().css('margin-top', '10px').css('padding-right', '10px');
            $('[data-toggle="tooltip"]').tooltip();
        }
        if (hodowlaPokemonDniaStowarzyszenieImage !== undefined && hodowlaPokemonDniaStowarzyszenieImage !== "undefined") {
            $('button[href="raport.php"]').parent().prepend('<img class="btn-akcja" href="hodowla.php?wszystkie&pokemon_dnia_stow"" src="https://gra.pokelife.pl/' + hodowlaPokemonDniaStowarzyszenieImage + '" data-toggle="tooltip" data-placement="top" title="" data-original-title="Pokemon Dnia Stowarzyszenia" style="cursor: pointer; width: 50px;margin-left: 10px; float: left; ">');
            $('button[href="raport.php"]').parent().css('margin-top', '10px').css('padding-right', '10px');
            $('[data-toggle="tooltip"]').tooltip();
        }
    }
    initPokemonDniaWidget();



    // **********************
    //
    // initPrzypomnienieOPracy()
    // Funkcja dodająca przypomnienie o pracy po wyjściu poza obszar strony
    //
    // **********************

    function initPrzypomnienieOPracy() {
        $('body').append('<div id="jobAlertBox" style="position: fixed; width: 100%; height: 100%; background: linear-gradient(rgba(0, 0, 0, 0.65) 0%, rgba(0, 0, 0, 0) 100%); z-index: 99999; top: 0px; display: none;"><h1 style="text-align: center;color: #dadada;font-size: 90px;vertical-align: middle;">Brak aktywności</h1></div>');

        var addEvent = function(obj, evt, fn) {
            if (obj.addEventListener) {
                obj.addEventListener(evt, fn, false);
            } else if (obj.attachEvent) {
                obj.attachEvent("on" + evt, fn);
            }
        };

        addEvent(document, "mouseout", function(event) {
            event = event ? event : window.event;
            var d = new Date();
            var h = d.getHours();
            var from = event.relatedTarget || event.toElement;
            if ((!from || from.nodeName == "HTML") && event.clientY <= 10 && $('.alert-info a[href="aktywnosc.php"]').length == 0) {
                $("#jobAlertBox").css('display', 'block');
            }
        });

        addEvent(document, "mouseover", function(event) {
            $('#jobAlertBox').css('display', "none");
        });
    }
    initPrzypomnienieOPracy();



    // **********************
    //
    // initWystawView()
    // Funkcja pokazuje ceny dla danego przedmiotu
    //
    // **********************
    function initWystawView() {
        onReloadMain(function() {
            var DATA = this;
            if (this.find('.panel-heading').html() === "Targ - Wystaw Przedmioty") {
                $(DATA).find("#targ_wysprz-zwykle input[value='Wystaw']").after('<input type="button" style="width: 25%;margin-left: 3%;" class="check-price form-control btn btn-primary" value="?">');
                $(DATA).find("#targ_wysprz-zwykle input[value='Wystaw']").css("width", "70%");
                if (this.find('.panel-heading').html() === "Targ - Wystaw Przedmioty") {
                    if ($(DATA).find(".panel-primary").length > 0) {
                        initSummary(DATA);
                    }
                }
            }
        })

        $(document).off("click", "#targ_wysprz-zwykle .check-price");
        $(document).on("click", "#targ_wysprz-zwykle .check-price", function() {
            $('#marketTable').remove();
            $('body').append("<div id='marketTable' style='z-index: 999; width: 260px; height: 400px; position: fixed; right: 0; background: white; bottom: 60px;border: 2px dashed; overflow: scroll; overflow-x:hidden'></div>")

            var przedmiot = $(this).parent().parent().find("input[name='nazwa']").val();
            var THAT = $(this).parent().parent();
            THAT.find('input[name="ilosc"]').val(THAT.parent().find("div").html().split('</b> - ')[1].split(' sztuk')[0]);

            $.ajax({
                type: 'POST',
                url: "gra/targ_prz.php"
            }).done(function(response) {
                window.setTimeout(function() {
                    $.ajax({
                        type: 'POST',
                        url: "gra/targ_prz.php?szukaj&przedmiot=" + przedmiot + "&zakladka=0&value587",
                    }).done(function(response) {
                        $.ajax({
                            type: 'POST',
                            url: "gra/targ_prz.php?oferty_strona&&przedmiot=" + przedmiot + "&value587&strona=1",
                        }).done(function(response) {
                            if (response.indexOf("Brak ofert.") < 0) {
                                var max = 1;
                                if ($($(response).find("form span")[2]).html() != "-----") {
                                    var price = Number($($(response).find("form span")[2]).html().split("&nbsp;")[0].replace(/\./g, '')) * max;
                                    THAT.find('input[name="cena_yeny"]').val(price - 1);
                                    $.getJSON(domain + "pokelife/api/update_cena.php?nazwa=" + przedmiot + "&time=" + Date.now() + "&cena=" + price, {
                                        format: "json"
                                    }).done(function (data) {
                                    })
                                } else {
                                    THAT.find('input[name="cena_yeny"]').val("brak");
                                }
                            } else {
                                THAT.find('input[name="cena_yeny"]').val("brak");
                            }

                            $(response).find("form[action='targ_prz.php?szukaj&przedmiot=" + przedmiot + "']").each(function(index, val) {
                                var img = $($(this).find("span")[0]);
                                var quantity = $($(this).find("span")[1]);
                                var price = $($(this).find("span")[2]);
                                var pricePZ = $($(this).find("span")[3]);
                                if (price.html() !== "-----") {
                                    var html = '<div style="display: table;width: 100%;height: 30px;padding: 5px;"><div style="display: table-cell;width: 70px;">' + img.html() + '</div><div style="display: table-cell;text-align: left;width: 100px;">' + quantity.html() + '</div><div style="display: table-cell;text-align: left;width: 100px;">' + price.html() + '</div><div style="display: table-cell;text-align: left;width: 70px;">' + pricePZ.html() + '</div></div>';
                                    $('#marketTable').append(html);
                                }
                            });
                        })
                    })
                }, 500);
            })
        });


        function initSummary(DATA) {
            var summaryCount = 0;
            var summarYen = 0;
            var summaryZas = 0;

            var panel = $(DATA).find(".panel-primary")[0];
            var table = $(panel).find("tr");
            $.each($(table), function(index, item) {
                var itemToSell = $(item).find("td");
                if (itemToSell.length > 5) {
                    let count = Number.parseInt(itemToSell[1].innerText);
                    let yenForEach = Number.parseInt(itemToSell[2].innerText);
                    let zasForEach = Number.parseInt(itemToSell[3].innerText);
                    if (isNaN(count))
                        count = 0;
                    if (isNaN(yenForEach))
                        yenForEach = 0;
                    if (isNaN(zasForEach))
                        zasForEach = 0;

                    summaryCount = summaryCount + count;
                    summarYen = summarYen + (count * yenForEach);
                    summaryZas = summaryZas + (count * zasForEach);
                }

            });

            var sumaJagodyCount = 0;
            var sumaJagodyYen = 0;
            var sumaJagodyZas = 0;

            $(DATA).find('#targ_wysprz-zwykle').css('margin-top', '20px');

            $(DATA).find(".panel .panel-primary:contains('Twoje oferty na targu') tbody").append(`
<tr>
<td></td>
<td id="summaryCount">` + new Intl.NumberFormat('en-IN', { maximumSignificantDigits: 3 }).format(summaryCount) + `</td>
<td id="summarYen">` + new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(summarYen) + `</td>
<td id="summaryZas">` + new Intl.NumberFormat('en-IN', { maximumSignificantDigits: 3 }).format(summaryZas) + ` §</td>
<td></td>
<td></td>
</tr>
`)

            $($(DATA).find(".panel .panel-primary")[0]).after(`
<div class="panel panel-primary">
<div class="panel-heading" style="cursor: pointer">Możliwy zarobek z jagód</div>
<table class="table table-strippedd">
<tbody id="JagodytoAppend">
<tr>
<th>&nbsp;</th>
<th>Ilość</th>
<th>Cena ¥</th>
<th>Cena §</th>
</tr>` + (
                $(DATA).find('input[name="nazwa_full"][value="Fioletowe Jagody"]').length > 0 ? `
<tr class="classToSum hidden"
data-count="` + (1 * $(DATA).find('input[name="nazwa_full"][value="Fioletowe Jagody"]').parent().parent().find('.col-md-12').html().split('b> - ')[1].split(" sztuk")[0]) + `"
data-yen="` + (Number(cenyJagod.fioletowe_jagody.cena_yeny) * $(DATA).find('input[name="nazwa_full"][value="Fioletowe Jagody"]').parent().parent().find('.col-md-12').html().split('b> - ')[1].split(" sztuk")[0]) + `"
data-zas="` + (2 * $(DATA).find('input[name="nazwa_full"][value="Fioletowe Jagody"]').parent().parent().find('.col-md-12').html().split('b> - ')[1].split(" sztuk")[0]) + `
">
<td>
<img src="images/pokesklep/fioletowe_jagody.jpg" class="visible-lg-inline" style="width: 72px;">
</td>
<td id="summaryCount">` + new Intl.NumberFormat('en-IN', { maximumSignificantDigits: 3 }).format($(DATA).find('input[name="nazwa_full"][value="Fioletowe Jagody"]').parent().parent().find('.col-md-12').html().split('b> - ')[1].split(" sztuk")[0]) + `</td>
<td id="summarYen">~ ` + new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(Number(cenyJagod.fioletowe_jagody.cena_yeny) * $(DATA).find('input[name="nazwa_full"][value="Fioletowe Jagody"]').parent().parent().find('.col-md-12').html().split('b> - ')[1].split(" sztuk")[0]) + `</td>
<td id="summaryZas">~ ` + new Intl.NumberFormat('en-IN', { maximumSignificantDigits: 3 }).format(2 * $(DATA).find('input[name="nazwa_full"][value="Fioletowe Jagody"]').parent().parent().find('.col-md-12').html().split('b> - ')[1].split(" sztuk")[0]) + `</td>
</tr>
` : ``) + (
                $(DATA).find('input[name="nazwa_full"][value="Niebieskie Jagody"]').length > 0 ? `
<tr class="classToSum hidden"
data-count="` + (1 * $(DATA).find('input[name="nazwa_full"][value="Niebieskie Jagody"]').parent().parent().find('.col-md-12').html().split('b> - ')[1].split(" sztuk")[0]) + `"
data-yen="` + (Number(cenyJagod.niebieskie_jagody.cena_yeny) * $(DATA).find('input[name="nazwa_full"][value="Niebieskie Jagody"]').parent().parent().find('.col-md-12').html().split('b> - ')[1].split(" sztuk")[0]) + `"
data-zas="` + (3 * $(DATA).find('input[name="nazwa_full"][value="Niebieskie Jagody"]').parent().parent().find('.col-md-12').html().split('b> - ')[1].split(" sztuk")[0]) + `
">
<td>
<img src="images/pokesklep/niebieskie_jagody.jpg" class="visible-lg-inline" style="width: 72px;">
</td>
<td id="summaryCount">` + new Intl.NumberFormat('en-IN', { maximumSignificantDigits: 3 }).format($(DATA).find('input[name="nazwa_full"][value="Niebieskie Jagody"]').parent().parent().find('.col-md-12').html().split('b> - ')[1].split(" sztuk")[0]) + `</td>
<td id="summarYen">~ ` + new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(Number(cenyJagod.niebieskie_jagody.cena_yeny) * $(DATA).find('input[name="nazwa_full"][value="Niebieskie Jagody"]').parent().parent().find('.col-md-12').html().split('b> - ')[1].split(" sztuk")[0]) + `</td>
<td id="summaryZas">~ ` + new Intl.NumberFormat('en-IN', { maximumSignificantDigits: 3 }).format(3 * $(DATA).find('input[name="nazwa_full"][value="Niebieskie Jagody"]').parent().parent().find('.col-md-12').html().split('b> - ')[1].split(" sztuk")[0]) + `</td>
</tr>
` : ``) + (
                $(DATA).find('input[name="nazwa_full"][value="Żółte Jagody"]').length > 0 ? `
<tr class="classToSum hidden"
data-count="` + (1 * $(DATA).find('input[name="nazwa_full"][value="Żółte Jagody"]').parent().parent().find('.col-md-12').html().split('b> - ')[1].split(" sztuk")[0]) + `"
data-yen="` + (Number(cenyJagod.zolte_jagody.cena_yeny) * $(DATA).find('input[name="nazwa_full"][value="Żółte Jagody"]').parent().parent().find('.col-md-12').html().split('b> - ')[1].split(" sztuk")[0]) + `"
data-zas="` + (3 * $(DATA).find('input[name="nazwa_full"][value="Żółte Jagody"]').parent().parent().find('.col-md-12').html().split('b> - ')[1].split(" sztuk")[0]) + `
">
<td>
<img src="images/pokesklep/zolte_jagody.jpg" class="visible-lg-inline" style="width: 72px;">
</td>
<td id="summaryCount">` + new Intl.NumberFormat('en-IN', { maximumSignificantDigits: 3 }).format($(DATA).find('input[name="nazwa_full"][value="Żółte Jagody"]').parent().parent().find('.col-md-12').html().split('b> - ')[1].split(" sztuk")[0]) + `</td>
<td id="summarYen">~ ` + new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(Number(cenyJagod.zolte_jagody.cena_yeny) * $(DATA).find('input[name="nazwa_full"][value="Żółte Jagody"]').parent().parent().find('.col-md-12').html().split('b> - ')[1].split(" sztuk")[0]) + `</td>
<td id="summaryZas">~ ` + new Intl.NumberFormat('en-IN', { maximumSignificantDigits: 3 }).format(3 * $(DATA).find('input[name="nazwa_full"][value="Żółte Jagody"]').parent().parent().find('.col-md-12').html().split('b> - ')[1].split(" sztuk")[0]) + `</td>
</tr>
` : ``) + (
                $(DATA).find('input[name="nazwa_full"][value="Zielone Jagody"]').length > 0 ? `
<tr class="classToSum hidden"
data-count="` + (1 * $(DATA).find('input[name="nazwa_full"][value="Zielone Jagody"]').parent().parent().find('.col-md-12').html().split('b> - ')[1].split(" sztuk")[0]) + `"
data-yen="` + (Number(cenyJagod.zielone_jagody.cena_yeny) * $(DATA).find('input[name="nazwa_full"][value="Zielone Jagody"]').parent().parent().find('.col-md-12').html().split('b> - ')[1].split(" sztuk")[0]) + `"
data-zas="` + (15 * $(DATA).find('input[name="nazwa_full"][value="Zielone Jagody"]').parent().parent().find('.col-md-12').html().split('b> - ')[1].split(" sztuk")[0]) + `
">
<td>
<img src="images/pokesklep/zielone_jagody.jpg" class="visible-lg-inline" style="width: 72px;">
</td>
<td id="summaryCount">` + new Intl.NumberFormat('en-IN', { maximumSignificantDigits: 3 }).format($(DATA).find('input[name="nazwa_full"][value="Zielone Jagody"]').parent().parent().find('.col-md-12').html().split('b> - ')[1].split(" sztuk")[0]) + `</td>
<td id="summarYen">~ ` + new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(Number(cenyJagod.zielone_jagody.cena_yeny) * $(DATA).find('input[name="nazwa_full"][value="Zielone Jagody"]').parent().parent().find('.col-md-12').html().split('b> - ')[1].split(" sztuk")[0]) + `</td>
<td id="summaryZas">~ ` + new Intl.NumberFormat('en-IN', { maximumSignificantDigits: 3 }).format(15 * $(DATA).find('input[name="nazwa_full"][value="Zielone Jagody"]').parent().parent().find('.col-md-12').html().split('b> - ')[1].split(" sztuk")[0]) + `</td>
</tr>
` : ``) + (
                $(DATA).find('input[name="nazwa_full"][value="Pomarańczowe Jagody"]').length > 0 ? `
<tr class="classToSum hidden"
data-count="` + (1 * $(DATA).find('input[name="nazwa_full"][value="Pomarańczowe Jagody"]').parent().parent().find('.col-md-12').html().split('b> - ')[1].split(" sztuk")[0]) + `"
data-yen="` + (Number(cenyJagod.pomaranczowe_jagody.cena_yeny) * $(DATA).find('input[name="nazwa_full"][value="Pomarańczowe Jagody"]').parent().parent().find('.col-md-12').html().split('b> - ')[1].split(" sztuk")[0]) + `"
data-zas="` + (15 * $(DATA).find('input[name="nazwa_full"][value="Pomarańczowe Jagody"]').parent().parent().find('.col-md-12').html().split('b> - ')[1].split(" sztuk")[0]) + `
">
<td>
<img src="images/pokesklep/pomaranczowe_jagody.jpg" class="visible-lg-inline" style="width: 72px;">
</td>
<td id="summaryCount">` + new Intl.NumberFormat('en-IN', { maximumSignificantDigits: 3 }).format($(DATA).find('input[name="nazwa_full"][value="Pomarańczowe Jagody"]').parent().parent().find('.col-md-12').html().split('b> - ')[1].split(" sztuk")[0]) + `</td>
<td id="summarYen">~ ` + new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(Number(cenyJagod.pomaranczowe_jagody.cena_yeny) * $(DATA).find('input[name="nazwa_full"][value="Pomarańczowe Jagody"]').parent().parent().find('.col-md-12').html().split('b> - ')[1].split(" sztuk")[0]) + `</td>
<td id="summaryZas">~ ` + new Intl.NumberFormat('en-IN', { maximumSignificantDigits: 3 }).format(15 * $(DATA).find('input[name="nazwa_full"][value="Pomarańczowe Jagody"]').parent().parent().find('.col-md-12').html().split('b> - ')[1].split(" sztuk")[0]) + `</td>
</tr>
` : ``) + (
                $(DATA).find('input[name="nazwa_full"][value="Purpurowe Jagody"]').length > 0 ? `
<tr class="classToSum hidden"
data-count="` + (1 * $(DATA).find('input[name="nazwa_full"][value="Purpurowe Jagody"]').parent().parent().find('.col-md-12').html().split('b> - ')[1].split(" sztuk")[0]) + `"
data-yen="` + (Number(cenyJagod.purpurowe_jagody.cena_yeny) * $(DATA).find('input[name="nazwa_full"][value="Purpurowe Jagody"]').parent().parent().find('.col-md-12').html().split('b> - ')[1].split(" sztuk")[0]) + `"
data-zas="` + (15 * $(DATA).find('input[name="nazwa_full"][value="Purpurowe Jagody"]').parent().parent().find('.col-md-12').html().split('b> - ')[1].split(" sztuk")[0]) + `
">
<td>
<img src="images/pokesklep/purpurowe_jagody.jpg" class="visible-lg-inline" style="width: 72px;">
</td>
<td id="summaryCount">` + new Intl.NumberFormat('en-IN', { maximumSignificantDigits: 3 }).format($(DATA).find('input[name="nazwa_full"][value="Purpurowe Jagody"]').parent().parent().find('.col-md-12').html().split('b> - ')[1].split(" sztuk")[0]) + `</td>
<td id="summarYen">~ ` + new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(Number(cenyJagod.purpurowe_jagody.cena_yeny) * $(DATA).find('input[name="nazwa_full"][value="Purpurowe Jagody"]').parent().parent().find('.col-md-12').html().split('b> - ')[1].split(" sztuk")[0]) + `</td>
<td id="summaryZas">~ ` + new Intl.NumberFormat('en-IN', { maximumSignificantDigits: 3 }).format(15 * $(DATA).find('input[name="nazwa_full"][value="Purpurowe Jagody"]').parent().parent().find('.col-md-12').html().split('b> - ')[1].split(" sztuk")[0]) + `</td>
</tr>
` : ``) + (
                $(DATA).find('input[name="nazwa_full"][value="Różowe Jagody"]').length > 0 ? `
<tr class="classToSum hidden"
data-count="` + (1 * $(DATA).find('input[name="nazwa_full"][value="Różowe Jagody"]').parent().parent().find('.col-md-12').html().split('b> - ')[1].split(" sztuk")[0]) + `"
data-yen="` + (Number(cenyJagod.rozowe_jagody.cena_yeny) * $(DATA).find('input[name="nazwa_full"][value="Różowe Jagody"]').parent().parent().find('.col-md-12').html().split('b> - ')[1].split(" sztuk")[0]) + `"
data-zas="` + (15 * $(DATA).find('input[name="nazwa_full"][value="Różowe Jagody"]').parent().parent().find('.col-md-12').html().split('b> - ')[1].split(" sztuk")[0]) + `
">
<td>
<img src="images/pokesklep/rozowe_jagody.jpg" class="visible-lg-inline" style="width: 72px;">
</td>
<td id="summaryCount">` + new Intl.NumberFormat('en-IN', { maximumSignificantDigits: 3 }).format($(DATA).find('input[name="nazwa_full"][value="Różowe Jagody"]').parent().parent().find('.col-md-12').html().split('b> - ')[1].split(" sztuk")[0]) + `</td>
<td id="summarYen">~ ` + new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(Number(cenyJagod.rozowe_jagody.cena_yeny) * $(DATA).find('input[name="nazwa_full"][value="Różowe Jagody"]').parent().parent().find('.col-md-12').html().split('b> - ')[1].split(" sztuk")[0]) + `</td>
<td id="summaryZas">~ ` + new Intl.NumberFormat('en-IN', { maximumSignificantDigits: 3 }).format(15 * $(DATA).find('input[name="nazwa_full"][value="Różowe Jagody"]').parent().parent().find('.col-md-12').html().split('b> - ')[1].split(" sztuk")[0]) + `</td>
</tr>
` : ``) + (
                $(DATA).find('input[name="nazwa_full"][value="Brązowe Jagody"]').length > 0 ? `
<tr class="classToSum hidden"
data-count="` + (1 * $(DATA).find('input[name="nazwa_full"][value="Brązowe Jagody"]').parent().parent().find('.col-md-12').html().split('b> - ')[1].split(" sztuk")[0]) + `"
data-yen="` + (Number(cenyJagod.brazowe_jagody.cena_yeny) * $(DATA).find('input[name="nazwa_full"][value="Brązowe Jagody"]').parent().parent().find('.col-md-12').html().split('b> - ')[1].split(" sztuk")[0]) + `"
data-zas="` + (15 * $(DATA).find('input[name="nazwa_full"][value="Brązowe Jagody"]').parent().parent().find('.col-md-12').html().split('b> - ')[1].split(" sztuk")[0]) + `
">
<td>
<img src="images/pokesklep/brazowe_jagody.jpg" class="visible-lg-inline" style="width: 72px;">
</td>
<td id="summaryCount">` + new Intl.NumberFormat('en-IN', { maximumSignificantDigits: 3 }).format($(DATA).find('input[name="nazwa_full"][value="Brązowe Jagody"]').parent().parent().find('.col-md-12').html().split('b> - ')[1].split(" sztuk")[0]) + `</td>
<td id="summarYen">~ ` + new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(Number(cenyJagod.brazowe_jagody.cena_yeny) * $(DATA).find('input[name="nazwa_full"][value="Brązowe Jagody"]').parent().parent().find('.col-md-12').html().split('b> - ')[1].split(" sztuk")[0]) + `</td>
<td id="summaryZas">~ ` + new Intl.NumberFormat('en-IN', { maximumSignificantDigits: 3 }).format(15 * $(DATA).find('input[name="nazwa_full"][value="Brązowe Jagody"]').parent().parent().find('.col-md-12').html().split('b> - ')[1].split(" sztuk")[0]) + `</td>
</tr>
` : ``) + (
                $(DATA).find('input[name="nazwa_full"][value="Białe Jagody"]').length > 0 ? `
<tr class="classToSum hidden"
data-count="` + (1 * $(DATA).find('input[name="nazwa_full"][value="Białe Jagody"]').parent().parent().find('.col-md-12').html().split('b> - ')[1].split(" sztuk")[0]) + `"
data-yen="` + (Number(cenyJagod.biale_jagody.cena_yeny) * $(DATA).find('input[name="nazwa_full"][value="Białe Jagody"]').parent().parent().find('.col-md-12').html().split('b> - ')[1].split(" sztuk")[0]) + `"
data-zas="` + (1 * $(DATA).find('input[name="nazwa_full"][value="Białe Jagody"]').parent().parent().find('.col-md-12').html().split('b> - ')[1].split(" sztuk")[0]) + `
">
<td>
<img src="images/pokesklep/biale_jagody.jpg" class="visible-lg-inline" style="width: 72px;">
</td>
<td id="summaryCount">` + new Intl.NumberFormat('en-IN', { maximumSignificantDigits: 3 }).format($(DATA).find('input[name="nazwa_full"][value="Białe Jagody"]').parent().parent().find('.col-md-12').html().split('b> - ')[1].split(" sztuk")[0]) + `</td>
<td id="summarYen">~ ` + new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(Number(cenyJagod.biale_jagody.cena_yeny) * $(DATA).find('input[name="nazwa_full"][value="Białe Jagody"]').parent().parent().find('.col-md-12').html().split('b> - ')[1].split(" sztuk")[0]) + `</td>
<td id="summaryZas">~ ` + new Intl.NumberFormat('en-IN', { maximumSignificantDigits: 3 }).format(1 * $(DATA).find('input[name="nazwa_full"][value="Białe Jagody"]').parent().parent().find('.col-md-12').html().split('b> - ')[1].split(" sztuk")[0]) + `</td>
</tr>
` : ``) + `
</tbody>
</table>
</div>`
                                                             )


            $.each($(DATA.find('.classToSum')), function(index, item) {
                sumaJagodyCount = sumaJagodyCount + (1 * $(item).data('count'));
                sumaJagodyYen = sumaJagodyYen + (1 * $(item).data('yen'));
                sumaJagodyZas = sumaJagodyZas + (1 * $(item).data('zas'));
            });

            $(DATA).find("#JagodytoAppend").append(`
<tr>
<td>
<img src="images/yen.png" class="visible-lg-inline" style="width: 26px; margin: -6px 0px -6px 10px;">
</td>
<td id="summaryCount">` + new Intl.NumberFormat('en-IN', { maximumSignificantDigits: 3 }).format(sumaJagodyCount) + `</td>
<td id="summarYen">~ ` + new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(sumaJagodyYen) + `</td>
<td id="summaryZas">~ ` + new Intl.NumberFormat('en-IN', { maximumSignificantDigits: 3 }).format(sumaJagodyZas) + `</td>
</tr>`);
        }

        $(document).on('click', '.panel-heading:contains("Możliwy zarobek z jagód")', function() {
            if($('.classToSum.hidden').length > 0){
                $('.classToSum').removeClass('hidden');
            } else {
                $('.classToSum').addClass('hidden');
            }
        });

        $('body').off('click', ':not(#marketTable, #marketTable *)');
        $('body').on('click', ':not(#marketTable, #marketTable *)', function() {
            $('#marketTable').empty().remove()
        });

    }
    initWystawView();



    // **********************
    //
    // initRozbudowanyOpisDziczy
    // Funkcja dodająca podgląd statystyk dotyczących dziczy
    //
    // **********************

    function initRozbudowanyOpisDziczy(){
        var d = new Date();
        d.setMinutes(d.getMinutes() - 21);
        var today = d.getFullYear() + "" + d.getMonth() + "" + d.getDate();
        var kolekcjaData = new Object()
        var kolekcjaDnia;

        if (window.localStorage.kolekcjaDnia == undefined) {
            window.localStorage.kolekcjaDnia = "";
        }
        var login = $('#wyloguj').parent().parent().html().split("<div")[0].trim();

        onReloadMain(function() {
            if (this.find('.panel-heading').html() === "Kolekcja") {
                kolekcjaData.data = today;
                kolekcjaData.login = login;

                kolekcjaData.kanto = new Object();
                this.find('#kolekcja-1 div').each(function(index, value){
                    kolekcjaData.kanto[""+$(value).data('id-pokemona')] = $(value).hasClass('kolekcja-zlapane');
                })

                kolekcjaData.johto = new Object();
                this.find('#kolekcja-2 div').each(function(index, value){
                    kolekcjaData.johto[""+$(value).data('id-pokemona')] = $(value).hasClass('kolekcja-zlapane');
                })

                kolekcjaData.hoenn = new Object();
                this.find('#kolekcja-3 div').each(function(index, value){
                    kolekcjaData.hoenn[""+$(value).data('id-pokemona')] = $(value).hasClass('kolekcja-zlapane');
                })

                kolekcjaData.sinnoh = new Object();
                this.find('#kolekcja-4 div').each(function(index, value){
                    kolekcjaData.sinnoh[""+$(value).data('id-pokemona')] = $(value).hasClass('kolekcja-zlapane');
                })

                kolekcjaData.unova = new Object();
                this.find('#kolekcja-5 div').each(function(index, value){
                    kolekcjaData.unova[""+$(value).data('id-pokemona')] = $(value).hasClass('kolekcja-zlapane');
                })

                kolekcjaData.kalos = new Object();
                this.find('#kolekcja-6 div').each(function(index, value){
                    kolekcjaData.kalos[""+$(value).data('id-pokemona')] = $(value).hasClass('kolekcja-zlapane');
                })
                window.localStorage.kolekcjaDnia = JSON.stringify(kolekcjaData);
                console.log("Reloaded");
                initPasek();
            }
        })

        if (!window.localStorage.kolekcjaDnia.includes(today) || !window.localStorage.kolekcjaDnia.includes(login)) {
            $.get('gra/kolekcja.php', function( data ) {
                kolekcjaData.data = today;
                kolekcjaData.login = login;

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
                window.localStorage.kolekcjaDnia = JSON.stringify(kolekcjaData);
                initPasek();
            })
        } else {
            kolekcjaData = JSON.parse(window.localStorage.kolekcjaDnia);
            initPasek();
        }


        function initPasek(){
            $.each($('#pasek_skrotow li'), function (index, item) {
                if ($(item).find('a').attr('href').includes("gra/dzicz")) {
                    var url = $(item).find('a').attr('href').split('miejsce=')[1];
                    var name = $(item).find('a').data('original-title').split('Wyprawa: ')[1];

                    if(name == 'Miasto'){
                        name = 'Opuszczone Miasto';
                    }

                    $(document).off('mouseenter', 'a[href="gra/dzicz.php?poluj&miejsce='+url+'"]');
                    $(document).on('mouseenter', 'a[href="gra/dzicz.php?poluj&miejsce='+url+'"]', function(){
                        var html = '<div class="row" id="opis'+name.replace(/[ ]/g, '')+'" style="z-index: 999; width: 600px; bottom: 90px; position: fixed; left: 0; right: 0; margin: 0 auto; background: #222; opacity: .9; color: white; padding: 15px">';
                        var wszystkie = true;

                        $.each(pokemonData, function(index, value) {
                            if (jQuery.inArray(name, value.wystepowanie) != -1 && value.do_zlapania && kolekcjaData[value.region.toLowerCase()][value.id] == false) {
                                wszystkie = false;
                                var trudnoscNumber = 1;
                                if (value.trudnosc_zlapania == "Niska"){
                                    trudnoscNumber = 2;
                                } else if (value.trudnosc_zlapania == "Średnia"){
                                    trudnoscNumber = 3;
                                } else if (value.trudnosc_zlapania == "Wysoka"){
                                    trudnoscNumber = 4;
                                } else if (value.trudnosc_zlapania == "Bardzo wysoka"){
                                    trudnoscNumber = 5;
                                } else if (value.trudnosc_zlapania == "Niemożliwa"){
                                    trudnoscNumber = "x";
                                }
                                html = html + '<div class="col-xs-2" style="display: inline; float: left; padding: 0; margin-top: 5px; text-align: center;"><img style="margin-bottom: 5px; text-align: center; max-width: 80%;" src="https://gra.pokelife.pl/pokemony/niezdobyte/'+value.id+'.png"><p style="margin: 0; margin-top: 5px; margin-bottom: 5px">'+value.name+'</p><p><img src="/images/trudnosc/trudnosc' + trudnoscNumber + '.png" style="filter: grayscale(80%)"></p></div>';
                            }
                        })
                        if(wszystkie){
                            html = html + "Udało ci się złapać wszystkie poki w tej dziczy";
                        }
                        html = html + '</div>';
                        $('body').append(html);
                    })


                    $(document).on('mouseleave', 'a[href="gra/dzicz.php?poluj&miejsce='+url+'"]', function(){
                        $('#opis'+name.replace(/[ ]/g, '')).remove();
                    })
                }
            });
        }
    }
    initRozbudowanyOpisDziczy();



    // **********************
    //
    // initPrzypomnienieORepelu()
    // Funkcja dodająca przypomnienie o konczącym sie repelu
    //

    function initPrzypomnienieORepelu() {
        onReloadSidebar(function() {
            if(this.find('.well-stan[data-original-title="Czas pozostały do końca działania Tepela/Repela"]').length > 0){
                var ile = Number(this.find('.well-stan[data-original-title="Czas pozostały do końca działania Tepela/Repela"]').text());
                if(ile < 200){
                    var opacity = (200 - ile) / 200;
                    this.find('.well-stan[data-original-title="Czas pozostały do końca działania Tepela/Repela"]').css("background-color", "rgba(255, 117, 117, " + opacity + ")");
                }
            }
        })

        if($('.well-stan[data-original-title="Czas pozostały do końca działania Tepela/Repela"]').length > 0){
            var ile = Number($('.well-stan[data-original-title="Czas pozostały do końca działania Tepela/Repela"]').text());
            if(ile < 200){
                var opacity = (200 - ile) / 200;
                $('.well-stan[data-original-title="Czas pozostały do końca działania Tepela/Repela"]').css("background-color", "rgba(255, 117, 117, " + opacity + ")");
            }
        }
    }
    initPrzypomnienieORepelu();



    // **********************
    //
    // initSprawdzCzyMaszAktualnaWersjeBota
    // Funkcja dodająca sprawdzenie aktualnej wersji bota na serwerze
    //
    // **********************

    function initSprawdzCzyMaszAktualnaWersjeBota(){
        if(bot_version !== GM_info.script.version){
            console.log('Nieaktualna wersja bota');
            var api = "https://raw.githubusercontent.com/krozum/pokelife/master/README.md";
            $.get(api, {
                format: "text"
            }).done(function(data) {
                var changelog = data.split('Changelog')[1];
                $('body').append('<div id="botVersionAlertBox" style="position: absolute; width: 100%;background: rgb(22, 27, 29);z-index: 99999;top: 0px;display: block;"><h1 style="text-align: center; color: #ffffff; vertical-align: middle; font-size: 44px; margin-top: 200px">Nieaktualna wersja bota<br> kliknij <a target="_self" href="https://github.com/krozum/pokelife/raw/master/PokeLifeScript.user.js?temp='+Math.random()+'"><span style="color: #88e0d5; text-decoration: underline; ">tutaj</span></a> aby zaktualizować. <br>Odśwież strone po aktualizacji</h1><p style=" margin-top: 30px; color: white; text-align: center; white-space: pre-line; width: 70%; margin: 0 auto; text-align: left; margin-bottom: 100px ">'+changelog+'</p></div>');
            });
        } else {
            console.log('Aktualna wersja bota');
        }
    }
    initSprawdzCzyMaszAktualnaWersjeBota();



    // **********************
    //
    // initPrzypomnienieOOpiece
    // Funkcja dodająca przypomnienie o opiece
    //
    // **********************

    function initPrzypomnienieOOpiece(){
        $("#statystyki b:contains('Napoje Energetyczne:')").parent().next().html()
        if($("#statystyki .statystyki-wyglad:contains('Opieka Dzisiaj:')").next().html() == "nie"){
            $("#statystyki .statystyki-wyglad:contains('Opieka Dzisiaj:')").next().css("color", "red").css("font-weight", "800");
            $("#statystyki .statystyki-wyglad:contains('Opieka Dzisiaj:')").next().append('<span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>');
        }

        onReloadMain(function() {
            if (this.find('.panel-heading').html() === "Statystyki") {
                if(this.find("#statystyki .statystyki-wyglad:contains('Opieka Dzisiaj:')").next().html() == "nie"){
                    this.find("#statystyki .statystyki-wyglad:contains('Opieka Dzisiaj:')").next().css("color", "red").css("font-weight", "800");
                    this.find("#statystyki .statystyki-wyglad:contains('Opieka Dzisiaj:')").next().append('<span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>');
                }
            }
        })
    }
    initPrzypomnienieOOpiece();



    // **********************
    //
    // initOsiagnieciaView
    // Funkcja zmieniająca wygląd zakładki osiągnięcia
    //
    // **********************

    function initOsiagnieciaView(){

        var html;

        onReloadMain(function() {
            if(this.find('.panel-heading').text().trim() === "Osiągnięcia") {
                this.find('.nav-tabs').parent().prepend('<input id="wyszukajOsiagniecie" style="margin-bottom: 20px;display: inline; width: 100%;" type="text" class="form-control" placeholder="Wyszukaj osiągnięcie...">');
                this.find('#wyszukajOsiagniecie').after('<p style=" margin-bottom: 15px; font-size: 13px; "><span class="glyphicon glyphicon-plus"></span> Dodaj widget do sidebaru<span class="glyphicon glyphicon-heart" style="margin-left: 10px;"></span> Dodaj do ulubionych<span class="glyphicon glyphicon-inbox" style="margin-left: 10px;"></span> Przedmiot jako nagroda za zdobycie poziomu<span class="glyphicon glyphicon-remove-circle" style="margin-left: 10px;"></span> Nie wlicza się do wszechstronnego</p>');
                this.find('span[href="osiagniecia.php?rozwin"]').css('margin-right', '5px');
                html = this.html();
                changeHTML(this);
            }
        })

        $(document).off("keyup", "#wyszukajOsiagniecie");
        $(document).on("keyup", "#wyszukajOsiagniecie", function (event) {
            if($(this).val() == ""){
                $('#glowne_okno .panel-default').css('display', 'block');
                var tab_id = $('#glowne_okno li[role="presentation"].active a').attr('aria-controls');
                $('#'+tab_id).parent().find("div.tab-pane[role='tabpanel']").removeClass('active').removeClass('in').addClass('fade');
                $('#'+tab_id).addClass('in').addClass('active');
            } else {
                $('#glowne_okno .tab-pane').removeClass('fade').addClass('in').addClass('active');
                $('#glowne_okno .panel-default').css('display', 'none');
                $('#glowne_okno .panel-default:icontains("'+$(this).val()+'")').css("display", "block");
            }
        });

        $(document).off("click", 'li[role="presentation"]');
        $(document).on("click", 'li[role="presentation"]', function (event) {
            if($(this).parent().parent().parent().find('.panel-heading:contains("Osiągnięcia")').length > 0){
                $('#wyszukajOsiagniecie').val("");
                $('#glowne_okno .panel-default').css('display', 'block');
                var tab_id = $('#glowne_okno li[role="presentation"].active a').attr('aria-controls');
                $('#'+tab_id).parent().find("div.tab-pane[role='tabpanel']").removeClass('active').removeClass('in').addClass('fade');
                $('#'+tab_id).addClass('in').addClass('active');
            }
        });


        function changeHTML(THAT){
            THAT.find('li[role="presentation"]').removeClass('active');
            THAT.find('.nav-tabs').prepend('<li role="presentation" class="active"><a href="#osiagniecia-ulubione" aria-controls="osiagniecia-ulubione" role="tab" data-toggle="tab">Ulubione</a></li>');
            THAT.find('.tab-pane').removeClass('in').removeClass('active');
            THAT.find('.tab-content').prepend('<div role="tabpanel" class="tab-pane in active" id="osiagniecia-ulubione"> <div class="row"> <div class="panel-group" style="margin: 0 0 0 0; padding: 0 10px 0 10px;"> </div></div> </div>');
            THAT.find('.tab-content button').append('<span class="dodajDoUlubionych glyphicon glyphicon-heart pull-right" aria-hidden="true" style=" margin-right: 7px;"></span>');

            $(config.ulubioneOsiagniecia).each(function(index, value){
                THAT.find(value).addClass('in');
                THAT.find(value).parent().appendTo(THAT.find('#osiagniecia-ulubione .panel-group'));
            });

            THAT.find('#osiagniecia-ulubione .panel-group .panel-collapse').css('display', 'contents');
        }

        $(document).off('click', '.dodajDoUlubionych');
        $(document).on('click', '.dodajDoUlubionych', function() {
            var tempHTML;
            var tempTHIS;
            var href;
            if($(this).parent().parent().parent().parent().parent().attr('id') !== 'osiagniecia-ulubione'){
                href = $(this).parent().attr('href').trim();
                if(!config.ulubioneOsiagniecia.includes(href)){
                    config.ulubioneOsiagniecia.push(href);
                    updateConfig(config);
                    tempHTML = html;
                    tempTHIS = $(tempHTML);
                    changeHTML(tempTHIS);
                    $('#glowne_okno .panel-body').html(tempTHIS.find('.panel-body').html());
                }
            } else {
                href = $(this).parent().attr('href').trim();
                removeItemOnce(config.ulubioneOsiagniecia, href);
                updateConfig(config);
                tempHTML = html;
                tempTHIS = $(tempHTML);
                changeHTML(tempTHIS);
                $('#glowne_okno .panel-body').html(tempTHIS.find('.panel-body').html());
            }
        });


        function removeItemOnce(arr, value) {
            var index = arr.indexOf(value);
            if (index > -1) {
                arr.splice(index, 1);
            }
            return arr;
        }
    }
    initOsiagnieciaView();



    // **********************
    //
    // initTropicielDziczWidget
    // Funkcja dodająca widget osiągnięcia tropiciela
    //
    // **********************

    function initTropicielDziczWidget() {
        var widgetHTML;

        function refreshTropicielDziczWidget() {

            var html = '<div class="panel panel-primary tropicielClassToDelete"><div class="panel-heading">Tropiciel: ' + tropiciel.dzicz_name + '<div class="navbar-right"><span id="removeTropicielWidget" style="color: white; top: 4px; font-size: 16px; right: 3px;" class="glyphicon glyphicon-remove" aria-hidden="true"></span></div></div><table class="table table-striped table-condensed"><tbody><tr>';

            if(tropiciel.tropiciel_cel == null){
                html = html + "<td style='text-align: center;'>Wypraw do " + tropiciel.dzicz_name + ": <b>" + tropiciel.tropiciel_ilosc_wypraw + "</b>";
                html = html + "</td>";
            } else {
                if(Number(tropiciel.tropiciel_ilosc_wypraw) >= Number(tropiciel.tropiciel_cel)){
                    html = html + "<td style='text-align: center;'><b>Zdobyto nowy poziom!</b></td>";
                } else {
                    html = html + "<td style='text-align: center;'>Wypraw do " + tropiciel.dzicz_name + ": <b>" + tropiciel.tropiciel_ilosc_wypraw + "</b>";
                    html = html + " / <b>" + tropiciel.tropiciel_cel + "</b></td>";
                }
            }
            html = html + '</tr></tbody></table></div>';
            widgetHTML = html;
            if($('#sidebar').find(".panel-heading:contains('Tropiciel')").length == 0){
                $('#wyloguj').parent().parent().parent().after(widgetHTML);
            }
        }

        onReloadMain(function() {
            if(this.find('.panel-heading').text().trim() === "Osiągnięcia") {

                this.find('.tab-content button[href="#collapselaka_poziom"]').append('<span class="dodajDoSidebarTropicielDzicz glyphicon glyphicon-plus pull-right" data-osiagniecie-name="tropicielDzicz" data-dzicz="laka" data-dzicz-name="Łąka" aria-hidden="true" style=" margin-right: 7px;"></span>');
                this.find('.tab-content button[href="#collapselas_poziom"]').append('<span class="dodajDoSidebarTropicielDzicz glyphicon glyphicon-plus pull-right" data-osiagniecie-name="tropicielDzicz" data-dzicz="las" data-dzicz-name="Las" aria-hidden="true" style=" margin-right: 7px;"></span>');
                this.find('.tab-content button[href="#collapsewybrzeze_poziom"]').append('<span class="dodajDoSidebarTropicielDzicz glyphicon glyphicon-plus pull-right" data-osiagniecie-name="tropicielDzicz" data-dzicz="wybrzeze" data-dzicz-name="Wybrzeże" aria-hidden="true" style=" margin-right: 7px;"></span>');
                this.find('.tab-content button[href="#collapsemorze_poziom"]').append('<span class="dodajDoSidebarTropicielDzicz glyphicon glyphicon-plus pull-right" data-osiagniecie-name="tropicielDzicz" data-dzicz="morze" data-dzicz-name="Morze" aria-hidden="true" style=" margin-right: 7px;"></span>');
                this.find('.tab-content button[href="#collapsegory_poziom"]').append('<span class="dodajDoSidebarTropicielDzicz glyphicon glyphicon-plus pull-right" data-osiagniecie-name="tropicielDzicz" data-dzicz="gory" data-dzicz-name="Góry" aria-hidden="true" style=" margin-right: 7px;"></span>');
                this.find('.tab-content button[href="#collapsejaskinia_poziom"]').append('<span class="dodajDoSidebarTropicielDzicz glyphicon glyphicon-plus pull-right" data-osiagniecie-name="tropicielDzicz" data-dzicz="jaskinia" data-dzicz-name="Jaskinia" aria-hidden="true" style=" margin-right: 7px;"></span>');
                this.find('.tab-content button[href="#collapsemiasto_poziom"]').append('<span class="dodajDoSidebarTropicielDzicz glyphicon glyphicon-plus pull-right" data-osiagniecie-name="tropicielDzicz" data-dzicz="miasto" data-dzicz-name="Miasto" aria-hidden="true" style=" margin-right: 7px;"></span>');
                this.find('.tab-content button[href="#collapsesafari_poziom"]').append('<span class="dodajDoSidebarTropicielDzicz glyphicon glyphicon-plus pull-right" data-osiagniecie-name="tropicielDzicz" data-dzicz="safari" data-dzicz-name="Safari" aria-hidden="true" style=" margin-right: 7px;"></span>');

                this.find('.tab-content button[href="#collapsegesty_zagajnik_poziom"]').append('<span class="dodajDoSidebarTropicielDzicz glyphicon glyphicon-plus pull-right" data-osiagniecie-name="tropicielDzicz" data-dzicz="gesty_zagajnik" data-dzicz-name="Gęsty Zagajnik" aria-hidden="true" style=" margin-right: 7px;"></span>');
                this.find('.tab-content button[href="#collapsedolina_wiatrakow_poziom"]').append('<span class="dodajDoSidebarTropicielDzicz glyphicon glyphicon-plus pull-right" data-osiagniecie-name="tropicielDzicz" data-dzicz="dolina_wiatrakow" data-dzicz-name="Dolina Wiatraków" aria-hidden="true" style=" margin-right: 7px;"></span>');
                this.find('.tab-content button[href="#collapsekoronny_szczyt_poziom"]').append('<span class="dodajDoSidebarTropicielDzicz glyphicon glyphicon-plus pull-right" data-osiagniecie-name="tropicielDzicz" data-dzicz="koronny_szczyt" data-dzicz-name="Koronny Szczyt" aria-hidden="true" style=" margin-right: 7px;"></span>');
                this.find('.tab-content button[href="#collapsepotrojny_staw_poziom"]').append('<span class="dodajDoSidebarTropicielDzicz glyphicon glyphicon-plus pull-right" data-osiagniecie-name="tropicielDzicz" data-dzicz="potrojny_staw" data-dzicz-name="Potrójny Staw" aria-hidden="true" style=" margin-right: 7px;"></span>');
                this.find('.tab-content button[href="#collapsepustynia_lodowa_poziom"]').append('<span class="dodajDoSidebarTropicielDzicz glyphicon glyphicon-plus pull-right" data-osiagniecie-name="tropicielDzicz" data-dzicz="pustynia_lodowa" data-dzicz-name="Pustynia Lodowa" aria-hidden="true" style=" margin-right: 7px;"></span>');
                this.find('.tab-content button[href="#collapsewielkie_bagna_poziom"]').append('<span class="dodajDoSidebarTropicielDzicz glyphicon glyphicon-plus pull-right" data-osiagniecie-name="tropicielDzicz" data-dzicz="wielkie_bagna" data-dzicz-name="Wielkie Bagna" aria-hidden="true" style=" margin-right: 7px;"></span>');


                this.find('.tab-content button[href="#collapsealejka_spacerowa_poziom"]').append('<span class="dodajDoSidebarTropicielDzicz glyphicon glyphicon-plus pull-right" data-osiagniecie-name="tropicielDzicz" data-dzicz="alejka_spacerowa" data-dzicz-name="Alejka Spacerowa" aria-hidden="true" style=" margin-right: 7px;"></span>');
                this.find('.tab-content button[href="#collapsepustynia_poziom"]').append('<span class="dodajDoSidebarTropicielDzicz glyphicon glyphicon-plus pull-right" data-osiagniecie-name="tropicielDzicz" data-dzicz="pustynia" data-dzicz-name="Pustynia" aria-hidden="true" style=" margin-right: 7px;"></span>');
                this.find('.tab-content button[href="#collapseglebina_poziom"]').append('<span class="dodajDoSidebarTropicielDzicz glyphicon glyphicon-plus pull-right" data-osiagniecie-name="tropicielDzicz" data-dzicz="glebina" data-dzicz-name="Głębina" aria-hidden="true" style=" margin-right: 7px;"></span>');
                this.find('.tab-content button[href="#collapseogrod_poziom"]').append('<span class="dodajDoSidebarTropicielDzicz glyphicon glyphicon-plus pull-right" data-osiagniecie-name="tropicielDzicz" data-dzicz="ogrod" data-dzicz-name="Ogród" aria-hidden="true" style=" margin-right: 7px;"></span>');
                this.find('.tab-content button[href="#collapsenawiedzona_wieza_poziom"]').append('<span class="dodajDoSidebarTropicielDzicz glyphicon glyphicon-plus pull-right" data-osiagniecie-name="tropicielDzicz" data-dzicz="nawiedzona_wieza" data-dzicz-name="Nawiedzona Wieża" aria-hidden="true" style=" margin-right: 7px;"></span>');
                this.find('.tab-content button[href="#collapsemeteorytowa_gora_poziom"]').append('<span class="dodajDoSidebarTropicielDzicz glyphicon glyphicon-plus pull-right" data-osiagniecie-name="tropicielDzicz" data-dzicz="meteorytowa_gora" data-dzicz-name="Meteorytowa Góra" aria-hidden="true" style=" margin-right: 7px;"></span>');
                this.find('.tab-content button[href="#collapseopuszczona_elektrownia_poziom"]').append('<span class="dodajDoSidebarTropicielDzicz glyphicon glyphicon-plus pull-right" data-osiagniecie-name="tropicielDzicz" data-dzicz="opuszczona_elektrownia" data-dzicz-name="Opuszczona Elektrownia" aria-hidden="true" style=" margin-right: 7px;"></span>');
            }
        })

        $(document).on("click", '.dodajDoSidebarTropicielDzicz', function (event) {
            $('.tropicielClassToDelete').remove();
            tropiciel.tropiciel_ilosc_wypraw = $(this).parent().parent().find('b').html().split('/')[0].trim();
            tropiciel.tropiciel_cel = $(this).parent().parent().find('b').html().split('/')[1] == undefined ? null : $(this).parent().parent().find('b').html().split('/')[1].trim();
            tropiciel.dzicz = $(this).data('dzicz');
            tropiciel.dzicz_name = $(this).data('dzicz-name');
            refreshTropicielDziczWidget();
            config.tropicielWSidebar = tropiciel.dzicz;
            updateConfig(config);
            $.getJSON(domain + "pokelife/api/update_tropiciel.php?login=" + $('#wyloguj').parent().parent().html().split("<div")[0].trim() + "&time=" + Date.now() + "&tropiciel_ilosc_wypraw=" + tropiciel.tropiciel_ilosc_wypraw + "&tropiciel_cel=" + tropiciel.tropiciel_cel + "&dzicz=" + tropiciel.dzicz + "&dzicz_name=" + tropiciel.dzicz_name, {
                format: "json"
            }).done(function (data) {
            })
        });

        $(document).on("click", '#removeTropicielWidget', function (event) {
            $(this).parent().parent().parent().remove();
            config.tropicielWSidebar = "";
            updateConfig(config);
        });

        onReloadSidebar(function() {
            if(config.tropicielWSidebar !== "" && tropiciel.tropiciel_ilosc_wypraw !== null){
                this.find('#wyloguj').parent().parent().parent().after(widgetHTML);
                $('[data-toggle="tooltip"]').tooltip();
            }
        })

        onReloadMain(function(url) {
            if(config.tropicielWSidebar !== "" && tropiciel.tropiciel_ilosc_wypraw !== null){
                var to_check = "gra/dzicz.php?poluj&miejsce=" + tropiciel.dzicz;
                if((url == to_check) && (this.find('div:contains("Posiadasz za mało punktów akcji")').length == 0) && (this.find('p:contains("Nie możesz podróżować po dziczy, ponieważ wszystkie twoje pokemony są ran")').length == 0) && (this.find('p:contains("Nie możesz wyruszać w inne miejsca przebywając")').length == 0)) {
                    tropiciel.tropiciel_ilosc_wypraw++;
                    refreshTropicielDziczWidget();
                }
            }
        })

        if(config.tropicielWSidebar !== "" && tropiciel.tropiciel_ilosc_wypraw !== null){
            refreshTropicielDziczWidget();
        }

    }
    initTropicielDziczWidget();


}


$.getJSON(domain + "pokelife/api/get_user.php?login=" + $('#wyloguj').parent().parent().html().split("<div")[0].trim() + "&time="+Date.now(), {
    format: "json"
}).done(function (data) {
    if(data.status == 'success'){

        console.log(data);

        cenyJagod = data.ceny_jagod

        bot_version = data.bot_version;

        styles = data.styles;

        shiny = data.shiny;

        if(data.user != null){
            window.localStorage.falseLogin = data.user.false_login;
        }

        if(data.user != null && data.user.config != ""){
            config = JSON.parse(data.user.config);
            if(config.customStyleBackground == undefined){
                config.customStyleBackground = "#3c3c3c";
                config.customStyleTabs = "#C6E9D0";
                updateConfig(config);
            }
            if(config.customStyleFont == undefined){
                config.customStyleFont = "#000000";
                updateConfig(config);
            }
            if(config.maxLapanyLvl == undefined){
                config.maxLapanyLvl = 50;
                updateConfig(config);
            }
            if(config.niezlapaneMode == undefined){
                config.niezlapaneMode = 1;
                updateConfig(config);
            }
            if(config.useFontanna == undefined){
                config.useFontanna = false;
                updateConfig(config);
            }
            if(config.fontannaLastUsedDate == undefined){
                config.fontannaLastUsedDate = "1994512";
                updateConfig(config);
            }
            if(config.shinyMode == undefined){
                config.shinyMode = 1;
                updateConfig(config);
            }
            if(config.safariMode == undefined){
                config.safariMode = 1;
                updateConfig(config);
            }
            if(config.ulubioneOsiagniecia == undefined){
                config.ulubioneOsiagniecia = [];
                updateConfig(config);
            }
            if(config.tropicielWSidebar == undefined){
                config.tropicielWSidebar = "";
                updateConfig(config);
            }

            if(config.dzien == undefined){
                console.log(config.dzien);
                config.dzien = new Object();
                config.dzien.data11 = "nestballe";
                config.dzien.data12 = "nestballe";
                config.dzien.data13 = "greatballe";
                config.dzien.data14 = "greatballe";
                config.dzien.data21 = "nestballe";
                config.dzien.data22 = "nestballe";
                config.dzien.data23 = "greatballe";
                config.dzien.data24 = "greatballe";
                config.dzien.data31 = "nestballe";
                config.dzien.data32 = "nestballe";
                config.dzien.data33 = "greatballe";
                config.dzien.data34 = "greatballe";
                config.dzien.data41 = "nestballe";
                config.dzien.data42 = "nestballe";
                config.dzien.data43 = "greatballe";
                config.dzien.data44 = "greatballe";
                config.dzien.data51 = "nestballe";
                config.dzien.data52 = "nestballe";
                config.dzien.data53 = "greatballe";
                config.dzien.data54 = "greatballe";

                config.noc = new Object();
                config.noc.data11 = "nestballe";
                config.noc.data12 = "nestballe";
                config.noc.data13 = "nightballe";
                config.noc.data14 = "nightballe";
                config.noc.data21 = "nestballe";
                config.noc.data22 = "nestballe";
                config.noc.data23 = "nightballe";
                config.noc.data24 = "nightballe";
                config.noc.data31 = "nestballe";
                config.noc.data32 = "nestballe";
                config.noc.data33 = "nightballe";
                config.noc.data34 = "nightballe";
                config.noc.data41 = "nestballe";
                config.noc.data42 = "nestballe";
                config.noc.data43 = "nightballe";
                config.noc.data44 = "nightballe";
                config.noc.data51 = "nestballe";
                config.noc.data52 = "nestballe";
                config.noc.data53 = "nightballe";
                config.noc.data54 = "nightballe";
                updateConfig(config);
            }
        } else {
            config.skinStyle = 3;
            config.skipTutorial = false;
            config.useNiebieskieJagody = false;
            config.useNiebieskieNapoje = false;
            config.useCzerwoneNapoje = false;
            config.useZieloneNapoje = false;
            config.useEventoweNapoje = true;
            config.pokemonIconsIndex = 0;
            config.pokeballIconsIndex = 8;
            config.locationIconsIndex = 0;
            config.useOnlyInNight = false;
            config.niezlapaneMode = 1;
            config.useFontanna = false;
            config.hodowlaPokemonDniaImage = "";
            config.zadaniaWidget = "";
            config.hodowlaPokemonDniaStowarzyszenieImage = "";
            config.pok20 = 0;
            config.pok40 = 0;
            config.pok60 = 0;
            config.pok80 = 0;
            config.pok100 = 0;
            config.kolejnoscWidgetow = 1;
            config.maxLapanyLvl = 50;
            config.customStyleBackground = "#3c3c3c";
            config.customStyleTabs = "#C6E9D0";
            config.customStyleFont = "#000000";
            config.useFontanna = false;
            config.fontannaLastUsedDate = "1994512";
            config.shinyMode = 1;
            config.safariMode = 1;
            config.ulubioneOsiagniecia = [];
            config.tropicielWSidebar = "";

            config.dzien = new Object();
            config.dzien.data11 = "nestballe";
            config.dzien.data12 = "nestballe";
            config.dzien.data13 = "greatballe";
            config.dzien.data14 = "greatballe";
            config.dzien.data21 = "nestballe";
            config.dzien.data22 = "nestballe";
            config.dzien.data23 = "greatballe";
            config.dzien.data24 = "greatballe";
            config.dzien.data31 = "nestballe";
            config.dzien.data32 = "nestballe";
            config.dzien.data33 = "greatballe";
            config.dzien.data34 = "greatballe";
            config.dzien.data41 = "nestballe";
            config.dzien.data42 = "nestballe";
            config.dzien.data43 = "greatballe";
            config.dzien.data44 = "greatballe";
            config.dzien.data51 = "nestballe";
            config.dzien.data52 = "nestballe";
            config.dzien.data53 = "greatballe";
            config.dzien.data54 = "greatballe";

            config.noc = new Object();
            config.noc.data11 = "nestballe";
            config.noc.data12 = "nestballe";
            config.noc.data13 = "nightballe";
            config.noc.data14 = "nightballe";
            config.noc.data21 = "nestballe";
            config.noc.data22 = "nestballe";
            config.noc.data23 = "nightballe";
            config.noc.data24 = "nightballe";
            config.noc.data31 = "nestballe";
            config.noc.data32 = "nestballe";
            config.noc.data33 = "nightballe";
            config.noc.data34 = "nightballe";
            config.noc.data41 = "nestballe";
            config.noc.data42 = "nestballe";
            config.noc.data43 = "nightballe";
            config.noc.data44 = "nightballe";
            config.noc.data51 = "nestballe";
            config.noc.data52 = "nestballe";
            config.noc.data53 = "nightballe";
            config.noc.data54 = "nightballe";
            updateConfig(config);
        }

        config.useEventoweNapoje = false;

        $.getJSON("https://raw.githubusercontent.com/krozum/pokelife/master/PokemonData.json?a=1", {
            format: "json"
        }).done(function(data) {
            pokemonData = data;
            if ($('#pasek_skrotow a[href="gra/dzicz.php?poluj&miejsce=las"]').length > 0) {
                region = 'Kanto';
            } else if ($('#pasek_skrotow a[href="gra/dzicz.php?poluj&miejsce=puszcza"]').length > 0) {
                region = 'Johto';
            } else if ($('#pasek_skrotow a[href="gra/dzicz.php?poluj&miejsce=opuszczona_elektrownia"]').length > 0) {
                region = 'Hoenn';
            } else if ($('#pasek_skrotow a[href="gra/dzicz.php?poluj&miejsce=koronny_szczyt"]').length > 0) {
                region = 'Sinnoh';
            } else if ($('#pasek_skrotow a[href="gra/dzicz.php?poluj&miejsce=ranczo"]').length > 0) {
                region = 'Unova';
            } else if ($('#pasek_skrotow a[href="gra/dzicz.php?poluj&miejsce=francuski_labirynt"]').length > 0) {
                region = 'Kalos';
            }
            console.log("Wykryty region: " + region);

            var blob = new Blob([
                'var timers={};function fireTimeout(e){this.postMessage({id:e}),delete timers[e]}this.addEventListener("message",function(e){var t=e.data;switch(t.command){case"setTimeout":var i=parseInt(t.timeout||0,10),s=setTimeout(fireTimeout.bind(null,t.id),i);timers[t.id]=s;break;case"clearTimeout":(s=timers[t.id])&&clearTimeout(s),delete timers[t.id]}});'
            ])

            var timeoutId = 0;
            var timeouts = {};

            var worker = new Worker(window.URL.createObjectURL(blob));

            worker.addEventListener("message", function(evt) {
                var data = evt.data,
                    id = data.id,
                    fn = timeouts[id].fn,
                    args = timeouts[id].args;

                fn.apply(null, args);
                delete timeouts[id];
            });

            window.setTimeout = function(fn, delay) {
                var args = Array.prototype.slice.call(arguments, 2);
                timeoutId += 1;
                delay = delay || 0;
                var id = timeoutId;
                timeouts[id] = { fn: fn, args: args };
                worker.postMessage({ command: "setTimeout", id: id, timeout: delay });
                return id;
            };

            window.clearTimeout = function(id) {
                worker.postMessage({ command: "clearTimeout", id: id });
                delete timeouts[id];
            };



            if(config.tropicielWSidebar !== ""){
                $.getJSON(domain + "pokelife/api/get_tropiciel.php?login=" + $('#wyloguj').parent().parent().html().split("<div")[0].trim() + "&time="+Date.now() + "&dzicz=" + config.tropicielWSidebar, {
                    format: "json"
                }).done(function (data) {
                    if(data.status == 'success'){
                        tropiciel = data.tropiciel;
                        initPokeLifeScript();
                    }
                })
            } else {
                tropiciel.tropiciel_ilosc_wypraw = null;
                tropiciel.tropiciel_cel= null;
                tropiciel.dzicz= null;
                tropiciel.dzicz_name= null;

                initPokeLifeScript();
            }
        })
    }
});
