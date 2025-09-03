# Vercel Deployment Configuration

## Common Issues and Solutions

### "Vercel deployment not found" Error

This error typically occurs due to:

1. **Domain Configuration Mismatch**
   - Ensure the domain in `vercel.json` matches your actual Vercel deployment URL
   - Check that custom domains are properly configured in Vercel dashboard

2. **Routing Configuration Issues**
   - Incorrect routes in `vercel.json` can cause pages to not be found
   - Duplicate or conflicting route definitions

3. **Build Configuration Problems**
   - Missing or incorrect build commands
   - Environment variable misconfiguration

## Current Configuration

### Domain
- Primary Domain: `https://linpack.vercel.app`
- Canonical URL: `https://linpack.vercel.app`

### Build Process
1. Next.js frontend is built using `next build`
2. Python FastAPI backend is deployed with Vercel Python runtime
3. Environment variables are configured in Vercel dashboard

### Routes
- `/api/py/*` routes are proxied to the Python backend
- All other routes are handled by Next.js

## Troubleshooting Steps

1. **Verify Domain Configuration**
   - Check Vercel dashboard for domain settings
   - Ensure `vercel.json` env variables match deployment

2. **Check Route Configuration**
   - Verify routes in `vercel.json` are correct
   - Ensure no duplicate or conflicting routes

3. **Test API Endpoints**
   - Visit `/api/health` to verify deployment status
   - Check `/api/sitemap.xml` and `/api/robots.txt` for SEO routes

4. **Review Build Logs**
   - Check Vercel build logs for any errors
   - Ensure all dependencies are correctly installed

## Health Check Endpoint

A health check endpoint is available at `/api/health` to verify the deployment status.

## SEO Routes

- Sitemap: `/api/sitemap.xml`
- Robots: `/api/robots.txt`

Both routes are dynamically generated and should be accessible after deployment.