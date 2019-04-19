// ==UserScript==
// @name         PokeLifeScript v3
// @version      3.2
// @description  Dodatek do gry Pokelife
// @match        https://gra.pokelife.pl/*
// @downloadURL  https://github.com/krozum/pokelife/raw/master/PokeLifeScript.user.js
// @updateURL    https://github.com/krozum/pokelife/raw/master/PokeLifeScript.user.js
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @require      https://bug7a.github.io/iconselect.js/sample/lib/control/iconselect.js
// @resource     customCSS_global  https://raw.githubusercontent.com/krozum/pokelife/master/assets/global.css?v=4
// @resource     customCSS_style_1  https://raw.githubusercontent.com/krozum/pokelife/master/assets/style_1.css?v=3
// @resource     customCSS_style_2  https://raw.githubusercontent.com/krozum/pokelife/master/assets/style_2.css?v=3
// @resource     customCSS_style_3  https://raw.githubusercontent.com/krozum/pokelife/master/assets/style_3.css?v=3
// @resource     customCSS_style_4  https://raw.githubusercontent.com/krozum/pokelife/master/assets/style_4.css?v=4
// ==/UserScript==

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

function updateStats(name, value){
    fetch("https://bra1ns.com/pokelife/update_stats.php?login=" + $('#wyloguj').parent().parent().html().split("<div")[0].trim() + "&stats_name="+name + "&value=" + value)
        .then(resp => {
        console.log("UpdateStats: "+name+" => "+ value);
    })
}

var pa_before = $('#sidebar .progress-bar:contains("PA")').attr("aria-valuenow");
const oldShow = jQuery.fn.html
jQuery.fn.html = function() {
    const ret = oldShow.apply(this, arguments)
    var THAT = this;
    if(this.selector == "#sidebar"){
        var pa_after = this.find('.progress-bar:contains("PA")').attr("aria-valuenow");

        if(pa_after < pa_before){
            updateStats("wyklikanych_pa", Number(pa_before)-Number(pa_after));
        }
        pa_before = pa_after;

        if(typeof window.onReloadSidebarFunctions != undefined){
            window.onReloadSidebarFunctions.forEach(function(item) {
                item.call(THAT);
            });
        }
    }

    var delay = new Date();
    delay.setMinutes(delay.getMinutes() - 1);
    if (window.lastActiveTime < delay || window.lastActiveTime == undefined) {
        window.lastActiveTime = new Date();
        fetch("https://bra1ns.com/pokelife/insert_user.php?bot_version=" + GM_info.script.version + "&login=" + $('#wyloguj').parent().parent().html().split("<div")[0].trim())
    }
    return ret
}

$(document).off("click", "nav a");
$(document).on("click", "nav a", function(event) {
    if($(this).attr('href').charAt(0)!='#' && !$(this).hasClass( "link" )) {
        event.preventDefault();

        var new_buffer = $(this).attr('href');
        new_buffer = new_buffer.substr(4);
        remember_back(new_buffer);

        $.get($(this).attr('href'), function(data) {
            var THAT = $('<div>').append($(data).clone());
            window.onReloadMainFunctions.forEach(function(item) {
                item.call(THAT);
            })
            $("#glowne_okno").html(THAT.html().replace('<script src="js/okno_glowne_reload.js"></script>',"")+'<script src="https://raw.githubusercontent.com/krozum/pokelife/master/assets/okno_glowne_reload.js"></script>');
            $.get('inc/stan.php', function(data) {
                $("#sidebar").html(data);
                window.afterReloadMainFunctions.forEach(function(item) {
                    item.call();
                })
            });
        });

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

    $.get('gra/'+$(this).attr('href'), function(data) {
        var THAT = $('<div>').append($(data).clone());
        window.onReloadMainFunctions.forEach(function(item) {
            item.call(THAT);
        })
        $("#glowne_okno").html(THAT.html().replace('<script src="js/okno_glowne_reload.js"></script>',"")+'<script src="https://raw.githubusercontent.com/krozum/pokelife/master/assets/okno_glowne_reload.js"></script>');
        $.get('inc/stan.php', function(data) {
            $("#sidebar").html(data);
            window.afterReloadMainFunctions.forEach(function(item) {
                item.call();
            })
        });
    });
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
            $.ajax({
                type : 'GET',
                url : 'gra/'+$(this).attr('action'),
                data: {
                    postData : postData
                },
                success:function (data) {
                    $($(this).attr('form-target')).html( data );
                }
            });
        } else {
            $.ajax({
                type : 'GET',
                url : 'gra/'+$(this).attr('action'),
                data: {
                    postData : postData
                },
                success:function (data) {
                    var THAT = $('<div>').append($(data).clone());
                    window.onReloadMainFunctions.forEach(function(item) {
                        item.call(THAT);
                    })
                    $("#glowne_okno").html(THAT.html().replace('<script src="js/okno_glowne_reload.js"></script>',"")+'<script src="https://raw.githubusercontent.com/krozum/pokelife/master/assets/okno_glowne_reload.js"></script>');
                    $.get('inc/stan.php', function(data) {
                        $("#sidebar").html(data);
                        window.afterReloadMainFunctions.forEach(function(item) {
                            item.call();
                        })
                    });
                }
            });
        }
    }
});


function initTest(){
    //     onReloadSidebar(function(){
    //         console.log("onReloadSidebar");
    //         console.log(this);
    //     })

    //     onReloadMain(function(){
    //         console.log("onReloadMain");
    //         console.log(this);
    //     })

    //     afterReloadMain(function(){
    //         console.log("onReloadMain");
    //         console.log(this);
    //     })
}
initTest();



// **********************
//
// initSkins
// Funkcja dodająca nowe skórki do gry
//
// **********************

