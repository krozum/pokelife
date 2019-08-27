// ==UserScript==
// @name         FightSimulator
// @version      0.1.5
// @description  Dodatek do gry Pokelife - symulator walki
// @match        pokelife.pl
// @downloadURL  https://github.com/krozum/pokelife/raw/master/FightSimulator.user.js
// @updateURL    https://github.com/krozum/pokelife/raw/master/FightSimulator.user.js
// ==/UserScript==

// let poziom_pokemona = 100;
// let krytyczny_cios = 1;
// let punkty_ataku_pokemona = 2610;
// let stała_ataku = 60;
// let punkty_obrony_pokemona = 928;
// let modyfikator = 1;
// let stab = 1.3;
// let losowa_liczba = Math.floor((Math.random() * 50) + 205);


// var dmg =  ((((poziom_pokemona * 0.4 * krytyczny_cios) + 2) * punkty_ataku_pokemona * stała_ataku / 50 / punkty_obrony_pokemona ) + 2) * modyfikator * stab * (205 / 255) * 1.5 * 5;
// console.log("min: " + dmg);

// dmg =  ((((poziom_pokemona * 0.4 * krytyczny_cios) + 2) * punkty_ataku_pokemona * stała_ataku / 50 / punkty_obrony_pokemona ) + 2) * modyfikator * stab * (losowa_liczba / 255) * 1.5 * 5;
// console.log("random: " +dmg);


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

    this.nextAtack = function(){
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

        var atak;

        switch(atak_name){
            case "Leech Seed":
                atak = getLeechSeed();
                break;
            case "Sludge Bomb":
                atak = getSludgeBomb();
                break;
            case "Giga Drain":
                atak = getGigaDrain();
                break;
            case "Synthesis":
                atak = getSynthesis();
                break;
            default:
                console.log('Not working yet: ' + atak_name);
                atak = getStruggle();
                break;
        }
        return atak;
    };

    this.useAtack = function(przeciwnik){
        this.nextAtack().use(root, przeciwnik);
    };

    this.print = function(){
        console.log("----------Pokemon Stats----------");
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
        //console.log(_zycie);
        if(_zycie !== 0){
            _zycie = zycie;
        }
        //console.log(_zycie);
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


    this.setAtackToNext = function(){
        _aktualny_atak++;
        if(_aktualny_atak > 4){
            _aktualny_atak = 1;
        }
    };

    this.construct(id, poziom_pokemona, nazwa, atak, sp_atak, obrona, sp_obrona, szybkosc, zycie, atak1, atak2, atak3, atak4);
};

var Atak = function(nazwa, moc, celnosc, typ, kategoria, kontakt, priorytet, action){
    var _nazwa = "";
    var _moc = 50;
    var _celnosc = 100;
    var _typ = "-";
    var _kategoria = "Fizyczny";
    var _kontakt = "Tak";
    var _priorytet = 0;
    var _action;

    var root = this;

    this.getNazwa = function(){
        return _nazwa;
    }

    this.getMoc = function(){
        return _moc;
    }

    this.getCelnosc = function(){
        return _celnosc;
    }

    this.getTyp = function(){
        return _typ;
    }

    this.getKategoria = function(){
        return _kategoria;
    }

    this.getKontakt = function(){
        return _kontakt;
    }

    this.getPriorytet = function(){
        return _priorytet;
    }

    this.getAction = function(){
        return _action;
    }


    this.use = function(pokemon1, pokemon2){
        if(sprawdzCzyTrafil(_celnosc, pokemon1.getSzybkosc(), pokemon2.getSzybkosc(), root.getKategoria())){
            root.getAction().call(this, pokemon1, pokemon2);
        } else {
            console.log(pokemon1.getNazwa() + " używa ataku " + root.getNazwa() + ", jednak pudłuje. ");
            pokemon1.setAtackToNext();
        }
    }

    this.print = function(){
        console.log("----------Atak Stats----------");
        console.log("Nazwa: " + root.getNazwa());
        console.log("Moc: " + root.getMoc());
        console.log("Celność: " + root.getCelnosc());
        console.log("Typ: " + root.getTyp());
        console.log("Kategoria: " + root.getKategoria());
        console.log("Kontakt: " + root.getKontakt());
        console.log("Priorytet: " + root.getPriorytet());
    };

    this.construct = function(nazwa, moc, celnosc, typ, kategoria, kontakt, priorytet, action){
        _nazwa = nazwa;
        _moc = moc;
        _celnosc = celnosc;
        _typ = typ;
        _kategoria = kategoria;
        _kontakt = kontakt;
        _priorytet = priorytet;
        _action = action;
    };

    this.construct(nazwa, moc, celnosc, typ, kategoria, kontakt, priorytet, action);
}

