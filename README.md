# Projekt inżynierski: przeglądarka filmów (Softwareowy moduł sugerowania filmów dla platform VOD)

Aplikacja jest dostępna do wypróbowania: https://projekt-inzynierski.netlify.app/

![filmy](https://user-images.githubusercontent.com/45629012/151399465-6db5b6cf-a254-44fe-a55d-609e7bf0ac92.jpeg)

## Dokumentacja

### Opis

Aplikacja webowa pozwala na wyszukiwanie, ocenianie filmów przez użytkowników. Aplikacja ma także służyć do trafniejszego sugerowania filmów użytkownikom do czego wykorzystuje twierdzenie Bayesa z teorii prawdopodobieństwa. 

### Architektura

Aplikacja oparta jest o architekturę "serverless", Firebase Authentication odpowiada za uwierzytelnianie użytkowników, a Cloud Firestore zapewnia NoSQL-ową bazę danych. Poniżej przedstawiony jest schemat bazy danych.

![Schemat bazy danych](https://user-images.githubusercontent.com/45629012/151402118-82ccfc73-379d-4580-8562-cc4efbc71daf.png)

### Interfejs użytkownika

Poniżej przedstawiony jest diagram przypadków użycia określający jakie akcje może podjąć osoba używająca aplikacji.

![Diagram przypadków użycia drawio](https://user-images.githubusercontent.com/45629012/151405050-de7d90b4-f0af-4445-b4f9-7806474e95d6.png)

Aplikacja składa się z 4 głównych widoków:
- strona główna - przedstawia poszczególne zakładki aplikacji
- filmy - wyświetla wszystkie filmy w formie nieskończonego przewijania, posiada filtrowanie po gatunku filmu
- polecane filmy - wyświetla spersonalizowany ranking filmów biorący pod uwagę wiek i płeć użytkownika (algorytm używający twierdzenia Bayesa)
- statystyki - pozwala generować statystyki ocen filmów z danego gatunku i oblicza siłę korelacji między wiekiem, a wystawianym ocenom w danym gatunku

## Getting Started

### Dependencies

- React 17
- Firebase 5
- react-router-dom 5
- Bootstrap 5
- Styled Components 5

### Installing

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.
