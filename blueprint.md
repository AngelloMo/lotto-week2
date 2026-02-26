# Lotto Numbers Website Blueprint

## Overview

A simple web application to display winning lottery numbers from the dhlottery.co.kr website. The application fetches the latest draw number and then all historical draw numbers using Firebase Cloud Functions, displaying 30 rounds at a time with pagination to navigate through all the rounds.

## Data Source

The application uses Firebase Cloud Functions as a proxy to fetch lottery data from the unofficial dhlottery.co.kr API. This bypasses client-side CORS issues and rate limiting.

- **Firebase Cloud Function Endpoints:**
    - `/getLatestDrawNumber`: Fetches the latest lottery draw number.
    - `/getSingleLottoNumber?drwNo={round_number}`: Fetches a single lottery draw's data.

## Features

-   Fetch and display winning lottery numbers (all historical data).
-   Display 30 rounds per page.
-   Pagination to navigate through all rounds.
-   Loading indicator and error handling.
-   Responsive design for mobile and desktop.
-   Utilizes Firebase Cloud Functions for robust data fetching.

## Project Structure

-   `index.html`: The main HTML file.
-   `style.css`: CSS for styling the application.
-   `main.js`: JavaScript for fetching and displaying the data.
-   `functions/`: Firebase Cloud Functions for data proxying.
    -   `index.js`: Cloud Function code.
    -   `package.json`: Dependencies for Cloud Functions.
-   `firebase.json`: Firebase project configuration.
-   `blueprint.md`: This file.

## Development Plan

1.  **DONE:** Create `blueprint.md` to document the project.
2.  **DONE:** Set up Firebase Cloud Functions as a proxy for dhlottery.co.kr API.
    -   Created `firebase.json` for Firebase configuration.
    -   Created `functions/` directory with `package.json` and `index.js`.
    -   Installed dependencies (`node-fetch`, `cors`, `firebase-functions`).
    -   Implemented `getLatestDrawNumber` Cloud Function to find the latest draw number.
    -   Implemented `getSingleLottoNumber` Cloud Function to fetch data for a single draw.
    -   Configured `firebase.json` with rewrite rules for the Cloud Functions.
3.  **DONE:** Implement frontend logic in `main.js`.
    -   Fetches the latest draw number from `/getLatestDrawNumber`.
    -   Fetches all historical lottery data by iterating from the latest draw down to 1, using `/getSingleLottoNumber`.
    -   Stores all fetched data in `allLottoNumbers`.
    -   Implements pagination and renders 30 lottery rounds per page.
    -   Includes loading indicator and comprehensive error handling.
4.  **DONE:** Design and style the user interface.
    -   Created `index.html` with necessary containers.
    -   Styled the application using `style.css` for responsiveness, lottery number display, and pagination.
    -   Added favicon and meta tags for better user experience.
5.  **PENDING USER ACTION:** Deployment of Firebase Cloud Functions. *Note: The Cloud Functions need to be deployed to Firebase for the application to function correctly. The user needs to manually run `firebase deploy --only functions` in the terminal to deploy the functions.*

## Future Improvements

-   **Caching in Cloud Function:** Implement caching within the Cloud Function for lottery data to reduce redundant calls to dhlottery.co.kr and improve response times.
-   **Number Analysis:** Add features to analyze the frequency of each number, the sum of numbers for each draw, etc.
-   **Search by Round:** Add a search bar to allow users to jump to a specific round.
-   **User-Specific Numbers:** Allow users to input their own numbers and check if they have ever won.
-   **PWA:** Turn the application into a Progressive Web App (PWA) so that it can be "installed" on a user's device and work offline.
