# Password URL Encoding Quick Reference

## ⚠️ Problem: Special Characters in Passwords

When your database password contains special characters, they must be **URL-encoded** in the connection string.

## 🔧 Common Characters That Need Encoding

| Character | URL Encoded | Example |
|-----------|-------------|---------|
| `@` | `%40` | `pass@123` → `pass%40123` |
| `:` | `%3A` | `pass:word` → `pass%3Aword` |
| `/` | `%2F` | `pass/123` → `pass%2F123` |
| `?` | `%3F` | `pass?123` → `pass%3F123` |
| `#` | `%23` | `pass#123` → `pass%23123` |
| `&` | `%26` | `pass&123` → `pass%26123` |
| `%` | `%25` | `pass%123` → `pass%25123` |
| ` ` (space) | `%20` | `pass 123` → `pass%20123` |
| `!` | `%21` | `pass!123` → `pass%21123` |
| `$` | `%24` | `pass$123` → `pass%24123` |

## ✅ Your Fix

**Original Password:** `MH49AT@1311`  
**URL-Encoded:** `MH49AT%401311`

**Before (BROKEN):**
```
postgresql://postgres:MH49AT@1311@db.host.supabase.co:5432/postgres
                              ↑
                         Problem: @ is interpreted as delimiter
```

**After (FIXED):**
```
postgresql://postgres:MH49AT%401311@db.host.supabase.co:5432/postgres
                              ↑
                         @ encoded as %40
```

## 🛠️ How to URL-Encode Your Password

### Method 1: Online Tool
1. Go to: https://www.urlencoder.org/
2. Paste your password
3. Click "Encode"
4. Copy the result

### Method 2: Python
```python
from urllib.parse import quote
password = "MH49AT@1311"
encoded = quote(password, safe='')
print(encoded)  # MH49AT%401311
```

### Method 3: PowerShell
```powershell
Add-Type -AssemblyName System.Web
[System.Web.HttpUtility]::UrlEncode("MH49AT@1311")
```

### Method 4: Manual Reference
Use the table above to replace each special character.

## 📝 Connection String Format

```
postgresql://username:password@host:port/database
              ↓        ↓         ↓     ↓    ↓
           postgres  ENCODED   host  port  database
```

**Complete Example:**
```
DATABASE_URL=postgresql://postgres:My%40Pass%23123@db.xyz.supabase.co:5432/postgres
```

## ✅ Testing Your Connection

After encoding the password:

1. Update `.env` file with encoded password
2. Run test:
   ```bash
   python test_db_connection.py
   ```
3. Should see: ✅ Database connection successful!

## 🚨 Common Mistakes

❌ **Wrong:** Using password as-is with special characters  
✅ **Right:** URL-encode the password first

❌ **Wrong:** Encoding the entire connection string  
✅ **Right:** Only encode the password part

❌ **Wrong:** Encoding twice  
✅ **Right:** Encode only once

## 🔐 Security Note

- Never share your connection string
- Keep `.env` in `.gitignore`
- Use different passwords for dev/prod
- Rotate passwords regularly

---

**Your password is now properly encoded and should work!** 🎉
