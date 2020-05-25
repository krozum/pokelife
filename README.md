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
5.17.2 (2020-05-25)
* Dodanie dzwięku powiadomienia przy spotkaniu shiny/niezłapanego
* Dodanie scrollowania do chat bota
* Dodanie wysyłania wiadomości na enter
* Poprawka do wyświetlania nagłówków dni w chat bota

5.17.1 (2020-05-24)
* Poprawka do niezłapanych

5.17 (2020-05-23)
* Dodanie pokazywania w opisach dziczy trudności złapania pokemonów
* Dodanie pokazywania w widget shiny regionu i dziczy gdzie shiny pokemon występuje
* Zamiast wybierać czy zatrzymywać przy niezłapanych pokemonach czy nie, od teraz są do wyboru 4 tryby:
  - Zatrzymuj gdy spotkasz
  - Zatrzymuj tylko gdy spotkasz poki o trudności IV lub V
  - Nie zatrzymuj (traktuje niezłapane w taki sam sposób jak złapane, czyli rzuci pokeball zgodnie z configiem)
  - Rzucaj cherishballe w poki o trudności IV lub V (poki o trudności I, II, III potraktuje jak złapane, czyli rzuci pokeball zgodnie z configiem, IV i V rzuci cherishballe)

5.16 (2020-05-22)
* Poprawka do shiny alertów

5.15.8 (2020-05-22)
* Poprawka na zmiany dotyczące niektórych class

5.15.6 (2020-05-22)
* Dodanie zatrzymania AutoGo na dziennym przeliczaniu
* Zmiana w pokazywaniu widgetu shiny, od teraz nie powinno pokazywac duplikatów tego samego pokemomona gdy jeden gracz spotka go kilka razy w przeciągu paru minut

5.15.4 (2020-05-21)
* Poprawka do resetu, nie powinno zapisywać złych danych juz po wejściu na strone w czasie resetu
* Po wejściu na hodowle przeładuje widget z pokemonami dnia
* Zamieniono input na textarea w chat bota, rozszerza sie gdy tekst jest dłuższy.
* Minimalna optymalizacja na widoku plecaka, troche szybciej powinien sie ładować
* Poprawki na zakładke Wystaw Przedmioty: 
  - podsumowanie wystawionych zostało dodane do tabeli Twoje oferty na targu
  - możliwy zarobek z jagód domyślnie pokazuje sumę, po kliknięciu nagłówek pokazują sie szczegóły

5.15.2 (2020-05-19)
* Dodanie obsługi zmiany resetu z 3:30 na północ

5.15.1 (2020-05-15)
* Poprawka do nieładującego sie czatu

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
