# CyberWish - Cyberpunk Wishlist App

A cyberpunk-themed wishlist application where users can create wishlists and guests can mark items as purchased.

## Quick Demo Deployment Options

### 1. Railway (Recommended - Easiest)

1. Push code to GitHub
2. Go to [Railway.app](https://railway.app)
3. Sign up with GitHub
4. Click "Deploy from GitHub repo"
5. Select this repository
6. Railway will auto-deploy!

### 2. Render

1. Push code to GitHub
2. Go to [Render.com](https://render.com)
3. Sign up and create a new "Web Service"
4. Connect your GitHub repo
5. Use these settings:
   - Build Command: `npm run build`
   - Start Command: `npm start`

### 3. Vercel + Railway

**Frontend (Vercel):**
```bash
cd frontend
npx vercel --prod
```

**Backend (Railway):**
- Deploy backend folder separately on Railway
- Update frontend API calls to use Railway backend URL

## Local Development

```bash
# Backend
cd backend
npm install
npm start

# Frontend (new terminal)
cd frontend
npm install
npm start
```

## Features

- Create cyberpunk-styled wishlists
- Share via unique ID
- Guests can mark items as "acquired"
- Real-time purchase tracking
- Responsive design with glitch effects

## Demo

Visit the deployed app and:
1. Create a new wishlist
2. Add some items
3. Share the wishlist ID with friends
4. Let them mark items as purchased