# Cloudinary Setup Instructions

## 1. Create a Cloudinary Account
1. Go to [https://cloudinary.com](https://cloudinary.com)
2. Click "Sign Up for Free"
3. Fill in your details and verify your email

## 2. Get Your Credentials
1. Log in to your Cloudinary account
2. Go to your Dashboard (opens automatically after login)
3. You'll see three important values:
   - **Cloud Name**: Your unique account identifier
   - **API Key**: Public key for API access
   - **API Secret**: Private key (click the eye icon to reveal)

## 3. Configure Environment Variables
1. Open your `.env` file in the project root
2. Update these values with your actual Cloudinary credentials:

```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your_cloud_name_here"
CLOUDINARY_API_KEY="your_api_key_here"
CLOUDINARY_API_SECRET="your_api_secret_here"
```

**Example:**
```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="dz1abc123"
CLOUDINARY_API_KEY="123456789012345"
CLOUDINARY_API_SECRET="abcdefghijklmnopqrstuvwxyz123456"
```

## 4. Restart Your Development Server
After updating the `.env` file, restart your development server:
```bash
npm run dev
```

## 5. Test the Integration
1. Try adding a new order with images
2. The images should upload to Cloudinary
3. Check your Cloudinary Media Library to see uploaded images

## Folder Structure in Cloudinary
Images are organized in folders:
- `tailor-app/measurements/` - Measurement images
- `tailor-app/cloths/` - Cloth images

## Free Tier Limits
- **Storage**: 25 GB
- **Bandwidth**: 25 GB/month
- **Transformations**: 25 monthly credits

This should be more than enough for a tailor app!

## Troubleshooting
- **Error: "Cloudinary not configured"** → Check that all three env variables are set correctly
- **Error: "Failed to upload"** → Verify your API Secret is correct and not expired
- **Images not showing** → Check browser console for CORS or URL issues

## Security Notes
- Never commit your `.env` file to Git
- The `.env` file should already be in `.gitignore`
- `NEXT_PUBLIC_*` variables are exposed to the browser (that's normal for Cloud Name)
- API Secret stays on the server and is never exposed to the client
