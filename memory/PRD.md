# Product Requirements Document - Vardhaman Sanskar Dham Website

## Original Problem Statement
Build a website for trust/NGO named Vardhaman Sanskar Dham (Dombivli). First page should show various activities like Jivdaya, Anukampa, Sadharmik Bhakti, Bal Sanskaran, etc. Include space for contact details. Admin panel needed for content management.

## User Choices & Inputs
- **Color Scheme**: Dark royal blue (#1a3a6b, #0f2244) with amber (#d97706, #b45309)
- **Admin Access**: Email/Password (vsddomb@gmail.com)
- **Content Management**: All sections (Activities, About, Events, Gallery, Contact, Donation)
- **Images**: Real organization photos provided by user

## Architecture & Tech Stack
- **Frontend**: React.js with React Router, Axios
- **Backend**: FastAPI with JWT authentication
- **Database**: MongoDB
- **Styling**: Tailwind CSS with dark royal blue and amber theme
- **Components**: Shadcn UI component library
- **Auth**: bcrypt + JWT tokens with httpOnly cookies

## What's Been Implemented (December 2024)

### Phase 1: Frontend Website ✅
**Features**:
1. **Header/Navigation** - Sticky nav with logo, menu links, Donate CTA
2. **Hero Section** - Full-screen with dark royal blue gradient, amber accents
3. **Activities Section** - 4 activities with real images (Jivdaya, Anukampa, Sadharmik Bhakti, Bal Sanskaran)
4. **About Section** - Description, mission, vision, statistics (20+ years, 2,14,000+ animals saved)
5. **Events Section** - Upcoming and completed events with dates
6. **Photo Gallery** - Category filtering (Spiritual, Service, Education)
7. **Donation Section** - Bank details, UPI information
8. **Contact Section** - Contact form, phone, email, address
9. **Footer** - Organization branding, quick links

### Phase 2: Backend API ✅
**Endpoints**:
- Auth: `/api/auth/login`, `/api/auth/me`, `/api/auth/logout`
- Activities: GET, POST, PUT, DELETE `/api/activities`
- About: GET, PUT `/api/about`
- Events: GET, POST, PUT, DELETE `/api/events`
- Gallery: GET, POST, DELETE `/api/gallery`
- Contact: GET, PUT `/api/contact`
- Donation: GET, PUT `/api/donation`

**Security**:
- JWT authentication with httpOnly cookies
- Password hashing with bcrypt
- Admin role-based access control
- Protected routes middleware

### Phase 3: Admin Panel ✅
**Features**:
1. **Admin Login** - Email/password authentication
2. **Dashboard** - Tabbed interface for all content sections
3. **Activities Management** - Add, edit, delete activities
4. **About Management** - Edit description, mission, vision, stats
5. **Events Management** - Create, update, delete events
6. **Gallery Management** - Add, delete images by category
7. **Contact Management** - Update contact information
8. **Donation Management** - Update bank and UPI details

**Admin Credentials**:
- Email: vsddomb@gmail.com
- Password: Admin@VSD2024
- Stored in: `/app/memory/test_credentials.md`

### Phase 4: Database Integration ✅
- MongoDB collections: users, activities, about, events, gallery, contact, donation
- Seeded with real organization data
- Frontend fetches from backend APIs
- Real-time content updates

### Phase 5: Color Theme Update ✅
- Updated from light blue/gold to **dark royal blue** and **amber**
- Hero section: Dark blue (#0f2244, #1a3a6b) gradient
- CTAs: Amber (#d97706) with hover effects
- Consistent theme across all sections

## Technical Implementation

### Backend Structure
```
/app/backend/
├── server.py          # Main FastAPI app with all routes
├── seed_db.py         # Database seeding script
├── .env               # JWT_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD
└── requirements.txt   # Dependencies (bcrypt, pyjwt, motor, fastapi)
```

### Frontend Structure
```
/app/frontend/src/
├── pages/
│   ├── Home.jsx           # Main public website
│   ├── AdminLogin.jsx     # Admin login page
│   └── AdminDashboard.jsx # Admin content management
├── context/
│   └── AuthContext.jsx    # Authentication state management
├── components/ui/         # Shadcn UI components
└── App.js                 # Routes and auth provider
```

### Database Schema
- **users**: _id, email, password_hash, name, role, created_at
- **activities**: _id, title, subtitle, description, icon, image
- **about**: _id, title, description, mission, vision, stats[]
- **events**: _id, title, date, time, location, description, status
- **gallery**: _id, url, title, category
- **contact**: _id, name, phone, email, address, timing
- **donation**: _id, bankName, accountName, accountNumber, ifscCode, upiId

## Current Status
✅ **Fully Functional** - Website and admin panel operational
✅ **Backend Integration** - All data from MongoDB
✅ **Authentication** - Secure admin access with JWT
✅ **Content Management** - Admin can update all sections
✅ **Color Theme** - Dark royal blue with amber accents
✅ **Real Images** - Organization's actual photos integrated

## Next Steps / Potential Enhancements
- [ ] Image upload functionality (currently URL-based)
- [ ] Contact form backend (email notifications)
- [ ] Online payment gateway integration
- [ ] Mobile responsive menu
- [ ] SEO optimization
- [ ] Analytics integration
- [ ] Multi-language support (Hindi, Marathi)
- [ ] Event registration system
- [ ] Volunteer management system
