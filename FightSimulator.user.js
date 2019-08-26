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

var celnosc = (punkty_szybkosci_pokemon / punkty_szybkosci_przeciwnika);


var Pokemon = function(id, poziom_pokemona, nazwa, atak, sp_atak, obrona, sp_obrona, szybkosc, zycie, atak1, atak2, atak3, atak4){

    var _id;
    var _poziom_pokemona;
    var _nazwa;
    var _atak;
    var _sp_atak;
    var _obrona;
    var _sp_obrona;
    var _szybkosc;
    var _zycie;
    var _aktualny_atak = 1;
    var _atak1;
    var _atak2;
    var _atak3;
    var _atak4;
    var _is_damaged_by_lech_seed = 0;
    var _max_hp_in_fight = 0;

    var root = this;

    this.construct = function(id, poziom_pokemona, nazwa, atak, sp_atak, obrona, sp_obrona, szybkosc, zycie, atak1, atak2, atak3, atak4){
        _id = id;
        _poziom_pokemona = poziom_pokemona;
        _nazwa = nazwa;
        _atak = atak;
        _sp_atak = sp_atak;
        _obrona = obrona;
        _sp_obrona = sp_obrona;
        _szybkosc = szybkosc;
        _zycie = zycie;
        _atak1 = atak1;
        _atak2 = atak2;
        _atak3 = atak3;
        _atak4 = atak4;
    };

    this.atak = function(przeciwnik){
        var atak_name;
        if(_aktualny_atak == 1){
            atak_name = _atak1;
        }
        if(_aktualny_atak == 2){
            atak_name = _atak2;
        }
        if(_aktualny_atak == 3){
            atak_name = atak3;
        }
        if(_aktualny_atak == 4){
            atak_name = atak4;
        }


        switch(atak_name){
            case "Leech Seed":
                useLeechSeed(root, przeciwnik);
                break;
            case "Sludge Bomb":
                useSludgeBomb(root, przeciwnik);
                break;
            default:
                console.log('Not working yet');
                break;
        }

        _aktualny_atak++;
        if(_aktualny_atak > 4){
            _aktualny_atak = 1;
        }
    };

    this.print = function(){
        console.log("---------Pokemon Stats----------");
        console.log("ID: " + _id);
        console.log("Nazwa: " + _nazwa);
        console.log("Poziom: " + _poziom_pokemona);
        console.log("Atak: " + _atak);
        console.log("Sp Atak: " + _sp_atak);
        console.log("Obrona: " + _obrona);
        console.log("Sp Obrona: " + _sp_obrona);
        console.log("Szybkosc: " + _szybkosc);
        console.log("Zycie: " + _zycie);
        console.log("Atak 1: " + _atak1);
        console.log("Atak 2: " + _atak2);
        console.log("Atak 3: " + _atak3);
        console.log("Atak 4: " + _atak4);
    };

    this.getId = function(){
        return _id;
    }

    this.getPoziom = function(){
        return _poziom_pokemona;
    }

    this.getNazwa = function(){
        return _nazwa;
    }

    this.getAtak = function(){
        return _atak;
    }

    this.getSpAtak = function(){
        return _sp_atak;
    }

    this.getObrona = function(){
        return _obrona;
    }

    this.getSpObrona = function(){
        return _sp_obrona;
    }

    this.getSzybkosc = function(){
        return _szybkosc;
    }

    this.setZycie = function(zycie){
        if(_zycie !== 0){
            _zycie = zycie;
        }
    };

    this.getZycie = function(){
        return _zycie;
    }

    this.setMaxHpInFight= function(max_hp_in_fight){
        _max_hp_in_fight = max_hp_in_fight;
    };

    this.getMaxHpInFight = function(){
        return _max_hp_in_fight;
    }

    this.setIsDamagedByLeechSeed = function(is_damaged_by_lech_seed){
        _is_damaged_by_lech_seed = is_damaged_by_lech_seed;
    };

    this.getIsDamagedByLeechSeed = function(){
        return _is_damaged_by_lech_seed;
    }

    this.construct(id, poziom_pokemona, nazwa, atak, sp_atak, obrona, sp_obrona, szybkosc, zycie, atak1, atak2, atak3, atak4);
};



