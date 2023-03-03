# Engineering project: movie browser (Software movie suggestion module for VOD platforms)

The app is available to try: https://projekt-inzynierski.netlify.app/

![filmy](https://user-images.githubusercontent.com/45629012/151399465-6db5b6cf-a254-44fe-a55d-609e7bf0ac92.jpeg)

## Documentation

### Description

The web application allows users to search and rate movies. The application is also to be used to more accurately suggest movies to users, for which it uses the Bayes theorem from probability theory.

### Architecture

The application is based on the "serverless" architecture, Firebase Authentication is responsible for user authentication, and Cloud Firestore provides a NoSQL database. The database schema is shown below.

![Schemat bazy danych](https://user-images.githubusercontent.com/45629012/151402118-82ccfc73-379d-4580-8562-cc4efbc71daf.png)

### User Interface

Below is a use case diagram that defines what actions a person using the application can take.

![Diagram przypadków użycia drawio](https://user-images.githubusercontent.com/45629012/151405050-de7d90b4-f0af-4445-b4f9-7806474e95d6.png)

The application consists of 4 main views:
- home page - shows individual tabs of the application
- movies - displays all movies in the form of infinite scrolling, has filtering by movie genre
- recommended movies - displays a personalized ranking of movies taking into account the age and gender of the user (an algorithm using the Bayes theorem)
- statistics - allows you to generate statistics of movie ratings from a given genre and calculates the strength of correlation between age and ratings in a given genre

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
