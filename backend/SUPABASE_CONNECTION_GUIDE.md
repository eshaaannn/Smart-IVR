# Supabase Connection String Setup Guide

## 🔗 How to Get Your Supabase Connection String

### Step 1: Go to Supabase Dashboard
1. Open your Supabase project dashboard
2. Navigate to **Settings** (gear icon in sidebar)

### Step 2: Access Database Settings
1. Click on **Database** in the settings menu
2. Scroll down to **Connection String** section

### Step 3: Get Connection String
You'll see several connection string options. Use the **URI** format (Session mode recommended for serverless):

**Connection Pooling (Recommended for Production):**
```
postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
```

**Direct Connection (For Development):**
```
postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
```

### Step 4: Choose the Right Mode

**Transaction Mode** (port 6543) - Recommended
- Best for serverless functions
- Lower latency
- Use this for most applications

**Session Mode** (port 5432)
- Traditional connection
- Use for long-running processes

### Step 5: Get Your Password
- The password is your **database password** (set during project creation)
- If you forgot it, you can reset it in: Settings → Database → Database Password → Reset

### Step 6: Copy the Complete String
Example:
```
postgresql://postgres.abcdefghijk:MySuper$ecureP@ssw0rd@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

## 📝 Update Your `.env` File

1. Open `E:\HACKATHON\iiitn\Smart-IVR\backend\.env`
2. Replace the `DATABASE_URL` with your actual connection string:

```env
DATABASE_URL=postgresql://postgres.yourproject:yourpassword@aws-0-region.pooler.supabase.com:6543/postgres
```

**Important:** Make sure there are NO spaces and the password is properly escaped if it contains special characters.

## 🧪 Test the Connection

After updating `.env`, restart your server and test:

```bash
python interactive_test.py
```

Or manually test in Python:
```python
from database.supabase_client import db_client

# Test connection
if db_client.test_connection():
    print("✅ Database connected successfully!")
else:
    print("❌ Database connection failed")
```

## ⚠️ Common Issues

### Issue 1: Connection Refused
**Problem:** Can't connect to database  
**Fix:** 
- Check if you're using the correct port (6543 for pooler, 5432 for direct)
- Verify your IP is allowed (Supabase allows all by default)

### Issue 2: Authentication Failed
**Problem:** Password incorrect  
**Fix:**
- Reset password in Supabase dashboard
- Make sure password is properly escaped in connection string
- Special characters like `@`, `:`, `/` need to be URL-encoded

### Issue 3: Database Not Found
**Problem:** Database 'postgres' doesn't exist  
**Fix:**
- Use the exact connection string from Supabase dashboard
- Don't modify the database name

## 🔐 Security Best Practices

1. **Never commit `.env` to Git** (it's in `.gitignore`)
2. **Use environment variables** in production
3. **Rotate passwords** periodically
4. **Use connection pooling** (port 6543) for serverless deployments

## 📋 Quick Reference

| What | Where to Find |
|------|---------------|
| Connection String | Settings → Database → Connection String |
| Database Password | Settings → Database → Database Password |
| Project Reference | Settings → General → Reference ID |
| Region | Settings → General → Region |

---

**Your backend is now configured to use direct PostgreSQL connection to Supabase!** 🎉
