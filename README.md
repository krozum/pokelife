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

5.2.2 (2020-02-17)
* Poprawki do czatu
* Dodanie nowych balli
  * safariball - rzuca w niezłapane safariballa, pomija pozostałe
  * safariball stop - zatrzymuje przy niezłapanym, pomija pozostałe
  * levelballe - rzuca je w poki z trudność I 
  * swarmballe - rzuca je w poki poniżej 5 poziomu, po jednym ballu
  
5.2.4 (2020-02-18)
* Dodanie widgetów zadań i pokemonow dnia
* Poprawki do zliczania przegranych walk
* Poprawki do czatu

5.2.5 (2020-02-19)
* Dodanie informacji dlaczego autoGo sie zatrzymało (shiny, niezłapany, brak balli, brak PA)

5.2.6 (2020-02-19)
* Dodano przypomnienie o braku aktywności gdy uzytkownik opuszcza strone a nie ma ustawionej pracy lub treningu

5.2.7 (2020-02-19)
* Optymalizacje do widgetów aby nie wykonywały requestów po odswiezeniu strony

5.2.8 (2020-02-20)
* Poprawka aby gdy jest wyłączony czat główny nie znikały przyciski do włączenia czatu bota

5.2.9 (2020-02-21)
* Dodanie dynamicznego wybierania poków na podstawie lvl
* Dodanie opcji czy zatrzymywać gdy spotkasz niezłapane

5.3.4 (2020-02-23)
* Poprawka do lecznia
* Poprawka do podwójnego klikania w hodowle
* Poprawka do safariballi
* Dodanie autoscrollowania do czatu

5.3.5 (2020-02-23)
* Zmiana leczenia, od teraz leczy gdy spadnie poniżej 20-50% a nie do zera

5.3.6 (2020-02-23)
* Poprawka do niebieskich jagód

5.3.9 (2020-02-24)
* Dodanie leczenia za pomocą czerwonych jagód
* Zmiana UX w panelu ustawień
* Dodanie nowego powodu zatrzymania - zmiana dziczy w trakcie AutoGo
* Poprawka do widgetu zadań, nie wyświetlał sie poprawnie gdy był pobierany z localStorage
* Poprawka do zielonych napojów - od teraz uzywa po tyle ile może wypić a nie po 1

5.4 (2020-02-24)
* Poprawka do zielonych napojów aby nie przekraczał limitów

5.4.4 (2020-02-25)
* Dodanie informacji o zatrzymaniu do title strony
* Przepiasnie setTimeout na webworkery, nie powinno zwalniac po przełączniu strony
* Poprawka do safariballi, powinno zgłosić gdy sie uzywa ich poza dzicza weekendową

5.5 (2020-03-01)
* Dodanie wyszukiwania ceny na zakładce wystaw
