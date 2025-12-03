# Bolmi Admin Platform

Professional admin dashboard for public transportation management. Build with Next.js, TypeScript, TailwindCSS, and Recharts.

## Features

- **Authentication & Authorization**: JWT-based auth with role-based access control
  - Admin Global: Full system access
  - Admin Sindicato: Union-specific access
  - Conductor: Driver account

- **Users Management**: Create and manage conductors and union admins
- **Route Deviation Analytics**: 
  - Haversine distance calculation
  - Accuracy scoring system (Verde/Amarillo/Rojo)
  - Real-time metrics and KPIs
  
- **Trip Management**: View and manage trips with payment control
- **Driver Performance**: Personal dashboards with historical data
- **Fleet Management**: Vehicle tracking and assignment
- **Union Management**: Multi-sindicato support for Admin Global

## Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript
- **Styling**: TailwindCSS v4, shadcn/ui
- **Charts**: Recharts
- **State**: React Context + SWR
- **Forms**: React Hook Form
- **Maps**: Leaflet (ready for integration)

## Setup

### Environment Variables

Create `.env.local` with your microservice URLs:

\`\`\`env
NEXT_PUBLIC_AUTH_BASE_URL=https://your-auth-service.vercel.app
NEXT_PUBLIC_SINDICATO_BASE_URL=https://your-sindicato-service.vercel.app
NEXT_PUBLIC_VIAJES_BASE_URL=https://your-viajes-service.vercel.app
NEXT_PUBLIC_RUTAS_BASE_URL=https://your-rutas-service.vercel.app
NEXT_PUBLIC_VEHICULO_BASE_URL=https://your-vehiculo-service.vercel.app
\`\`\`

### Installation

\`\`\`bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000
\`\`\`

## Project Structure

\`\`\`
app/
├── login/              # Login page
├── dashboard/          # Protected dashboard
│   ├── page.tsx       # Main dashboard with KPIs
│   ├── usuarios/      # User management
│   ├── viajes/        # Trip management
│   ├── conductores/   # Driver list & dashboards
│   ├── vehiculos/     # Fleet management
│   ├── rutas/         # Routes list
│   └── sindicatos/    # Union management (Admin Global)
├── layout.tsx         # Root layout
└── globals.css        # Global styles & theme

lib/
├── api/               # Microservice clients
│   ├── client.ts     # HTTP client with auth
│   ├── auth.ts
│   ├── sindicatos.ts
│   ├── viajes.ts
│   ├── rutas.ts
│   └── vehiculos.ts
├── analytics/         # Deviation calculations
│   ├── distance.ts   # Haversine formula
│   └── viajes.ts     # Metrics & aggregations
├── context/          # Global state
│   └── auth-context.tsx
├── types.ts          # TypeScript definitions
└── env.ts            # Environment config

components/
├── layout/           # Navigation & layout
│   ├── sidebar.tsx
│   ├── header.tsx
│   └── dashboard-layout.tsx
├── usuarios/         # User management components
├── viajes/          # Trip components
└── ui/              # shadcn/ui components
\`\`\`

## Key Features Explained

### Authentication Flow

1. User logs in via `/login`
2. `POST /auth/login` returns JWT token
3. Token stored in localStorage
4. Subsequent requests include `Authorization: Bearer <token>`
5. 401 responses redirect to login
6. User data cached in React Context

### Role-Based Access

- **Admin Global**: Access to all sindicatos, can create new admins
- **Admin Sindicato**: Limited to own sindicato data
- Routes protected by role requirements

### Route Deviation Analysis

Metrics calculated using:
- **Haversine Distance**: Precise geographic calculations
- **Accuracy Score**: 0-100 based on average distance to planned route
- **Classification System**:
  - Verde: Score ≥85% & time_out_of_route <5%
  - Amarillo: Score 70-85% or time_out_of_route 5-15%
  - Rojo: Score <70% or time_out_of_route >15%

### Analytics & Aggregations

- Per-driver averages
- Per-route performance
- Per-sindicato KPIs
- Temporal trends and comparisons

## API Integration

All microservices are consumed via `/lib/api/` services:

\`\`\`typescript
// Example: Get trips for a conductor
import { viagesService } from '@/lib/api/viajes'
const trips = await viagesService.getByConductor(conductorId)
\`\`\`

Service methods handle:
- Authorization headers
- Error handling
- Response parsing
- Request/response logging

## Deployment

### Vercel (Recommended)

\`\`\`bash
# Push to GitHub
git push origin main

# Vercel auto-deploys on push
# Set env vars in Vercel dashboard
\`\`\`

### Docker

\`\`\`dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
\`\`\`

## TODOs & Future Improvements

- [ ] Leaflet map integration for trip visualization
- [ ] Real-time GPS tracking with WebSockets
- [ ] Bulk operations (payments, user creation)
- [ ] Advanced filtering & export (CSV/PDF)
- [ ] Push notifications for payment reminders
- [ ] Admin activity logs & audit trail
- [ ] API rate limiting & caching optimization
- [ ] Unit & integration tests

## Support

For issues or questions:
1. Check the error logs in browser console
2. Verify all env vars are set correctly
3. Confirm microservices are accessible
4. Open issue on GitHub

## License

Proprietary - Bolmi Platform