///////////////////////////////////////////
//
//     ATAKI
//
///////////////////////////////////////////

function getStruggle(){
    var atak = new Atak("Struggle", 50, 100, "brak", "Statusowy", false, 0, function(pokemon1, pokemon2){
        var stab = 1;
        var modyfikator = 1;
        var krytyczny_cios = 1;
        var losowa_liczba = Math.floor((Math.random() * 50) + 205);

        var damage = ((((pokemon1.getPoziom() * 0.4 * krytyczny_cios) + 2) * pokemon1.getSpAtak() * this.getMoc() / 50 / pokemon2.getSpObrona()) + 2) * modyfikator * stab * (losowa_liczba / 255) * 5;
        if(damage > pokemon2.getZycie()){
            damage = pokemon2.getZycie();
        }
        damage = damage.toFixed(0);
        pokemon2.setZycie(Number(pokemon2.getZycie()) - damage);
        pokemon1.setZycie(Number(pokemon1.getZycie()) - (damage * 0.25).toFixed());

        console.log(pokemon1.getNazwa() + " używa ataku " + this.getNazwa() + " i zadaje " + damage + " obrażeń przeciwnikowi.");
        pokemon1.setAtackToNext();
    });
    return atak;
}


function getLeechSeed(){
    var atak = new Atak("Leech Seed", 0, 100, "Trawiasty", "Statusowy", false, 0, function(pokemon1, pokemon2){
        pokemon2.setIsDamagedByLeechSeed(true);
        console.log(pokemon1.getNazwa() + " używa ataku " + this.getNazwa() + ", nasiona przyklejają się do przeciwnika.");
        pokemon1.setAtackToNext();
    });
    return atak;
}

function getSludgeBomb(){
    var atak = new Atak("Sludge Bomb", 90, 100, "Trujący", "Specjalny", false, 0, function(pokemon1, pokemon2){
        var odpornosci = getOdpornosci(pokemon2.getId());
        var stab = 1;
        var modyfikator = odpornosci[this.getTyp()]
        var krytyczny_cios = 1;
        var losowa_liczba = Math.floor((Math.random() * 50) + 205);

        var damage = ((((pokemon1.getPoziom() * 0.4 * krytyczny_cios) + 2) * pokemon1.getSpAtak() * this.getMoc() / 50 / pokemon2.getSpObrona()) + 2) * modyfikator * stab * (losowa_liczba / 255) * 5;
        if(damage > pokemon2.getZycie()){
            damage = pokemon2.getZycie();
        }
        damage = damage.toFixed(0);
        pokemon2.setZycie(Number(pokemon2.getZycie()) - damage);
        if(modyfikator > 1){
            console.log(pokemon1.getNazwa() + " używa ataku " + this.getNazwa() + " i zadaje " + damage + " obrażeń przeciwnikowi. Ten ruch jest super efektywny.");
        } else if (modyfikator < 1){
            console.log(pokemon1.getNazwa() + " używa ataku " + this.getNazwa() + " i zadaje " + damage + " obrażeń przeciwnikowi. Ten ruch jest mało efektywny.");
        } else {
            console.log(pokemon1.getNazwa() + " używa ataku " + this.getNazwa() + " i zadaje " + damage + " obrażeń przeciwnikowi.");
        }
        pokemon1.setAtackToNext();
    });
    return atak;
}


