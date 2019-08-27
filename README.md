# PokeLifeScript

* AutoGo czyli automatyczne wyklinanie punktów w wybraną dzicz:
  - Wybór w którą dzicz będzie klikał
  - Wybór jakiego pokemona będzie używał
  - Wybór pokeballa jakiego będzie rzucał, w tym opcje automatycznego wybierania balli zaleznie od pokemona z którym walczymy
  - Automatyczne leczenie
  - Zatrzymuje się, gdy spotka Shiny Pokemona
  - Zatrzymywanie sie, gdy spotka pokemona niezłapanego
  - Opcja automatycznego uzywania Niebieskich napoi, jagód aby zrobić limity.
* Rozbudowany widok plecaka:
  - Ulepszony widok zakładki TM
  - Ulepszony widok zakładki Trzymane
* Strona ze statystykami gdzie można podejrzeć sumę zarobionych yenów, zdobytego doświadczenia, jak i wszystkie wydarzenia w dziczy  
* Rozbudowany sidebar:
  - Ostatnio 3 spotkane shiny przez graczy z informacją kiedy i gdzie
  - Widget z dostępnymi zadaniami
  - Informacja o pokemonie dnia
  - Gdy jest włączona jakaś aktywność pokazuje ile juz czasu spędziliśmy/zostało
