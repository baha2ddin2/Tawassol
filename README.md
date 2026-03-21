# Tawassol (تواصل)

A modern, high-performance social networking platform designed for seamless connection and professional interaction. Tawassol (Arabic for "Connect") bridges the gap between developers, trainers, and communities through real-time engagement and a premium user experience.

---

## Tech Stack

### Frontend
- **Framework**: [Next.js 15+](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/)
- **Real-time**: [Socket.io-client](https://socket.io/)
- **Localization**: [react-i18next](https://react.i18next.com/)
- **Components**: [Material UI (MUI)](https://mui.com/)

### Backend
- **Core API**: [Laravel 12+](https://laravel.com/)
- **Database**: MySQL
- **Real-time Infrastructure**: Laravel Echo / Node.js WebSocket Server

---

##  Core Features

- **English/French Localization**: Seamless toggle between languages with persistent preferences.
- **Global Dark/Light Mode**: Premium, eye-friendly themes using a custom palette (#081F5C, #334EAC).
- **Real-time Presence**: Instant "Online/Offline" status tracking for all users.
- **Advanced Messaging**: Private and group chats with real-time delivery, seen indicators, and interactive message editing.
- **Community Management**: Robust group administration features (Admin roles, member removal).
- **Fully Responsive**: Optimized for mobile (iOS/Android) with fixed headers and independent scroll zones.
- **SEO Optimized**: Dynamic metadata implementation for profiles, hashtags, and search results.

---

##  Installation & Setup

### Prerequisites
- Node.js 18+
- PHP 8.2+
- Composer
- MySQL

### 1. Backend Setup (/server)
```bash
cd server/laravel-api
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve
```

### 2. WebSocket Server Setup (/server/web-socket)
```bash
cd server/web-socket
npm install
npm start
```

### 3. Frontend Setup (/client)
```bash
cd client
npm install
npm run dev
```

---

## Environment Variables (.env Template)

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### Backend (.env)
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=tawassol_db
DB_USERNAME=root
DB_PASSWORD=

JWT_SECRET=your_secret_key
```

---

## Design System

Tawassol uses a curated, harmonious color palette for a premium aesthetic:

| Color | Hex | Role |
| :--- | :--- | :--- |
| **Primary Dark** | `#081F5C` | Root backgrounds, Headers (Dark Mode) |
| **Primary** | `#334EAC` | Borders, Nav links, Cards (Dark Mode) |
| **Accent** | `#709601` | Online indicators, Success actions |
| **Surface** | `#D0E3FF` | Borders, Hover states (Light Mode) |
| **Paper** | `#F9FCFF` | Root backgrounds (Light Mode) |