var pok = new Pokemon(3, 100, "Venek 1", 600, 600, 600, 600, 600, 600, "Leech Seed", "Leech Seed", "Leech Seed", "Leech Seed");
var pok2 = new Pokemon(4, 100, "Venek 2", 600, 600, 600, 600, 600, 600, "Sludge Bomb", "Sludge Bomb", "Sludge Bomb", "Sludge Bomb");




function useLeechSeed(pokemon1, pokemon2){
    pokemon2.setIsDamagedByLeechSeed(true);
    console.log(pokemon1.getNazwa() + " uzywa leech seed. Nasiona przyklejają sie");
}


function useSludgeBomb(pokemon1, pokemon2){
    var moc = 90;
    var modyfikator = 1;
    var stab = 1;
    var krytyczny_cios = 1;
    var losowa_liczba = Math.floor((Math.random() * 50) + 205);

    var damage = ((((pokemon1.getPoziom() * 0.4 * krytyczny_cios) + 2) * pokemon1.getSpAtak() * moc / 50 / pokemon2.getSpObrona()) + 2) * modyfikator * stab * (losowa_liczba / 255) * 5;
    if(damage > pokemon2.getZycie()){
        damage = pokemon2.getZycie();
    }
    damage = damage.toFixed(0);
    pokemon2.setZycie(pokemon2.getZycie() - damage);
    console.log(pokemon1.getNazwa() + " uzywam sludge bomb. Zadaje " + damage + " obrazen");
}



function runda(pokemon1, pokemon2){
    pokemon1.setMaxHpInFight(pokemon1.getZycie());
    pokemon2.setMaxHpInFight(pokemon2.getZycie());

    for(var i = 1; i<= 50; i++){
        console.log("///////////////////*********** TURA " + i + " ***********/////////////////////");
        pokemon1.print();
        pokemon2.print();
        tura();
        if(pokemon1.getZycie() == 0){
            console.log("************************");
            console.log("**                    **");
            console.log("**  Pokemon 1 wygrał  **");
            console.log("**                    **");
            console.log("************************");
            return;
        }
        if(pokemon2.getZycie() == 0){
            console.log("************************");
            console.log("**                    **");
            console.log("**  Pokemon 2 wygrał  **");
            console.log("**                    **");
            console.log("************************");
            return;
        }
    }
    console.log("************************");
    console.log("**                    **");
    console.log("**       Remis        **");
    console.log("**                    **");
    console.log("************************");
    return;

    function tura(){
        console.log("-------------");
        if(pokemon1.getSzybkosc() >= pokemon2.getSzybkosc()){
            pokemon1.atak(pokemon2);
            pokemon2.atak(pokemon1);
        } else {
            pokemon2.atak(pokemon1);
            pokemon1.atak(pokemon2);
        }
        if(pokemon1.getIsDamagedByLeechSeed()){
            var dmg1 = pokemon1.getZycie() * 4/100;
            dmg1 = Number(dmg1.toFixed(0));
            console.log("Nasiona: "+ dmg1 + " obrazen");
            pokemon1.setZycie(pokemon1.getZycie() - dmg1);
            if(pokemon2.getZycie() + dmg1 > pokemon2.getMaxHpInFight()){
                pokemon2.setZycie(pokemon2.getMaxHpInFight());
            } else {
                pokemon2.setZycie(pokemon2.getZycie() + dmg1);
            }
        }
        if(pokemon2.getIsDamagedByLeechSeed()){
            var dmg2 = pokemon2.getZycie() * 4/100;
            dmg2 = Number(dmg2.toFixed(0));
            console.log("Nasiona: "+ dmg2 + " obrazen");
            pokemon2.setZycie(pokemon2.getZycie() - dmg2);
            if(pokemon1.getZycie() + dmg2 > pokemon1.getMaxHpInFight()){
                pokemon1.setZycie(pokemon1.getMaxHpInFight());
            } else {
                pokemon1.setZycie(pokemon1.getZycie() + dmg2);
            }
        }
    }
}

runda(pok, pok2);