* Szybki sklep gdzie mozna kupic potrzebne rzeczy bez wychodzenia z danego widoku
* Szybka aktywośc gdzie można rozpocząć Prace lub Trening jednym kliknięciem
* Automatyczne wbijanie osiągnięcia szkoleniowiec i jeszcze dokładke
* Ulepszony graficznie widok
[![N|Solid](https://i.imgur.com/LqM5fs7.png)](https://github.com/krozum/pokelife)

Instrukcja instalacji
---------

1. Zainstaluj dodatek http://tampermonkey.net/
2. Po zainstalowaniu wejdż w link https://github.com/krozum/pokelife/raw/master/PokeLifeScript.user.js i kliknij przycisk Zainstaluj


Changelog
---------
4.0.5 (2019-08-27)
* Dodanie obsługi eventu
* W wyborach eventowych autoGo wybiera dać 1000Yenów starcowi i Środkowy

3.39.1 (2019-08-20)
* Poprawki do wyświetlania na niskich levelach

3.39 (2019-08-19)
* Poprawki do leczenia z fontanny
* Dodanie informacji dlaczego bot sie zatrzymał

3.38 (2019-08-17)
* Dodanie tutoriala przy pierwszym uruchomieniu skryptu

3.37 (2019-08-12)
* Dodanie opcji automatycznego przywracana PA za pomoocą fontanny

3.36.1 (2019-08-10)
* Dodanie widgetu Stowarzyszenia
* Dodanie pokemona dnia Stowarzyszenia

3.34 (2019-07-26)
* Kolejne poprawki do automatycznego odnawiania pracy w kopalni
* Fix na ranking i dodawanie przycisku do szybkich walk

3.33 (2019-07-22)
* Poprawki do automatycznego odnawiania pracy w kopalni

3.32.3 (2019-07-22)
* Funkcja testowa: po wybraniu szybkiej aktywnosci - praca w kopalni automatycznie będzie odświeżał stronę co 20s aby utrzymać sesje i w przypadku gdy czas przekroczy 2h zakończy prace i zacznie od nowa

3.32.2 (2019-07-21)
* Fix dla safarballi

3.32 (2019-07-14)
* Kolejne zmiany do balli:
  * Rozdzielenie safariballi na dwa, ten co sie zatrzymuje gdy spotka złapanego i ten co rzuca w niezłapane safariballe
  * Levelballe, rzuca od teraz we wszystkie z poziomem złapania I 
  * Zmiana do nightballi, gdy była 22-6 to zawsze rzzucał night balle, teraz levelballe oraz swarmballe mają priorytet nad nightballami

3.31.2 (2019-07-12)
* Poprawka do safari, nie zatrzymuje sie juz przy niezlapanych tylko sam rzuca safariballa w nie jak jest ustawiony safariball w selectPokeball

3.31 (2019-07-11)
* Dodanie exp moda, wybiera pokemona zaleznie od lvl przeciwnika

3.30.2 (2019-07-11)
* Poprawka do informacji o dziczy w Kanto

3.30 (2019-07-09)
* Ulepszony widok szybkiej pracy
* Dodanie opcji "Uzywaj wznawiania PA tylko pomiędzy 22-6"

3.29.3 (2019-07-07)
* Poprawka do odliczania czasu, w przypadku opieki odlicza do zera

3.29.2 (2019-07-04)
* Podwójne kliknięcie poza panele (szybki sklep, praca, ustawienia auto go) ukrywa je
* BETA: Pokazanie w sidebarze ile czasu sie jest juz w aktywnosci
* Dodanie czasu pracy do tytułu strony, tak aby było widac w liście kart ile juz sie pracuje

3.28 (2019-06-21)
* Dodanie opcji szybkiej zmiany poków w druzynie na zdefiniowane

3.26 (2019-06-17)
* Dodanie szybkiej aktywności
* Podwójne kliknięcie gdziekolwiek, zamyka szybki sklep, szybka aktywność oraz ustawienia przywracania PA

3.25 (2019-06-17)
* Dodanie przypomnienie o aktywności
* Dodanie informacji gdzie występuje dane shiny w shinyWidget

3.24 (2019-06-15)
* Poprawki do safari, naprawiono błąd który powodował ze zawsze pomijał, nigdy nie rzucał balli.
* Zmiana dla safariballa, rzuca w pokemony niezłapane oraz w pokemony o łatwości łapania I z poziomem mniejszym lub równym 40.

3.23 (2019-06-14)
* Dodanie przycisku do szybkich walk w lidze

3.22 (2019-06-14)
* Dodanie opcji podglądu poka ligowe nawet gdy jest on zablokowany, oraz rozłożenia statystyk

3.21.2 (2019-06-06)
* Dodanie wyboru Setów z przedmiotami i szybkiej podmiany ich.
* Przeniesiono zapis konfiguracji do sql, teraz powinno przenosić ustawienia pomiędzy przeglądarkami. 

3.20.3 (2019-05-30)
* Dodanie obsługi eventu Wyspa unikatów

3.19 (2019-05-27)
* Refaktoring kodu, mogą przestać działać niektóre rzeczy, zgłaszać

3.18.1 (2019-05-24)
* Dodanie automatycznego wbijania Jeszcze dokładke?

3.17.5 (2019-05-23)
* Drobne poprawki
* Stunny w szybki sklepie juz kupują sie po 10
* Zmieniono ilość niebieskich jagód na 100 w szybkim sklepie
* Poprawki graficzne na widoku Pokemony -> Pokemony

3.17  (2019-05-21)
* Dodanie nowego balla levelball + mixed2
* Zmieniono poziom swarmballi z 3 do 5 poziomu

3.16.5 (2019-05-17)
* Drobne poprawki
* Poprawiono błąd ze zliczaniem wykorzystanych PA

3.16.2 (2019-05-13)
* Dodano porgress bar dla szkoleniowca

3.16 (2019-05-11)
* Dodanie tabelki z cenami po wciśnięciu "?" na widoku Wystaw Przedmioty

3.15.4 (2019-05-11)
* Poprawki do szkoleniowca
* Dodanie przycisku do paska skrótów
* Dodanie zapisywanie dziczy w której jest event

3.15 (2019-05-10)
* Dodano przycisk do wbijania szkoleniowca. Jest on dostępny w Pokemony -> Przechowalnia. Po kliknięciu bot przechodzi po wszystkich pokemonach w przechowalni i zwiększa im statystyki z treningiem mniejszym niż 7 do wartości 7.

3.14 (2019-05-09)
* Od teraz otwórz w nowym oknie działa

3.13 (2019-05-09)
* Dodanie nowego widoku Trzymanych przedmiotów

3.12.1 (2019-05-08)
* Poprawka do zawieszania sie bota

3.12 (2019-05-06)
* Przejście na nowy hosting

3.11 (2019-05-06)
* Poprawka do zapisywania statystyk

3.10.1 (2019-05-02)
* Poprawka do leczenia

3.10 (2019-05-02)
* Dodanie opcje automatycznego przywracania PA w trakcie AutoGO

3.9.5 (2019-05-02)
* Poprawa błędu z zakładkami

3.9.4 (2019-05-01)
* Tymaczasowa poprawa zapisywania zmiany dziczy

3.9.2 (2019-04-30)
* Dodanie możliwości wyświetlania komunikatu

3.9 (2019-04-29)
* Dodanie wyszukiwarki osiągnięć

3.8 (2019-04-29)
* Dodanie szybkiego sklepu, poprawa autoGo na spacji aby przy szybkim klikaniu nie powodowała błędów

3.7.2 (2019-04-25)
* Poprawka do podpowiedzi z dziczami z jajkiem

3.7 (2019-04-24)
* Dodanie logowanie informacji na temat doświadczenia i aktywności do statystyk.

3.5 (2019-04-21)
* Dodanie wyboru specialnej dziczy. Po wybraniu bot będzie chodził do pierwszej dziczy aż napotka podpowiedź gdzie jest jajko. Wtedy przełączy sie na tą dzicz aż do momentu zdobycia jajka. Po zdobyciu wraca do pierwszej dziczy. Aby działał wymaga uzupełnienia pliku
https://github.com/krozum/pokelife/blob/master/wielkanoc.json o wszystke podpowiedzi. Unova i Kanto są w większości uzupełnione.

3.4 (2019-04-20)
* Kolejna porcja poprawek
* Dodanie podpowiedzi w której dziczy jest jajko

3.2 (2019-04-18)
* Poprawki do bota, przeniesienie pozostałych funkcji
* Dodatkowe statystyki do dziczy po najechaniu na pasek skrótów, na razie tylko Unova

3.0 (2019-04-18)
* Nowa wersja bota dzięki której rozbudowana nowych rzeczy będzie łatwiejsza
