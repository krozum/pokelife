# PokeLifeScript

* AutoGo czyli automatyczne wyklinanie punktów w wybraną dzicz:
  - Wybór w którą dzicz będzie klikał
  - Wybór jakiego pokemona będzie używał
  - Wybór pokeballa jakiego będzie rzucał, w tym opcje automatycznego wybierania balli zaleznie od pokemona z którym walczymy
  - Automatyczne leczenie gdy ktoryś z poków padnie
  - Zatrzymuje się, gdy spotka Shiny Pokemona
  - Zatrzymywanie sie, gdy spotka pokemona niezłapanego
  - Opcja automatycznego odnawiania PA (Niebieskie napoje, Czerwone napoje, Zielone napoje, Jagody)
* Rozbudowany widok plecaka:
  - Ulepszony widok zakładki TM
  - Ulepszony widok zakładki Trzymane
* Strona ze statystykami gdzie można podejrzeć sumę zarobionych yenów, zdobytego doświadczenia, jak i wszystkie wydarzenia w dziczy  
* Rozbudowany sidebar:
  - Ostatnio 3 spotkane shiny przez graczy z informacją kiedy i gdzie
* Ulepszony graficznie widok
[![N|Solid](https://i.imgur.com/LqM5fs7.png)](https://github.com/krozum/pokelife)

Instrukcja instalacji
---------

1. Zainstaluj dodatek http://tampermonkey.net/
2. Po zainstalowaniu wejdż w link https://github.com/krozum/pokelife/raw/master/PokeLifeScript.user.js i kliknij przycisk Zainstaluj


Changelog
---------
5.0.4 (2020-01-13)
* Dodanie nowych bali
* Poprawki do niedziałjących funkcji
* Dodanie wznawiania PA za pomocą jagód i napojów

5.1 (2020-01-28)
* Przywrócenie statystyk
* Przywrócenie widgetu shiny
* Zmiana odnawiania limitów napojów: bot teraz odnawia do -1 od max, czyli np 11/12 tak aby zostawić ostatni limit na fontanne.

5.1.1 (2020-01-28)
* Przywrócenie wbijania szkoleniowca, dodano timeouty po 1s,gdyby było uciążliwe będą korygowane. 100 pokemonów powinno wbijać około 15m. Przycisk znajduje sie w zakładce Pokemony -> Przechowalnia

5.1.3 (2020-02-01)
* Poprawka do autoGo, gdy baterie w dziczy sie wyczerpały

5.2 (2020-02-14)
* Dodanie czatu dla użytkowników bota
