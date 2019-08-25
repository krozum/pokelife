    
// ==UserScript==
// @name         FightSimulator
// @version      0.1.1
// @description  Dodatek do gry Pokelife - symulator walki
// @match        https://gra.pokelife.pl/*
// @downloadURL  https://github.com/krozum/pokelife/raw/master/FightSimulator.user.js
// @updateURL    https://github.com/krozum/pokelife/raw/master/FightSimulator.user.js
// ==/UserScript==

let poziom_pokemona = 100;
let krytyczny_cios = 1;
let punkty_ataku_pokemona = 2610;
let stała_ataku = 60;
let punkty_obrony_pokemona = 928;
let modyfikator = 1;
let stab = 1.3;
let losowa_liczba = Math.floor((Math.random() * 50) + 205);


var dmg =  ((((poziom_pokemona * 0.4 * krytyczny_cios) + 2) * punkty_ataku_pokemona * stała_ataku / 50 / punkty_obrony_pokemona ) + 2) * modyfikator * stab * (205 / 255) * 1.5 * 5;
console.log("min: " + dmg);

dmg =  ((((poziom_pokemona * 0.4 * krytyczny_cios) + 2) * punkty_ataku_pokemona * stała_ataku / 50 / punkty_obrony_pokemona ) + 2) * modyfikator * stab * (losowa_liczba / 255) * 1.5 * 5;
console.log("random: " +dmg);

dmg =  ((((poziom_pokemona * 0.4 * krytyczny_cios) + 2) * punkty_ataku_pokemona * stała_ataku / 50 / punkty_obrony_pokemona ) + 2) * modyfikator * stab * (255 / 255) * 1.5 * 5;
console.log("max: " +dmg);


var pokemon_1 = new Object();
pokemon_1.id = 3;
pokemon_1.atak = 583;
pokemon_1.sp_atak = 1928;
pokemon_1.obrona = 1570;
pokemon_1.sp_obrona = 1213;
pokemon_1.szybkosc = 581;
pokemon_1.zycie = 7335;
pokemon_1.ataki =  [];
pokemon_1.ataki[1] = "Leech Seed";
pokemon_1.ataki[2] = "Sludge Bomb";
pokemon_1.ataki[3] = "Giga Drain";
pokemon_1.ataki[4] = "Synthesis";
pokemon_1.odpornosci =  [];
pokemon_1.odpornosci[1] = 1;
pokemon_1.odpornosci[2] = 2;
pokemon_1.odpornosci[3] = 0.5;
pokemon_1.odpornosci[4] = 0.3;
pokemon_1.odpornosci[5] = 0.5;
pokemon_1.odpornosci[6] = 2;
pokemon_1.odpornosci[7] = 2;
pokemon_1.odpornosci[8] = 1;
pokemon_1.odpornosci[9] = 1;
pokemon_1.odpornosci[10] = 0.5;
pokemon_1.odpornosci[11] = 1;
pokemon_1.odpornosci[12] = 1;
pokemon_1.odpornosci[13] = 1;
pokemon_1.odpornosci[14] = 2;
pokemon_1.odpornosci[15] = 1;
pokemon_1.odpornosci[16] = 1;
pokemon_1.odpornosci[17] = 1;
pokemon_1.odpornosci[18] = 0.5;


var pokemon_2 = new Object();
pokemon_2.id = 3;
pokemon_2.atak = 583;
pokemon_2.sp_atak = 1928;
pokemon_2.obrona = 1570;
pokemon_2.sp_obrona = 1213;
pokemon_2.szybkosc = 581;
pokemon_2.zycie = 7335;
pokemon_2.ataki =  [];
pokemon_2.ataki[1] = "Leech Seed";
pokemon_2.ataki[2] = "Sludge Bomb";
pokemon_2.ataki[3] = "Giga Drain";
pokemon_2.ataki[4] = "Synthesis";
pokemon_2.odpornosci =  [];
pokemon_2.odpornosci[1] = 1;
pokemon_1.odpornosci[2] = 2;
pokemon_2.odpornosci[3] = 0.5;
pokemon_2.odpornosci[4] = 0.3;
pokemon_2.odpornosci[5] = 0.5;
pokemon_2.odpornosci[6] = 2;
pokemon_2.odpornosci[7] = 2;
pokemon_2.odpornosci[8] = 1;
pokemon_2.odpornosci[9] = 1;
pokemon_2.odpornosci[10] = 0.5;
pokemon_2.odpornosci[11] = 1;
pokemon_2.odpornosci[12] = 1;
pokemon_2.odpornosci[13] = 1;
pokemon_2.odpornosci[14] = 2;
pokemon_2.odpornosci[15] = 1;
pokemon_2.odpornosci[16] = 1;
pokemon_2.odpornosci[17] = 1;
pokemon_2.odpornosci[18] = 0.5;

let pokemonyAtakujace = [];
pokemonyAtakujace.push(pokemon_1);

let pokemonyBroniace = [];
pokemonyAtakujace.push(pokemon_2);


function walka(pokemonyAtakujace, pokemonyBroniace){
    var pokemon_1 = pokemonyAtakujace.shift();
    var pokemon_2 = pokemonyAtakujace.shift();

    console.log(pokemon_1);
    console.log(pokemon_2);
}

walka(pokemonyAtakujace, pokemonyBroniace);
