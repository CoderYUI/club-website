# Deployment Guide for Club-Website

## Prerequisites

Before deploying, ensure you have:

1. A Vercel account
2. The Vercel CLI installed (`npm install -g vercel`)
3. All changes committed to your repository

## Deployment Steps

### 1. Prepare for Deployment

First, make sure all changes are committed:

```bash
git add .
git commit -m "Update SEO configuration and fix Vercel deployment issues"
```

### 2. Deploy to Vercel

You can deploy in two ways:

#### Option A: Using Vercel CLI (Recommended)

```bash
# If this is your first time deploying this project
vercel --prod

# For subsequent deployments
vercel --prod
```

#### Option B: Using Git Integration

1. Push your changes to your Git repository:
   ```bash
   git push origin main
   ```

2. Vercel will automatically deploy if you have Git integration set up

### 3. Verify Deployment

After deployment, verify that all changes are working:

1. Visit your deployed site: https://linpack.vercel.app
2. Run the SEO verification script:
   ```bash
   npm run seo-verify
   ```

### 4. Post-Deployment Checklist

- [ ] Canonical URL shows as `https://linpack.vercel.app`
- [ ] Health check endpoint works: `https://linpack.vercel.app/api/health`
- [ ] Sitemap is accessible: `https://linpack.vercel.app/api/sitemap.xml`
- [ ] Robots.txt is accessible: `https://linpack.vercel.app/api/robots.txt`
- [ ] All SEO meta tags are correctly set

## Troubleshooting

### "Vercel deployment not found" Error

If you encounter this error:

1. Check that your custom domain is properly configured in the Vercel dashboard
2. Ensure the domain in `vercel.json` matches your actual deployment
3. Verify that the deployment completed successfully in the Vercel dashboard

### SEO Verification Failures

If SEO verification fails after deployment:

1. Wait a few minutes for Vercel's CDN to propagate changes
2. Clear your browser cache
3. Run the verification script again

### API Route Issues

If API routes return 404:

1. Check that the route files are in the correct directory structure:
   ```
   app/
   └── api/
       ├── health/
       │   └── route.ts
       ├── sitemap.xml/
       │   └── route.ts
       └── robots.txt/
           └── route.ts
   ```

2. Ensure route files export the correct HTTP methods (GET, POST, etc.)

## Environment Variables

Make sure these environment variables are set in your Vercel project:

- `NEXT_PUBLIC_API_URL=https://linpack.vercel.app/`

You can set them in the Vercel dashboard under Settings > Environment Variables.

## Custom Domain Configuration

To configure your custom domain:

1. Go to your Vercel project dashboard
2. Navigate to Settings > Domains
3. Add your domain: `linpack.vercel.app`
4. Follow the DNS configuration instructions

## Rollback Procedure

If you need to rollback to a previous deployment:

1. Go to your Vercel project dashboard
2. Navigate to the "Deployments" tab
3. Find the previous working deployment
4. Click the "Promote to Production" button

## Monitoring

After deployment, monitor:

1. Vercel Analytics for performance metrics
2. Error logs in the Vercel dashboard
3. SEO verification script results