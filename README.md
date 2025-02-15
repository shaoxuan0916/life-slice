# Life Slice

Life Slice is a web application that helps you document and organize your life's meaningful moments. It allows you to:

- Record and preserve your life events
- Organize experiences into distinct journeys (like career, education, or personal growth)
- Break down each journey into smaller, memorable "slices" that tell your story
- Share your journeys with friends and family
- Favorite other users' journeys and react to their slices

Think of it as a digital life journal where each journey represents a different chapter of your life, and slices are the individual moments that make that chapter special.

## Tech Stack

- Next.js
- Tailwind CSS
- Shadcn UI
- Tanstack Query
- TypeScript
- Supabase
- Stripe
- Resend

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Supabase account
- Resend account
- Stripe account

### Step 1: Clone and Install Dependencies

1. Clone the repository

```bash
git clone https://github.com/shaoxuan0916/life-slice.git
cd life-slice
```

2. Install dependencies

```bash
npm install # or yarn install
```

### Step 2: Setup Supabase, Stripe, Resend and add the environment variables to .env.local

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_SUPABASE_BUCKET=your_bucket_name

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_publishable_key
STRIPE_SECRET_KEY=your_secret_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret
NEXT_PUBLIC_PRICE_ID=your_price_id

# Resend
RESEND_API_KEY=your_resend_api_key
```

### Step 3: Run the development server

```bash
npm run dev # or yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to use the app.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please feel free to submit a pull request.

Happy coding! 🎉
