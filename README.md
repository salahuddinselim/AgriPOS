# Agri POS - Agricultural POS & Inventory Management System

A production-ready, single-shop POS and inventory management web application for agricultural shops in Bangladesh.

## Features

- **Dashboard**: Today's sales, total due, customer count, low stock alerts
- **Product Management**: Add/Edit/Delete products with categories (pesticide, fertilizer, seed)
- **Customer Management**: Phone-based customer identification with purchase history tracking
- **Invoice System**: Create invoices with auto-calculation, stock deduction, and customer due tracking
- **Inventory Monitoring**: Real-time stock levels with low stock alerts
- **Shop Settings**: Configure shop name, address, phone, and logo

## Tech Stack

- **Frontend**: Next.js 14, React, Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth + Storage)

## Prerequisites

1. Node.js 18+
2. Supabase account

## Setup

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Note your `Project URL` and `anon public key`

### 2. Configure Environment Variables

```bash
cp .env.example .env.local
```

Edit `.env.local` with your Supabase credentials:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### 3. Set Up Database

1. Go to Supabase SQL Editor
2. Copy and paste the contents of `schema.sql`
3. Run the SQL script

### 4. Install Dependencies

```bash
npm install
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Vercel Deployment

### 1. Deploy to Vercel

```bash
npm install -g vercel
vercel
```

Or connect your GitHub repository to Vercel.

### 2. Configure Environment Variables in Vercel

Go to your Vercel project settings and add:

- `NEXT_PUBLIC_SUPABASE_URL` = your Supabase URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` = your Supabase anon key

### 3. Set Up Supabase

Run the SQL schema in your Supabase SQL Editor (same as local setup).

## Database Schema

The system uses the following tables:

- `shop_settings`: Shop configuration (name, address, phone, logo)
- `products`: Product inventory with stock tracking
- `customers`: Customer records with unique phone numbers
- `invoices`: Invoice records
- `invoice_items`: Individual items in invoices

## Security

- Row Level Security (RLS) enabled on all tables
- Only authenticated users can access data
- Email/password authentication via Supabase Auth
- No public access to database

## Project Structure

```
invoice/
├── src/
│   ├── app/              # Next.js app router pages
│   ├── components/       # Reusable components
│   ├── context/        # React context (Auth)
│   └── lib/           # Supabase client
├── schema.sql          # Database schema with RLS policies
├── vercel.json        # Vercel configuration
└── package.json      # Dependencies
```

## License

MIT