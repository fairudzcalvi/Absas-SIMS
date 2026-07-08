# Deploy ABSAAS SIMS to Netlify

## Quick Deploy Options

### Option 1: Deploy via Netlify CLI (Fastest)

1. **Install Netlify CLI** (one-time setup):
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify**:
   ```bash
   netlify login
   ```

3. **Deploy**:
   ```bash
   netlify deploy --prod
   ```
   - When prompted, select "Create & configure a new site"
   - Choose your team
   - Enter a site name (or leave blank for random name)
   - Build command: `npm run build`
   - Publish directory: `dist`

### Option 2: Deploy via Netlify Website (Easiest)

1. **Go to Netlify** → https://app.netlify.com/

2. **Click "Add new site"** → "Import an existing project"

3. **Choose deployment method**:
   - If using Git: Connect your repository (GitHub, GitLab, Bitbucket)
   - If deploying manually: Choose "Deploy manually"

4. **Configure build settings**:
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Node version: 18 or higher

5. **Click "Deploy site"**

### Option 3: Drag & Drop Deploy (Simplest)

1. **Build your project locally**:
   ```bash
   npm run build
   ```

2. **Go to Netlify** → https://app.netlify.com/drop

3. **Drag and drop** the `dist` folder onto the page

## Configuration

The project includes a `netlify.toml` file with:
- Build command configuration
- SPA routing redirect rules (for React Router)

## Environment Variables (If needed later)

If you add a backend API, set environment variables in Netlify:
1. Go to Site settings → Environment variables
2. Add your variables (e.g., `VITE_API_URL`)

## Custom Domain (Optional)

1. Go to Site settings → Domain management
2. Click "Add custom domain"
3. Follow the instructions to configure your DNS

## Build Optimization

Your site is already optimized with:
- ✅ Vite production build
- ✅ Code splitting
- ✅ Asset optimization
- ✅ Gzip compression

## Default Login Credentials

Remember to change these in production!

- **Admin:** username: `admin`, password: `admin123`
- **Student:** username: `student1`, password: `student123`
- **Teacher:** username: `admin`, password: `admin123`

## Troubleshooting

**Build fails?**
- Check Node version (should be 18+)
- Run `npm install` to ensure all dependencies are installed
- Test build locally: `npm run build`

**Site loads but shows blank page?**
- Check browser console for errors
- Verify the publish directory is set to `dist`

**Routes don't work?**
- Ensure `netlify.toml` is in the root directory
- The redirect rule should handle SPA routing
