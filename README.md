# Forza Games 🎮

Forza Games is a modern, responsive game discovery platform inspired by the Epic Games Store. It allows users to browse popular and trending games, view detailed information about each title, and discover new releases using data sourced from Steam and powered by the FitgirlAPI.

## 🚀 Features

- **Dynamic Game Discovery**: Browse through various categories like "Popular" and "Trending".
- **Responsive Design**: Fully responsive UI built with Tailwind CSS, ensuring a seamless experience across desktop, tablet, and mobile.
- **Detailed Game Pages**: In-depth information for each game, including descriptions, ratings, and screenshots.
- **Smart Caching**: Implements both in-memory and local storage caching to reduce API calls and improve performance.
- **Local Search**: Fast search functionality that queries already loaded game data.
- **Modern UI Components**: Interactive sliders and carousels for an engaging browsing experience.

## 🛠️ Tech Stack

- **Frontend**: [React 19](https://react.dev/), [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/), [Sass](https://sass-lang.com/)
- **Routing**: [React Router 6](https://reactrouter.com/)
- **Icons**: [Lucide React](https://lucide.dev/), [React Icons](https://react-icons.github.io/react-icons/)
- **Carousels**: [React Slick](https://react-slick.neostack.com/)
- **API**: [FitgirlAPI](https://github.com/forzayt/FitgirlAPI) (sourced from Steam)

## 📁 Project Structure

```text
src/
├── components/       # Reusable UI components (Navbar, Footer, Sliders)
├── data/             # Static JSON data for game categories
├── pages/            # Main application views (HomePage, GameDetails)
├── services/         # API integration and data mapping logic
├── App.jsx           # Main routing configuration
└── main.jsx          # Application entry point
```

## ⚙️ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/forzagames.git
   ```
2. Navigate to the project directory:
   ```bash
   cd forzagames
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application

To start the development server:
```bash
npm run dev
```
The application will be available at `http://localhost:5173`.

### Building for Production

To create a production-ready build:
```bash
npm run build
```

## 🌐 Deployment

The project is configured for deployment on [Vercel](https://vercel.com/) with a `vercel.json` configuration file.

## 🙏 Acknowledgements

- Inspired by the [Epic Games Store](https://store.epicgames.com/)
- Data powered by [FitgirlAPI](https://github.com/forzayt/FitgirlAPI)
- Game information sourced from [Steam](https://store.steampowered.com/)

---

© 2026, Forza Games, Inc. All rights reserved.
