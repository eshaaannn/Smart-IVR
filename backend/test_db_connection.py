"""
Quick test script for database connection.
Run this to verify your DATABASE_URL is working.
"""
from database.supabase_client import db_client
import sys

def main():
    print("=" * 60)
    print("🔍 Database Connection Test")
    print("=" * 60)
    
    # Test connection
    print("\n📡 Testing connection...")
    
    # Debug: Print connection params (masking password)
    if db_client.connection_params:
        debug_params = db_client.connection_params.copy()
        debug_params['password'] = '******'
        print(f"DEBUG: Connection Params: {debug_params}")
    else:
        print("DEBUG: connection_params is None!")
    
    try:
        is_connected = db_client.test_connection()
        
        if is_connected:
            print("✅ Database connection successful!")
            print("\n📊 Connection Info:")
            print(f"   Using: PostgreSQL (psycopg2)")
            print(f"   Status: Connected")
            
            # Try to query database
            print("\n🔍 Testing database query...")
            try:
                import asyncio
                calls = asyncio.run(db_client.get_recent_calls(limit=1))
                print(f"✅ Query successful! Found {len(calls)} recent call(s)")
                
                if len(calls) > 0:
                    print("\n   Sample record:")
                    print(f"   - ID: {calls[0].get('id', 'N/A')}")
                    print(f"   - Category: {calls[0].get('issue_category', 'N/A')}")
                    print(f"   - Timestamp: {calls[0].get('created_at', 'N/A')}")
                
            except Exception as e:
                print(f"⚠️ Query test failed: {e}")
            
            print("\n" + "=" * 60)
            print("✅ All tests passed! Your database is ready to use.")
            print("=" * 60)
            return 0
            
        else:
            print("❌ Database connection failed!")
            print("\n🔧 Troubleshooting:")
            print("   1. Check your DATABASE_URL in .env file")
            print("   2. Verify the connection string format:")
            print("      postgresql://user:password@host:port/database")
            print("   3. Make sure your Supabase project is active")
            print("   4. Check if password contains special characters (escape them)")
            print("\n📖 See SUPABASE_CONNECTION_GUIDE.md for detailed help")
            return 1
            
    except Exception as e:
        print(f"❌ Connection test error: {e}")
        print("\n🔧 Common Issues:")
        print("   • DATABASE_URL not set → Check .env file")
        print("   • Invalid format → Use postgresql://... format")
        print("   • Wrong password → Reset in Supabase dashboard")
        return 1

if __name__ == "__main__":
    sys.exit(main())
