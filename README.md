# Port Info Web Application

## What does this site do?

This website shows information about ships currently in selected Finnish ports and basic information about those ports. The information is fetched from public APIs in real time. The site is responsive and works on different screen sizes.

There are three pages:
- **Ships in port** – choose a port and see the ships currently there.
- **Ports** – read general information about the available ports.
- **About** – learn about the site, used APIs, and the author.

---

## How to use the site?

1. Go to the **Ships in port** page.
2. Choose a port from the dropdown list.
3. The site shows ships that have already arrived and have not yet left.
4. Ship details are shown, including extra data retrieved from the API.
5. Go to the **Ports** page to see basic information about the ports.
6. Go to the **About** page to read more about the site and its background.

The site remembers your selected port, so the same port will be shown when you come back later.

---

## Technical details

- **Ships in port page** uses [Digitraffic Marine API](https://www.digitraffic.fi/meriliikenne/) to fetch ship and port call information.
- Site assumes that the ship is in the port if the actual time of arrival is before current time and estimated departure time is after the current time based on port calls.
- For ships in the selected port, more information is retrieved from API to be shown on the site.
- **Ports page** uses [Wikimedia REST API](https://www.mediawiki.org/wiki/Wikimedia_REST_API) to get port descriptions from Finnish Wikipedia.
- The descriptions about the ports are then translated into English using [Google Cloud Translation API](https://cloud.google.com/translate/docs/reference/rest).
- The **About page** also tracks how many times the user has loaded the page (locally).
- Formating of the site has been done with CSS and functionality with JavaScript.

---

## Setup and requirements

- No API keys are needed to use the site.
- Just open `index.html` in a browser to start.
- Make sure all related `.css` and `.js` files are in the correct folder structure.
- Requires an internet connection to fetch data from APIs.

---

## Project background

This website was created as part of the **Web Development Basics** course at **Oulu University of Applied Sciences (OAMK)**.

The goal was to learn how to:
- Build a responsive website using HTML, CSS, and JavaScript
- Use external APIs and make asynchronous requests
- Handle and display dynamic data in the frontend

