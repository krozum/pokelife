    
// ==UserScript==
// @name         FightSimulator
// @version      0.1.2
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


var Pokemon = function(id, atak, sp_atak, obrona, sp_obrona, szybkosc, zycie){

    var _id;
    var _atak;
    var _sp_atak;
    var _obrona;
    var _sp_obrona;
    var _szybkosc;
    var _zycie;
    var _aktualny_atak = 1;

    var root = this;

    this.construct = function(id, atak, sp_atak, obrona, sp_obrona, szybkosc, zycie){
        _id = id;
        _atak = atak;
        _sp_atak = sp_atak;
        _obrona = obrona;
        _sp_obrona = sp_obrona;
        _szybkosc = szybkosc;
        _zycie = zycie;
    };

    this.atak = function(przeciwnik){
        useLeechSeed(root, przeciwnik);
    };

    this.print = function(){
        console.log("---------Pokemon Stats----------");
        console.log("ID: " + _id);
        console.log("Atak: " + _atak);
        console.log("Sp Atak: " + _sp_atak);
        console.log("Obrona: " + _obrona);
        console.log("Sp Obrona: " + _sp_obrona);
        console.log("Szybkosc: " + _szybkosc);
        console.log("Zycie: " + _zycie);
    };

    this.setZycie = function(zycie){
        _zycie = zycie;
    };

    this.getZycie = function(){
        return _zycie;
    }

    this.construct(id, atak, sp_atak, obrona, sp_obrona, szybkosc, zycie);
};



var pok = new Pokemon(3, 600, 600, 600, 600, 600, 600);
pok.print();

var pok2 = new Pokemon(3, 600, 600, 600, 600, 600, 600);
pok2.print();

pok.atak(pok2);

pok.print();
pok2.print();


function useLeechSeed(pokemon1, pokemon2){
    
    var dmg =  354;
    pokemon2.setZycie(pokemon2.getZycie() - dmg);
}
