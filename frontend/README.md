# IMS Management Frontend

Professional frontend application for Information Manipulation Sets (IMS) management system built with Next.js.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Runtime**: Bun
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Notifications**: react-hot-toast
- **Date Handling**: date-fns

## Features

- JWT-based authentication
- Role-based access control
- Dashboard with statistics and analytics
- IMS management (CRUD operations)
- Advanced search and filtering
- Tags management
- Merge/Unmerge functionality
- User management (Admin only)
- Responsive design
- Real-time notifications

## Setup

### Prerequisites

- Bun installed (https://bun.sh)
- Backend API running (see backend/README.md)

### Installation

```bash
# Install dependencies
bun install
```

### Configuration

Create a `.env.local` file:

```bash
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Running the Application

```bash
# Development mode
bun run dev

# Build for production
bun run build

# Start production server
bun run start
```

The application will be available at `http://localhost:3000`

## Default Credentials

After running the backend seed:

- **Admin**: admin@ims.com / password123
- **Analyst 1**: analyst1@ims.com / password123
- **Analyst 2**: analyst2@ims.com / password123
- **Viewer**: viewer@ims.com / password123

## Pages

### Public Routes
- `/auth/login` - Login page

### Protected Routes
- `/dashboard` - Dashboard with statistics
- `/ims` - IMS list with search and filters
- `/ims/[id]` - IMS detail view
- `/ims/new` - Create new IMS
- `/ims/[id]/edit` - Edit IMS
- `/tags` - Tags management
- `/merge` - Merged IMS list

### Admin Only
- `/users` - User management

## Project Structure

```
frontend/
├── src/
│   ├── app/               # Next.js App Router pages
│   │   ├── auth/          # Authentication pages
│   │   ├── dashboard/     # Dashboard
│   │   ├── ims/           # IMS pages
│   │   ├── tags/          # Tags pages
│   │   ├── merge/         # Merge pages
│   │   ├── users/         # User management (Admin)
│   │   ├── layout.tsx     # Root layout
│   │   ├── page.tsx       # Home page
│   │   └── globals.css    # Global styles
│   ├── components/        # Reusable components
│   │   └── Navbar.tsx     # Navigation bar
│   ├── contexts/          # React contexts
│   │   └── AuthContext.tsx # Auth state management
│   ├── lib/               # Utilities
│   │   └── api.ts         # API client
│   └── types/             # TypeScript types
│       └── index.ts       # Type definitions
├── .env.local             # Environment variables
├── next.config.js         # Next.js configuration
├── tailwind.config.ts     # Tailwind configuration
└── package.json
```

## Key Features Implementation

### Authentication
- JWT token stored in localStorage
- Automatic token injection in API requests
- Automatic redirect on 401 responses
- Protected routes with role-based access

### State Management
- Zustand for auth state
- Persistent storage with zustand/middleware

### API Integration
- Axios instance with interceptors
- Automatic error handling
- Type-safe API calls

### UI Components
- Tailwind CSS utilities
- Custom badge styles for statuses
- Responsive layouts
- Form components with validation

## Development

### Adding New Pages
1. Create page in `src/app/[route]/page.tsx`
2. Add layout if needed in `src/app/[route]/layout.tsx`
3. Update navigation in `src/components/Navbar.tsx`

### Adding New API Calls
1. Define types in `src/types/index.ts`
2. Use the `api` instance from `src/lib/api.ts`
3. Handle errors with try-catch and toast notifications

## Styling

Tailwind CSS is configured with custom utilities in `globals.css`:

- `.btn`, `.btn-primary`, `.btn-secondary`, `.btn-danger` - Button styles
- `.card` - Card container
- `.input`, `.label` - Form elements
- `.badge-*` - Status and priority badges

## TypeScript

The project uses strict TypeScript configuration. All types are defined in `src/types/index.ts`.

## License

MIT
