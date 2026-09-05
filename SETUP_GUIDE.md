# Festa Munich - Complete Setup Guide

## Project Overview
Festa Munich is a luxury e-commerce boutique store inspired by premium brands like Zegna. It features a React + Vite frontend with Supabase backend.

---

## 📋 Prerequisites
- Node.js 16+ (LTS recommended)
- npm or yarn package manager
- Supabase account (free tier available at https://supabase.com)
- Git

---

## 🚀 Installation Steps

### 1. Clone & Setup Local Project
```bash
cd "Desktop/Festa Munich"
npm install
```

### 2. Configure Supabase

#### Step 2.1: Create Supabase Project
- Go to https://app.supabase.com
- Create a new project
- Wait for it to initialize (usually 1-2 minutes)

#### Step 2.2: Get Your Credentials
- Go to **Settings → API** in Supabase
- Copy:
  - `Project URL` (VITE_SUPABASE_URL)
  - `anon public key` (VITE_SUPABASE_ANON_KEY)

#### Step 2.3: Create .env.local File
Create `.env.local` in project root:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

### 3. Execute Database Schema

#### Option A: Using Supabase Console (Recommended for beginners)
1. Open Supabase project → Go to **SQL Editor**
2. Click **New Query** → Paste contents of `supabase_complete_schema.sql`
3. Click **Run**
4. ✅ All tables created!

#### Option B: Using Supabase CLI (Advanced)
```bash
npx supabase db push
```

### 4. Start Development Server
```bash
npm run dev
```
Server will run at `http://localhost:5173`

---

## 📦 Project Structure

```
src/
├── components/
│   ├── admin/           # Admin dashboard & management
│   ├── checkout/        # Checkout flow
│   ├── home/           # Homepage sections
│   ├── layout/         # Navigation & layout
│   └── shop/           # Product display & details
├── context/
│   └── ShopContext.jsx # Global state management
├── data/
│   └── initialProducts.js # Sample products
├── utils/
│   └── helpers.js      # Utility functions
├── App.jsx             # Main app component
├── main.jsx            # Entry point
└── supabaseClient.js   # Supabase client config
```

---

## 🔑 Key Features

### Frontend Features
- ✅ Responsive luxury design
- ✅ Product catalog with filters
- ✅ Shopping cart & wishlist
- ✅ Checkout flow with order management
- ✅ Order tracking
- ✅ Admin dashboard for product/order management
- ✅ Smooth animations & transitions

### Database Features
- ✅ Products management
- ✅ Order processing
- ✅ Customer profiles
- ✅ Wishlist functionality
- ✅ Product reviews
- ✅ Coupon codes
- ✅ Inventory tracking
- ✅ Row-level security (RLS)
- ✅ Automatic timestamps
- ✅ Performance indexes

---

## 🛠️ Build for Production

### 1. Build the Project
```bash
npm run build
```
Creates optimized build in `dist/` folder

### 2. Preview Production Build
```bash
npm run preview
```

### 3. Deploy to Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

Or deploy to any static host:
- Netlify
- AWS Amplify
- GitHub Pages

---

## 🔐 Security Checklist

- [ ] Never commit `.env.local` to git
- [ ] Use strong Supabase passwords
- [ ] Enable Row Level Security (RLS) on all tables
- [ ] Restrict API key permissions in Supabase
- [ ] Use HTTPS in production
- [ ] Implement user authentication
- [ ] Validate all input data
- [ ] Use environment variables for secrets

---

## 📊 Database Schema

### Core Tables
1. **products** - Product catalog
2. **orders** - Customer orders
3. **order_items** - Individual items in orders
4. **customers** - Customer profiles
5. **wishlists** - Saved items
6. **reviews** - Product reviews
7. **coupon_codes** - Discount codes
8. **inventory_log** - Stock tracking

---

## 🐛 Troubleshooting

### Issue: "Supabase not configured"
**Solution:** 
- Verify `.env.local` is in project root
- Check URL and key are correct (no extra spaces)
- Restart development server

### Issue: "Products not loading"
**Solution:**
- Verify schema was executed successfully
- Check Supabase RLS policies are enabled
- Check browser console for errors

### Issue: "CORS errors"
**Solution:**
- Ensure Supabase URL is correct
- Check API key has right permissions
- Verify project is public (not private)

---

## 📱 Features Demo

### For Customers
1. Browse luxury product collections
2. View detailed product information
3. Add to cart/wishlist
4. Secure checkout process
5. Order tracking
6. Customer support contact

### For Admin
- Dashboard with KPIs
- Product management (add/edit/delete)
- Order management & tracking
- Category management
- Supabase settings configuration

---

## 📞 Support & Next Steps

### To Enable Advanced Features:
1. **User Authentication** - Integrate Supabase Auth
2. **Email Notifications** - Setup SendGrid or Mailgun
3. **Payment Gateway** - Integrate Stripe or PayPal
4. **Analytics** - Add Google Analytics
5. **SEO Optimization** - Meta tags & structured data

### Deployment Platforms:
- [Vercel](https://vercel.com) - Recommended for React/Vite
- [Netlify](https://netlify.com) - Alternative
- [AWS Amplify](https://aws.amazon.com/amplify/)

---

## 📝 Git Setup

```bash
# Initialize git
git init

# Create .gitignore
echo "node_modules/" >> .gitignore
echo ".env.local" >> .gitignore
echo "dist/" >> .gitignore

# Commit
git add .
git commit -m "Initial commit: Festa Munich e-commerce"
```

---

## ✅ Completion Checklist

- [ ] Node modules installed
- [ ] Supabase project created
- [ ] `.env.local` configured
- [ ] Database schema executed
- [ ] Development server running
- [ ] Products visible in catalog
- [ ] Admin dashboard accessible
- [ ] Checkout flow working
- [ ] Order tracking functional
- [ ] Ready for deployment

---

## 🎉 You're All Set!

Your Festa Munich e-commerce platform is now complete and ready to use.

**Happy selling! 🛍️**
