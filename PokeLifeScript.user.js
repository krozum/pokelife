// ==UserScript==
// @name         PokeLifeScript: AntyBan Edition
// @version      5.0.3
// @description  Dodatek do gry Pokelife
// @match        https://gra.pokelife.pl/*
// @downloadURL  https://github.com/krozum/pokelife/raw/master/PokeLifeScript.user.js
// @updateURL    https://github.com/krozum/pokelife/raw/master/PokeLifeScript.user.js
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @require      https://bug7a.github.io/iconselect.js/sample/lib/control/iconselect.js
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
        $(""+selector).html(THAT.html().replace('<script src="js/okno_glowne_reload.js"></script>',"").replace("http://api.jquery.com/scripts/events.js", "https://gra.pokelife.pl/js/zegar.js"));

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

$(document).off("click", ".btn-akcja");
$(document).on("click", ".btn-akcja", function(event) {
    var url = $(this).attr('href');
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

    reloadMain("#glowne_okno", 'gra/'+$(this).attr('href'));
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
                            $.get( 'inc/stan.php', function( data ) {
                                $( "#sidebar" ).html( data );
                                $('.btn-wybor_pokemona').attr("disabled", false);
                                $('.btn-wybor_pokemona .progress-bar').css("width", "100%");
                                $('.btn-wybor_pokemona .progress-bar span').html("100% PŻ");
                                setTimeout(function(){
                                    click(true)
                                }, (timeoutMax - timeoutMin) + timeoutMin);
                            });
                        });
                    }
                    console.log('zycie');
                    canRun = false;
                }
            });

            if (canRun) {
                if($('#glowne_okno .panel-heading').length > 0){
                    if ($('.dzikipokemon-background-shiny').length > 0) {
                        console.log('PokeLifeScript: spotkany Shiny, przerwanie AutoGo');
                        autoGo = false;
                        $('#goAutoButton').html('AutoGO');
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
                $('#settingsAutoGo table').append('<tr style="opacity: 0.2"><td><img style="width: 40px;" src="images/pokesklep/duzy_napoj_energetyczny.jpg"></td><td><input disabled type="checkbox" id="autoUseCzerwoneNapoje" name="autoUseCzerwoneNapoje" value="1" '+(window.localStorage.useCzerwoneNapoje == "true" ? "checked" : "") + ' style=" margin: 0; line-height: 50px; height: 50px; "></td><td><label style=" margin: 0; height: 50px; line-height: 44px; font-size: 14px; ">Uzywaj czerwonych napojów gdy zabraknie PA</label></td> </tr>');
                $('#settingsAutoGo table').append('<tr style="opacity: 0.2"><td><img style="width: 40px;" src="images/pokesklep/napoj_energetyczny.jpg"></td><td><input disabled type="checkbox" id="autoUseNiebieskieNapoje" name="autoUseNiebieskieNapoje" value="1" '+(window.localStorage.useNiebieskieNapoje == "true" ? "checked" : "") + ' style=" margin: 0; line-height: 50px; height: 50px; "></td><td><label style=" margin: 0; height: 50px; line-height: 44px; font-size: 14px; ">Uzywaj niebieskich napojów gdy zabraknie PA</label></td> </tr>');
                $('#settingsAutoGo table').append('<tr><td><img style="width: 40px;" src="images/pokesklep/niebieskie_jagody.jpg"></td><td><input type="checkbox" id="autoUseNiebieskieJagody" name="autoUseNiebieskieJagody" value="1" '+(window.localStorage.useNiebieskieJagody == "true" ? "checked" : "") + ' style=" margin: 0; line-height: 50px; height: 50px; "></td><td><label style=" margin: 0; height: 50px; line-height: 44px; font-size: 14px; ">Uzywaj niebieskich jagód gdy zabraknie PA</label></td> </tr>');
                $('#settingsAutoGo table').append('<tr style="opacity: 0.2"><td><img style="width: 40px;" src="images/stow/18_5.png"></td><td><input type="checkbox" disabled id="autoUseFontanna" name="autoUseFontanna" value="1" '+(window.localStorage.useFontanna == "true" ? "checked" : "") + ' style=" margin: 0; line-height: 50px; height: 50px; "></td><td><label style=" margin: 0; height: 50px; line-height: 44px; font-size: 14px; ">Uzywaj fontanny gdy zabraknie PA</label></td> </tr>');
                $('#settingsAutoGo table').append('<tr><td></td><td><input type="checkbox" id="useOnlyInNight" name="useOnlyInNight" value="1" '+(window.localStorage.useOnlyInNight == "true" ? "checked" : "") + ' style=" margin: 0; line-height: 50px; height: 50px; "></td><td><label style=" margin: 0; height: 50px; line-height: 44px; font-size: 14px; ">Uzywaj wznawiania PA tylko pomiędzy 22-6</label></td> </tr>');
                $('#settingsAutoGo').append('<p>Bot będzie starał sie przywrócać PA w kolejności <b>Fontanna</b> -> <b>Niebieskie Jagody</b> -> <b>Niebieskie napoje</b> -> <b>Czerwone napoje</b></p>');
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

        $(document).on("click", "#autoUseFontanna", function(){
            var isChecked = $('#autoUseFontanna').prop('checked');
            window.localStorage.useFontanna = isChecked;
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
                    case "useFontanna":
                        console.log('Próbuje przywrócić PA za pomocą fontanny');
                        if($("a[href='gra/stowarzyszenie.php']").length > 0){
                            reloadMain("#glowne_okno", "gra/stowarzyszenie.php", function(){
                                        console.log('aaaa');
                                setTimeout(function(){
                                    if($('button[href="stowarzyszenie.php?p=2&fontanna_wypij"]:contains("Napij się z fontanny")').length > 0){
                                        reloadMain("#glowne_okno", "gra/stowarzyszenie.php?p=2&fontanna_wypij", function(){
                                            autoGo = true;
                                            $('#goAutoButton').html('STOP');
                                            setTimeout(function(){
                                                click();
                                            }, 2000);
                                        });
                                    } else {
                                        console.log('Wykorzystałeś już dzisiaj fontanne');
                                        probujWznowicAutoGo(array, autoGoBefore);
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


        function przerwijAutoGoZPowoduBrakuPA(){
            var autoGoBefore = autoGo;
            console.log('PokeLifeScript: brak PA, przerywam AutoGo');
            autoGo = false;
            $('#goAutoButton').html('AutoGO');

            var array = [];
            if(window.localStorage.useCzerwoneNapoje == "true" || window.localStorage.useCzerwoneNapoje == true){
                array.push("useCzerwoneNapoje");
            }
            if(window.localStorage.useNiebieskieNapoje == "true" || window.localStorage.useNiebieskieNapoje == true){
                array.push("useNiebieskieNapoje");
            }
            if(window.localStorage.useNiebieskieJagody == "true" || window.localStorage.useNiebieskieJagody == true){
                array.push("useNiebieskieJagody");
            }
            if(window.localStorage.useFontanna == "true" || window.localStorage.useFontanna == true){
                array.push("useFontanna");
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
}
initPokeLifeScript();