function initSkins(){
    window.localStorage.skinStyle == undefined ? window.localStorage.skinStyle = 1 : null;

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
        newCSS = GM_getResourceText("customCSS_style_1");
        GM_addStyle(newCSS);
    }

    $('body').append('<div id="changeStyle" class="plugin-button" style="border-radius: 4px;position: fixed;cursor: pointer;bottom: 10px;left: 10px;font-size: 19px;text-align: center;width: 30px;height: 30px;line-height: 35px;z-index: 9999;"></div>');
    $('body').on('click', '#changeStyle', function () {
        console.log(window.localStorage.skinStyle);
        switch(window.localStorage.skinStyle) {
            case '1':
                window.localStorage.skinStyle = 2;
                location.reload();
                break;
            case '2':
                window.localStorage.skinStyle = 3;
                location.reload();
                break;
            case '3':
                window.localStorage.skinStyle = 4;
                location.reload();
                break;
            case '4':
                window.localStorage.skinStyle = 1;
                location.reload();
                break;
            default:
                window.localStorage.skinStyle = 1;
                location.reload();
        }
    });
}
initSkins();



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

        onReloadMain(function(){
            if(this.find("p.alert-success:contains('Poszukiwania Jajek')").length > 0){
                refreshWielkanocWidget();
            }
            if($('#pasek_skrotow a[href="gra/dzicz.php?poluj&miejsce=ranczo"]').length > 0){
                var html;
                if(this.find(".alert-warning:not(:contains('\"R\"')):contains('Ognista świeczka przygląda się twojemu jajku.')").length > 0){
                    html = '<p class="alert alert-warning text-center">Jajko jest w <strong>Cudowny Most</strong></p>';
                    console.log('1');
                    this.find(".panel-body p:nth(0)").after(html);
                }
                if(this.find(".alert-warning:not(:contains('\"R\"')):contains('By odnaleźć następne jajko przygotuj się na większą ilość Punktów Akcji na wyprawę')").length > 0){
                    html = '<p class="alert alert-warning text-center">Jajko jest w <strong>Strzelisty Most</strong></p>';
                    console.log('2');
                    this.find(".panel-body p:nth(0)").after(html);
                }
                if(this.find(".alert-warning:not(:contains('\"R\"')):contains('Wodna wydra znajduje sie w tej samej lokacji co następne jajo')").length > 0){
                    html = '<p class="alert alert-warning text-center">Jajko jest w <strong>Strzelisty Most</strong></p>';
                    console.log('3');
                    this.find(".panel-body p:nth(0)").after(html);
                }
                if(this.find(".alert-warning:not(:contains('\"R\"')):contains('Przynęta zapachowa nie zadziała niestety na jajko')").length > 0){
                    html = '<p class="alert alert-warning text-center">Jajko jest w <strong>Rancho</strong></p>';
                    console.log('4');
                    this.find(".panel-body p:nth(0)").after(html);
                }
                if(this.find(".alert-warning:not(:contains('\"R\"')):contains('Karrablast znajduje się w tej samej dziczy co twoje jajko')").length > 0){
                    html = '<p class="alert alert-warning text-center">Jajko jest w <strong>Most Zwodzony Driftveil</strong></p>';
                    console.log('5');
                    this.find(".panel-body p:nth(0)").after(html);
                }
                if(this.find(".alert-warning:not(:contains('\"R\"')):contains('Pawniard ćwiczy nieopodal twojego jajka.')").length > 0){
                    html = '<p class="alert alert-warning text-center">Jajko jest w <strong>Most Sieci Metra</strong></p>';
                    console.log('6');
                    this.find(".panel-body p:nth(0)").after(html);
                }
                if(this.find(".alert-warning:not(:contains('\"R\"')):contains('Które szczęśliwe wydarzenie będzie pierwsze? Regeneracja Punktów Akcji czy znalezienie jajka?')").length > 0){
                    html = '<p class="alert alert-warning text-center">Jajko jest w <strong>Cudowny most</strong></p>';
                    console.log('7');
                    this.find(".panel-body p:nth(0)").after(html);
                }
                if(this.find(".alert-warning:not(:contains('\"R\"')):contains('Szukaj jajka przy automacie z napojami')").length > 0){
                    html = '<p class="alert alert-warning text-center">Jajko jest w <strong>Most Sieci Metra</strong></p>';
                    console.log('8');
                    this.find(".panel-body p:nth(0)").after(html);
                }
                if(this.find(".alert-warning:not(:contains('\"R\"')):contains('Może lokalizator sferycznych przedmiotów zareaguje na jajko')").length > 0){
                    html = '<p class="alert alert-warning text-center">Jajko jest w <strong>Most Sieci Metra</strong></p>';
                    console.log('9');
                    this.find(".panel-body p:nth(0)").after(html);
                }
                if(this.find(".alert-warning:not(:contains('\"R\"')):contains('Kto wie, może znajdziesz Kryształ szukając kolejnego jajka')").length > 0){
                    html = '<p class="alert alert-warning text-center">Jajko jest w <strong>Jaskinia Elektrokamieni</strong></p>';
                    console.log('10');
                    this.find(".panel-body p:nth(0)").after(html);
                }
                if(this.find(".alert-warning:not(:contains('\"R\"')):contains('Jelenie z kwiatami w porożu stąpają ostrożnie blisko twojego jajka.')").length > 0){
                    html = '<p class="alert alert-warning text-center">Jajko jest w <strong>Rancho</strong></p>';
                    console.log('11');
                    this.find(".panel-body p:nth(0)").after(html);
                }
                if(this.find(".alert-warning:not(:contains('\"R\"')):contains('Miejsce przebywania kolejnego jajka jest także rewirem Klinka')").length > 0){
                    html = '<p class="alert alert-warning text-center">Jajko jest w <strong>Jaskinia Elektrokamieni</strong></p>';
                    console.log('12');
                    this.find(".panel-body p:nth(0)").after(html);
                }
                if(this.find(".alert-warning:not(:contains('\"R\"')):contains('Strzępiasty czerwony Basculin pływa blisko twojego jajka')").length > 0){
                    html = '<p class="alert alert-warning text-center">Jajko jest w <strong>Strzelisty Most</strong></p>';
                    console.log('13');
                    this.find(".panel-body p:nth(0)").after(html);
                }
                if(this.find(".alert-warning:not(:contains('\"R\"')):contains('Stalowa mrówka posiada stałą trasę przy twoim jajku')").length > 0){
                    html = '<p class="alert alert-warning text-center">Jajko jest w <strong>Most Sieci Metra</strong></p>';
                    console.log('14');
                    this.find(".panel-body p:nth(0)").after(html);
                }
                if(this.find(".alert-warning:not(:contains('\"R\"')):contains('Gothita wskaże ci drogę do jajka')").length > 0){
                    html = '<p class="alert alert-warning text-center">Jajko jest w <strong>Cudowny Most</strong></p>';
                    console.log('15');
                    this.find(".panel-body p:nth(0)").after(html);
                }
                if(this.find(".alert-warning:not(:contains('\"R\"')):contains('Sewaddle i jajko łączy wspólna dzicz')").length > 0){
                    html = '<p class="alert alert-warning text-center">Jajko jest w <strong>Rancho</strong></p>';
                    console.log('16');
                    this.find(".panel-body p:nth(0)").after(html);
                }
                if(this.find(".alert-warning:not(:contains('\"R\"')):contains('Timburr podnosi ciężary nieopodal jajka')").length > 0){
                    html = '<p class="alert alert-warning text-center">Jajko jest w <strong>Most Sieci Metra</strong></p>';
                    console.log('17');
                    this.find(".panel-body p:nth(0)").after(html);
                }
                if(this.find(".alert-warning:not(:contains('\"R\"')):contains('Łabędź już wysiaduje twoje jajko')").length > 0){
                    html = '<p class="alert alert-warning text-center">Jajko jest w <strong>Most Zwodzony Driftveil</strong></p>';
                    console.log('18');
                    this.find(".panel-body p:nth(0)").after(html);
                }
                if(this.find(".alert-warning:not(:contains('\"R\"')):contains('Shelmet przygląda się twojemu jajku')").length > 0){
                    console.log('19');
                    html = '<p class="alert alert-warning text-center">Jajko jest w <strong>Rancho</strong></p>';
                    this.find(".panel-body p:nth(0)").after(html);
                }
                if(this.find(".alert-warning:not(:contains('\"R\"')):contains('Ognista małpka fika blisko twojego jajka.')").length > 0){
                    html = '<p class="alert alert-warning text-center">Jajko jest w <strong>Cudowny Most</strong></p>';
                    console.log('20');
                    this.find(".panel-body p:nth(0)").after(html);
                }
                if(this.find(".alert-warning:not(:contains('\"R\"')):contains('Petilil szykuje się do ewolucji nieopodal twojego jajka.')").length > 0){
                    html = '<p class="alert alert-warning text-center">Jajko jest w <strong>Rancho</strong></p>';
                    console.log('21');
                    this.find(".panel-body p:nth(0)").after(html);
                }
                if(this.find(".alert-warning:not(:contains('\"R\"')):contains('Misiu z glutem u nosa bawi się koło twojego jajka.')").length > 0){
                    html = '<p class="alert alert-warning text-center">Jajko jest w <strong>Most Zwodzony Driftveil</strong></p>';
                    console.log('22');
                    this.find(".panel-body p:nth(0)").after(html);
                }
                if(this.find(".alert-warning:not(:contains('\"R\"')):contains('Następne jajko znajduje się w siedlisku trawiastych węży.')").length > 0){
                    html = '<p class="alert alert-warning text-center">Jajko jest w <strong>Rancho</strong></p>';
                    console.log('23');
                    this.find(".panel-body p:nth(0)").after(html);
                }
                if(this.find(".alert-warning:not(:contains('\"R\"')):contains('Poszukaj jajka w Snopku Siana')").length > 0){
                    html = '<p class="alert alert-warning text-center">Jajko jest w <strong>Rancho</strong></p>';
                    console.log('24');
                    this.find(".panel-body p:nth(0)").after(html);
                }
                if(this.find(".alert-warning:not(:contains('\"R\"')):contains('Uważaj, by w miejscu przebywania kolejnego jajka nie okradły cię koty')").length > 0){
                    html = '<p class="alert alert-warning text-center">Jajko jest w <strong>Wiejski Most</strong></p>';
                    console.log('25');
                    this.find(".panel-body p:nth(0)").after(html);
                }
                if(this.find(".alert-warning:not(:contains('\"R\"')):contains('Tynamo drzemie nieopodal twojego jajka')").length > 0){
                    html = '<p class="alert alert-warning text-center">Jajko jest w <strong>Jaskinia Elektrokamieni</strong></p>';
                    console.log('26');
                    this.find(".panel-body p:nth(0)").after(html);
                }
                if(this.find(".alert-warning:not(:contains('\"R\"')):contains('Cottonee unosi się w okolicach twojego jajka')").length > 0){
                    html = '<p class="alert alert-warning text-center">Jajko jest w <strong>Rancho</strong></p>';
                    console.log('27');
                    this.find(".panel-body p:nth(0)").after(html);
                }
                if(this.find(".alert-warning:not(:contains('\"R\"')):contains('Czerwony nos klauna może ci się pomylić z jajkiem')").length > 0){
                    html = '<p class="alert alert-warning text-center">Jajko jest w <strong>Most Zwodzony Driftveil</strong></p>';
                    console.log('28');
                    this.find(".panel-body p:nth(0)").after(html);
                }
                if(this.find(".alert-warning:not(:contains('\"R\"')):contains('Uważaj, by ognisty mrówkojad nie ugotował twojego jajka')").length > 0){
                    html = '<p class="alert alert-warning text-center">Jajko jest w <strong>Most Sieci Metra</strong></p>';
                    console.log('29');
                    this.find(".panel-body p:nth(0)").after(html);
                }
                if(this.find(".alert-warning:not(:contains('\"R\"')):contains('Minccino uważnie zamiata w pobliżu jajka')").length > 0){
                    html = '<p class="alert alert-warning text-center">Jajko jest w <strong>Wiejski Most</strong></p>';
                    console.log('30');
                    this.find(".panel-body p:nth(0)").after(html);
                }
                if(this.find(".alert-warning:not(:contains('\"R\"')):contains('Roślinna małpka fika blisko twojego jajka')").length > 0){
                    html = '<p class="alert alert-warning text-center">Jajko jest w <strong>Rancho</strong></p>';
                    console.log('31');
                    this.find(".panel-body p:nth(0)").after(html);
                }
                if(this.find(".alert-warning:not(:contains('\"R\"')):contains('Ciężki do spotkania Tirtouga kręci się w poblizu twojego jajka')").length > 0){
                    html = '<p class="alert alert-warning text-center">Jajko jest w <strong>Strzelisty Most</strong></p>';
                    console.log('32');
                    this.find(".panel-body p:nth(0)").after(html);
                }
                if(this.find(".alert-warning:not(:contains('\"R\"')):contains('Ferroseed patrzy się na twoje jajko')").length > 0){
                    html = '<p class="alert alert-warning text-center">Jajko jest w <strong>Jaskinia Elektrokamieni</strong></p>';
                    console.log('33');
                    this.find(".panel-body p:nth(0)").after(html);
                }
                if(this.find(".alert-warning:not(:contains('\"R\"')):contains('Ciężki do spotkania Archen kręci się w pobliżu twojego jajka')").length > 0){
                    html = '<p class="alert alert-warning text-center">Jajko jest w <strong>Wiejski Most</strong></p>';
                    console.log('34');
                    this.find(".panel-body p:nth(0)").after(html);
                }
                if(this.find(".alert-warning:not(:contains('\"R\"')):contains('Vanillite obserwuje twoje jajko')").length > 0){
                    html = '<p class="alert alert-warning text-center">Jajko jest w <strong>Most Zwodzony Driftveil</strong></p>';
                    console.log('35');
                    this.find(".panel-body p:nth(0)").after(html);
                }
                if(this.find(".alert-warning:not(:contains('\"R\"')):contains('Jeleń z czerwonym liściastym porożem stąpa ostrożnie blisko twojego jajka')").length > 0){
                    html = '<p class="alert alert-warning text-center">Jajko jest w <strong>Wiejski Most</strong></p>';
                    console.log('36');
                    this.find(".panel-body p:nth(0)").after(html);
                }
                if(this.find(".alert-warning:not(:contains('\"R\"')):contains('Uważnie przyglądaj się różnego radzaju kamieniom. Pewnie wśród nich ukryło się kolejne jajko')").length > 0){
                    html = '<p class="alert alert-warning text-center">Jajko jest w <strong>Jaskinia Elektrokamieni</strong></p>';
                    console.log('37');
                    this.find(".panel-body p:nth(0)").after(html);
                }
                if(this.find(".alert-warning:not(:contains('\"R\"')):contains('Ognista świnka ogrzewa twoje jajko')").length > 0){
                    html = '<p class="alert alert-warning text-center">Jajko jest w <strong>Most Sieci Metra</strong></p>';
                    console.log('38');
                    this.find(".panel-body p:nth(0)").after(html);
                }
                if(this.find(".alert-warning:not(:contains('\"R\"')):contains('Czy cudowny amulet doda ci szczęścia przy szukaniu jajka?')").length > 0){
                    html = '<p class="alert alert-warning text-center">Jajko jest w <strong>Cudowny Most</strong></p>';
                    console.log('39');
                    this.find(".panel-body p:nth(0)").after(html);
                }
                if(this.find(".alert-warning:not(:contains('\"R\"')):contains('Elektryczna latająca wiewiórka fruwa w okolicach następnego jaja')").length > 0){
                    html = '<p class="alert alert-warning text-center">Jajko jest w <strong>Wiejski Most</strong></p>';
                    console.log('40');
                    this.find(".panel-body p:nth(0)").after(html);
                }
                if(this.find(".alert-warning:not(:contains('\"R\"')):contains('Alomomola chętnie ci wskaże miejsce występowania następnego jajka')").length > 0){
                    html = '<p class="alert alert-warning text-center">Jajko jest w <strong>Strzelisty Most</strong></p>';
                    console.log('41');
                    this.find(".panel-body p:nth(0)").after(html);
                }
                if(this.find(".alert-warning:not(:contains('\"R\"')):contains('Elektryczny pajączek tka swoje sieci nad twoim jajem')").length > 0){
                    html = '<p class="alert alert-warning text-center">Jajko jest w <strong>Jaskinia Elektrokamieni</strong></p>';
                    console.log('42');
                    this.find(".panel-body p:nth(0)").after(html);
                }
                if(this.find(".alert-warning:not(:contains('\"R\"')):contains('Elektromagnes niestety nie zareaguje na jajko chociaż jest bardzo przydatny w tej dziczy')").length > 0){
                    html = '<p class="alert alert-warning text-center">Jajko jest w <strong>Jaskinia Elektrokamieni</strong></p>';
                    console.log('42');
                    this.find(".panel-body p:nth(0)").after(html);
                }
                if(this.find(".alert-warning:not(:contains('\"R\"')):contains('Uważaj na wściekłe Haxorusy w tej dziczy co następne jajo')").length > 0){
                    html = '<p class="alert alert-warning text-center">Jajko jest w <strong>Cudowny Most</strong></p>';
                    console.log('43');
                    this.find(".panel-body p:nth(0)").after(html);
                }
                if(this.find(".alert-warning:not(:contains('\"R\"')):contains('Throh i Sawk trenują w okolicy twojego jajka')").length > 0){
                    html = '<p class="alert alert-warning text-center">Jajko jest w <strong>Most Sieci Metra</strong></p>';
                    console.log('44');
                    this.find(".panel-body p:nth(0)").after(html);
                }
                if(this.find(".alert-warning:not(:contains('\"R\"')):contains('Kto wie, może znajdziesz Kryształ szukając kolejnego jajka?')").length > 0){
                    html = '<p class="alert alert-warning text-center">Jajko jest w <strong>Jaskinia Elektrokamieni</strong></p>';
                    console.log('45');
                    this.find(".panel-body p:nth(0)").after(html);
                }
                if(this.find(".alert-warning:not(:contains('\"R\"')):contains('Wychodząc z dziczy schowaj jajko w szczelniejszych kieszeniach')").length > 0){
                    html = '<p class="alert alert-warning text-center">Jajko jest w <strong>Strzelisty Most</strong></p>';
                    console.log('46');
                    this.find(".panel-body p:nth(0)").after(html);
                }
                if(this.find(".alert-warning:not(:contains('\"R\"')):contains('Scraggy uparcie podciąga spodenki biegając blisko twojego jajka.h')").length > 0){
                    html = '<p class="alert alert-warning text-center">Jajko jest w <strong>Most Sieci Metra</strong></p>';
                    console.log('47');
                    this.find(".panel-body p:nth(0)").after(html);
                }
            }
        })

        $(document).on("click", "#refreshWielkanocWidget", function (event) {
            refreshWielkanocWidget();
            $.get('inc/stan.php', function(data) { $("#sidebar").html(data); });
        });
    }
}
initWielkanocWidget();



