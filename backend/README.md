# IMS Management Backend

Professional backend API for Information Manipulation Sets (IMS) management system.

## Tech Stack

- **Framework**: NestJS with TypeScript
- **Runtime**: Bun
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT with Passport
- **Validation**: class-validator & class-transformer
- **API Documentation**: Swagger/OpenAPI

## Features

- JWT Authentication & Authorization
- Role-based Access Control (Admin, Analyst, Viewer)
- IMS CRUD operations with auto-generated CCD-IDs
- Advanced search and filtering
- Tags management
- Merge/Unmerge functionality
- Dashboard with statistics and analytics
- Audit logging and history tracking
- Soft delete support
- Rate limiting
- Comprehensive API documentation

## Setup

### Prerequisites

- Bun installed (https://bun.sh)
- PostgreSQL database running

### Installation

```bash
# Install dependencies
bun install

# Copy environment variables
cp .env.example .env
# Edit .env with your database credentials

# Generate Prisma client
bun run prisma:generate

# Run migrations
bun run prisma:migrate

# Seed the database (optional)
bun run prisma:seed
```

### Running the Application

```bash
# Development mode
bun run start:dev

# Production mode
bun run build
bun run start:prod
```

The API will be available at `http://localhost:3001`

API Documentation: `http://localhost:3001/api/docs`

## Test Credentials

After running the seed:

- **Admin**: admin@ims.com / password123
- **Analyst 1**: analyst1@ims.com / password123
- **Analyst 2**: analyst2@ims.com / password123
- **Viewer**: viewer@ims.com / password123

## API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `GET /auth/profile` - Get current user profile

### Users
- `GET /users` - List all users
- `GET /users/:id` - Get user by ID
- `GET /users/analysts` - Get all analysts
- `POST /users` - Create user (Admin only)
- `PATCH /users/:id` - Update user (Admin only)
- `DELETE /users/:id` - Delete user (Admin only)

### IMS
- `GET /ims` - List IMS with filters
- `GET /ims/:id` - Get IMS by ID
- `GET /ims/:id/history` - Get IMS history
- `POST /ims` - Create new IMS
- `PATCH /ims/:id` - Update IMS
- `DELETE /ims/:id` - Soft delete IMS
- `POST /ims/:id/restore` - Restore deleted IMS (Admin)

### Tags
- `GET /tags` - List all tags
- `GET /tags/:id` - Get tag by ID
- `GET /tags/popular` - Get popular tags
- `POST /tags` - Create tag
- `PATCH /tags/:id` - Update tag
- `DELETE /tags/:id` - Delete tag (Admin)

### Merge
- `GET /merge` - List active merges
- `GET /merge/history` - Get merge history
- `GET /merge/:id` - Get merge by ID
- `POST /merge` - Create merge
- `POST /merge/:id/unmerge` - Unmerge
- `DELETE /merge/:id` - Delete merge (Admin)

### Dashboard
- `GET /dashboard/statistics` - Get overall statistics
- `GET /dashboard/analyst/:id/stats` - Get analyst stats
- `GET /dashboard/timeline` - Get creation timeline
- `GET /dashboard/trends` - Get trends

## Project Structure

```
backend/
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── seed.ts            # Seed data
├── src/
│   ├── auth/              # Authentication module
│   ├── users/             # Users module
│   ├── ims/               # IMS module
│   ├── tags/              # Tags module
│   ├── merge/             # Merge module
│   ├── dashboard/         # Dashboard module
│   ├── prisma/            # Prisma service
│   ├── common/            # Shared utilities
│   │   ├── decorators/    # Custom decorators
│   │   ├── guards/        # Auth guards
│   │   ├── filters/       # Exception filters
│   │   └── interceptors/  # Interceptors
│   ├── app.module.ts      # Root module
│   └── main.ts            # Application entry
├── .env                   # Environment variables
└── package.json
```

## Database Schema

Key models:
- **User**: Authentication and user management
- **IMS**: Information Manipulation Sets
- **Tag**: Categorization tags
- **MergedIMS**: Merged IMS records
- **Comment**: IMS comments
- **Attachment**: File attachments
- **IMSHistory**: Audit trail

## Development

```bash
# Run in watch mode
bun run start:dev

# Run tests
bun test

# Lint code
bun run lint

# Format code
bun run format

# Open Prisma Studio
bun run prisma:studio
```

## Environment Variables

See `.env.example` for all available configuration options.

Key variables:
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret for JWT token signing
- `JWT_EXPIRES_IN` - Token expiration time
- `PORT` - API port (default: 3001)
- `CORS_ORIGIN` - Allowed CORS origin

## License

MIT
