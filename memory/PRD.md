# Product Requirements Document - Vardhaman Sanskar Dham Website

## Project Overview
Full-stack NGO website with comprehensive admin panel for Vardhaman Sanskar Dham (Dombivli)

## Features Implemented

### Public Website ✅
- Dark royal blue (#1a3a6b, #0f2244) with amber (#d97706) theme
- Sections: Hero, Activities (4), About, Events (3), Gallery (6 with filters), Donation, Contact
- Working contact form (submits to database)
- Real organization images integrated
- Responsive design with smooth animations

### Admin Panel ✅
**Authentication**:
- Email/Password login with JWT
- Secure httpOnly cookies
- Password: bcrypt hashed

**Content Management Tabs**:
1. **Activities** - Add/Edit/Delete with image upload
2. **About** - Edit description, mission, vision, stats
3. **Events** - Create/Update/Delete events
4. **Gallery** - Upload/Delete images by category
5. **Contact** - Update contact information
6. **Donation** - Edit bank/UPI details

**New Features Added**:
7. **Profile** - Change password & update profile details
8. **Users** - Create/manage multiple admin accounts
9. **Messages** - View contact form submissions (stored in DB)
10. **Donations** - Record donations, send thank you notifications

### Backend APIs ✅
- `/api/auth/*` - Login, logout, profile, change password
- `/api/users` - User management (CRUD)
- `/api/activities` - Activities CRUD
- `/api/about` - About section management
- `/api/events` - Events CRUD
- `/api/gallery` - Gallery CRUD
- `/api/contact` - Contact info & messages
- `/api/contact/message` - Public contact form submission
- `/api/contact/messages` - Admin view messages
- `/api/donation` - Donation details
- `/api/donations/records` - Donation tracking CRUD
- `/api/donations/records/{id}/send-thankyou` - Send thank you
- `/api/upload` - Image upload endpoint

### Database Collections
- **users** - Admin accounts
- **activities** - 4 activities
- **about** - Organization info
- **events** - Event listings
- **gallery** - Photo gallery
- **contact** - Contact information
- **contact_messages** - Contact form submissions
- **donation** - Bank/UPI details
- **donation_records** - Donation tracking

## Admin Credentials
**Email**: vsddomb@gmail.com
**Password**: Admin@VSD2024

## Access Points
- **Website**: https://sanskar-dham.preview.emergentagent.com
- **Admin Login**: https://sanskar-dham.preview.emergentagent.com/admin/login

## How It Works

### Contact Form Flow
1. User fills contact form on website
2. Submits to `/api/contact/message`
3. Stored in database with "unread" status
4. Admin views in Messages tab
5. Admin can mark as read or delete

### Donation Management Flow
1. Donor makes bank/UPI transfer
2. Admin records donation in Donations tab
3. Enter donor details, amount, transaction ID
4. Status: "pending"
5. Admin clicks "Send Thank You"
6. Status changes to "confirmed"
7. Thank you notification sent (ready for email/WhatsApp integration)

### User Management Flow
1. Admin creates new user in Users tab
2. Provides email, password, name
3. New admin can login independently
4. Each admin can manage their own profile
5. Cannot delete own account (safety)

### Image Upload
1. Admin clicks "Upload" in Activities/Gallery
2. Selects image from computer
3. Uploaded to `/app/backend/uploads/`
4. URL auto-generated and saved
5. Accessible via `/uploads/{filename}`

## Next Steps
- Email/WhatsApp integration for notifications (SendGrid, Twilio)
- Payment gateway (Razorpay/Stripe) for online donations
- Bulk image upload for gallery
- Export donation records (CSV/Excel)
- SMS notifications
- Multi-language support

## Latest Updates (2026-04-20)

### ✅ NEW: Separate Donations Page
- Created dedicated `/donate` route with comprehensive donation information
- Includes domestic AND foreign donation sections
- Play Store link integration for mobile app
- Tax benefits & transparency section
- Professional design with dark blue/amber theme

### ✅ NEW: Activities Listing Page
- Created `/activities` route showing ALL activities in grid layout
- Homepage now shows only 4 featured activities with "View All Activities" button
- Click on any activity card to view full details

### ✅ NEW: Activity Detail Pages
- Dynamic route `/activities/{slug}` for individual activity pages
- Support for:
  - Multiple images (gallery)
  - Multiple videos (YouTube embeds + uploaded videos)
  - Custom fields per activity
  - Stats display
  - Full description with proper formatting
- Call-to-action for donations

### ✅ UPDATED: Backend Activity Schema
- Added support for `slug`, `category`, `stats`, `images[]`, `videos[]`, `customFields{}`
- New endpoint: `GET /api/activities/{slug}` for activity detail
- Auto-generate slug from title if not provided

### ✅ UPDATED: Donation Model
- Added `playStoreLink` field for Android app download
- Added `foreignDonation` object for FCRA account details
- Admin can now edit Play Store link in Donation tab

### ✅ UPDATED: Navigation
- "Donate Now" button navigates to `/donate` page (instead of scrolling)
- Activities cards are clickable and navigate to detail pages
- Proper routing throughout the application