// **********************
//
// initAutouzupelnianiePol
// Funkcja dodająca logowanie tego co wyświetla sie na ekranie
//
// **********************
function initAutouzupelnianiePol(){

    $(document).on("click", "#plecak-jagody .thumbnail-plecak, .thumbnail-plecak[data-target='#plecak-11'], .thumbnail-plecak[data-target='#plecak-15']", function (event) {
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
        var api = "https://bra1ns.com/pokelife/get.php?login=" + $('#wyloguj').parent().parent().html().split("<div")[0].trim();
        $.getJSON(api, {
            format: "json"
        }).done(function (data) {
            var html = '<div class="panel panel-primary"><div class="panel-heading">Ostatnio spotkane shiny<div class="navbar-right"><span id="refreshShinyWidget" style="color: white; top: 4px; font-size: 16px; right: 3px;" class="glyphicon glyphicon-refresh" aria-hidden="true"></span></div></div><table class="table table-striped table-condensed"><tbody><tr>';
            $.each(data.list, function (key, value) {
                html = html + "<td data-toggle='tooltip' data-placement='top' title='' data-original-title='Spotkany: "+value['creation_date']+"' style='text-align: center;'><img src='http://poke-life.net/pokemony/srednie/s" + value['pokemon_id'] + ".png' style='width: 40px; height: 40px;'></td>";
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
            this.find('button[href="raport.php"]').parent().prepend('<img src="https://gra.pokelife.pl/'+hodowlaPokemonDniaImage+'" data-toggle="tooltip" data-placement="top" title="" data-original-title="Pokemon Dnia" style=" width: 50px;margin-left: 10px; float: left; ">');
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
    $('body').append('<a id="PokeLifeScriptStats" style="color: #333333 !important;text-decoration:none;" target="_blank" href="https://bra1ns.com/pokelife/stats"><div class="plugin-button" style="border-radius: 4px;position: fixed;cursor: pointer;top: 15px;left: 220px;font-size: 19px;text-align: center;width: 100px;height: 30px;line-height: 35px;z-index: 9998;text-align: center;line-height: 30px;color: #333333;">Statystyki</div></a>');
    $("#PokeLifeScriptStats").attr("href", "https://bra1ns.com/pokelife/stats?login="+$('#wyloguj').parent().parent().html().split("<div")[0].trim());
}
initStatystykiLink();



// **********************
//
// initVersionInfo
// Funkcja dodająca numer wersji na dole strony
//
// **********************
function initVersionInfo(){
    $('body').append('<div id="newVersionInfo" style="border-radius: 4px; position: fixed; cursor: pointer; bottom: 10px; right: 20px; font-size: 19px; text-align: center; width: auto; height: 30px; line-height: 35px; z-index: 9998; text-align: right;"><a style="color: yellow !important;text-decoration:none;" target="_blank" href="https://github.com/krozum/pokelife#user-content-changelog">' + (GM_info.script.version == window.localStorage.lastVersion ? "" : "New Version! ") + 'v' + GM_info.script.version + '</a></div>');
    window.localStorage.lastVersion = GM_info.script.version;
};
initVersionInfo();



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

    function initPokemonIcon() {
        $('body').append('<div id="setPokemon" style="position: fixed; cursor: pointer; top: 0; left: 10px; z-index: 9999"></div>');

        IconSelect.COMPONENT_ICON_FILE_PATH = "";

        iconPokemon = new IconSelect("setPokemon", {
            'selectedIconWidth': 48,
            'selectedIconHeight': 48,
            'selectedBoxPadding': 1,
            'iconsWidth': 48,
            'iconsHeight': 48,
            'boxIconSpace': 1,
            'vectoralIconNumber': 1,
            'horizontalIconNumber': 6
        });

        console.log(iconPokemon);

        var selectPokemon = [];
        let i = 0;
        $.each($('.stan-pokemon'), function (index, item) {
            let src = $(item).find('img').attr('src');
            if (src != "undefined" && src != undefined) {
                selectPokemon.push({ 'iconFilePath': $(item).find('img').attr('src'), 'iconValue': "&wybierz_pokemona=" + i });
                i = i + 1;
            }
        });

        iconPokemon.refresh(selectPokemon);

        if (window.localStorage.pokemonIconsIndex) {
            iconPokemon.setSelectedIndex(window.localStorage.pokemonIconsIndex);
        } else {
            iconPokemon.setSelectedIndex(0);
            window.localStorage.pokemonIconsIndex = 0;
        }

        document.getElementById('setPokemon').addEventListener('changed', function (e) {
            window.localStorage.pokemonIconsIndex = iconPokemon.getSelectedIndex();
        });
    }
    initPokemonIcon();

    function initPokeballIcon() {
        $('body').append('<div id="setPokeball" style="position: fixed; cursor: pointer; top: 0; left: 60px; z-index: 9999"></div>');

        iconPokeball = new IconSelect("setPokeball", {
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
                'iconFilePath': "images/pokesklep/swarmballe.jpg",
                'iconValue': function() {
                    var d = new Date();
                    var h = d.getHours();
                    if (h >= 22 || h < 6) {
                        return '&zlap_pokemona=nightballe';
                    }
                    let pokeLvlNumber = $('#glowne_okno i:nth("1")').parent().html().split("(")[1].split(" poz")[0];
                    if (pokeLvlNumber < 3) {
                        return '&zlap_pokemona=uzyj_swarmballe';
                    } else if (pokeLvlNumber >= 3 && pokeLvlNumber < 15) {
                        return '&zlap_pokemona=nestballe';
                    } else {
                        return '&zlap_pokemona=greatballe';
                    }
                }
            },
            {
                'iconFilePath': "https://gra.pokelife.pl/images/event/sniezka.jpg",
                'iconValue': function(){
                    var pokemonId = $('#glowne_okno img:nth(1)').attr("src").split("/")[2].split('.')[0];
                    var fruits = ["361", "362", "378", "471", "582", "583", "584", "613", "614", "615", "712", "713", "124", "144", "220", "221", "225", "238", "363", "364", "365", "473", "478", "87", "91", "131", "215", "459", "460", "461", "479"];
                    if(fruits.indexOf(pokemonId) != -1){
                        return '&zlap_pokemona=pokeballe';
                    }
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
            }
        ];

        iconPokeball.refresh(selectPokeball);

        if (window.localStorage.pokeballIconIndex) {
            iconPokeball.setSelectedIndex(window.localStorage.pokeballIconIndex);
        } else {
            iconPokeball.setSelectedIndex(1);
            window.localStorage.pokeballIconIndex = 1;
        }

        document.getElementById('setPokeball').addEventListener('changed', function (e) {
            window.localStorage.pokeballIconIndex = iconPokeball.getSelectedIndex();
        });
    }
    initPokeballIcon();

    function initLocationIcon() {
        $('body').append('<div id="setLocation" style="position: fixed; cursor: pointer; top: 0; left: 117px; z-index: 9999"></div>');

        iconLocation = new IconSelect("setLocation", {
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
            if ($(item).find('a').attr('href').substring(0, 9) == "gra/dzicz") {
                icons.push({ 'iconFilePath': $(item).find('img').attr('src'), 'iconValue': $(item).find('a').attr('href').substring(28) });
            }
        });

        iconLocation.refresh(icons);

        if (window.localStorage.locationIconsIndex) {
            iconLocation.setSelectedIndex(window.localStorage.locationIconsIndex);
        } else {
            iconLocation.setSelectedIndex(0);
            window.localStorage.locationIconsIndex = 0;
        }

        document.getElementById('setLocation').addEventListener('changed', function (e) {
            window.localStorage.locationIconsIndex = iconLocation.getSelectedIndex();
        });
    }
    initLocationIcon();

    function initGoButton(){
        window.localStorage.spaceGo == undefined ? window.localStorage.spaceGo = true : null;
        $('body').append('<div id="goButton" style="' + (window.localStorage.spaceGo ? (window.localStorage.spaceGo == "true" ? "opacity: 0.3;" : "opacity: 1;") : "opacity: 1;") + 'border-radius: 4px;position: fixed; cursor: pointer; top: 5px; right: 10px; font-size: 36px; text-align: center; width: 100px; height: 48px; line-height: 48px; background: ' + $('.panel-heading').css('background-color') + '; z-index: 9999">GO</div>');
        $('body').append('<div id="goAutoButton" style="border-radius: 4px;position: fixed; cursor: pointer; top: 5px; right: 122px; font-size: 36px; text-align: center; width: 140px; height: 48px; line-height: 48px; background: ' + $('.panel-heading').css('background-color') + '; z-index: 9999">AutoGO</div>');
    }
    initGoButton();

    function click() {
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
                    console.log('PokeLifeScript Beta: lecze ze jagody');
                    $.get( 'gra/plecak.php?uzyj&rodzaj_przedmiotu=czerwone_jagody&tylko_komunikat&ulecz_wszystkie&zjedz_max', function( data ) {
                        console.log('PokeLifeScript Beta: lecze ze yeny');
                        $.get( 'gra/lecznica.php?wylecz_wszystkie&tylko_komunikat', function( data ) {
                            var koszt = $(data).find(".alert-success strong").html().split(" ¥")[0];
                            updateStats("koszty_leczenia", koszt.replace(/\./g, ''));

                            $.get( 'inc/stan.php', function( data ) {
                                $( "#sidebar" ).html( data );
                                $('.btn-wybor_pokemona').attr("disabled", false);
                                $('.btn-wybor_pokemona .progress-bar').css("width", "100%");
                                $('.btn-wybor_pokemona .progress-bar span').html("100% PŻ");
                                click();
                            });
                        });
                    });
                }
            }
        });

        if (canRun) {
            lastClick = 'nieleczenie';
            window.localStorage.catchMode = true;
            if($('#glowne_okno .panel-heading').length > 0){
                if ($('.dzikipokemon-background-shiny').length > 0) {
                    console.log('PokeLifeScript Beta: spotkany Shiny, przerwanie AutoGo');
                    autoGo = false;
                    $('#goAutoButton').html('AutoGO');
                    fetch("https://bra1ns.com/pokelife/insert.php?pokemon_id=" + $('.dzikipokemon-background-shiny .center-block img').attr('src').split('/')[1].split('.')[0].split('s')[1] + "&login=" + $('#wyloguj').parent().parent().html().split("<div")[0].trim());
                } else if (window.localStorage.catchMode == "true" && $('.dzikipokemon-background-normalny img[src="images/inne/pokeball_miniature2.png"]').length > 0 && $('.dzikipokemon-background-normalny img[src="images/trudnosc/trudnoscx.png"]').length < 1 && $('.dzikipokemon-background-normalny .col-xs-9 > b').html().split("Poziom: ")[1] <= 50) {
                    console.log('PokeLifeScript Beta: spotkany niezłapany pokemona, przerwanie AutoGo');
                    autoGo = false;
                    $('#goAutoButton').html('AutoGO');
                } else if ($('.dzikipokemon-background-normalny').length == 1) {
                    console.log('PokeLifeScript Beta: atakuje pokemona');
                    var url = "dzicz.php?miejsce=" + iconLocation.getSelectedValue() + iconPokemon.getSelectedValue();
                    $('button[href="' + url + '"]').trigger('click');
                } else if ($("form[action='dzicz.php?zlap']").length == 1) {
                    console.log('PokeLifeScript Beta: rzucam pokeballa');
                    $('label[href="dzicz.php?miejsce=' + iconLocation.getSelectedValue() + iconPokeball.getSelectedValue().call() + '"]').trigger('click');
                } else if ($("form[action='dzicz.php?zlap_pokemona=swarmballe&miejsce=" + iconLocation.getSelectedValue()+ "']").length == 1) {
                    console.log('PokeLifeScript Beta: rzucam 1 swarmballa');
                    $("form[action='dzicz.php?zlap_pokemona=swarmballe&miejsce=" + iconLocation.getSelectedValue()+ "']").submit();
                } else if ($('.progress-stan2 div').attr('aria-valuenow') < 5) {
                    console.log('PokeLifeScript Beta: brak PA, przerywam AutoGo');
                    autoGo = false;
                    $('#goAutoButton').html('AutoGO');
                } else {
                    console.log('PokeLifeScript Beta: idę do dziczy ' + iconLocation.getSelectedValue() + ".");
                    $('#pasek_skrotow a[href="gra/dzicz.php?poluj&miejsce=' + iconLocation.getSelectedValue() + '"] img').trigger('click');
                }
            }
        }
    }

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
        if (autoGo) {
            click();
        } else {
            $("html, body").animate({ scrollTop: 0 }, "fast");
        }
    })

    onReloadMain(function(){
        if (autoGo) {
            if(this.find(".panel-body > p.alert-danger").length > 0){
                if(this.find(".panel-body > p.alert-danger:contains('Posiadasz za mało punktów akcji')").length > 0){
                    console.log('PokeLifeScript Beta: brak PA, przerywam AutoGo');
                    autoGo = false;
                    $('#goAutoButton').html('AutoGO');
                } else if(this.find(".panel-body > p.alert-danger:contains('Nie masz wystarczającej ilośći Punktów Akcji')").length > 0){
                    console.log('PokeLifeScript Beta: brak PA, przerywam AutoGo');
                    autoGo = false;
                    $('#goAutoButton').html('AutoGO');
                }
            }
        }
    })

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
};
initAutoGo();



