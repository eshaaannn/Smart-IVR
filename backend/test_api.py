"""
Simple test script to verify all endpoints are working correctly.
Run this to confirm your backend is functioning properly.
"""
import requests
import json

BASE_URL = "http://localhost:8000"

def test_health():
    """Test the health endpoint."""
    print("\n🔍 Testing /health endpoint...")
    try:
        response = requests.get(f"{BASE_URL}/health")
        print(f"   Status Code: {response.status_code}")
        print(f"   Response: {json.dumps(response.json(), indent=2)}")
        
        if response.status_code == 200:
            print("   ✅ Health endpoint working!")
            return True
        else:
            print("   ❌ Health endpoint failed!")
            return False
    except Exception as e:
        print(f"   ❌ Error: {e}")
        return False


def test_process_issue():
    """Test the process-issue endpoint."""
    print("\n🔍 Testing /process-issue endpoint...")
    try:
        payload = {"audio_url": "https://example.com/test-billing.wav"}
        response = requests.post(
            f"{BASE_URL}/process-issue",
            json=payload
        )
        print(f"   Status Code: {response.status_code}")
        print(f"   Response: {json.dumps(response.json(), indent=2)}")
        
        if response.status_code == 200:
            data = response.json()
            if all(key in data for key in ["language", "transcript", "issue_category", "confidence", "routing_to", "fallback"]):
                print("   ✅ Process-issue endpoint working!")
                return True
            else:
                print("   ❌ Response missing required fields!")
                return False
        else:
            print("   ❌ Process-issue endpoint failed!")
            return False
    except Exception as e:
        print(f"   ❌ Error: {e}")
        return False


def test_recent_calls():
    """Test the recent-calls endpoint."""
    print("\n🔍 Testing /recent-calls endpoint...")
    try:
        response = requests.get(f"{BASE_URL}/recent-calls?limit=5")
        print(f"   Status Code: {response.status_code}")
        print(f"   Response: {json.dumps(response.json(), indent=2)}")
        
        if response.status_code == 200:
            data = response.json()
            if "count" in data and "calls" in data:
                print("   ✅ Recent-calls endpoint working!")
                print(f"   📊 Found {data['count']} call logs")
                return True
            else:
                print("   ❌ Response missing required fields!")
                return False
        else:
            print("   ❌ Recent-calls endpoint failed!")
            return False
    except Exception as e:
        print(f"   ❌ Error: {e}")
        return False


def test_validation_error():
    """Test that validation errors work correctly."""
    print("\n🔍 Testing validation error handling...")
    try:
        # Send invalid payload (missing required field)
        payload = {"wrong_field": "value"}
        response = requests.post(
            f"{BASE_URL}/process-issue",
            json=payload
        )
        print(f"   Status Code: {response.status_code}")
        
        if response.status_code == 422:
            print("   ✅ Validation errors working correctly!")
            print("   (This is GOOD - it means the API rejects invalid data)")
            return True
        else:
            print("   ⚠️ Expected 422 for invalid data")
            return False
    except Exception as e:
        print(f"   ❌ Error: {e}")
        return False


def main():
    """Run all tests."""
    print("=" * 60)
    print("🚀 Smart-IVR Backend API Test Suite")
    print("=" * 60)
    
    results = {
        "Health Check": test_health(),
        "Process Issue": test_process_issue(),
        "Recent Calls": test_recent_calls(),
        "Validation Errors": test_validation_error()
    }
    
    print("\n" + "=" * 60)
    print("📊 Test Results Summary")
    print("=" * 60)
    
    for test_name, passed in results.items():
        status = "✅ PASS" if passed else "❌ FAIL"
        print(f"   {test_name}: {status}")
    
    total = len(results)
    passed = sum(results.values())
    
    print(f"\n   Total: {passed}/{total} tests passed")
    
    if passed == total:
        print("\n   🎉 All tests passed! Your backend is working perfectly!")
    else:
        print("\n   ⚠️ Some tests failed. Check the output above for details.")
    
    print("=" * 60)


if __name__ == "__main__":
    main()
