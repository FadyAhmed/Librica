#!/bin/sh

# Run migrations
npx prisma migrate deploy
npx prisma generate

# Start the app
npm run dev