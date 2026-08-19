#!/usr/bin/env python3
"""
Quick test script for /chat endpoint
"""
import requests
import json

BASE_URL = "http://localhost:8001"

# Test 1: General knowledge question (non-meeting related)
print("=" * 60)
print("Test 1: General Knowledge Question")
print("=" * 60)

response = requests.post(
    f"{BASE_URL}/chat",
    json={"question": "What is Python programming?"},
    timeout=30
)

print(f"Status Code: {response.status_code}")
print(f"Response: {json.dumps(response.json(), indent=2)}")

# Test 2: Meeting-related question (if there's data in ChromaDB)
print("\n" + "=" * 60)
print("Test 2: Meeting-Related Question")
print("=" * 60)

response = requests.post(
    f"{BASE_URL}/chat",
    json={"question": "What decisions were made in the meeting?"},
    timeout=30
)

print(f"Status Code: {response.status_code}")
print(f"Response: {json.dumps(response.json(), indent=2)}")

print("\n✓ Chat endpoint tests completed!")
