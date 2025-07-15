#!/bin/bash

# Test production build locally
echo "🔍 Testing production build locally..."

# Build the project
echo "📦 Building frontend..."
npm run build

# Serve the build locally
echo "🚀 Starting local production server..."
echo "Open http://localhost:4173 to test production build"
echo "Backend should be running on http://localhost:3001"

npx vite preview --port 4173
