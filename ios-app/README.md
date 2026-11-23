# Aplikacja na iPhone'a: instrukcja

Ten katalog zamienia grę z przeglądarki w aplikację iOS (przez Capacitor). Gra jest w całości spakowana w aplikacji i działa bez internetu.

**Stan:** szkielet generuje się poprawnie i jest skonfigurowany (ikona, ekran startowy, tylko pion, tylko iPhone). Samego budowania w Xcode i wysyłki do Apple nie dało się tu sprawdzić, bo wymagają konta Apple Developer. Pierwsze uruchomienie może więc wymagać drobnej poprawki.

## Co musisz mieć

1. **Konto Apple Developer** (99 USD rocznie): https://developer.apple.com/programs/enroll/
2. **Identyfikator aplikacji** (Bundle ID), na przykład `com.twojanazwa.whodidthis`. Wymyślasz go sam, raz na zawsze.
3. **Wpis aplikacji w App Store Connect**: https://appstoreconnect.apple.com → Aplikacje → „+” → Nowa aplikacja → iOS, nazwa „Who Did This?! Cat Chaos”, język główny angielski, wybrany Bundle ID.

Teksty do sklepu, zrzuty ekranu i ikona leżą w katalogu `store/`.

## Droga A: bez Maca (GitHub buduje za Ciebie)

W repozytorium jest gotowy przepis `.github/workflows/ios-testflight.yml`. Uruchamia się tylko ręcznie.

1. W App Store Connect → Użytkownicy i dostęp → Integracje → **Klucze App Store Connect API** utwórz klucz z rolą **Admin**. Zapisz: Key ID, Issuer ID i pobierz plik `.p8` (da się pobrać tylko raz).
2. Team ID znajdziesz na https://developer.apple.com/account → Membership details.
3. Na GitHubie: repozytorium → Settings → Secrets and variables → Actions:
   - zakładka **Secrets**: `ASC_KEY_ID`, `ASC_ISSUER_ID`, `ASC_KEY_P8` (cała treść pliku .p8), `APPLE_TEAM_ID`
   - zakładka **Variables**: `BUNDLE_ID`
4. Zakładka **Actions** → „iOS TestFlight” → **Run workflow**.
5. Po kilkunastu minutach wersja pojawi się w App Store Connect → TestFlight. Instalujesz ją na telefonie przez aplikację TestFlight.

Kluczy nie wklejaj nigdzie indziej niż w GitHub Secrets.

## Droga B: na Macu z Xcode

```bash
cd ios-app
```

```bash
npm install
```

```bash
npm run ios:add
```

```bash
npm run ios:sync
```

```bash
npm run ios:open
```

W Xcode: zaznacz projekt **App** → Signing & Capabilities → wybierz swój Team i wpisz Bundle ID. Potem Product → Archive → Distribute App → App Store Connect.

Po każdej zmianie w grze wystarczy `npm run ios:sync`.

## Przed wysłaniem do recenzji

- Zagraj na prawdziwym telefonie przez TestFlight: dźwięk, muzyka, wibracje przy tłuczeniu, pauza po wyjściu z aplikacji.
- W App Store Connect wklej teksty ze `store/STORE.md`, dodaj zrzuty ze `store/screenshots/`, ustaw wiek 4+, w ankiecie prywatności wybierz „Dane nie są zbierane”.
- Adres polityki prywatności: https://ermariusz-cmyk.github.io/who-did-this/privacy.html
- Adres wsparcia: https://ermariusz-cmyk.github.io/who-did-this/support.html
