    
// ==UserScript==
// @name         FightSimulator
// @version      0.1
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