function getGigaDrain(pokemon1, pokemon2){
    var atak = new Atak("Giga Drain", 75, 100, "Trawiasty", "Specjalny", false, 0, function(pokemon1, pokemon2){
        var odpornosci = getOdpornosci(pokemon2.getId());
        var stab = 1;
        var modyfikator = odpornosci[this.getTyp()]
        var krytyczny_cios = 1;
        var losowa_liczba = Math.floor((Math.random() * 50) + 205);

        var damage = ((((pokemon1.getPoziom() * 0.4 * krytyczny_cios) + 2) * pokemon1.getSpAtak() * this.getMoc() / 50 / pokemon2.getSpObrona()) + 2) * modyfikator * stab * (losowa_liczba / 255) * 5;
        if(damage > pokemon2.getZycie()){
            damage = pokemon2.getZycie();
        }
        damage = damage.toFixed(0);
        pokemon2.setZycie(pokemon2.getZycie() - damage);
        var leczenie = damage * 0.4;

        if(pokemon1.getMaxHpInFight() < pokemon1.getZycie() + leczenie){
            leczenie = pokemon1.getMaxHpInFight() - pokemon1.getZycie();
        }
        leczenie = leczenie.toFixed(0);
        pokemon1.setZycie(Number(pokemon1.getZycie()) + Number(leczenie));

        if(modyfikator > 1){
            console.log(pokemon1.getNazwa() + " używa ataku " + this.getNazwa() + " i zadaje " + damage + " obrażeń przeciwnikowi. Ten ruch jest super efektywny. Pokemon leczy się za " + leczenie);
        } else if (modyfikator < 1){
            console.log(pokemon1.getNazwa() + " używa ataku " + this.getNazwa() + " i zadaje " + damage + " obrażeń przeciwnikowi. Ten ruch jest mało efektywny. Pokemon leczy się za " + leczenie);
        } else {
            console.log(pokemon1.getNazwa() + " używa ataku " + this.getNazwa() + " i zadaje " + damage + " obrażeń przeciwnikowi. Pokemon leczy się za " + leczenie);
        }
        pokemon1.setAtackToNext();
    });
    return atak;
}


function getSynthesis(pokemon1, pokemon2){
    var atak = new Atak("Synthesis", 0, 100, "Trawiasty", "Statusowy", false, 0, function(pokemon1, pokemon2){
        var leczenie = pokemon1.getZycie() * 0.25;
        if(pokemon1.getMaxHpInFight() < pokemon1.getZycie() + leczenie){
            leczenie = pokemon1.getMaxHpInFight() - pokemon1.getZycie();
        }
        leczenie = leczenie.toFixed(0);
        pokemon1.setZycie(Number(pokemon1.getZycie()) + Number(leczenie));

        console.log(pokemon1.getNazwa() + " używa ataku Synthesis  i odzyskuje  " + leczenie + "  życia.");
        pokemon1.setAtackToNext();
    });
    return atak;
}


///////////////////////////////////////////
//
//     WALKA
//
///////////////////////////////////////////

