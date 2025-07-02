# Expense Tracking App Front-End

An expense tracking application built with Angular. Easily manage your daily expenses, visualize spending trends, and gain insights into your personal finances.

## Features

- User authentication (sign up & login)
- Add, edit, and delete expenses
- Filter expenses by date
- Sort expenses by time, title, type, or amount
- Generate reports with interactive charts

## Tech Stack

- [Angular](https://angular.io/)
- [Bootstrap 5](https://getbootstrap.com/) for responsive UI
- [Chart.js](https://www.chartjs.org/) for interactive charts

## Back-End

Back-end built with Node.js, Express.js, MongoDB, and Passport.js for authentication: https://github.com/LeoSmotryk/expense-tracking-app_back-end

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [Angular CLI](https://angular.io/cli) (`npm install -g @angular/cli`)

### Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/your-username/expense-tracking-app.git
   cd expense-tracking-app
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

### Development Server

Start the local development server:
```sh
npm start
```
Open [http://localhost:4200/](http://localhost:4200/) in your browser. The app will reload automatically on code changes.

### Building

To build the project for production:
```sh
npm run build
```
The output will be in the `dist/` directory.

### Running Unit Tests

To execute unit tests via [Karma](https://karma-runner.github.io):
```sh
npm test
```

## Project Structure

- `src/app/` – Main Angular application code (components, modals, styles)
- `public/` – Static assets (favicon, etc.)
- `.vscode/` – Recommended VS Code settings and tasks
- `proxy.conf.json` – Proxy configuration for API requests

## API

This app expects a backend server running at `http://localhost:5000` for authentication and expense management. Update `proxy.conf.json` if your backend runs elsewhere.

## Customization

- To change the default expense types, edit the `defaultTypes` array in the add/edit expense modal components.
- To add more features or customize the UI, modify the components in `src/app/`.
