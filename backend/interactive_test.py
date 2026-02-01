"""
Interactive testing script with multiple test scenarios.
Run this to test all endpoints with different test cases.
"""
import requests
import json
from time import sleep

BASE_URL = "http://localhost:8000"

# Test data scenarios
TEST_SCENARIOS = [
    {
        "name": "Billing Issue (Hindi)",
        "data": {"audio_url": "https://example.com/billing-query-hindi.wav"},
        "expected_category": "billing",
        "expected_routing": "Billing Support"
    },
    {
        "name": "Password Reset Request",
        "data": {"audio_url": "https://example.com/password-reset.wav"},
        "expected_category": "password_reset",
        "expected_routing": "Account Security"
    },
    {
        "name": "Technical Issue",
        "data": {"audio_url": "https://example.com/technical-problem.wav"},
        "expected_category": "technical_issue",
        "expected_routing": "Technical Support"
    },
    {
        "name": "Account Access Problem",
        "data": {"audio_url": "https://example.com/cannot-login.wav"},
        "expected_category": "account_access",
        "expected_routing": "Account Security"
    },
    {
        "name": "General Service Request",
        "data": {"audio_url": "https://example.com/general-query.wav"},
        "expected_category": "service_request",
        "expected_routing": "Customer Service"
    }
]


def print_header(text):
    """Print a formatted header."""
    print("\n" + "=" * 70)
    print(f"  {text}")
    print("=" * 70)


def print_section(text):
    """Print a section divider."""
    print("\n" + "-" * 70)
    print(f"  {text}")
    print("-" * 70)


def test_process_issue(scenario):
    """Test the /process-issue endpoint with a scenario."""
    print_section(f"Test: {scenario['name']}")
    
    print(f"\n📤 Request Data:")
    print(json.dumps(scenario['data'], indent=2))
    
    try:
        response = requests.post(
            f"{BASE_URL}/process-issue",
            json=scenario['data'],
            timeout=10
        )
        
        print(f"\n📊 Response Status: {response.status_code}", end="")
        
        if response.status_code == 200:
            print(" ✅")
            data = response.json()
            
            print(f"\n📝 Response Data:")
            print(json.dumps(data, indent=2))
            
            # Validate response
            print(f"\n🔍 Validation:")
            checks = {
                "Has language": "language" in data,
                "Has transcript": "transcript" in data,
                "Has issue_category": "issue_category" in data,
                "Has confidence": "confidence" in data,
                "Has routing_to": "routing_to" in data,
                "Has fallback flag": "fallback" in data,
                "Confidence > 0.5": data.get("confidence", 0) > 0.5,
            }
            
            for check, passed in checks.items():
                status = "✅" if passed else "❌"
                print(f"   {status} {check}")
            
            return all(checks.values())
        else:
            print(" ❌")
            print(f"\n❌ Error Response:")
            print(json.dumps(response.json(), indent=2))
            return False
            
    except requests.exceptions.ConnectionError:
        print(" ❌")
        print("\n❌ Connection Error: Is the server running?")
        print("   Start server with: python main.py")
        return False
    except Exception as e:
        print(" ❌")
        print(f"\n❌ Error: {str(e)}")
        return False


def test_recent_calls():
    """Test the /recent-calls endpoint."""
    print_section("Test: Recent Calls (Analytics)")
    
    try:
        print(f"\n📤 Request: GET /recent-calls?limit=5")
        
        response = requests.get(
            f"{BASE_URL}/recent-calls",
            params={"limit": 5},
            timeout=10
        )
        
        print(f"\n📊 Response Status: {response.status_code}", end="")
        
        if response.status_code == 200:
            print(" ✅")
            data = response.json()
            
            print(f"\n📝 Response Data:")
            print(json.dumps(data, indent=2))
            
            print(f"\n🔍 Validation:")
            checks = {
                "Has count field": "count" in data,
                "Has calls array": "calls" in data,
                "Count matches array length": data.get("count") == len(data.get("calls", [])),
            }
            
            for check, passed in checks.items():
                status = "✅" if passed else "❌"
                print(f"   {status} {check}")
            
            print(f"\n📊 Stats: Found {data.get('count', 0)} call logs")
            
            return all(checks.values())
        else:
            print(" ❌")
            print(f"\n❌ Error Response:")
            print(json.dumps(response.json(), indent=2))
            return False
            
    except requests.exceptions.ConnectionError:
        print(" ❌")
        print("\n❌ Connection Error: Is the server running?")
        return False
    except Exception as e:
        print(" ❌")
        print(f"\n❌ Error: {str(e)}")
        return False


def test_health():
    """Test the health endpoint."""
    print_section("Test: Health Check")
    
    try:
        print(f"\n📤 Request: GET /health")
        
        response = requests.get(f"{BASE_URL}/health", timeout=5)
        
        print(f"\n📊 Response Status: {response.status_code}", end="")
        
        if response.status_code == 200:
            print(" ✅")
            data = response.json()
            print(f"\n📝 Response Data:")
            print(json.dumps(data, indent=2))
            return True
        else:
            print(" ❌")
            return False
            
    except Exception as e:
        print(" ❌")
        print(f"\n❌ Error: {str(e)}")
        return False


def main():
    """Run all tests."""
    print_header("🚀 Smart-IVR API Interactive Test Suite")
    
    print("\n📍 Server Location: http://localhost:8000")
    print("📚 Swagger Docs: http://localhost:8000/docs")
    
    # Test health first
    health_ok = test_health()
    
    if not health_ok:
        print("\n❌ Server health check failed. Please start the server first.")
        print("   Run: python main.py")
        return
    
    # Test process-issue with multiple scenarios
    print_header("Testing /process-issue Endpoint (Multiple Scenarios)")
    
    results = []
    for i, scenario in enumerate(TEST_SCENARIOS, 1):
        print(f"\n🔹 Scenario {i}/{len(TEST_SCENARIOS)}")
        result = test_process_issue(scenario)
        results.append((scenario['name'], result))
        
        if i < len(TEST_SCENARIOS):
            sleep(0.5)  # Small delay between tests
    
    # Test recent calls
    print_header("Testing /recent-calls Endpoint")
    recent_calls_ok = test_recent_calls()
    
    # Summary
    print_header("📊 Test Summary")
    
    print(f"\n✅ Health Check: {'PASS' if health_ok else 'FAIL'}")
    print(f"\n🔄 Process Issue Tests:")
    
    passed = 0
    for name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"   {status} - {name}")
        if result:
            passed += 1
    
    print(f"\n📊 Analytics Test:")
    print(f"   {'✅ PASS' if recent_calls_ok else '❌ FAIL'} - Recent Calls")
    
    total_tests = len(TEST_SCENARIOS) + 2  # +2 for health and recent_calls
    total_passed = passed + (1 if health_ok else 0) + (1 if recent_calls_ok else 0)
    
    print(f"\n🎯 Overall: {total_passed}/{total_tests} tests passed")
    
    if total_passed == total_tests:
        print("\n🎉 All tests passed! Your backend is working perfectly!")
    else:
        print(f"\n⚠️ {total_tests - total_passed} test(s) failed. Check the output above.")
    
    print("\n" + "=" * 70)
    
    # Additional tips
    print("\n💡 Quick Tips:")
    print("   • To test manually, visit: http://localhost:8000/docs")
    print("   • Click 'Try it out' on any endpoint to test interactively")
    print("   • Check server logs for detailed error information")
    print("\n")


if __name__ == "__main__":
    main()
