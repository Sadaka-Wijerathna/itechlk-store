# 🚀 Quick Start Checklist - Make iTechLK Appear Like Frame Toque on Google

## ✅ IMMEDIATE ACTIONS (Do These Today!)

### 1. Update Your Business Address (5 minutes)
**File:** `src/components/StructuredData.tsx`

Find this section (around line 90):
```typescript
address = {
  streetAddress: 'Your Street Address', // ← CHANGE THIS
  addressLocality: 'Colombo',           // ← CHANGE THIS
  addressRegion: 'Western Province',    // ← CHANGE THIS
  postalCode: '00700',                  // ← CHANGE THIS
  addressCountry: 'LK',
}
```

**Replace with your actual address:**
```typescript
address = {
  streetAddress: '123 Main Street',      // Your street address
  addressLocality: 'Colombo',            // Your city
  addressRegion: 'Western Province',     // Your province
  postalCode: '00700',                   // Your postal code
  addressCountry: 'LK',
}
```

**Optional:** Add GPS coordinates for better map placement:
```typescript
geo = {
  latitude: 6.9271,   // Your latitude
  longitude: 79.8612, // Your longitude
}
```

To find your coordinates:
1. Go to Google Maps
2. Right-click your location
3. Click the coordinates to copy them

---

### 2. Create Google Business Profile (30 minutes)

**Go to:** https://business.google.com

**Fill in:**
- Business name: `iTechLK Store`
- Category: `E-commerce service`
- Phone: `+94 74 257 0943`
- Website: `https://www.itechlk.store`
- Email: `itechlkstore@gmail.com`
- Hours: `Open 24 hours` (or set your hours)

**Verify your business:**
- Choose phone or email verification (fastest)
- Enter the code you receive

**Upload photos:**
- Logo: `/public/logo.png`
- Cover photo: Create a banner (1024x576px)
- Product photos: At least 3 images

---

### 3. Create Social Media Accounts (1 hour)

#### Facebook Business Page
**URL:** https://www.facebook.com/pages/create
- Page name: `iTechLK Store`
- Category: `E-commerce Website`
- Add logo and cover photo
- Add contact info
- **Save your page URL:** `https://facebook.com/itechlkstore`

#### Instagram Business Account
**Download Instagram app**
- Username: `@itechlkstore`
- Convert to Business Account
- Add bio: "Premium Accounts at Affordable Prices 🇱🇰"
- Add website link
- **Save your profile URL:** `https://instagram.com/itechlkstore`

#### TikTok Business Account
**Download TikTok app**
- Username: `@itechlkstore`
- Switch to Business Account
- Add bio and website
- **Save your profile URL:** `https://tiktok.com/@itechlkstore`

#### LinkedIn Company Page
**URL:** https://www.linkedin.com/company/setup/new/
- Company name: `iTechLK Store`
- Industry: `E-commerce`
- Add description and logo
- **Save your page URL:** `https://linkedin.com/company/itechlkstore`

#### Twitter/X Account
**URL:** https://twitter.com/signup
- Username: `@itechlkstore`
- Add bio and website
- **Save your profile URL:** `https://twitter.com/itechlkstore`

---

### 4. Update Social Media Links in Code (5 minutes)

**File:** `src/components/StructuredData.tsx`

Find this section (around line 105):
```typescript
sameAs = [
  'https://facebook.com/itechlkstore',
  'https://instagram.com/itechlkstore',
  'https://twitter.com/itechlkstore',
  'https://www.tiktok.com/@itechlkstore',
  'https://www.linkedin.com/company/itechlkstore',
]
```

**Replace with your ACTUAL social media URLs** (the ones you just created)

---

### 5. Get Your First Reviews (Ongoing)

**Get your review link from Google Business Profile:**
1. Go to your Google Business Profile dashboard
2. Click "Get more reviews"
3. Copy the link

**Share with customers via WhatsApp:**
```
Hi! Thank you for choosing iTechLK Store! 🎉

If you're satisfied with our service, we'd appreciate 
a quick review on Google:

[Your Review Link]

Thank you! 🙏
```

