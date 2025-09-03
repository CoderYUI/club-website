#!/usr/bin/env node

const axios = require('axios');
const cheerio = require('cheerio');

console.log('SEO Verification Script');
console.log('======================');
console.log('Note: This script verifies the deployed version of your website.');
console.log('If you have made local changes, please deploy them to Vercel first.');
console.log('See DEPLOYMENT_GUIDE.md for deployment instructions.\n');

async function verifySEO() {
  try {
    console.log('Starting SEO verification for https://linpack.vercel.app\n');
    
    // Test the main page
    const response = await axios.get('https://linpack.vercel.app');
    const $ = cheerio.load(response.data);
    
    // Check title
    const title = $('title').text();
    console.log('✅ Title:', title);
    
    // Check meta description
    const description = $('meta[name="description"]').attr('content');
    console.log('✅ Description:', description);
    
    // Check canonical URL
    const canonical = $('link[rel="canonical"]').attr('href');
    console.log('✅ Canonical URL:', canonical);
    
    // Verify canonical URL is correct
    if (canonical === 'https://linpack.vercel.app') {
      console.log('✅ Canonical URL is correct');
    } else {
      console.log('❌ Canonical URL is incorrect. Expected: https://linpack.vercel.app, Got:', canonical);
      console.log('   This may be because you haven\'t deployed your changes yet.');
    }
    
    // Check Open Graph tags
    const ogTitle = $('meta[property="og:title"]').attr('content');
    const ogDescription = $('meta[property="og:description"]').attr('content');
    const ogImage = $('meta[property="og:image"]').attr('content');
    console.log('✅ OG Title:', ogTitle);
    console.log('✅ OG Description:', ogDescription);
    console.log('✅ OG Image:', ogImage);
    
    // Check Twitter tags
    const twitterCard = $('meta[name="twitter:card"]').attr('content');
    const twitterTitle = $('meta[name="twitter:title"]').attr('content');
    const twitterImage = $('meta[name="twitter:image"]').attr('content');
    console.log('✅ Twitter Card:', twitterCard);
    console.log('✅ Twitter Title:', twitterTitle);
    console.log('✅ Twitter Image:', twitterImage);
    
    // Test health endpoint
    try {
      const healthResponse = await axios.get('https://linpack.vercel.app/api/health');
      console.log('✅ Health Check Status:', healthResponse.status);
      console.log('✅ Health Check Message:', healthResponse.data.message);
    } catch (healthError) {
      console.log('❌ Health Check Error:', healthError.response?.status || healthError.message);
      console.log('   This may be because you haven\'t deployed your changes yet.');
    }
    
    // Test sitemap
    try {
      const sitemapResponse = await axios.get('https://linpack.vercel.app/api/sitemap.xml');
      console.log('✅ Sitemap Status:', sitemapResponse.status);
      console.log('✅ Sitemap Content Type:', sitemapResponse.headers['content-type']);
    } catch (sitemapError) {
      console.log('❌ Sitemap Error:', sitemapError.response?.status || sitemapError.message);
      console.log('   This may be because you haven\'t deployed your changes yet.');
    }
    
    // Test robots.txt
    try {
      const robotsResponse = await axios.get('https://linpack.vercel.app/api/robots.txt');
      console.log('✅ Robots.txt Status:', robotsResponse.status);
      console.log('✅ Robots.txt Content Type:', robotsResponse.headers['content-type']);
    } catch (robotsError) {
      console.log('❌ Robots.txt Error:', robotsError.response?.status || robotsError.message);
      console.log('   This may be because you haven\'t deployed your changes yet.');
    }
    
    // Test image accessibility
    try {
      const imageResponse = await axios.get('https://linpack.vercel.app/preview.png', { 
        responseType: 'stream' 
      });
      console.log('✅ Preview Image Status:', imageResponse.status);
    } catch (imageError) {
      console.log('❌ Preview Image Error:', imageError.response?.status || imageError.message);
    }
    
    console.log('\n🎉 SEO Verification Complete!');
    console.log('\n📝 Note: If any items show as incorrect or missing, please deploy your changes to Vercel.');
    console.log('   See DEPLOYMENT_GUIDE.md for detailed deployment instructions.');
  } catch (error) {
    console.error('❌ SEO Verification Error:', error.response?.status, error.message);
    console.error('Please make sure your website is deployed and accessible at https://linpack.vercel.app');
    console.error('See DEPLOYMENT_GUIDE.md for deployment instructions.');
    process.exit(1);
  }
}

verifySEO();