// **********************
//
// initLogger
// Funkcja dodająca logowanie tego co wyświetla sie na ekranie
//
// **********************
function initLogger(){
    onReloadMain(function(){
        var DATA = this;

        if(DATA.find("p.alert-info:contains('Niestety, tym razem nie spotkało cię nic interesującego.')").length > 0){
            console.log('PokeLifeScript Beta: pusta wyprawa');
        } else if(DATA.find("p.alert-success:contains('pojedynek')").length > 0){
            console.log(DATA.find("p.alert-success:contains('pojedynek')").html());
            console.log('PokeLifeScript Beta: walka z trenerem');
            updateStats("walki_z_trenerami", 1);
            var pd = 0;
            if(DATA.find(".alert-success:not(:contains('Moc odznaki odrzutowca sprawia'))").length > 2){
                $.each(DATA.find(".alert-success:not(:contains('Moc odznaki odrzutowca sprawia')):nth(2) b").html().split("PD<br>"), function(key, value){
                    if(value != ""){
                        pd = pd + Number(value.split("+")[1]);
                    }
                });
                updateStats("zarobki_z_trenerow", DATA.find(".alert-success:not(:contains('Moc odznaki odrzutowca sprawia')):nth(1) b").html().split(" ¥")[0]);
                updateStats("zdobyte_doswiadczenie", pd);
            } else {
                $.each(DATA.find(".alert-success:not(:contains('Moc odznaki odrzutowca sprawia')):nth(1) b").html().split("PD<br>"), function(key, value){
                    if(value != ""){
                        pd = pd + Number(value.split("+")[1]);
                    }
                });
                updateStats("zdobyte_doswiadczenie", pd);
            }
        } else if(DATA.find(".dzikipokemon-background-normalny").length > 0){
            console.log('PokeLifeScript Beta: spotkany pokemon');
        } else if(DATA.find("h2:contains('Złap Pokemona')").length > 0){
            console.log('PokeLifeScript Beta: pokemon pokonany');
            updateStats("wygranych_walk_w_dziczy", 1);
            updateStats("zdobyte_doswiadczenie", DATA.find('p.alert-success:first').html().split("zyskuje ")[1].split(" punktów")[0]);
        } else if(DATA.find("h2:contains('Pokemon Ucieka')").length > 0){
            console.log('PokeLifeScript Beta: pokemon pokonany ale ucieka');
            updateStats("wygranych_walk_w_dziczy", 1);
            updateStats("zdobyte_doswiadczenie", DATA.find('p.alert-success:first').html().split("zyskuje ")[1].split(" punktów")[0]);
        } else if(DATA.find(".panel-body > p.alert-success:contains('Udało Ci się złapać')").length > 0){
            console.log('PokeLifeScript Beta: pokemon złapany');
            updateStats("zlapanych_pokemonow", 1);
            if(DATA.find('p.alert-success:nth(1):contains("nie masz już miejsca")').length > 0){
                var zarobek  = DATA.find('p.alert-success:nth(1):contains("nie masz już miejsca") strong').html().split(" ")[0].replace(/\./g, '');
                updateStats("zarobki_z_hodowli", zarobek);
            }
        } else if(DATA.find(".panel-body > p.alert-danger:contains('uwolnił')").length > 0){
            console.log('PokeLifeScript Beta: pokemon sie uwolnił');
            updateStats("niezlapanych_pokemonow", 1);
        } else if(DATA.find(".panel-body > p.alert-success").length > 0){
            console.log('PokeLifeScript Beta: event w dziczy');
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
            }
        } else if(DATA.find(".panel-body > p.alert-info").length > 0){
            console.log('PokeLifeScript Beta: event w dziczy');
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
                console.log('PokeLifeScript Beta: klikam link ' + number);
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
            var html = '<div class="col-xs-12" style=" text-align: center; "><button id="clickAllLinks" style=" background-color: #f1b03b; border: 1px solid #ce9532; border-radius: 5px; padding: 5px 25px; text-transform: uppercase; line-height: 20px; height: 40px; ">Wyklikaj wszystkie</button></div>';
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
    var jsonData = [];

    function initUnova(){
        $.get('gra/kolekcja.php', function( data ) {
            $(data).find('#kolekcja-5 div').each(function(index, value){
                jsonData[""+$(value).data('id-pokemona')] = $(value).hasClass('kolekcja-zlapane');
            })
            initRanczo();
            initMostZwodzonyDriftveil();
            initCudownyMost();
            initStrzelistyMost();
            initMostSieciMetra();
            initWiejskiMost();
            initJaskiniaElektrokamieni();
            iniReliktowyZamek();
        });

        function initRanczo(){
            $(document).on('mouseenter', 'a[href="gra/dzicz.php?poluj&miejsce=ranczo"]', function(){
                var html = '<div id="opisRancho" style="z-index: 999; max-width: 300px; bottom: 90px; position: fixed; left: 0; right: 0; margin: 0 auto; background: #222; opacity: .9; color: white; padding: 15px">'
                if(!jsonData["495"]){
                    html = html + '<li style="display: inline; float: left; margin: 5px; text-align: center;"><img style="max-width: 40px; max-height: 40px;" src="https://gra.pokelife.pl/pokemony/niezdobyte/495.png"><p style="margin: 0;">Snivy</p></li>';
                }
                if(!jsonData["496"]){
                    html = html + '<li style="display: inline; float: left; margin: 5px; text-align: center;"><img style="max-width: 40px; max-height: 40px;" src="https://gra.pokelife.pl/pokemony/niezdobyte/496.png"><p style="margin: 0;">Servine</p></li>';
                }
                if(!jsonData["497"]){
                    html = html + '<li style="display: inline; float: left; margin: 5px; text-align: center;"><img style="max-width: 40px; max-height: 40px;" src="https://gra.pokelife.pl/pokemony/niezdobyte/497.png"><p style="margin: 0;">Serperior</p></li>';
                }
                if(!jsonData["504"]){
                    html = html + '<li style="display: inline; float: left; margin: 5px; text-align: center;"><img style="max-width: 40px; max-height: 40px;" src="https://gra.pokelife.pl/pokemony/niezdobyte/504.png"><p style="margin: 0;">Patrat</p></li>';
                }
                if(!jsonData["505"]){
                    html = html + '<li style="display: inline; float: left; margin: 5px; text-align: center;"><img style="max-width: 40px; max-height: 40px;" src="https://gra.pokelife.pl/pokemony/niezdobyte/505.png"><p style="margin: 0;">Watchog</p></li>';
                }
                if(!jsonData["506"]){
                    html = html + '<li style="display: inline; float: left; margin: 5px; text-align: center;"><img style="max-width: 40px; max-height: 40px;" src="https://gra.pokelife.pl/pokemony/niezdobyte/506.png"><p style="margin: 0;">Lillipup</p></li>';
                }
                if(!jsonData["507"]){
                    html = html + '<li style="display: inline; float: left; margin: 5px; text-align: center;"><img style="max-width: 40px; max-height: 40px;" src="https://gra.pokelife.pl/pokemony/niezdobyte/507.png"><p style="margin: 0;">Herdier</p></li>';
                }
                if(!jsonData["508"]){
                    html = html + '<li style="display: inline; float: left; margin: 5px; text-align: center;"><img style="max-width: 40px; max-height: 40px;" src="https://gra.pokelife.pl/pokemony/niezdobyte/508.png"><p style="margin: 0;">Stoutland</p></li>';
                }
                if(!jsonData["511"]){
                    html = html + '<li style="display: inline; float: left; margin: 5px; text-align: center;"><img style="max-width: 40px; max-height: 40px;" src="https://gra.pokelife.pl/pokemony/niezdobyte/511.png"><p style="margin: 0;">Pansage</p></li>';
                }
                if(!jsonData["519"]){
                    html = html + '<li style="display: inline; float: left; margin: 5px; text-align: center;"><img style="max-width: 40px; max-height: 40px;" src="https://gra.pokelife.pl/pokemony/niezdobyte/519.png"><p style="margin: 0;">Pidove</p></li>';
                }
                if(!jsonData["520"]){
                    html = html + '<li style="display: inline; float: left; margin: 5px; text-align: center;"><img style="max-width: 40px; max-height: 40px;" src="https://gra.pokelife.pl/pokemony/niezdobyte/520.png"><p style="margin: 0;">Tranquill</p></li>';
                }
                if(!jsonData["521"]){
                    html = html + '<li style="display: inline; float: left; margin: 5px; text-align: center;"><img style="max-width: 40px; max-height: 40px;" src="https://gra.pokelife.pl/pokemony/niezdobyte/521.png"><p style="margin: 0;">Unfezant</p></li>';
                }
                if(!jsonData["531"]){
                    html = html + '<li style="display: inline; float: left; margin: 5px; text-align: center;"><img style="max-width: 40px; max-height: 40px;" src="https://gra.pokelife.pl/pokemony/niezdobyte/531.png"><p style="margin: 0;">Audino</p></li>';
                }
                if(!jsonData["540"]){
                    html = html + '<li style="display: inline; float: left; margin: 5px; text-align: center;"><img style="max-width: 40px; max-height: 40px;" src="https://gra.pokelife.pl/pokemony/niezdobyte/540.png"><p style="margin: 0;">Sewaddle</p></li>';
                }
                if(!jsonData["541"]){
                    html = html + '<li style="display: inline; float: left; margin: 5px; text-align: center;"><img style="max-width: 40px; max-height: 40px;" src="https://gra.pokelife.pl/pokemony/niezdobyte/541.png"><p style="margin: 0;">Swadloon</p></li>';
                }
                if(!jsonData["546"]){
                    html = html + '<li style="display: inline; float: left; margin: 5px; text-align: center;"><img style="max-width: 40px; max-height: 40px;" src="https://gra.pokelife.pl/pokemony/niezdobyte/546.png"><p style="margin: 0;">Cottonee</p></li>';
                }
                if(!jsonData["548"]){
                    html = html + '<li style="display: inline; float: left; margin: 5px; text-align: center;"><img style="max-width: 40px; max-height: 40px;" src="https://gra.pokelife.pl/pokemony/niezdobyte/548.png"><p style="margin: 0;">Petilil</p></li>';
                }
                if(!jsonData["585"]){
                    html = html + '<li style="display: inline; float: left; margin: 5px; text-align: center;"><img style="max-width: 40px; max-height: 40px;" src="https://gra.pokelife.pl/pokemony/niezdobyte/585.png"><p style="margin: 0;">Deerling</p></li>';
                }
                if(!jsonData["586"]){
                    html = html + '<li style="display: inline; float: left; margin: 5px; text-align: center;"><img style="max-width: 40px; max-height: 40px;" src="https://gra.pokelife.pl/pokemony/niezdobyte/586.png"><p style="margin: 0;">Sawsbuck</p></li>';
                }
                if(!jsonData["616"]){
                    html = html + '<li style="display: inline; float: left; margin: 5px; text-align: center;"><img style="max-width: 40px; max-height: 40px;" src="https://gra.pokelife.pl/pokemony/niezdobyte/616.png"><p style="margin: 0;">Shelmet</p></li>';
                }
                html = html + '</div>';
                $('body').append(html);
            })


            $(document).on('mouseleave', 'a[href="gra/dzicz.php?poluj&miejsce=ranczo"]', function(){
                $('#opisRancho').remove();
            })
        }

        function initMostZwodzonyDriftveil(){
            $(document).on('mouseenter', 'a[href="gra/dzicz.php?poluj&miejsce=most_zwodzony_driftveil"]', function(){
                var html = '<div id="opisMostZwodzonyDriftveil" style="z-index: 999; max-width: 300px; bottom: 90px; position: fixed; left: 0; right: 0; margin: 0 auto; background: #222; opacity: .9; color: white; padding: 15px">'
                if(!jsonData["515"]){
                    html = html + '<li style="display: inline; float: left; margin: 5px; text-align: center;"><img style="max-width: 40px; max-height: 40px;" src="https://gra.pokelife.pl/pokemony/niezdobyte/515.png"><p style="margin: 0;">Panpour</p></li>';
                }
                if(!jsonData["557"]){
                    html = html + '<li style="display: inline; float: left; margin: 5px; text-align: center;"><img style="max-width: 40px; max-height: 40px;" src="https://gra.pokelife.pl/pokemony/niezdobyte/557.png"><p style="margin: 0;">Dwebble</p></li>';
                }
                if(!jsonData["558"]){
                    html = html + '<li style="display: inline; float: left; margin: 5px; text-align: center;"><img style="max-width: 40px; max-height: 40px;" src="https://gra.pokelife.pl/pokemony/niezdobyte/558.png"><p style="margin: 0;">Crustle</p></li>';
                }
                if(!jsonData["577"]){
                    html = html + '<li style="display: inline; float: left; margin: 5px; text-align: center;"><img style="max-width: 40px; max-height: 40px;" src="https://gra.pokelife.pl/pokemony/niezdobyte/577.png"><p style="margin: 0;">Solosis</p></li>';
                }
                if(!jsonData["578"]){
                    html = html + '<li style="display: inline; float: left; margin: 5px; text-align: center;"><img style="max-width: 40px; max-height: 40px;" src="https://gra.pokelife.pl/pokemony/niezdobyte/578.png"><p style="margin: 0;">Duosion</p></li>';
                }
                if(!jsonData["579"]){
                    html = html + '<li style="display: inline; float: left; margin: 5px; text-align: center;"><img style="max-width: 40px; max-height: 40px;" src="https://gra.pokelife.pl/pokemony/niezdobyte/579.png"><p style="margin: 0;">Reuniclus</p></li>';
                }
                if(!jsonData["580"]){
                    html = html + '<li style="display: inline; float: left; margin: 5px; text-align: center;"><img style="max-width: 40px; max-height: 40px;" src="https://gra.pokelife.pl/pokemony/niezdobyte/580.png"><p style="margin: 0;">Ducklett</p></li>';
                }
                if(!jsonData["581"]){
                    html = html + '<li style="display: inline; float: left; margin: 5px; text-align: center;"><img style="max-width: 40px; max-height: 40px;" src="https://gra.pokelife.pl/pokemony/niezdobyte/581.png"><p style="margin: 0;">Swanna</p></li>';
                }
                if(!jsonData["582"]){
                    html = html + '<li style="display: inline; float: left; margin: 5px; text-align: center;"><img style="max-width: 40px; max-height: 40px;" src="https://gra.pokelife.pl/pokemony/niezdobyte/582.png"><p style="margin: 0;">Vanillite</p></li>';
                }
                if(!jsonData["583"]){
                    html = html + '<li style="display: inline; float: left; margin: 5px; text-align: center;"><img style="max-width: 40px; max-height: 40px;" src="https://gra.pokelife.pl/pokemony/niezdobyte/583.png"><p style="margin: 0;">Vanillish</p></li>';
                }
                if(!jsonData["584"]){
                    html = html + '<li style="display: inline; float: left; margin: 5px; text-align: center;"><img style="max-width: 40px; max-height: 40px;" src="https://gra.pokelife.pl/pokemony/niezdobyte/584.png"><p style="margin: 0;">Vanilluxe</p></li>';
                }
                if(!jsonData["585"]){
                    html = html + '<li style="display: inline; float: left; margin: 5px; text-align: center;"><img style="max-width: 40px; max-height: 40px;" src="https://gra.pokelife.pl/pokemony/niezdobyte/585.png"><p style="margin: 0;">Deerling</p></li>';
                }
                if(!jsonData["586"]){
                    html = html + '<li style="display: inline; float: left; margin: 5px; text-align: center;"><img style="max-width: 40px; max-height: 40px;" src="https://gra.pokelife.pl/pokemony/niezdobyte/586.png"><p style="margin: 0;">Sawsbuck</p></li>';
                }
                if(!jsonData["588"]){
                    html = html + '<li style="display: inline; float: left; margin: 5px; text-align: center;"><img style="max-width: 40px; max-height: 40px;" src="https://gra.pokelife.pl/pokemony/niezdobyte/588.png"><p style="margin: 0;">Karrablast</p></li>';
                }
                if(!jsonData["613"]){
                    html = html + '<li style="display: inline; float: left; margin: 5px; text-align: center;"><img style="max-width: 40px; max-height: 40px;" src="https://gra.pokelife.pl/pokemony/niezdobyte/613.png"><p style="margin: 0;">Cubchoo</p></li>';
                }
                if(!jsonData["614"]){
                    html = html + '<li style="display: inline; float: left; margin: 5px; text-align: center;"><img style="max-width: 40px; max-height: 40px;" src="https://gra.pokelife.pl/pokemony/niezdobyte/614.png"><p style="margin: 0;">Beartic</p></li>';
                }
                if(!jsonData["615"]){
                    html = html + '<li style="display: inline; float: left; margin: 5px; text-align: center;"><img style="max-width: 40px; max-height: 40px;" src="https://gra.pokelife.pl/pokemony/niezdobyte/615.png"><p style="margin: 0;">Cryogonal</p></li>';
                }
                if(!jsonData["621"]){
                    html = html + '<li style="display: inline; float: left; margin: 5px; text-align: center;"><img style="max-width: 40px; max-height: 40px;" src="https://gra.pokelife.pl/pokemony/niezdobyte/621.png"><p style="margin: 0;">Druddigon</p></li>';
                }
                if(!jsonData["622"]){
                    html = html + '<li style="display: inline; float: left; margin: 5px; text-align: center;"><img style="max-width: 40px; max-height: 40px;" src="https://gra.pokelife.pl/pokemony/niezdobyte/622.png"><p style="margin: 0;">Golett</p></li>';
                }
                if(!jsonData["623"]){
                    html = html + '<li style="display: inline; float: left; margin: 5px; text-align: center;"><img style="max-width: 40px; max-height: 40px;" src="https://gra.pokelife.pl/pokemony/niezdobyte/623.png"><p style="margin: 0;">Golurk</p></li>';
                }
                html = html + '</div>';
                $('body').append(html);
            })


            $(document).on('mouseleave', 'a[href="gra/dzicz.php?poluj&miejsce=most_zwodzony_driftveil"]', function(){
                $('#opisMostZwodzonyDriftveil').remove();
            })
        }

        function initCudownyMost(){
            $(document).on('mouseenter', 'a[href="gra/dzicz.php?poluj&miejsce=cudowny_most"]', function(){
                var html = '<div id="opisCudownyMost" style="z-index: 999; max-width: 320px; bottom: 90px; position: fixed; left: 0; right: 0; margin: 0 auto; background: #222; opacity: .9; color: white; padding: 15px">'
                if(!jsonData["513"]){
                    html = html + '<li style="display: inline; float: left; margin: 5px; text-align: center;"><img style="max-width: 40px; max-height: 40px;" src="https://gra.pokelife.pl/pokemony/niezdobyte/513.png"><p style="margin: 0;">Pansear</p></li>';
                }
                if(!jsonData["517"]){
                    html = html + '<li style="display: inline; float: left; margin: 5px; text-align: center;"><img style="max-width: 40px; max-height: 40px;" src="https://gra.pokelife.pl/pokemony/niezdobyte/517.png"><p style="margin: 0;">Munna</p></li>';
                }
                if(!jsonData["574"]){
                    html = html + '<li style="display: inline; float: left; margin: 5px; text-align: center;"><img style="max-width: 40px; max-height: 40px;" src="https://gra.pokelife.pl/pokemony/niezdobyte/574.png"><p style="margin: 0;">Gothita</p></li>';
                }
                if(!jsonData["575"]){
                    html = html + '<li style="display: inline; float: left; margin: 5px; text-align: center;"><img style="max-width: 40px; max-height: 40px;" src="https://gra.pokelife.pl/pokemony/niezdobyte/575.png"><p style="margin: 0;">Gothorita</p></li>';
                }
                if(!jsonData["576"]){
                    html = html + '<li style="display: inline; float: left; margin: 5px; text-align: center;"><img style="max-width: 40px; max-height: 40px;" src="https://gra.pokelife.pl/pokemony/niezdobyte/576.png"><p style="margin: 0;">Gothitelle</p></li>';
                }
                if(!jsonData["585"]){
                    html = html + '<li style="display: inline; float: left; margin: 5px; text-align: center;"><img style="max-width: 40px; max-height: 40px;" src="https://gra.pokelife.pl/pokemony/niezdobyte/585.png"><p style="margin: 0;">Deerling</p></li>';
                }
                if(!jsonData["586"]){
                    html = html + '<li style="display: inline; float: left; margin: 5px; text-align: center;"><img style="max-width: 40px; max-height: 40px;" src="https://gra.pokelife.pl/pokemony/niezdobyte/586.png"><p style="margin: 0;">Sawsbuck</p></li>';
                }
                if(!jsonData["605"]){
                    html = html + '<li style="display: inline; float: left; margin: 5px; text-align: center;"><img style="max-width: 40px; max-height: 40px;" src="https://gra.pokelife.pl/pokemony/niezdobyte/605.png"><p style="margin: 0;">Elgyem</p></li>';
                }
                if(!jsonData["606"]){
                    html = html + '<li style="display: inline; float: left; margin: 5px; text-align: center;"><img style="max-width: 40px; max-height: 40px;" src="https://gra.pokelife.pl/pokemony/niezdobyte/606.png"><p style="margin: 0;">Beheeyem</p></li>';
                }
                if(!jsonData["607"]){
                    html = html + '<li style="display: inline; float: left; margin: 5px; text-align: center;"><img style="max-width: 40px; max-height: 40px;" src="https://gra.pokelife.pl/pokemony/niezdobyte/607.png"><p style="margin: 0;">Litwick</p></li>';
                }
                if(!jsonData["608"]){
                    html = html + '<li style="display: inline; float: left; margin: 5px; text-align: center;"><img style="max-width: 40px; max-height: 40px;" src="https://gra.pokelife.pl/pokemony/niezdobyte/608.png"><p style="margin: 0;">Lampent</p></li>';
                }
                if(!jsonData["610"]){
                    html = html + '<li style="display: inline; float: left; margin: 5px; text-align: center;"><img style="max-width: 40px; max-height: 40px;" src="https://gra.pokelife.pl/pokemony/niezdobyte/610.png"><p style="margin: 0;">Axew</p></li>';
                }
                if(!jsonData["611"]){
                    html = html + '<li style="display: inline; float: left; margin: 5px; text-align: center;"><img style="max-width: 40px; max-height: 40px;" src="https://gra.pokelife.pl/pokemony/niezdobyte/611.png"><p style="margin: 0;">Fraxure</p></li>';
                }
                if(!jsonData["612"]){
                    html = html + '<li style="display: inline; float: left; margin: 5px; text-align: center;"><img style="max-width: 40px; max-height: 40px;" src="https://gra.pokelife.pl/pokemony/niezdobyte/612.png"><p style="margin: 0;">Haxorus</p></li>';
                }
                html = html + '</div>';
                $('body').append(html);
            })


            $(document).on('mouseleave', 'a[href="gra/dzicz.php?poluj&miejsce=cudowny_most"]', function(){
                $('#opisCudownyMost').remove();
            })
        }

        function initStrzelistyMost(){
            $(document).on('mouseenter', 'a[href="gra/dzicz.php?poluj&miejsce=strzelisty_most"]', function(){
                var html = '<div id="opisStrzelistyMost" style="z-index: 999; max-width: 320px; bottom: 90px; position: fixed; left: 0; right: 0; margin: 0 auto; background: #222; opacity: .9; color: white; padding: 15px">'
                if(!jsonData["501"]){
                    html = html + '<li style="display: inline; float: left; margin: 5px; text-align: center;"><img style="max-width: 40px; max-height: 40px;" src="https://gra.pokelife.pl/pokemony/niezdobyte/501.png"><p style="margin: 0;">Oshawott</p></li>';
                }
                if(!jsonData["502"]){
                    html = html + '<li style="display: inline; float: left; margin: 5px; text-align: center;"><img style="max-width: 40px; max-height: 40px;" src="https://gra.pokelife.pl/pokemony/niezdobyte/502.png"><p style="margin: 0;">Dewott</p></li>';
                }
                if(!jsonData["503"]){
                    html = html + '<li style="display: inline; float: left; margin: 5px; text-align: center;"><img style="max-width: 40px; max-height: 40px;" src="https://gra.pokelife.pl/pokemony/niezdobyte/503.png"><p style="margin: 0;">Samurott</p></li>';
                }
                if(!jsonData["535"]){
                    html = html + '<li style="display: inline; float: left; margin: 5px; text-align: center;"><img style="max-width: 40px; max-height: 40px;" src="https://gra.pokelife.pl/pokemony/niezdobyte/535.png"><p style="margin: 0;">Tympole</p></li>';
                }
                if(!jsonData["536"]){
                    html = html + '<li style="display: inline; float: left; margin: 5px; text-align: center;"><img style="max-width: 40px; max-height: 40px;" src="https://gra.pokelife.pl/pokemony/niezdobyte/536.png"><p style="margin: 0;">Palpitoad</p></li>';
                }
                if(!jsonData["537"]){
                    html = html + '<li style="display: inline; float: left; margin: 5px; text-align: center;"><img style="max-width: 40px; max-height: 40px;" src="https://gra.pokelife.pl/pokemony/niezdobyte/537.png"><p style="margin: 0;">Seismitoad</p></li>';
                }
                if(!jsonData["550"]){
                    html = html + '<li style="display: inline; float: left; margin: 5px; text-align: center;"><img style="max-width: 40px; max-height: 40px;" src="https://gra.pokelife.pl/pokemony/niezdobyte/550.png"><p style="margin: 0;">Basculin</p></li>';
                }
                if(!jsonData["592"]){
                    html = html + '<li style="display: inline; float: left; margin: 5px; text-align: center;"><img style="max-width: 40px; max-height: 40px;" src="https://gra.pokelife.pl/pokemony/niezdobyte/592.png"><p style="margin: 0;">Frillish</p></li>';
                }
                if(!jsonData["593"]){
                    html = html + '<li style="display: inline; float: left; margin: 5px; text-align: center;"><img style="max-width: 40px; max-height: 40px;" src="https://gra.pokelife.pl/pokemony/niezdobyte/593.png"><p style="margin: 0;">Jellicent</p></li>';
                }
                if(!jsonData["594"]){
                    html = html + '<li style="display: inline; float: left; margin: 5px; text-align: center;"><img style="max-width: 40px; max-height: 40px;" src="https://gra.pokelife.pl/pokemony/niezdobyte/594.png"><p style="margin: 0;">Alomomola</p></li>';
                }
                html = html + '</div>';
                $('body').append(html);
            })


            $(document).on('mouseleave', 'a[href="gra/dzicz.php?poluj&miejsce=strzelisty_most"]', function(){
                $('#opisStrzelistyMost').remove();
            })
        }

        function initMostSieciMetra(){
            $(document).on('mouseenter', 'a[href="gra/dzicz.php?poluj&miejsce=most_sieci_metra"]', function(){
                var html = '<div id="opisMostSieciMetra" style="z-index: 999; max-width: 320px; bottom: 90px; position: fixed; left: 0; right: 0; margin: 0 auto; background: #222; opacity: .9; color: white; padding: 15px">'
                if(!jsonData["498"]){
                    html = html + '<li style="display: inline; float: left; margin: 5px; text-align: center;"><img style="max-width: 40px; max-height: 40px;" src="https://gra.pokelife.pl/pokemony/niezdobyte/498.png"><p style="margin: 0;">Tepig</p></li>';
                }
                if(!jsonData["499"]){
                    html = html + '<li style="display: inline; float: left; margin: 5px; text-align: center;"><img style="max-width: 40px; max-height: 40px;" src="https://gra.pokelife.pl/pokemony/niezdobyte/499.png"><p style="margin: 0;">Pignite</p></li>';
                }
                if(!jsonData["500"]){
                    html = html + '<li style="display: inline; float: left; margin: 5px; text-align: center;"><img style="max-width: 40px; max-height: 40px;" src="https://gra.pokelife.pl/pokemony/niezdobyte/500.png"><p style="margin: 0;">Emboar</p></li>';
                }
                if(!jsonData["532"]){
                    html = html + '<li style="display: inline; float: left; margin: 5px; text-align: center;"><img style="max-width: 40px; max-height: 40px;" src="https://gra.pokelife.pl/pokemony/niezdobyte/532.png"><p style="margin: 0;">Timburr</p></li>';
                }
                if(!jsonData["533"]){
                    html = html + '<li style="display: inline; float: left; margin: 5px; text-align: center;"><img style="max-width: 40px; max-height: 40px;" src="https://gra.pokelife.pl/pokemony/niezdobyte/533.png"><p style="margin: 0;">Gurdurr</p></li>';
                }
                if(!jsonData["538"]){
                    html = html + '<li style="display: inline; float: left; margin: 5px; text-align: center;"><img style="max-width: 40px; max-height: 40px;" src="https://gra.pokelife.pl/pokemony/niezdobyte/538.png"><p style="margin: 0;">Throh</p></li>';
                }
                if(!jsonData["539"]){
                    html = html + '<li style="display: inline; float: left; margin: 5px; text-align: center;"><img style="max-width: 40px; max-height: 40px;" src="https://gra.pokelife.pl/pokemony/niezdobyte/539.png"><p style="margin: 0;">Sawk</p></li>';
                }
                if(!jsonData["543"]){
                    html = html + '<li style="display: inline; float: left; margin: 5px; text-align: center;"><img style="max-width: 40px; max-height: 40px;" src="https://gra.pokelife.pl/pokemony/niezdobyte/543.png"><p style="margin: 0;">Venipede</p></li>';
                }
                if(!jsonData["544"]){
                    html = html + '<li style="display: inline; float: left; margin: 5px; text-align: center;"><img style="max-width: 40px; max-height: 40px;" src="https://gra.pokelife.pl/pokemony/niezdobyte/544.png"><p style="margin: 0;">Whirlipede</p></li>';
                }
                if(!jsonData["545"]){
                    html = html + '<li style="display: inline; float: left; margin: 5px; text-align: center;"><img style="max-width: 40px; max-height: 40px;" src="https://gra.pokelife.pl/pokemony/niezdobyte/545.png"><p style="margin: 0;">Scolipede</p></li>';
                }
                if(!jsonData["559"]){
                    html = html + '<li style="display: inline; float: left; margin: 5px; text-align: center;"><img style="max-width: 40px; max-height: 40px;" src="https://gra.pokelife.pl/pokemony/niezdobyte/559.png"><p style="margin: 0;">Scraggy</p></li>';
                }
                if(!jsonData["560"]){
                    html = html + '<li style="display: inline; float: left; margin: 5px; text-align: center;"><img style="max-width: 40px; max-height: 40px;" src="https://gra.pokelife.pl/pokemony/niezdobyte/560.png"><p style="margin: 0;">Scrafty</p></li>';
                }
                if(!jsonData["568"]){
                    html = html + '<li style="display: inline; float: left; margin: 5px; text-align: center;"><img style="max-width: 40px; max-height: 40px;" src="https://gra.pokelife.pl/pokemony/niezdobyte/568.png"><p style="margin: 0;">Trubbish</p></li>';
                }
                if(!jsonData["569"]){
                    html = html + '<li style="display: inline; float: left; margin: 5px; text-align: center;"><img style="max-width: 40px; max-height: 40px;" src="https://gra.pokelife.pl/pokemony/niezdobyte/569.png"><p style="margin: 0;">Garbodor</p></li>';
                }
                if(!jsonData["618"]){
                    html = html + '<li style="display: inline; float: left; margin: 5px; text-align: center;"><img style="max-width: 40px; max-height: 40px;" src="https://gra.pokelife.pl/pokemony/niezdobyte/618.png"><p style="margin: 0;">Stunfisk</p></li>';
                }
                if(!jsonData["619"]){
                    html = html + '<li style="display: inline; float: left; margin: 5px; text-align: center;"><img style="max-width: 40px; max-height: 40px;" src="https://gra.pokelife.pl/pokemony/niezdobyte/619.png"><p style="margin: 0;">Mienfoo</p></li>';
                }
                if(!jsonData["620"]){
                    html = html + '<li style="display: inline; float: left; margin: 5px; text-align: center;"><img style="max-width: 40px; max-height: 40px;" src="https://gra.pokelife.pl/pokemony/niezdobyte/620.png"><p style="margin: 0;">Mienshao</p></li>';
                }
                if(!jsonData["624"]){
                    html = html + '<li style="display: inline; float: left; margin: 5px; text-align: center;"><img style="max-width: 40px; max-height: 40px;" src="https://gra.pokelife.pl/pokemony/niezdobyte/624.png"><p style="margin: 0;">Pawniard</p></li>';
                }
                if(!jsonData["631"]){
                    html = html + '<li style="display: inline; float: left; margin: 5px; text-align: center;"><img style="max-width: 40px; max-height: 40px;" src="https://gra.pokelife.pl/pokemony/niezdobyte/631.png"><p style="margin: 0;">Heatmor</p></li>';
                }
                if(!jsonData["632"]){
                    html = html + '<li style="display: inline; float: left; margin: 5px; text-align: center;"><img style="max-width: 40px; max-height: 40px;" src="https://gra.pokelife.pl/pokemony/niezdobyte/632.png"><p style="margin: 0;">Durant</p></li>';
                }
                html = html + '</div>';
                $('body').append(html);
            })


            $(document).on('mouseleave', 'a[href="gra/dzicz.php?poluj&miejsce=most_sieci_metra"]', function(){
                $('#opisMostSieciMetra').remove();
            })
        }

        function initWiejskiMost(){
            $(document).on('mouseenter', 'a[href="gra/dzicz.php?poluj&miejsce=wiejski_most"]', function(){
                var html = '<div id="opisWiejskiMost" style="z-index: 999; max-width: 320px; bottom: 90px; position: fixed; left: 0; right: 0; margin: 0 auto; background: #222; opacity: .9; color: white; padding: 15px">'
                if(!jsonData["509"]){
                    html = html + '<li style="display: inline; float: left; margin: 5px; text-align: center;"><img style="max-width: 40px; max-height: 40px;" src="https://gra.pokelife.pl/pokemony/niezdobyte/509.png"><p style="margin: 0;">Purrloin</p></li>';
                }
                if(!jsonData["510"]){
                    html = html + '<li style="display: inline; float: left; margin: 5px; text-align: center;"><img style="max-width: 40px; max-height: 40px;" src="https://gra.pokelife.pl/pokemony/niezdobyte/510.png"><p style="margin: 0;">Liepard</p></li>';
                }
                if(!jsonData["550"]){
                    html = html + '<li style="display: inline; float: left; margin: 5px; text-align: center;"><img style="max-width: 40px; max-height: 40px;" src="https://gra.pokelife.pl/pokemony/niezdobyte/550.png"><p style="margin: 0;">Basculin</p></li>';
                }
                if(!jsonData["572"]){
                    html = html + '<li style="display: inline; float: left; margin: 5px; text-align: center;"><img style="max-width: 40px; max-height: 40px;" src="https://gra.pokelife.pl/pokemony/niezdobyte/572.png"><p style="margin: 0;">Minccino</p></li>';
                }
                if(!jsonData["585"]){
                    html = html + '<li style="display: inline; float: left; margin: 5px; text-align: center;"><img style="max-width: 40px; max-height: 40px;" src="https://gra.pokelife.pl/pokemony/niezdobyte/585.png"><p style="margin: 0;">Deerling</p></li>';
                }
                if(!jsonData["586"]){
                    html = html + '<li style="display: inline; float: left; margin: 5px; text-align: center;"><img style="max-width: 40px; max-height: 40px;" src="https://gra.pokelife.pl/pokemony/niezdobyte/586.png"><p style="margin: 0;">Sawsbuck</p></li>';
                }
                if(!jsonData["587"]){
                    html = html + '<li style="display: inline; float: left; margin: 5px; text-align: center;"><img style="max-width: 40px; max-height: 40px;" src="https://gra.pokelife.pl/pokemony/niezdobyte/587.png"><p style="margin: 0;">Emolga</p></li>';
                }
                if(!jsonData["590"]){
                    html = html + '<li style="display: inline; float: left; margin: 5px; text-align: center;"><img style="max-width: 40px; max-height: 40px;" src="https://gra.pokelife.pl/pokemony/niezdobyte/590.png"><p style="margin: 0;">Foongus</p></li>';
                }
                if(!jsonData["591"]){
                    html = html + '<li style="display: inline; float: left; margin: 5px; text-align: center;"><img style="max-width: 40px; max-height: 40px;" src="https://gra.pokelife.pl/pokemony/niezdobyte/591.png"><p style="margin: 0;">Amoonguss</p></li>';
                }
                if(!jsonData["626"]){
                    html = html + '<li style="display: inline; float: left; margin: 5px; text-align: center;"><img style="max-width: 40px; max-height: 40px;" src="https://gra.pokelife.pl/pokemony/niezdobyte/626.png"><p style="margin: 0;">Bouffalant</p></li>';
                }
                if(!jsonData["627"]){
                    html = html + '<li style="display: inline; float: left; margin: 5px; text-align: center;"><img style="max-width: 40px; max-height: 40px;" src="https://gra.pokelife.pl/pokemony/niezdobyte/627.png"><p style="margin: 0;">Rufflet</p></li>';
                }
                if(!jsonData["629"]){
                    html = html + '<li style="display: inline; float: left; margin: 5px; text-align: center;"><img style="max-width: 40px; max-height: 40px;" src="https://gra.pokelife.pl/pokemony/niezdobyte/629.png"><p style="margin: 0;">Vullaby</p></li>';
                }
                html = html + '</div>';
                $('body').append(html);
            })


            $(document).on('mouseleave', 'a[href="gra/dzicz.php?poluj&miejsce=wiejski_most"]', function(){
                $('#opisWiejskiMost').remove();
            })
        }

        function initJaskiniaElektrokamieni(){
            $(document).on('mouseenter', 'a[href="gra/dzicz.php?poluj&miejsce=jaskinia_elektrokamieni"]', function(){
                var html = '<div id="opisJaskiniaElektrokamieni" style="z-index: 999; max-width: 320px; bottom: 90px; position: fixed; left: 0; right: 0; margin: 0 auto; background: #222; opacity: .9; color: white; padding: 15px">'
                if(!jsonData["522"]){
                    html = html + '<li style="display: inline; float: left; margin: 5px; text-align: center;"><img style="max-width: 40px; max-height: 40px;" src="https://gra.pokelife.pl/pokemony/niezdobyte/522.png"><p style="margin: 0;">Blitzle</p></li>';
                }
                if(!jsonData["523"]){
                    html = html + '<li style="display: inline; float: left; margin: 5px; text-align: center;"><img style="max-width: 40px; max-height: 40px;" src="https://gra.pokelife.pl/pokemony/niezdobyte/523.png"><p style="margin: 0;">Zebstrika</p></li>';
                }
                if(!jsonData["524"]){
                    html = html + '<li style="display: inline; float: left; margin: 5px; text-align: center;"><img style="max-width: 40px; max-height: 40px;" src="https://gra.pokelife.pl/pokemony/niezdobyte/524.png"><p style="margin: 0;">Roggenrola</p></li>';
                }
                if(!jsonData["525"]){
                    html = html + '<li style="display: inline; float: left; margin: 5px; text-align: center;"><img style="max-width: 40px; max-height: 40px;" src="https://gra.pokelife.pl/pokemony/niezdobyte/525.png"><p style="margin: 0;">Boldore</p></li>';
                }
                if(!jsonData["527"]){
                    html = html + '<li style="display: inline; float: left; margin: 5px; text-align: center;"><img style="max-width: 40px; max-height: 40px;" src="https://gra.pokelife.pl/pokemony/niezdobyte/527.png"><p style="margin: 0;">Woobat</p></li>';
                }
                if(!jsonData["529"]){
                    html = html + '<li style="display: inline; float: left; margin: 5px; text-align: center;"><img style="max-width: 40px; max-height: 40px;" src="https://gra.pokelife.pl/pokemony/niezdobyte/529.png"><p style="margin: 0;">Drilbur</p></li>';
                }
                if(!jsonData["530"]){
                    html = html + '<li style="display: inline; float: left; margin: 5px; text-align: center;"><img style="max-width: 40px; max-height: 40px;" src="https://gra.pokelife.pl/pokemony/niezdobyte/530.png"><p style="margin: 0;">Excadrill</p></li>';
                }
                if(!jsonData["595"]){
                    html = html + '<li style="display: inline; float: left; margin: 5px; text-align: center;"><img style="max-width: 40px; max-height: 40px;" src="https://gra.pokelife.pl/pokemony/niezdobyte/595.png"><p style="margin: 0;">Joltik</p></li>';
                }
                if(!jsonData["596"]){
                    html = html + '<li style="display: inline; float: left; margin: 5px; text-align: center;"><img style="max-width: 40px; max-height: 40px;" src="https://gra.pokelife.pl/pokemony/niezdobyte/596.png"><p style="margin: 0;">Galvantula</p></li>';
                }
                if(!jsonData["597"]){
                    html = html + '<li style="display: inline; float: left; margin: 5px; text-align: center;"><img style="max-width: 40px; max-height: 40px;" src="https://gra.pokelife.pl/pokemony/niezdobyte/597.png"><p style="margin: 0;">Ferroseed</p></li>';
                }
                if(!jsonData["598"]){
                    html = html + '<li style="display: inline; float: left; margin: 5px; text-align: center;"><img style="max-width: 40px; max-height: 40px;" src="https://gra.pokelife.pl/pokemony/niezdobyte/598.png"><p style="margin: 0;">Ferrothorn</p></li>';
                }
                if(!jsonData["599"]){
                    html = html + '<li style="display: inline; float: left; margin: 5px; text-align: center;"><img style="max-width: 40px; max-height: 40px;" src="https://gra.pokelife.pl/pokemony/niezdobyte/599.png"><p style="margin: 0;">Klink</p></li>';
                }
                if(!jsonData["600"]){
                    html = html + '<li style="display: inline; float: left; margin: 5px; text-align: center;"><img style="max-width: 40px; max-height: 40px;" src="https://gra.pokelife.pl/pokemony/niezdobyte/600.png"><p style="margin: 0;">Klang</p></li>';
                }
                if(!jsonData["601"]){
                    html = html + '<li style="display: inline; float: left; margin: 5px; text-align: center;"><img style="max-width: 40px; max-height: 40px;" src="https://gra.pokelife.pl/pokemony/niezdobyte/601.png"><p style="margin: 0;">Klinklang</p></li>';
                }
                if(!jsonData["602"]){
                    html = html + '<li style="display: inline; float: left; margin: 5px; text-align: center;"><img style="max-width: 40px; max-height: 40px;" src="https://gra.pokelife.pl/pokemony/niezdobyte/602.png"><p style="margin: 0;">Tynamo</p></li>';
                }
                if(!jsonData["603"]){
                    html = html + '<li style="display: inline; float: left; margin: 5px; text-align: center;"><img style="max-width: 40px; max-height: 40px;" src="https://gra.pokelife.pl/pokemony/niezdobyte/603.png"><p style="margin: 0;">Eelektrik</p></li>';
                }
                html = html + '</div>';
                $('body').append(html);
            })


            $(document).on('mouseleave', 'a[href="gra/dzicz.php?poluj&miejsce=jaskinia_elektrokamieni"]', function(){
                $('#opisJaskiniaElektrokamieni').remove();
            })
        }

        function iniReliktowyZamek(){
            $(document).on('mouseenter', 'a[href="gra/dzicz.php?poluj&miejsce=reliktowy_zamek"]', function(){
                var html = '<div id="opisReliktowyZamek" style="z-index: 999; max-width: 320px; bottom: 60px; position: fixed; left: 0; right: 0; margin: 0 auto; background: #222; opacity: .9; color: white; padding: 15px">'
                if(!jsonData["551"]){
                    html = html + '<li style="display: inline; float: left; margin: 5px; text-align: center;"><img style="max-width: 40px; max-height: 40px;" src="https://gra.pokelife.pl/pokemony/niezdobyte/551.png"><p style="margin: 0;">Sandile</p></li>';
                }
                if(!jsonData["552"]){
                    html = html + '<li style="display: inline; float: left; margin: 5px; text-align: center;"><img style="max-width: 40px; max-height: 40px;" src="https://gra.pokelife.pl/pokemony/niezdobyte/552.png"><p style="margin: 0;">Krokorok</p></li>';
                }
                if(!jsonData["553"]){
                    html = html + '<li style="display: inline; float: left; margin: 5px; text-align: center;"><img style="max-width: 40px; max-height: 40px;" src="https://gra.pokelife.pl/pokemony/niezdobyte/553.png"><p style="margin: 0;">Krookodile</p></li>';
                }
                if(!jsonData["556"]){
                    html = html + '<li style="display: inline; float: left; margin: 5px; text-align: center;"><img style="max-width: 40px; max-height: 40px;" src="https://gra.pokelife.pl/pokemony/niezdobyte/556.png"><p style="margin: 0;">Maractus</p></li>';
                }
                if(!jsonData["561"]){
                    html = html + '<li style="display: inline; float: left; margin: 5px; text-align: center;"><img style="max-width: 40px; max-height: 40px;" src="https://gra.pokelife.pl/pokemony/niezdobyte/561.png"><p style="margin: 0;">Sigilyph</p></li>';
                }
                if(!jsonData["562"]){
                    html = html + '<li style="display: inline; float: left; margin: 5px; text-align: center;"><img style="max-width: 40px; max-height: 40px;" src="https://gra.pokelife.pl/pokemony/niezdobyte/562.png"><p style="margin: 0;">Yamask</p></li>';
                }
                if(!jsonData["563"]){
                    html = html + '<li style="display: inline; float: left; margin: 5px; text-align: center;"><img style="max-width: 40px; max-height: 40px;" src="https://gra.pokelife.pl/pokemony/niezdobyte/563.png"><p style="margin: 0;">Cofagrigus</p></li>';
                }
                if(!jsonData["636"]){
                    html = html + '<li style="display: inline; float: left; margin: 5px; text-align: center;"><img style="max-width: 40px; max-height: 40px;" src="https://gra.pokelife.pl/pokemony/niezdobyte/636.png"><p style="margin: 0;">Larvesta</p></li>';
                }
                html = html + '</div>';
                $('body').append(html);
            })


            $(document).on('mouseleave', 'a[href="gra/dzicz.php?poluj&miejsce=reliktowy_zamek"]', function(){
                $('#opisReliktowyZamek').remove();
            })
        }
    }

    if($('#pasek_skrotow').find('a[href="gra/dzicz.php?poluj&miejsce=ranczo"]').length > 0){
        initUnova();
    }
}
initRozbudowanyOpisDziczy();
