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
5.41 (2021-04-06)
* Poprawka na zczytywanie eventów (nie działało przez to np wznawianie PA)

5.40 (2021-03-29)
* Dodanie wyboru pokeballi dla jajek
* Poprawki na błąd po aktualizacji gdzie nie działało AutoGo
* Dodanie motywu wielkanocnego zamiast zimowego

5.31 (2021-01-27)
* Przywrócenie opcji wznawiania PA za pomocą przycisku Wypij Eventowy NE w statystykach

5.30.3 (2020-12-02)
* Przycisk do wysłania na chat bota będzie pokazywał Wyślij lub Wyslij prywatną zaleznie jaka wiadomość zostanie napisana
* Poprawki do widoku osiągnięć 

5.30 (2020-12-01)
* Dodanie przypomnienia o kalendarzu swiątecznym

5.29 (2020-12-01)
* Dodanie reszty tropicieli do widgetów do sidebar (dzięki @Koza679!)
* Poprawienie zwijania/rozwijania osiągnięć na widoku Osiągnięcia
* Dodanie możliwość wysłania prywatnej wiadomości na chat bota. Wystarczy rozpocząć wiadomość od "PW @nazwa" 

5.28.2 (2020-11-24)
* Poprawka na możliwość klikania spacji na notatniku

5.28 (2020-11-18)
* Dodanie wyszukiwarki przedmiotów

5.27 (2020-11-18)
* Poprawka na zliczanie zarobków z hodowli

5.26 (2020-11-14)
* Dodanie swiątecznych dekoracji

5.25 (2020-11-13)
* Poprawka dla wbijania szkoleniowca, wbija teraz w atak do max podanej ilości tj gdy pokemon ma sume treningów 25, poda sie wbijaj do 40 to wytrenuje te 15 w atak.

5.24 (2020-11-09)
* Kliknięcie prawym przyciskiem myszki na nick na czat otwiera profil uzytkownika
* Dodanie wiadomości o sumie wartości pokemonów w hodowli na góre widoku.

5.23 (2020-07-20)
* Dodanie obsługi eventu, zatrzymuje na Zdarzeniach czasowych, niektóre rozwiązuje sam

5.21 (2020-06-16)
* Odblokowanie bota aby nadal chętni mogli korzystać

5.20.9 (2020-06-15)
* Drobna poprawka na brak jednej funkcji, bot przez to sie zawieszał dla niektórych

5.20.8 (2020-06-14)
* Poprawka dla zapisywania informacji o wykorzystaniu danych limitów przy posiadaniu multikont

5.20.7 (2020-06-13)
* Zmniejszono panel ustawienia pokebali
* Dodano zapisywanie informacji o wykorzystaniu danych limitów, nie powinno juz teraz próbować wznowic na przykład niebieskimi jagodami gdy juz wykorzystało sie limit danego dnia. Powinno lekko przyśpieszyć AutoGo

5.20.6 (2020-06-13)
* Drobna poprawka do wbijania szkoleniowca

5.20.5 (2020-06-13)
* Dodanie nowego powodu zatrzymania AutoGo: gdy jesteś w dziczy weekendowej a próbujesz uruchomić go dla normalnej dziczy
* Dodanie opcji podania do ilu statystyk ma wbijać szkoleniowca

5.20.4 (2020-06-11)
* Dodanie legendy na widoku osiągnięć
* Dodanie zliczania zarobku z eventów w dziczy (na razie tylko pył w pustyni lodowej)
* Dodanie wykresu szybkości klikania AutoGo w prawym dolnym rogu. Średnią wartością jest około 17 kliknięć na 10s. Wszystko powyżej jest na zielono zaznaczane, wszystko poniżej na czerwono

5.20.3 (2020-06-10)
* Poprawka na podgląd poków w legendarnych polowaniach

5.20.2 (2020-06-09)
* Seria poprawek do eventów i brakujących jagód

5.20 (2020-06-09)
* Przerobienie zakładki Dzicz na widoku Statystyk
* Poprawka na poprawne zliczanie niektórych eventów gdy wystąpiła Moc odznaki
* Został usunięty licznik klików w tytule strony

5.19.6 (2020-06-09)
* Poprawka do przywracania PA za pomocą fontanny, nie zawsze zapisywało że danego dnia juz była użyta

5.19.5 (2020-06-09)
* Dodanie dodatkowych zabezpieczeń dla danych na stronie: max 10 kont na jednym IP. W razie gdyby ktoś dotarł do limitu i potrzebował więcej slotów można zgłaszać to na github

5.19.4 (2020-06-09)
* Poprawka dla shiny alertów, zmienił sie sposób wyswietlania obrazków przez co alerty przestały działać

5.19.3 (2020-06-07)
* Dodanie aktualizacji cen jagód na statystykach na podstawie wyszukiwan w zakładce Wystaw. Powinny być zawsze w miare aktualne.

5.19.2 (2020-06-07)
* Dodanie Hoenn do widgetów z Tropicielem

5.19.1 (2020-06-07)
* Dodanie changelogu do alertu o nieaktualnej wersji bota

5.19 (2020-06-07)
* Dodanie możliwości podpięcia widgetu z Tropicielem do Sidebaru, na razie tylko regiony Kanto i Sinooh
* Poprawienie błędu w którym nie zapisywał sie widget z zadaniami przez co przy każdym logowaniu pytał o widok z Zadaniami
* Przepisanie zapytań do bazy tak aby było jedno globalne get_user, dzięki czemu nie odświeża sidebaru przy logowaniu 4 razy tylko 1.
* Dodanie obsługi na niskim lvl do eventu w dziczy gdzie informuje o braku życia pokemona i konieczności leczenia
* Poprawka do widgetu Zadania aby zamiast pustego na niskich lvl wyświetlał: brak zadań

5.18.8 (2020-06-03)
* Poprawka do wyświetlania na czerwono nieodbytej opieki
* Dodanie wyszukiwarki osiągnięć na widoku Osiągnięcia
* Dodanie zakładki Ulubione na osiągnięciach. Można dodawać tam osiągnięcia poprzed kliknięcie serduszka na danym osiągnięciu

5.18.7 (2020-06-02)
* Usunięcie opcji eventowych napojów
* Wyłączenie Go na spacji dla Opcji konta

5.18.5 (2020-06-02)
* Poprawka na wznawiania PA za pomocą fonanny
* Dodanie licznika kliknięc AutoGo w tytule strony gdy karta nie jest aktywna

5.18.4 (2020-05-31)
* Nowe ustawienia safari:
  - Zatrzymuj niezłapane, pomijaj pozostałe
  - Nie zatrzymuj, ruczaj tylko w niezłapane
  - Nie zatrzymuj, rzucaj we wszystkie
* Refaktoring kodu

5.18.3 (2020-05-31)
* Poprawka do rzucania cherishballi
* Dodanie opcji ustawienia Shiny: zatrzymuj, nie zatrzymuj, rzucaj cherishballe

5.18.2 (2020-05-30)
* Dodanie autowzawianie PA za pomocą fontanny
* Dodanie ultraballi i swarmballi jako opcje wyboru

5.18 (2020-05-29)
* Została przepisana opcja wyboru pokeballi. Od teraz można wybrać rodzaj pokeballa w zależności od trudności złapania i lvl pokemona jak i pory dnia.
* Została dodana zakładka z informacjami przy wyborze pokeballi.
* Dodano liczenie doświadczenia przy przegranych walkach

5.17.3 (2020-05-25)
* Dodanie ceny w hodowli na shiny widget

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
