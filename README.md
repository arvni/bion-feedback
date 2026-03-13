# Voice Record — Bilingual Feedback Collection App

A mobile-first web application for collecting customer feedback via voice recordings or structured Q&A surveys. Supports English and Arabic (RTL) with a clean multi-step wizard UI.

---

## Features

- **Bilingual** — English and Arabic with full RTL layout support (Cairo font for Arabic)
- **Two feedback modes** — Voice recording (up to 60 seconds) or structured Q&A survey
- **Multi-step wizard** — Language → Phone → Mode → Record/Survey
- **Admin panel** — Dashboard with stats, question management (EN + AR), paginated responses with audio playback
- **Authenticated audio streaming** — Voice files served through a protected Laravel route (not publicly exposed)
- **Custom notifications** — No browser `alert()` — animated overlay with auto-dismiss for success

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Laravel 12, PHP 8.2+ |
| Frontend | React 19, Inertia.js v2 |
| Styling | Bootstrap 5, custom SCSS |
| Build | Vite 6 |
| Database | MySQL |
| Fonts | Nunito (EN), Cairo (AR) via Bunny Fonts |

---

## Requirements

- PHP 8.2+
- Composer
- Node.js 18+
- MySQL 8+

---

## Installation

```bash
# 1. Clone the repository
git clone <repo-url>
cd voice-record

# 2. Install PHP dependencies
composer install

# 3. Install JS dependencies
npm install

# 4. Environment setup
cp .env.example .env
php artisan key:generate
```

Edit `.env` with your database credentials:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=voice_record
DB_USERNAME=root
DB_PASSWORD=
```

```bash
# 5. Run migrations
php artisan migrate

# 6. Create storage symlink (for file access)
php artisan storage:link

# 7. Create the first admin user
php artisan tinker
>>> \App\Models\User::create(['name'=>'Admin','email'=>'admin@example.com','password'=>bcrypt('password')]);

# 8. Build assets
npm run build

# 9. Start the server
php artisan serve
```

---

## Development

```bash
# Run Vite dev server (HMR) alongside Laravel
npm run dev          # http://localhost:5173
php artisan serve    # http://localhost:8000
```

---

## Project Structure

```
resources/js/
├── Pages/
│   ├── Welcome.jsx          # Main wizard shell (step state, submit logic)
│   ├── Admin/
│   │   ├── Dashboard.jsx    # Stats + per-question rating breakdown
│   │   ├── Questions.jsx    # CRUD for survey questions (EN + AR)
│   │   └── Responses.jsx    # Paginated response list + audio player
│   └── Auth/                # Login, ForgotPassword, ResetPassword, etc.
├── Layouts/
│   └── AdminLayout.jsx      # Navbar + layout wrapper for admin pages
├── components/
│   ├── LanguageStep.jsx     # Step 1 — EN / AR language selector
│   ├── FirstStep.jsx        # Step 2 — Phone number input
│   ├── SecondStep.jsx       # Step 3 — Voice or Survey choice
│   ├── SoundRecordStep.jsx  # Final step — mic recording UI
│   ├── QAStep.jsx           # Final step — emoji rating survey
│   ├── recorder-controls.jsx# Mic button + progress ring + stop/submit
│   └── AppNotification.jsx  # Animated success/error overlay
├── hooks/
│   └── useRecorder.js       # MediaRecorder state management hook
├── handlers/
│   └── recorder-controls.js # startRecording / saveRecording helpers
└── utils/
    ├── format-time.js        # MM:SS timer formatter
    ├── generate-key.js       # UUID key generator
    └── recorder.js           # Low-level recorder utilities
