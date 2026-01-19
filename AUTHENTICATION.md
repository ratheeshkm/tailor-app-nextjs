# Authentication System - Setup Guide

## Overview
The Tailer App now includes a complete authentication system with login/logout functionality and a User database model.

## Credentials
- **Username:** `sunu`
- **Password:** `sunu`

## How to Test Locally

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Open the browser:**
   Navigate to `http://localhost:3000`

3. **You will be redirected to the login page** (`/login`) automatically because the app now requires authentication for all routes except the login page.

4. **Login with demo credentials:**
   - Username: `sunu`
   - Password: `sunu`

5. **After successful login:**
   - You'll be redirected to the home page (`/`)
   - You'll see a "Logout" button in the header (both desktop and mobile)
   - All other pages are now protected and accessible only when logged in

6. **To logout:**
   - Click the "Logout" button in the header
   - You'll be redirected to the login page

## Implementation Details

### Database Schema
A new `User` model was added to `prisma/schema.prisma`:
```prisma
model User {
  id        Int     @id @default(autoincrement())
  username  String  @unique
  password  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### Authentication Files Created

1. **`app/login/page.tsx`** - Login page component with:
   - Username and password input fields
   - Error message display
   - Loading states during submission
   - Demo credentials info box
   - Dark mode support

2. **`app/api/auth/login/route.ts`** - Login API endpoint:
   - Accepts POST requests with `{ username, password }`
   - Verifies password using bcryptjs
   - Generates JWT token with 7-day expiration
   - Sets secure httpOnly cookie
   - Returns authentication token

3. **`app/api/auth/logout/route.ts`** - Logout API endpoint:
   - Accepts POST requests
   - Clears the authentication cookie
   - Redirects user to login page

4. **`middleware.ts`** - Authentication middleware:
   - Protects all routes except `/login`, `/api/auth/login`, and `/api/health`
   - Validates JWT tokens from cookies
   - Redirects unauthenticated users to `/login`
   - Returns 401 for unauthorized API requests

### Modified Files

1. **`app/components/Header.tsx`** - Added logout button:
   - Desktop navigation: Logout button next to Customers menu
   - Mobile navigation: Logout button in mobile menu
   - Calls `/api/auth/logout` endpoint and redirects to login

2. **`prisma/schema.prisma`** - Updated to use environment variables:
   - Changed `DATABASE_URL` and added `DIRECT_URL` from environment
   - Added User model for authentication

3. **`.env` and `.env.local`** - Updated with new environment variables:
   ```env
   DATABASE_URL="your-pooled-connection-string"
   DIRECT_URL="your-direct-connection-string"
   JWT_SECRET="your-super-secret-jwt-key-change-in-production"
   ```

### Packages Used
- **bcryptjs** - Password hashing with bcrypt algorithm
- **jsonwebtoken** - JWT token generation and verification

## Database Migration

The User table was created using:
```bash
npx prisma migrate dev --name add_user
```

The demo user (sunu/sunu) was seeded using:
```bash
npx tsx scripts/seed-auth.js
```

## Security Features

1. **Password Hashing:** Passwords are hashed using bcryptjs before storage
2. **JWT Tokens:** Session tokens are signed and verified using JWT
3. **HttpOnly Cookies:** Auth tokens are stored in secure httpOnly cookies
4. **Route Protection:** Middleware automatically protects all routes
5. **Token Expiration:** JWT tokens expire after 7 days

## Adding New Users

To add a new user, create a migration or use the seed script pattern. Example:

```javascript
const { PrismaClient } = require('@prisma/client');
const bcryptjs = require('bcryptjs');

const prisma = new PrismaClient();

async function createUser(username, password) {
  const hashedPassword = await bcryptjs.hash(password, 10);
  const user = await prisma.user.create({
    data: { username, password: hashedPassword }
  });
  console.log('User created:', user);
}

createUser('newuser', 'newpassword');
```

## Deploying to Vercel

1. **Set environment variables in Vercel dashboard:**
   - `DATABASE_URL` - Your pooled connection string
   - `DIRECT_URL` - Your direct connection string
   - `JWT_SECRET` - A strong secret key for JWT signing

2. **Run migrations on Vercel:**
   ```bash
   npx prisma migrate deploy
   ```

3. **Seed the user:**
   ```bash
   npx tsx scripts/seed-auth.js
   ```

## Troubleshooting

**"Unable to acquire lock" error:**
- Kill any running Node.js processes: `Get-Process node | Stop-Process -Force`

**"DIRECT_URL not found" error:**
- Ensure both `DATABASE_URL` and `DIRECT_URL` are set in `.env`

**Login fails with "Invalid credentials":**
- Check that the user exists in the database
- Verify the password is correct (case-sensitive)

**Stuck on login page:**
- Check browser console for JWT errors
- Verify JWT_SECRET is set correctly in environment
- Clear browser cookies and try again