**Goal:** Get 5-10 reviews in the first month

---

## 📊 WHAT YOU'VE ALREADY GOT ✅

Your website already has:
- ✅ SEO optimization
- ✅ Sitemap (https://www.itechlk.store/sitemap.xml)
- ✅ Robots.txt (https://www.itechlk.store/robots.txt)
- ✅ Google Search Console verification
- ✅ Organization schema
- ✅ Website schema
- ✅ LocalBusiness schema (just added!)
- ✅ Product schema
- ✅ Open Graph tags
- ✅ Twitter Cards
- ✅ PWA manifest

---

## 🎯 EXPECTED RESULTS

### After 1 Week:
- ✅ Google Business Profile verified
- ✅ Social media accounts created
- ✅ First 2-3 reviews received

### After 1 Month:
- ✅ Appearing in Google Search for "iTechLK Store"
- ✅ Business panel showing on right side (like Frame Toque)
- ✅ 5-10 reviews
- ✅ Social media profiles linked

### After 2-3 Months:
- ✅ Ranking for product keywords
- ✅ 20+ reviews
- ✅ Regular organic traffic
- ✅ Strong online presence

---

## 🔍 HOW TO CHECK YOUR PROGRESS

### 1. Check if Google has indexed your site:
Search in Google:
```
site:www.itechlk.store
```

### 2. Check your business profile:
Search in Google:
```
iTechLK Store
```

You should see your business panel on the right side!

### 3. Test your structured data:
**URL:** https://search.google.com/test/rich-results
- Enter: `https://www.itechlk.store`
- Check for LocalBusiness schema

### 4. Test social media previews:
- **Facebook:** https://developers.facebook.com/tools/debug/
- **Twitter:** https://cards-dev.twitter.com/validator
- **LinkedIn:** https://www.linkedin.com/post-inspector/

---

## 📝 CHECKLIST

### Today:
- [ ] Update business address in `StructuredData.tsx`
- [ ] Add GPS coordinates (optional)
- [ ] Create Google Business Profile
- [ ] Verify business
- [ ] Upload logo and photos

### This Week:
- [ ] Create Facebook page
- [ ] Create Instagram account
- [ ] Create TikTok account
- [ ] Create LinkedIn page
- [ ] Create Twitter account
- [ ] Update social media links in code
- [ ] Deploy updated website

### This Month:
- [ ] Get first 5 reviews
- [ ] Post on social media (2-3 times per week)
- [ ] Add products to Google Business Profile
- [ ] List in 3+ directories
- [ ] Create first blog post

### Ongoing:
- [ ] Respond to reviews
- [ ] Post regular updates
- [ ] Monitor Google Business insights
- [ ] Engage with customers
- [ ] Add new products

---

## 🆘 NEED HELP?

### Common Issues:

**Q: Business not showing in Google?**
A: Wait 2-4 weeks after verification. Ensure profile is complete with photos and reviews.

**Q: Can't verify business?**
A: Try different verification method (phone/email). Contact Google Business support.

**Q: Social media links not working?**
A: Make sure URLs are exact (including https://)

**Q: Reviews not showing?**
A: Reviews take 24-48 hours to appear. Ensure reviewers have Google accounts.

---

## 📞 SUPPORT RESOURCES

- **Google Business Support:** https://support.google.com/business
- **Google Search Console:** https://search.google.com/search-console
- **Rich Results Test:** https://search.google.com/test/rich-results
- **Full Guide:** See `GOOGLE_BUSINESS_PROFILE_SETUP.md`

---

## 🎉 YOU'RE READY!

Follow this checklist step by step, and within 1-2 months, your business will appear on Google just like Frame Toque Digital!

**Key Points:**
1. ✅ Update your address in the code
2. ✅ Create Google Business Profile
3. ✅ Create social media accounts
4. ✅ Get reviews from customers
5. ✅ Post regularly and engage

**Good luck! 🚀**
