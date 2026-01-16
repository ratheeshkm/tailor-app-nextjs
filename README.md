This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Database Setup

This project uses PostgreSQL with Prisma ORM. To set up a free database:

1. **Create a free PostgreSQL database:**
   - Use [Neon](https://neon.tech) (recommended) or [Supabase](https://supabase.com)
   - Create a new project/database
   - Copy the connection string

2. **Update environment variables:**
   - Update `.env.local` with your database connection string
   - Example: `DATABASE_URL="postgresql://username:password@hostname/database?sslmode=require"`

3. **Install dependencies and generate Prisma client:**
   ```bash
   npm install
   npx prisma generate
   ```

4. **Run database migrations:**
   ```bash
   npx prisma db push
   ```

4. **Seed the database with dummy data (optional):**
   ```bash
   npm run seed
   ```
   This will add 50 sample customers to test the search functionality.

### Troubleshooting Database Issues:

- **"PrismaClient is not defined"**: Run `npx prisma generate`
- **"Can't connect to database"**: Check your DATABASE_URL in `.env.local`
- **"Migration failed"**: Ensure your database allows schema modifications
- **API returns 500 error**: Check server logs for detailed error messages

## Getting Started

First, install dependencies and run the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Features

- Add customers with name and mobile number
- Create new stitching orders with customer selection, cloth type, and measurements
- Responsive design with dark mode support

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
