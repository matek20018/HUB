# HUB — instrukcja uruchomienia

Nawyki (Rytm dnia), Lango i odtwarzacz audiobooków w jednej aplikacji.
Działa offline, synchronizuje postępy między Makiem a iPhonem i nie wymaga żadnej subskrypcji.

- **Aplikacja** mieszka na GitHub Pages (darmowe).
- **Postępy** mieszkają w Twojej bazie Supabase (darmowy plan).
- **Pliki audio** zostają na urządzeniu, na którym je dodasz.

Całość zajmuje ok. 20 minut, robisz to raz.

---

## 1. Supabase (baza na postępy)

1. Wejdź na **supabase.com** → *Start your project* → zaloguj się (najprościej przez GitHub, więc możesz najpierw zrobić krok 3.1).
2. *New project*: nazwa `hub`, ustaw dowolne hasło do bazy (zapisz je, ale do apki nie będzie potrzebne), region **Central EU (Frankfurt)**, plan **Free**. Poczekaj ok. 2 minuty.
3. Lewe menu → **SQL Editor** → *New query* → wklej całą zawartość pliku `supabase.sql` → **Run**. Ma się pojawić „Success”.
4. Lewe menu → **Authentication → Users** → *Add user* → *Create new user*: Twój e-mail i hasło, zaznacz **Auto Confirm User**. Tym kontem będziesz się logować w apce.
5. **Authentication → Sign In / Providers** (lub *Settings*) → wyłącz **Allow new users to sign up**. Dzięki temu nikt poza Tobą nie założy konta w Twojej bazie.
6. **Project Settings → API** (lub *API Keys*): skopiuj **Project URL** i **Publishable key** (jeśli go nie ma, weź **anon public**).

## 2. Wpisz dane do `config.js`

Otwórz `config.js` w dowolnym edytorze tekstu i wklej oba wpisy między cudzysłowy:

```js
window.HUB_CONFIG = {
  supabaseUrl: "https://abcdefgh.supabase.co",
  supabaseKey: "sb_publishable_..."
};
```

Ten klucz jest publiczny z założenia. Twoje dane chroni logowanie i zasady w bazie (każdy wiersz jest przypisany do Twojego konta).

## 3. GitHub (hosting apki)

1. Załóż konto na **github.com** (jeśli nie masz).
2. Prawy górny róg **+ → New repository**: nazwa `hub`, **Public**, kliknij *Create repository*.
3. Na stronie nowego repozytorium kliknij **uploading an existing file**, przeciągnij **wszystkie pliki z folderu `hub`** (razem z poprawionym `config.js`) → *Commit changes*.
   - Folder `.github` jest na Macu ukryty. W Finderze naciśnij **Cmd + Shift + .** (kropka), żeby go zobaczyć, i przeciągnij go razem z resztą.
4. **Settings → Pages** → *Source: Deploy from a branch* → Branch **main**, folder **/ (root)** → *Save*.
5. Po 1–2 minutach apka jest pod adresem **https://TWÓJ-LOGIN.github.io/hub/**.
6. **Actions** (górne menu repozytorium) → jeśli pyta, kliknij *I understand… enable*. Potem *Supabase keep-alive* → **Run workflow**, żeby sprawdzić, że ping działa (zielony ptaszek).

## 4. Instalacja na urządzeniach

**iPhone:** otwórz adres w **Safari** → przycisk Udostępnij → **Do ekranu początkowego**. Uruchom HUB z ikony → ⚙ → zaloguj się e-mailem i hasłem z kroku 1.4.

**Mac:** otwórz adres w **Safari** → menu *Plik* → **Dodaj do Docka**. Uruchom z Docka → ⚙ → zaloguj się.

Od tej chwili wszystko, co zrobisz na jednym urządzeniu, pojawia się na drugim (kropka przy ⚙ jest zielona, gdy wszystko jest wysłane).

## 5. Przeniesienie danych

- **Rytm dnia:** ⚙ → *Importuj kopię* → plik `import-rytm-dnia.json` (osobno, nie wrzucaj go na GitHuba).
- **Lango:** jeśli otwierałeś wcześniej Lango w innej apce, jego postęp jest zamknięty w tamtej apce i nie przeniesie się sam. HUB przyjmie go, jeśli kiedyś wyeksportujesz go do pliku JSON (⚙ → *Importuj kopię* rozpozna format Lango).

## Jak to działa na co dzień

- **Offline:** wszystko zapisuje się najpierw na urządzeniu. Gdy wróci internet, zmiany same się wyślą. Jeśli te same postępy w Lango zmienisz na obu urządzeniach, HUB je połączy, a nie nadpisze.
- **Automatyczne nawyki:** ćwiczenie w Lango odhacza „Język” (minimum), a 10 minut słuchania audiobooka odhacza „Czytanie”. Ręczne kliknięcie zawsze ma pierwszeństwo.
- **Audiobooki:** konwerter na Macu robi MP3. Na iPhonie: Audio → *Dodaj pliki MP3* → zaznacz wszystkie pliki jednej książki naraz. Najprościej przenieść je AirDropem albo przez iCloud Drive. Miejsce, w którym skończyłeś, synchronizuje się, pliki nie.
- **Aktualizacje:** gdy podmienisz pliki na GitHubie, urządzenia pobiorą nową wersję same przy następnym uruchomieniu z internetem.
- **Kopia zapasowa:** ⚙ → *Eksportuj kopię* raz na jakiś czas i trzymaj plik w iCloud Drive.

## Ważne

- **Nie usuwaj apki HUB z iPhone'a bez potrzeby:** razem z nią znikną pliki audio z tego telefonu. Postępy są bezpieczne w Supabase.
- Supabase usypia darmowy projekt po 7 dniach bez żadnego zapytania. Codzienne używanie HUB-a i automat na GitHubie (ping co 3 dni) temu zapobiegają. Gdyby jednak się uśpił: supabase.com → projekt → *Restore*. Dane nie znikają, a apka w tym czasie działa offline.
