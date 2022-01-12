# Instagram

The purpose of this app was to learn some technologies I have not used before, e.g. Recoil and to get better at technologies I already was familiar with, e.g. firebase.
\
\
Live demo at [_margatsni-nine.vercel.app_](http://margatsni-nine.vercel.app/).

## Table of Contents

- [Technologies Used](#technologies-used)
- [Features](#features)
- [Setup](#setup)
- [Directory Structure](#directory-structure)
- [Acknowledgements](#acknowledgements)

## Technologies Used

- **React** (v17) - Front-End lirary
- **NextJS** (v12) - React framework
- **Tailwind CSS** (v3) - CSS framework
- **Firebase** (v9) - Cloud database, storage, auth provider
- **Recoil** (v0.5) - Global state management system
- **TypeScript** (v4)

## Features

- Log in / Sign up
- Reset Password
- Timeline (not available to not logged in users)
- Create / delete posts
- Like / comment posts
- Profile page (public for everyone with restrictions for not logged in users)
- Post page (public for everyone with restrictions for not logged in users)
- Suggestions
- Search
- Follow / Unfollow
- Multiple languages
  - EN
  - PL

## Setup

In order to get the project running locally, you need to download the repo: `git clone https://github.com/avanrish/margatsni.git`
Next step is to go into `margatsni` directory and install all dependencies:

```
npm install
# or
yarn install
```

After installing all dependencies you need to create a firebase project ([Guide](https://firebase.google.com/docs/web/setup)), make sure to activate firestore and firebase storage. When you register a web app, you will get data that you have to add into `.env.local` (see `.env.local.example`).\
You also need to setup firebase-admin in your firebase project ([Guide](https://firebase.google.com/docs/admin/setup)) and fill remaining variables in `.env.local`.\
After all those steps, run

```
npm run dev
# or
yarn dev
```

## Directory Structure

```sh
margatsni/
├── locales         # Data for internationalization
│   ├── EN          # English translations
│   └── PL          # Polish translations
├── src             # App's source files
│   ├── atoms       # Global state (Recoil)
│   ├── components  # Reusable parts
│   ├── hooks       # Custom hooks
│   ├── lib         # Initialize 3rd party service (firebase, firebase-admin)
│   ├── pages       # Application views
│   ├── services    # External services
│   └── util        # Utility functions, data
└── styles          # General app styles
```

## Acknowledgements

The project is a clone of popular [Instagram from Meta](https://instagram.com) web app with no intention of making any profit out of it.\
It is just a demo app.\
\
When I was unsure how certain things could work (app's behavior, not code), I checked live demo of [@Kerosz](https://github.com/Kerosz)'s build.
