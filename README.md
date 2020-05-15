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
5.15 (2020-05-15)
* Poprawka do czerwonych napojów aby działały gdy jest mniej niz 850PA
* Dodanie przeładowania opisu dziczy po wejściu na kolekcje
* Od teraz zmiana kolorów w kreatorze styli jest widoczna od razu na stronie, a zapisuje sie dopiero po save

5.14.3 (2020-05-13)
* Dodanie nowego stylu, nowy sposób zapisywania gotowych styli

5.14.1 (2020-05-11)
* Dodanie opcji ustawiania customowych styli

5.10 (2020-05-09)
* Dodanie opcji wyboru lvl poków do którego ma łapać, zwiazane z nowym osiągnięciem
* Dodanie minimalistycznego przypomnienia o opiece, gdy sie jeszcze nie odbyło jej w statystykach będzie zaznaczona na czerwono informacja z wykrzyknikiem
* Dodanie informacji o kończącym sie repelu. W sidebar gdy zosatnie poniżej 200 wypraw na repelu/tepelu zacznie powoli podświetlać sie na czerwono ilośc pozostałych wypraw
* Dodanie premierballi do wyboru pokeballi
* Przeniesienie wyboru customowego wybierania pokemonów z ustawien AutoGo do panelu który pojawi sie po wybraniu zębatki w lewym górnym selektorze. Poprzedni panel był mało intuicyjny dla nowych graczy
* Poprawa wybierania skinów, nie blokuje sie juz na arbuzowym

5.9.6 (2020-04-28)
* Dodanie możliwości oznaczania w czacie
* Podświetla wiadomość w momencie w którym ktoś cie w niej oznaczył 

5.9.5 (2020-04-27)
* Poprawki zwiazane z przeniesieniem hostingu
* Przywrócenie zapisywania configu do bazy zamiast localstorage, teraz ustawienia powinny być przenoszone pomiędzy przeglądarkami
* Dodanie zmiany kolejności widgetów

5.9.3 (2020-04-24)
* Wyczyszczenie kodu po evencie
* Zamiana kolejności widgetów w sidebar
* Zmiana kolejności wznawiania PA, najpierw będzie próbował Niebieskie napoje a dopier póżniej zielone
* Dodanie podsumowania ile można zarobić z jagód na zakładce Wystaw
* Drobne poprawki wizualne
* Od teraz bot będzie na start informował o nowej wersji i wymuszał aktualizacje

5.9 (2020-04-17)
* Poprawki do wznawiania PA, były problemy przez dodanie nowego rodzaju napojów eventowych.
* Poprawki do pokemonów dnia

5.8.3 (2020-04-12)
* Poprawka do niebieskich jagód
