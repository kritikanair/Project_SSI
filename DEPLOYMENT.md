# Deployment Guide

## 🚀 Deploy to GitHub Pages

Your SSI Wallet app is ready to deploy! Follow these steps:

### Option 1: GitHub Pages (Recommended - Free & Easy)

1. **Go to your repository settings:**
   - Visit: https://github.com/kash-gg/Project_SSI/settings/pages

2. **Configure GitHub Pages:**
   - Under "Source", select: **Deploy from a branch**
   - Branch: **main**
   - Folder: **/ (root)**
   - Click **Save**

3. **Wait for deployment** (2-3 minutes)
   - GitHub will build and deploy your app
   - Your app will be live at: `https://kash-gg.github.io/Project_SSI/`

4. **Access your deployed app:**
   - Visit the URL above
   - Your SSI Wallet is now publicly accessible!

### Option 2: Vercel (Alternative - Automatic CI/CD)

1. Go to https://vercel.com
2. Sign in with GitHub
3. Click "Import Project"
4. Select `Project_SSI` repository
5. Click "Deploy"
6. Done! Vercel will give you a live URL

### Option 3: Netlify (Alternative)

1. Go to https://netlify.com
2. Sign up/login with GitHub
3. Click "Add new site" → "Import an existing project"
4. Choose GitHub and select `Project_SSI`
5. Deploy settings:
   - Build command: (leave empty)
   - Publish directory: (leave empty or `/`)
6. Click "Deploy"

---

## ✅ Post-Deployment Checklist

After deployment, test these features:

- [ ] Create a new DID
- [ ] Issue a credential
- [ ] Share selectively
- [ ] Verify a presentation
- [ ] Check PWA install prompt (mobile)

---

## 🔧 Custom Domain (Optional)

### For GitHub Pages:
1. Go to repository Settings → Pages
2. Add your custom domain
3. Update DNS settings with your domain provider

### For Vercel/Netlify:
- Follow their domain setup guides in dashboard

---

## 📱 PWA Features

Once deployed, your app can be:
- **Installed on mobile** (Add to Home Screen)
- **Works offline** (Service Worker)
- **Receives updates** automatically

---

## 🐛 Troubleshooting

**Issue: App doesn't load**
- Check browser console for errors
- Ensure all files were committed and pushed
- Wait a few minutes for deployment to complete

**Issue: White screen**
- Check that `index.html` is in the root directory
- Verify all JavaScript files are accessible

**Issue: Service Worker errors**
- The service worker might need time to register
- Try hard refresh (Ctrl+Shift+R)

---

## 🔒 Security Note

This deployment is suitable for:
- ✅ Demonstration
- ✅ Testing
- ✅ Development

For production use with real credentials:
- Use HTTPS (GitHub Pages provides this)
- Consider adding authentication layer
- Implement proper key management
- Add credential revocation
- Use production-grade BBS+ signatures

---

Your app is ready to go live! 🎉