```

---

## Routes

### Public

| Method | Path | Description |
|---|---|---|
| `GET` | `/` | Main feedback wizard |
| `POST` | `/api/upload` | Submit voice recording or Q&A answers |
| `GET` | `/api/questions` | Fetch active survey questions (ordered) |

### Admin (requires authentication)

| Method | Path | Description |
|---|---|---|
| `GET` | `/admin` | Dashboard |
| `GET` | `/admin/questions` | List questions |
| `POST` | `/admin/questions` | Create question |
| `PUT` | `/admin/questions/{id}` | Update question |
| `DELETE` | `/admin/questions/{id}` | Delete question |
| `GET` | `/admin/responses` | Paginated responses list |
| `GET` | `/admin/audio/{id}` | Stream audio file (authenticated only) |

### Auth

| Method | Path | Description |
|---|---|---|
| `GET/POST` | `/login` | Admin login |
| `POST` | `/logout` | Logout |
| `GET/POST` | `/forgot-password` | Password reset request |
| `GET/POST` | `/reset-password/{token}` | Set new password |

---

## Database Schema

### `files` — Feedback submissions

| Column | Type | Notes |
|---|---|---|
| `id` | bigint | Primary key |
| `phoneNo` | string | Submitter's phone number |
| `type` | string | `soundRecord` or `qa` |
| `fileAddress` | string\|null | Storage path to audio file (voice only) |
| `qa` | json\|null | Array of `{question, value}` objects (survey only) |
| `hash` | string | UUID, unique per submission |
| `created_at` | timestamp | Auto-managed by Laravel |

### `questions` — Survey questions

| Column | Type | Notes |
|---|---|---|
| `id` | bigint | Primary key |
| `text` | text | English question text |
| `text_ar` | text\|null | Arabic question text |
| `order` | integer | Display order (unique) |
| `status` | boolean | `1` = active, `0` = hidden from survey |

---

## Audio Storage

Voice recordings are stored on the `local` disk under:

```
storage/app/AudioFiles/YYYY-MMM-DD/<timestamp>.<ext>
```

Files are **not publicly accessible**. All playback goes through the authenticated `GET /admin/audio/{id}` route, which streams the file via `Storage::response()` with the correct MIME type and `Accept-Ranges` headers for seeking.

---

## Docker

### Build

```bash
docker build -t bion-feedback .
```

### Run (single container)

```bash
docker run -d \
  --name bion-feedback \
  -p 8000:8000 \
  -e APP_KEY=base64:... \
  -e APP_URL=http://localhost:8000 \
  -e DB_HOST=your-db-host \
  -e DB_PORT=3306 \
  -e DB_DATABASE=voice_record \
  -e DB_USERNAME=root \
  -e DB_PASSWORD=secret \
  -e MAIL_MAILER=smtp \
  -e MAIL_HOST=your-mail-host \
  -e MAIL_PORT=587 \
  -e MAIL_USERNAME=... \
  -e MAIL_PASSWORD=... \
  -e FEEDBACK_NOTIFY_EMAIL=feedback@example.com \
  -e TURNSTILE_SITE_KEY=... \
  -e TURNSTILE_SECRET_KEY=... \
  bion-feedback
```

Or use an env file:

```bash
docker run -d --name bion-feedback -p 8000:8000 --env-file .env bion-feedback
```

### Container roles

The image supports multiple roles via the `CONTAINER_ROLE` environment variable:

| Role | Command | Description |
|---|---|---|
| `app` (default) | `php artisan serve` | HTTP server on port 8000 |
| `queue` | `php artisan queue:work` | Processes email queue jobs |
| `scheduler` | `php artisan schedule:run` | Runs scheduled tasks every 60 s |

### Docker Compose example

```yaml
services:
  app:
    image: bion-feedback
    ports:
      - "8000:8000"
    env_file: .env
    environment:
      CONTAINER_ROLE: app
    depends_on:
      - db

  queue:
    image: bion-feedback
    env_file: .env
    environment:
      CONTAINER_ROLE: queue
    depends_on:
      - db

  scheduler:
    image: bion-feedback
    env_file: .env
    environment:
      CONTAINER_ROLE: scheduler
    depends_on:
      - db

  db:
    image: mysql:8
    environment:
      MYSQL_DATABASE: voice_record
      MYSQL_ROOT_PASSWORD: secret
    volumes:
      - db_data:/var/lib/mysql

volumes:
  db_data:
```

> **Note:** Run `php artisan key:generate --show` locally to generate an `APP_KEY` value for the container.

---

## Admin Access

Navigate to `/login` and sign in with the credentials you created during installation. After login you are redirected to `/admin`.

The admin panel requires authentication on all routes — attempting to access `/admin/*` without a session redirects to `/login`.
