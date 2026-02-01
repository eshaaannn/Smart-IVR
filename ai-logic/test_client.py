import requests
import wave
import struct

def create_dummy_wav(filename="test.wav"):
    with wave.open(filename, 'w') as wav_file:
        wav_file.setnchannels(1)
        wav_file.setsampwidth(2)
        wav_file.setframerate(44100)
        # Write 1 second of silence
        data = struct.pack('<h', 0) * 44100
        wav_file.writeframes(data)
    print(f"Created {filename}")

def test_api():
    url = "http://localhost:8000/analyze_audio"
    filename = "test.wav"
    create_dummy_wav(filename)
    
    with open(filename, 'rb') as f:
        files = {'file': (filename, f, 'audio/wav')}
        try:
            print(f"Sending {filename} to {url}...")
            response = requests.post(url, files=files)
            print("Status Code:", response.status_code)
            print("Response JSON:", response.json())
        except Exception as e:
            print("Test failed:", e)

import sys

if __name__ == "__main__":
    if len(sys.argv) > 1:
        # User provided a file path
        target_file = sys.argv[1]
        print(f"Testing with provided file: {target_file}")
        
        url = "http://localhost:8000/analyze_audio"
        try:
            with open(target_file, 'rb') as f:
                files = {'file': (target_file, f, 'audio/wav')}
                print(f"Sending {target_file} to {url}...")
                response = requests.post(url, files=files)
                print("Status Code:", response.status_code)
                print("Response JSON:", response.json())
        except FileNotFoundError:
            print(f"Error: File '{target_file}' not found.")
        except Exception as e:
            print("Test failed:", e)
    else:
        # Run default silence test
        test_api()
