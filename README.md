# IMS Management System

Professional full-stack web application for managing Information Manipulation Sets (IMS) with comprehensive features for tracking, analyzing, and managing disinformation campaigns and cyber threats.

## Overview

This system provides a complete platform for managing IMS records with:
- Automatic CCD-ID generation (CCD-1, CCD-2, etc.)
- Role-based access control (Admin, Analyst, Viewer)
- Advanced search, filtering, and analytics
- Tag-based categorization
- IMS merging and relationship tracking
- Comprehensive audit logging
- Dashboard with statistics and trends

## Tech Stack

### Backend
- **Framework**: NestJS with TypeScript
- **Runtime**: Bun
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT with Passport
- **Validation**: class-validator & class-transformer
- **API Docs**: Swagger/OpenAPI

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State**: Zustand
- **HTTP**: Axios

## Quick Start with Docker

Cea mai simplă metodă de instalare - doar 3 comenzi!

### Cerințe

- [Docker](https://docs.docker.com/get-docker/) instalat
- [Docker Compose](https://docs.docker.com/compose/install/) instalat

### Instalare în 3 pași

**Pasul 1: Clonează repository-ul**
```bash
git clone https://github.com/Anatolie05/IMS_Management.git
cd IMS_Management
```

**Pasul 2: Pornește aplicația**
```bash
docker-compose up -d
```

**Pasul 3: Accesează aplicația**

| Serviciu | URL |
|----------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:3001 |
| API Docs (Swagger) | http://localhost:3001/api/docs |

### Credențiale implicite

| Rol | Email | Parolă |
|-----|-------|--------|
| Admin | admin@ims.com | password123 |
| Analyst | analyst1@ims.com | password123 |
| Analyst | analyst2@ims.com | password123 |
| Viewer | viewer@ims.com | password123 |

### Comenzi Docker utile

```bash
# Pornește toate serviciile
docker-compose up -d

# Oprește toate serviciile
docker-compose down

# Vezi log-urile în timp real
docker-compose logs -f

# Rebuild după modificări de cod
docker-compose up -d --build

# Șterge totul (inclusiv baza de date)
docker-compose down -v

# Vezi statusul containerelor
docker-compose ps
```

---

## Instalare Manuală (fără Docker)

### Prerequisites

- Bun installed (https://bun.sh)
- PostgreSQL database running
- Node.js (for compatibility)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Anatolie05/IMS_Management.git
cd IMS_Management
```

2. **Setup Backend**
```bash
cd backend

# Install dependencies
bun install

# Configure environment
cp .env.example .env
# Edit .env with your database credentials

# Generate Prisma client
bun run prisma:generate

# Run migrations
bun run prisma:migrate

# Seed database (optional)
bun run prisma:seed

# Start backend
bun run start:dev
```

Backend will run on `http://localhost:3001`
API docs available at `http://localhost:3001/api/docs`

3. **Setup Frontend**
```bash
cd ../frontend

# Install dependencies
bun install

# Start frontend
bun run dev
```

Frontend will run on `http://localhost:3000`

### Default Credentials

After running the seed:
- **Admin**: admin@ims.com / password123
- **Analyst 1**: analyst1@ims.com / password123
- **Analyst 2**: analyst2@ims.com / password123
- **Viewer**: viewer@ims.com / password123

## Features

### Core Functionality

1. **IMS Management**
   - Auto-generated CCD-IDs (CCD-1, CCD-2, ...)
   - Full CRUD operations
   - Rich text descriptions
   - External links (OpenCTI, DocIntel)
   - Priority levels (Urgent, High, Medium, Low)
   - Status tracking (Draft, In Progress, Completed, Merged, Archived)
   - Soft delete with restore capability

2. **User Management**
   - Three roles: Admin, Analyst, Viewer
   - Email-based authentication
   - Password hashing with bcrypt
   - JWT token-based sessions

3. **Analyst Assignment**
   - Assign IMS to analysts
   - Track assignment history
   - Workload distribution analytics
   - Re-assignment capability

4. **Tags System**
   - Color-coded tags
   - Multiple tags per IMS
   - Popular tags analytics
   - Tag-based filtering

5. **Merge Functionality**
   - Merge multiple related IMS
   - Custom merge names and descriptions
   - Track merge reasoning
   - Unmerge capability
   - Merge history

6. **Search & Filtering**
   - Full-text search across IMS
   - Filter by status, priority, analyst, tags
   - Sort by multiple criteria
   - Paginated results

7. **Dashboard & Analytics**
   - Overview statistics
   - Status and priority distribution
   - Analyst workload tracking
   - Recent activity feed
   - Timeline visualization
   - Trends analysis

8. **Audit Trail**
   - Complete history of changes
   - Assignment tracking
   - Action logging
   - Timestamp tracking

### Security Features

- JWT authentication
- Role-based access control
- Password hashing
- Rate limiting
- CORS protection
- Input validation
- SQL injection prevention (Prisma)

## API Documentation

The backend provides comprehensive API documentation via Swagger/OpenAPI.

Access at: `http://localhost:3001/api/docs`

### Key Endpoints

#### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login
- `GET /auth/profile` - Get current user

#### IMS
- `GET /ims` - List IMS (with filters)
- `GET /ims/:id` - Get IMS detail
- `POST /ims` - Create IMS
- `PATCH /ims/:id` - Update IMS
- `DELETE /ims/:id` - Delete IMS
- `POST /ims/:id/restore` - Restore deleted IMS

#### Tags
- `GET /tags` - List all tags
- `POST /tags` - Create tag
- `GET /tags/popular` - Popular tags

#### Merge
- `GET /merge` - List merges
- `POST /merge` - Create merge
- `POST /merge/:id/unmerge` - Unmerge

#### Dashboard
- `GET /dashboard/statistics` - Overall stats
- `GET /dashboard/analyst/:id/stats` - Analyst stats
- `GET /dashboard/timeline` - Timeline data
- `GET /dashboard/trends` - Trends analysis

## Database Schema

### Main Models

- **User** - System users (Admin, Analyst, Viewer)
- **IMS** - Information Manipulation Sets
- **Tag** - Categorization tags
- **IMSTag** - Many-to-many relationship
- **MergedIMS** - Merge records
- **MergedIMSItem** - IMS included in merges
- **Comment** - IMS comments
- **Attachment** - File attachments
- **IMSHistory** - Audit trail
- **IMSAssignmentHistory** - Assignment tracking
- **IMSRelation** - Related IMS connections

## Development

### Backend Development

```bash
cd backend

# Development mode with hot reload
bun run start:dev

# Run tests
bun test

# Generate Prisma client after schema changes
bun run prisma:generate

# Create new migration
bun run prisma:migrate

# Open Prisma Studio
bun run prisma:studio
```

### Frontend Development

```bash
cd frontend

# Development mode
bun run dev

# Build for production
bun run build

# Start production server
bun run start
```

## Project Structure

```
IMS_Check/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma      # Database schema
│   │   └── seed.ts            # Seed data
│   ├── src/
│   │   ├── auth/              # Authentication
│   │   ├── users/             # User management
│   │   ├── ims/               # IMS core module
│   │   ├── tags/              # Tags module
│   │   ├── merge/             # Merge module
│   │   ├── dashboard/         # Analytics
│   │   ├── prisma/            # Prisma service
│   │   └── common/            # Shared utilities
│   └── README.md
├── frontend/
│   ├── src/
│   │   ├── app/               # Next.js pages
│   │   ├── components/        # React components
│   │   ├── contexts/          # State management
│   │   ├── lib/               # Utilities
│   │   └── types/             # TypeScript types
│   └── README.md
└── README.md
```

## Environment Variables

### Backend (.env)
```env
DATABASE_URL=postgresql://user:password@localhost:5432/ims_db
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
PORT=3001
CORS_ORIGIN=http://localhost:3000
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## Deployment

### Backend Deployment

1. Build the application
```bash
bun run build
```

2. Set environment variables
3. Run migrations
```bash
bun run prisma:migrate deploy
```

4. Start production server
```bash
bun run start:prod
```

### Frontend Deployment

1. Build the application
```bash
bun run build
```

2. Set environment variables
3. Start production server
```bash
bun run start
```

### Docker Deployment

Pentru deployment în producție cu Docker:

```bash
# Clone și navighează
git clone https://github.com/Anatolie05/IMS_Management.git
cd IMS_Management

# Editează variabilele de mediu în docker-compose.yml
# - Schimbă JWT_SECRET cu o cheie secretă puternică
# - Schimbă parola bazei de date
# - Actualizează CORS_ORIGIN cu domeniul tău

# Pornește în background
docker-compose up -d

# Verifică că totul rulează
docker-compose ps
```

Pentru producție, se recomandă:
- Nginx ca reverse proxy
- Certificate SSL (Let's Encrypt)
- Backup automat pentru PostgreSQL

## License

MIT

## Support

For issues or questions:
- Check the API documentation at `/api/docs`
- Review backend README: `backend/README.md`
- Review frontend README: `frontend/README.md`

## Credits

Developed for StatCom - Information Manipulation Sets Management System