function runda(pokemon1, pokemon2){
    pokemon1.setMaxHpInFight(pokemon1.getZycie());
    pokemon2.setMaxHpInFight(pokemon2.getZycie());

    for(var i = 1; i<= 50; i++){
        console.log("");
        console.log("///////////////////*********** TURA " + i + " ***********/////////////////////");
        console.log("");
        pokemon1.print();
        console.log("");
        pokemon2.print();
        tura();
        if(pokemon1.getZycie() == 0){
            console.log("");
            console.log("");
            console.log("////////////////////////////////////////////");
            console.log("//                                        //");
            console.log("//            Pokemon 2 wygrał            //");
            console.log("//                                        //");
            console.log("////////////////////////////////////////////");
            console.log("");
            console.log("");
            return;
        }
        if(pokemon2.getZycie() == 0){
            console.log("");
            console.log("");
            console.log("////////////////////////////////////////////");
            console.log("//                                        //");
            console.log("//            Pokemon 1 wygrał            //");
            console.log("//                                        //");
            console.log("////////////////////////////////////////////");
            console.log("");
            console.log("");
            return;
        }
    }
    console.log("");
    console.log("");
    console.log("////////////////////////////////////////////");
    console.log("//                                        //");
    console.log("//                  Remis                 //");
    console.log("//                                        //");
    console.log("////////////////////////////////////////////");
    console.log("");
    console.log("");
    return;

    function tura(){
        console.log("");
        console.log("---------------------------------------");
        console.log("");

        if(pokemon1.nextAtack().getPriorytet() > pokemon2.nextAtack().getPriorytet()){
            pokemon1.useAtack(pokemon2);
            if(pokemon1.getZycie() == 0 || pokemon2.getZycie() == 0){
                return;
            }
            pokemon2.useAtack(pokemon1);
            if(pokemon1.getZycie() == 0 || pokemon2.getZycie() == 0){
                return;
            }
        } else if(pokemon2.nextAtack().getPriorytet() > pokemon1.nextAtack().getPriorytet()){
            pokemon2.useAtack(pokemon1);
            if(pokemon1.getZycie() == 0 || pokemon2.getZycie() == 0){
                return;
            }
            pokemon1.useAtack(pokemon2);
            if(pokemon1.getZycie() == 0 || pokemon2.getZycie() == 0){
                return;
            }
        } else {
            if(pokemon1.getSzybkosc() >= pokemon2.getSzybkosc()){
                pokemon1.useAtack(pokemon2);
                if(pokemon1.getZycie() == 0 || pokemon2.getZycie() == 0){
                    return;
                }
                pokemon2.useAtack(pokemon1);
                if(pokemon1.getZycie() == 0 || pokemon2.getZycie() == 0){
                    return;
                }
            } else {
                pokemon2.useAtack(pokemon1);
                if(pokemon1.getZycie() == 0 || pokemon2.getZycie() == 0){
                    return;
                }
                pokemon1.useAtack(pokemon2);
                if(pokemon1.getZycie() == 0 || pokemon2.getZycie() == 0){
                return;
            }
            }
        }


        if(pokemon1.getIsDamagedByLeechSeed()){
            var dmg1 = pokemon1.getZycie() * 4/100;
            dmg1 = Number(dmg1.toFixed(0));
            pokemon1.setZycie(pokemon1.getZycie() - dmg1);
            if(pokemon2.getZycie() + dmg1 > pokemon2.getMaxHpInFight()){
                pokemon2.setZycie(pokemon2.getMaxHpInFight());
            } else {
                pokemon2.setZycie(pokemon2.getZycie() + dmg1);
            }
            console.log(pokemon1.getNazwa() + " traci " + Number(dmg1) + " przez przyklejone nasiona. " + pokemon2.getNazwa() + " leczy się za "+ Number(dmg1) +" życia");
            if(pokemon1.getZycie() == 0 || pokemon2.getZycie() == 0){
                return;
            }
        }
        if(pokemon2.getIsDamagedByLeechSeed()){
            var dmg2 = pokemon2.getZycie() * 4/100;
            dmg2 = Number(dmg2.toFixed(0));
            pokemon2.setZycie(pokemon2.getZycie() - dmg2);
            if(pokemon1.getZycie() + dmg2 > pokemon1.getMaxHpInFight()){
                pokemon1.setZycie(pokemon1.getMaxHpInFight());
            } else {
                pokemon1.setZycie(pokemon1.getZycie() + dmg2);
            }
            console.log(pokemon2.getNazwa() + " traci " + Number(dmg2) + " przez przyklejone nasiona. " + pokemon1.getNazwa() + " leczy się za "+ Number(dmg2) +" życia");
            if(pokemon1.getZycie() == 0 || pokemon2.getZycie() == 0){
                return;
            }
        }
    }
}


