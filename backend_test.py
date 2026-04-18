#!/usr/bin/env python3

import requests
import sys
import json
from datetime import datetime

class NGOAdminAPITester:
    def __init__(self, base_url="https://sanskar-dham.preview.emergentagent.com"):
        self.base_url = base_url
        self.session = requests.Session()
        self.tests_run = 0
        self.tests_passed = 0
        self.admin_email = "vsddomb@gmail.com"
        self.admin_password = "Admin@VSD2024"

    def log_test(self, name, success, details=""):
        """Log test results"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
            print(f"✅ {name} - PASSED")
        else:
            print(f"❌ {name} - FAILED: {details}")
        
        if details:
            print(f"   Details: {details}")

    def test_admin_login(self):
        """Test admin login functionality"""
        try:
            response = self.session.post(
                f"{self.base_url}/api/auth/login",
                json={"email": self.admin_email, "password": self.admin_password},
                headers={"Content-Type": "application/json"}
            )
            
            if response.status_code == 200:
                data = response.json()
                if data.get("email") == self.admin_email and data.get("role") == "admin":
                    self.log_test("Admin Login", True, f"Logged in as {data.get('email')}")
                    return True
                else:
                    self.log_test("Admin Login", False, f"Invalid response data: {data}")
                    return False
            else:
                self.log_test("Admin Login", False, f"Status: {response.status_code}, Response: {response.text}")
                return False
        except Exception as e:
            self.log_test("Admin Login", False, f"Exception: {str(e)}")
            return False

    def test_auth_me(self):
        """Test getting current user info"""
        try:
            response = self.session.get(f"{self.base_url}/api/auth/me")
            
            if response.status_code == 200:
                data = response.json()
                if data.get("email") == self.admin_email:
                    self.log_test("Auth Me", True, f"User info retrieved: {data.get('email')}")
                    return True
                else:
                    self.log_test("Auth Me", False, f"Unexpected user data: {data}")
                    return False
            else:
                self.log_test("Auth Me", False, f"Status: {response.status_code}, Response: {response.text}")
                return False
        except Exception as e:
            self.log_test("Auth Me", False, f"Exception: {str(e)}")
            return False

    def test_activities_crud(self):
        """Test Activities CRUD operations"""
        # Test GET activities
        try:
            response = self.session.get(f"{self.base_url}/api/activities")
            if response.status_code == 200:
                activities = response.json()
                self.log_test("Get Activities", True, f"Retrieved {len(activities)} activities")
            else:
                self.log_test("Get Activities", False, f"Status: {response.status_code}")
                return False
        except Exception as e:
            self.log_test("Get Activities", False, f"Exception: {str(e)}")
            return False

        # Test POST activity
        test_activity = {
            "title": "Test Activity",
            "subtitle": "Test Subtitle",
            "description": "Test Description for activity",
            "icon": "Heart",
            "image": "https://example.com/test.jpg"
        }
        
        try:
            response = self.session.post(
                f"{self.base_url}/api/activities",
                json=test_activity,
                headers={"Content-Type": "application/json"}
            )
            
            if response.status_code == 200:
                data = response.json()
                activity_id = data.get("id")
                self.log_test("Create Activity", True, f"Created activity with ID: {activity_id}")
                
                # Test PUT activity
                updated_activity = test_activity.copy()
                updated_activity["title"] = "Updated Test Activity"
                
                response = self.session.put(
                    f"{self.base_url}/api/activities/{activity_id}",
                    json=updated_activity,
                    headers={"Content-Type": "application/json"}
                )
                
                if response.status_code == 200:
                    self.log_test("Update Activity", True, f"Updated activity {activity_id}")
                else:
                    self.log_test("Update Activity", False, f"Status: {response.status_code}")
                
                # Test DELETE activity
                response = self.session.delete(f"{self.base_url}/api/activities/{activity_id}")
                if response.status_code == 200:
                    self.log_test("Delete Activity", True, f"Deleted activity {activity_id}")
                else:
                    self.log_test("Delete Activity", False, f"Status: {response.status_code}")
                    
            else:
                self.log_test("Create Activity", False, f"Status: {response.status_code}, Response: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Activities CRUD", False, f"Exception: {str(e)}")
            return False

        return True

    def test_events_crud(self):
        """Test Events CRUD operations"""
        # Test GET events
        try:
            response = self.session.get(f"{self.base_url}/api/events")
            if response.status_code == 200:
                events = response.json()
                self.log_test("Get Events", True, f"Retrieved {len(events)} events")
            else:
                self.log_test("Get Events", False, f"Status: {response.status_code}")
                return False
        except Exception as e:
            self.log_test("Get Events", False, f"Exception: {str(e)}")
            return False

        # Test POST event
        test_event = {
            "title": "Test Event",
            "date": "2024-12-31",
            "time": "10:00 AM",
            "location": "Test Location",
            "description": "Test event description",
            "status": "upcoming"
        }
        
        try:
            response = self.session.post(
                f"{self.base_url}/api/events",
                json=test_event,
                headers={"Content-Type": "application/json"}
            )
            
            if response.status_code == 200:
                data = response.json()
                event_id = data.get("id")
                self.log_test("Create Event", True, f"Created event with ID: {event_id}")
                
                # Test PUT event
                updated_event = test_event.copy()
                updated_event["title"] = "Updated Test Event"
                
                response = self.session.put(
                    f"{self.base_url}/api/events/{event_id}",
                    json=updated_event,
                    headers={"Content-Type": "application/json"}
                )
                
                if response.status_code == 200:
                    self.log_test("Update Event", True, f"Updated event {event_id}")
                else:
                    self.log_test("Update Event", False, f"Status: {response.status_code}")
                
                # Test DELETE event
                response = self.session.delete(f"{self.base_url}/api/events/{event_id}")
                if response.status_code == 200:
                    self.log_test("Delete Event", True, f"Deleted event {event_id}")
                else:
                    self.log_test("Delete Event", False, f"Status: {response.status_code}")
                    
            else:
                self.log_test("Create Event", False, f"Status: {response.status_code}, Response: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Events CRUD", False, f"Exception: {str(e)}")
            return False

        return True

    def test_gallery_crud(self):
        """Test Gallery CRUD operations"""
        # Test GET gallery
        try:
            response = self.session.get(f"{self.base_url}/api/gallery")
            if response.status_code == 200:
                gallery = response.json()
                self.log_test("Get Gallery", True, f"Retrieved {len(gallery)} images")
            else:
                self.log_test("Get Gallery", False, f"Status: {response.status_code}")
                return False
        except Exception as e:
            self.log_test("Get Gallery", False, f"Exception: {str(e)}")
            return False

        # Test POST gallery image
        test_image = {
            "url": "https://example.com/test-image.jpg",
            "title": "Test Image",
            "category": "bhakti"
        }
        
        try:
            response = self.session.post(
                f"{self.base_url}/api/gallery",
                json=test_image,
                headers={"Content-Type": "application/json"}
            )
            
            if response.status_code == 200:
                data = response.json()
                image_id = data.get("id")
                self.log_test("Create Gallery Image", True, f"Created image with ID: {image_id}")
                
                # Test DELETE gallery image
                response = self.session.delete(f"{self.base_url}/api/gallery/{image_id}")
                if response.status_code == 200:
                    self.log_test("Delete Gallery Image", True, f"Deleted image {image_id}")
                else:
                    self.log_test("Delete Gallery Image", False, f"Status: {response.status_code}")
                    
            else:
                self.log_test("Create Gallery Image", False, f"Status: {response.status_code}, Response: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Gallery CRUD", False, f"Exception: {str(e)}")
            return False

        return True

    def test_about_section(self):
        """Test About section operations"""
        # Test GET about
        try:
            response = self.session.get(f"{self.base_url}/api/about")
            if response.status_code == 200:
                about = response.json()
                self.log_test("Get About", True, f"Retrieved about section")
            else:
                self.log_test("Get About", False, f"Status: {response.status_code}")
                return False
        except Exception as e:
            self.log_test("Get About", False, f"Exception: {str(e)}")
            return False

        # Test PUT about
        test_about = {
            "title": "Test About Title",
            "description": "Test about description",
            "mission": "Test mission statement",
            "vision": "Test vision statement",
            "stats": [
                {"label": "Years of Service", "value": "20+"},
                {"label": "People Served", "value": "10000+"}
            ]
        }
        
        try:
            response = self.session.put(
                f"{self.base_url}/api/about",
                json=test_about,
                headers={"Content-Type": "application/json"}
            )
            
            if response.status_code == 200:
                self.log_test("Update About", True, "Updated about section")
            else:
                self.log_test("Update About", False, f"Status: {response.status_code}, Response: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("About Section", False, f"Exception: {str(e)}")
            return False

        return True

    def test_contact_section(self):
        """Test Contact section operations"""
        # Test GET contact
        try:
            response = self.session.get(f"{self.base_url}/api/contact")
            if response.status_code == 200:
                contact = response.json()
                self.log_test("Get Contact", True, f"Retrieved contact information")
            else:
                self.log_test("Get Contact", False, f"Status: {response.status_code}")
                return False
        except Exception as e:
            self.log_test("Get Contact", False, f"Exception: {str(e)}")
            return False

        # Test PUT contact
        test_contact = {
            "name": "Test Contact Person",
            "phone": "+91 9876543210",
            "email": "test@example.com",
            "address": "Test Address, Test City",
            "timing": "9:00 AM - 6:00 PM"
        }
        
        try:
            response = self.session.put(
                f"{self.base_url}/api/contact",
                json=test_contact,
                headers={"Content-Type": "application/json"}
            )
            
            if response.status_code == 200:
                self.log_test("Update Contact", True, "Updated contact information")
            else:
                self.log_test("Update Contact", False, f"Status: {response.status_code}, Response: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Contact Section", False, f"Exception: {str(e)}")
            return False

        return True

    def test_donation_section(self):
        """Test Donation section operations"""
        # Test GET donation
        try:
            response = self.session.get(f"{self.base_url}/api/donation")
            if response.status_code == 200:
                donation = response.json()
                self.log_test("Get Donation", True, f"Retrieved donation information")
            else:
                self.log_test("Get Donation", False, f"Status: {response.status_code}")
                return False
        except Exception as e:
            self.log_test("Get Donation", False, f"Exception: {str(e)}")
            return False

        # Test PUT donation
        test_donation = {
            "bankName": "Test Bank",
            "accountName": "Test Account Name",
            "accountNumber": "1234567890",
            "ifscCode": "TEST0001234",
            "upiId": "test@upi"
        }
        
        try:
            response = self.session.put(
                f"{self.base_url}/api/donation",
                json=test_donation,
                headers={"Content-Type": "application/json"}
            )
            
            if response.status_code == 200:
                self.log_test("Update Donation", True, "Updated donation information")
            else:
                self.log_test("Update Donation", False, f"Status: {response.status_code}, Response: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Donation Section", False, f"Exception: {str(e)}")
            return False

        return True

    def test_logout(self):
        """Test logout functionality"""
        try:
            response = self.session.post(f"{self.base_url}/api/auth/logout")
            
            if response.status_code == 200:
                self.log_test("Logout", True, "Successfully logged out")
                return True
            else:
                self.log_test("Logout", False, f"Status: {response.status_code}, Response: {response.text}")
                return False
        except Exception as e:
            self.log_test("Logout", False, f"Exception: {str(e)}")
            return False

    def run_all_tests(self):
        """Run all API tests"""
        print("🚀 Starting NGO Admin API Tests...")
        print(f"📍 Testing against: {self.base_url}")
        print("=" * 60)

        # Test authentication first
        if not self.test_admin_login():
            print("❌ Login failed - stopping tests")
            return False

        # Test auth/me endpoint
        self.test_auth_me()

        # Test all CRUD operations
        self.test_activities_crud()
        self.test_events_crud()
        self.test_gallery_crud()
        self.test_about_section()
        self.test_contact_section()
        self.test_donation_section()

        # Test logout
        self.test_logout()

        # Print summary
        print("=" * 60)
        print(f"📊 Test Results: {self.tests_passed}/{self.tests_run} tests passed")
        success_rate = (self.tests_passed / self.tests_run) * 100 if self.tests_run > 0 else 0
        print(f"📈 Success Rate: {success_rate:.1f}%")
        
        if self.tests_passed == self.tests_run:
            print("🎉 All tests passed!")
            return True
        else:
            print(f"⚠️  {self.tests_run - self.tests_passed} tests failed")
            return False

def main():
    tester = NGOAdminAPITester()
    success = tester.run_all_tests()
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())