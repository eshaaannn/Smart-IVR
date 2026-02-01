# 🚨 CRITICAL: IPv4 Connection Fix

## ❌ The Problem
Your database connection failed because Supabase uses **IPv6-only** for direct connections (`db.project.supabase.co`). Your current network seems to support only IPv4, so it cannot find the database.

## ✅ The Solution
You **MUST** use the **Connection Pooler**, which supports IPv4.

### Step 1: Go to Supabase Settings
1. Open your Supabase Dashboard
2. Go to **Settings** (gear icon) -> **Database**

### Step 2: Get the POOLER Connection String
1. Look for the **"Connection String"** section.
2. ⚠️ **IMPORTANT:** In the top right of this section, make sure **"Transaction"** mode is selected (NOT "Session").
   - This changes the port to `6543`.
   - This changes the host to something like `aws-0-[region].pooler.supabase.com`.

3. **Copy the URI.**
   It should look like this:
   ```
   postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres
   ```

### Step 3: Update Your `.env` File
1. Paste the new URL.
2. **Remember:** You still need to URL-encode your password if it has special characters!

**Example:**
```env
# OLD (IPv6 only - Fails):
DATABASE_URL=postgresql://postgres:MH49AT%401311@db.uahawhtdvobviqfokmqv.supabase.co:5432/postgres

# NEW (IPv4 compatible - Works):
DATABASE_URL=postgresql://postgres.uahawhtdvobviqfokmqv:MH49AT%401311@aws-0-ap-south-1.pooler.supabase.com:6543/postgres
```

(Note: The region `ap-south-1` is just an example, yours might be strictly different!)

### Step 4: Test Again
Run:
```bash
python test_db_connection.py
```