///////////////////////////////////////////
//
//     sprawdzCzyTrafil
//
///////////////////////////////////////////

function sprawdzCzyTrafil(celnosc, szybkosc1, szybkosc2, typ){
    var zmienna = szybkosc1/szybkosc2;
    var modified_celnosc;

    if(zmienna >= 3){
        modified_celnosc = celnosc * 1.4;
    } else if(zmienna >= 2){
        modified_celnosc = celnosc * 1.26;
    } else if(zmienna >= 1.1){
        modified_celnosc = celnosc * 1.04;
    } else if(zmienna < 0.33){
        modified_celnosc = celnosc * 0.6;
    } else if(zmienna < 0.5){
        modified_celnosc = celnosc * 0.74;
    } else if(zmienna < 0.9){
        modified_celnosc = celnosc * 0.96;
    } else {
        modified_celnosc = celnosc;
    }

    if(modified_celnosc < 0.4 * celnosc){
        modified_celnosc = 0.4 * celnosc;
    }
    if(modified_celnosc > 2 * celnosc){
        modified_celnosc = 2 * celnosc;
    }
    if(typ === "Statusowy" && modified_celnosc > 75){
        modified_celnosc = 75;
    }

    var losuj = Math.floor(Math.random() * 101);

    //console.log("modified_celnosc: " + modified_celnosc);
    //console.log("wylosowano: " + losuj);
    if(losuj <= modified_celnosc){
        return true;
    } else {
        return false;
    }
}


///////////////////////////////////////////
//
//     dane dotyczace odpornosci
//
///////////////////////////////////////////

function getOdpornosci(id){
    var array = [];
    switch(id){
        case 3:
            array["Normalny"] = 1;
            array["Ognisty"] = 2;
            array["Wodny"] = 0.5;
            array["Trawiasty"] = 0.25;
            array["Elektryczny"] = 0.5;
            array["Powietrzny"] = 2;
            array["Psychiczny"] = 2;
            array["Trujący"] = 1;
            array["Duch"] = 1;
            array["Walczący"] = 0.5;
            array["Stalowy"] = 1;
            array["Ziemny"] = 1;
            array["Kamienny"] = 1;
            array["Lodowy"] = 2;
            array["Mroczny"] = 1;
            array["Robaczy"] = 1;
            array["Smok"] = 1;
            array["Wróżka"] = 0.5;
            break;
        default:
            array["Normalny"] = 1;
            array["Ognisty"] = 1;
            array["Wodny"] = 1;
            array["Trawiasty"] = 1;
            array["Elektryczny"] = 1;
            array["Powietrzny"] = 1;
            array["Psychiczny"] = 1;
            array["Trujący"] = 1;
            array["Duch"] = 1;
            array["Walczący"] = 1;
            array["Stalowy"] = 1;
            array["Ziemny"] = 1;
            array["Kamienny"] = 1;
            array["Lodowy"] = 1;
            array["Mroczny"] = 1;
            array["Robaczy"] = 1;
            array["Smok"] = 1;
            array["Wróżka"] = 1;
            break;
    }
    return array;
}


///////////////////////////////////////////
//
//     inne
//
///////////////////////////////////////////

var pok = new Pokemon(3, 100, "Venek 1", 600, 1600, 600, 600, 600, 4600, "Leech Seed", "Sludge Bomb", "Giga Drain", "Synthesis");
var pok2 = new Pokemon(3, 100, "Venek 2", 600, 1600, 600, 600, 601, 4600, "Leech Seed", "Sludge Bomb", "Giga Drain", "Synthesis");

runda(pok, pok2);

