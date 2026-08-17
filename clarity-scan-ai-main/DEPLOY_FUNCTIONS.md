# Deploy Supabase Edge Functions

Your Edge Functions need to be deployed to Supabase servers. Here's how to fix the "non-2xx status code" error:

## Option 1: Deploy via Supabase Dashboard (Recommended - No CLI needed)

1. **Go to your Supabase Project Dashboard**
   - Visit: https://supabase.com/dashboard/project/jhihmyhmdkccbgudpnol
   - Navigate to: **Edge Functions** in the left sidebar

2. **Deploy `analyze-brain-mri` function**
   - Click "Create a new function" or "Deploy function"
   - Function name: `analyze-brain-mri`
   - Copy the entire content from: `supabase/functions/analyze-brain-mri/index.ts`
   - Paste it into the code editor
   - Click "Deploy function"

3. **Deploy `segment-brain-tumor` function**
   - Click "Create a new function" again
   - Function name: `segment-brain-tumor`
   - Copy the entire content from: `supabase/functions/segment-brain-tumor/index.ts`
   - Paste it into the code editor
   - Click "Deploy function"

4. **Set Environment Variable (CRITICAL)**
   - In the Supabase Dashboard, go to: **Project Settings** → **Edge Functions** → **Secrets**
   - Add a new secret:
     - Name: `LOVABLE_API_KEY`
     - Value: Your Lovable API key (get it from https://lovable.dev/projects/YOUR_PROJECT_ID/settings)
   - Click "Add secret"

5. **Test the app**
   - Refresh http://localhost:8080/
   - Upload a brain MRI scan
   - The error should now show the real message (or work completely!)

---

## Option 2: Deploy via CLI (Advanced - requires setup)

If you prefer CLI deployment:

### Install Supabase CLI

**Via Scoop (Windows):**
```powershell
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase
```

**Via Chocolatey:**
```powershell
choco install supabase
```

**Manual Install:**
Download from: https://github.com/supabase/cli/releases
Extract and add to PATH.

### Deploy Functions

1. **Login to Supabase:**
   ```powershell
   cd c:\Users\dinesh\Downloads\clarity-scan-ai-main\clarity-scan-ai-main
   supabase login
   ```

2. **Link to your project:**
   ```powershell
   supabase link --project-ref jhihmyhmdkccbgudpnol
   ```

3. **Set the secret:**
   ```powershell
   supabase secrets set LOVABLE_API_KEY="your-lovable-api-key-here"
   ```

4. **Deploy both functions:**
   ```powershell
   supabase functions deploy analyze-brain-mri
   supabase functions deploy segment-brain-tumor
   ```

5. **Verify deployment:**
   ```powershell
   supabase functions list
   ```

---

## Getting Your Lovable API Key

1. Visit your Lovable project: https://lovable.dev/projects/YOUR_PROJECT_ID
2. Click on **Settings** or **Project Settings**
3. Look for **API Keys** or **Integrations**
4. Copy your API key
5. Add it to Supabase as `LOVABLE_API_KEY` secret

---

## Troubleshooting

### Error: "LOVABLE_API_KEY is not configured"
- You need to set the `LOVABLE_API_KEY` secret in Supabase (step 4 above)

### Error: "Rate limit exceeded"
- Your Lovable API has rate limits - wait a moment and try again

### Error: "AI credits depleted"
- Your Lovable account needs more credits

### Functions still not working after deployment?
1. Check function logs in Supabase Dashboard → Edge Functions → select function → Logs
2. Verify both functions are deployed (green checkmark)
3. Ensure `LOVABLE_API_KEY` secret is set correctly
4. Try redeploying the functions

---

## Current Project Configuration

- **Supabase Project ID:** jhihmyhmdkccbgudpnol
- **Supabase URL:** https://jhihmyhmdkccbgudpnol.supabase.co
- **Functions to deploy:**
  - `analyze-brain-mri` (analyzes MRI scans using Gemini Vision)
  - `segment-brain-tumor` (generates tumor segmentation overlays)

Both functions require JWT verification disabled (already configured in `supabase/config.toml`).
