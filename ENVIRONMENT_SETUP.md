# Environment Variables Setup

This document explains how to configure environment variables for the KP Floods 2025 Frontend application.

## Quick Setup

1. **Copy the example file:**
   ```bash
   cp .env.example .env
   ```

2. **Edit `.env` with your actual values:**
   ```bash
   # API Configuration
   VITE_API_BASE_URL=https://your-api-url.com
   
   # OpenAI Configuration (for chatbot)
   VITE_OPENAI_API_KEY=your_actual_openai_api_key
   
   # Dashboard Configuration
   VITE_DASHBOARD_PATH=/dashboard
   ```

3. **Restart your development server:**
   ```bash
   npm run dev
   ```

## Environment Variables

### Client-Safe Variables (VITE_*)

Only variables prefixed with `VITE_` are exposed to the client-side code. These should be **non-secret** values.

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Base URL for API endpoints | `https://api.example.com` |
| `VITE_OPENAI_API_KEY` | OpenAI API key for chatbot | `sk-proj-...` |
| `VITE_DASHBOARD_PATH` | Dashboard route path | `/dashboard` |

### Security Notes

- **Never commit `.env` files** to version control
- **Only use VITE_* for non-secret values** that are safe to expose to the browser
- **Keep server-side secrets** (like database passwords) server-side only
- **Use environment variables in production** deployment platforms

## Production Deployment

### Railway
1. Go to your Railway project dashboard
2. Navigate to "Variables" tab
3. Add your environment variables:
   - `VITE_API_BASE_URL`
   - `VITE_OPENAI_API_KEY`
   - `VITE_DASHBOARD_PATH`
4. Redeploy your application

### Vercel
1. Go to your Vercel project dashboard
2. Navigate to "Settings" → "Environment Variables"
3. Add your environment variables for Production environment
4. Redeploy your application

## Development vs Production

- **Development:** Uses `.env` file from project root
- **Production:** Uses environment variables set in deployment platform
- **Build:** Uses `--mode production` to ensure proper environment loading

## Troubleshooting

### Environment variables not loading?
1. Ensure variable names start with `VITE_`
2. Restart development server after adding variables
3. Check console for environment debug information

### API key not working in production?
1. Verify environment variable is set in deployment platform
2. Check that the variable name matches exactly
3. Ensure the API key is valid and has proper permissions

### Build errors?
1. Run `npm run build` to test production build locally
2. Check that all required environment variables are set
3. Review build output for any missing dependencies 