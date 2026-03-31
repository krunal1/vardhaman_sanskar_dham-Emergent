# Product Requirements Document - Vardhaman Sanskar Dham Website

## Original Problem Statement
Build a website for trust/NGO named Vardhaman Sanskar Dham (Dombivli). First page should show various activities we do like Jivdaya, Anukampa, Sadharmik Bhakti, Bal Sanskaran, etc. Give space for contact details.

## User Choices & Inputs
- **Color Scheme**: Spiritual blue and gold
- **Content**: Placeholder content for activities
- **Images**: Placeholder images (professional spiritual/NGO themed)
- **Contact**: Name "Ankit" with placeholder details
- **Additional Sections**: About Us, Photo Gallery, Events/Announcements, Donation/Support

## Architecture & Tech Stack
- **Frontend**: React.js with React Router
- **Styling**: Tailwind CSS with custom blue and gold theme
- **Components**: Shadcn UI component library
- **State Management**: React hooks (useState)
- **Data**: Mock data in `/app/frontend/src/mock.js`

## What's Been Implemented (Dec 2024)

### Phase 1: Frontend with Mock Data ✅
**Date**: December 2024

#### Completed Features:
1. **Header/Navigation**
   - Sticky navigation bar with logo
   - Navigation links to all sections
   - Prominent "Donate Now" CTA button

2. **Hero Section**
   - Full-screen hero with spiritual temple background
   - Blue and gold gradient overlay
   - "Serving Since 2009" badge
   - Compelling headline with CTAs
   - Animated scroll indicator

3. **Activities Section**
   - 4 activity cards: Jivdaya, Anukampa, Sadharmik Bhakti, Bal Sanskaran
   - Each with icon, image, description
   - Hover effects and animations
   - Image overlays with gradient

4. **About Section**
   - Organization description
   - Mission and Vision cards
   - Statistics showcase (Years of Service, Lives Touched, Volunteers, Programs)
   - Blue and amber accent colors

5. **Events Section**
   - 3 event cards with status badges (Upcoming/Completed)
   - Date, time, location information
   - Register Now CTA for upcoming events

6. **Photo Gallery**
   - 6 images with category filtering
   - Filter buttons: All, Spiritual, Service, Education
   - Hover effects with image zoom
   - Title overlays on hover

7. **Donation Section**
   - Full-width blue gradient background
   - Bank account details
   - UPI payment information
   - Prominent "Donate Now" button

8. **Contact Section**
   - Contact information cards (Phone, Email, Address, Hours)
   - Contact form with validation
   - Icon-based visual design
   - Contact person: Ankit

9. **Footer**
   - Organization branding
   - Quick links navigation
   - Contact information
   - Copyright information

#### Technical Implementation:
- All data in `/app/frontend/src/mock.js`
- Single-page application with smooth scrolling
- Responsive design for all screen sizes
- Custom animations and transitions in App.css
- Shadcn UI components used throughout

## Prioritized Backlog

### P0 Features (Must Have - Backend Development)
- [ ] Backend API development with MongoDB
- [ ] Contact form submission endpoint
- [ ] Event management CRUD operations
- [ ] Gallery image management
- [ ] About/content management system

### P1 Features (High Priority)
- [ ] Event registration system
- [ ] Volunteer registration form
- [ ] Newsletter subscription
- [ ] Admin panel for content management
- [ ] Image upload functionality for gallery

### P2 Features (Nice to Have)
- [ ] Online payment integration for donations
- [ ] Social media integration
- [ ] Blog/News section
- [ ] Volunteer dashboard
- [ ] Event calendar view
- [ ] Testimonials section
- [ ] Multi-language support (English, Hindi, Marathi)

## Next Tasks
1. **Backend Development**: Create FastAPI endpoints for contact form, events, gallery
2. **MongoDB Models**: Design schemas for events, contacts, gallery, content
3. **Integration**: Connect frontend forms to backend APIs
4. **Testing**: End-to-end testing of all features
5. **Enhancements**: Add more interactive features based on user feedback

## API Contracts (To Be Implemented)

### Contact Form
- **POST** `/api/contact`
- Body: `{ name, email, phone, message }`
- Response: Success/error message

### Events
- **GET** `/api/events` - Get all events
- **POST** `/api/events` - Create event (admin)
- **PUT** `/api/events/:id` - Update event (admin)
- **DELETE** `/api/events/:id` - Delete event (admin)

### Gallery
- **GET** `/api/gallery` - Get all gallery images
- **POST** `/api/gallery` - Upload image (admin)
- **DELETE** `/api/gallery/:id` - Delete image (admin)

### Content
- **GET** `/api/content/:section` - Get section content (about, activities, etc.)
- **PUT** `/api/content/:section` - Update section content (admin)

## Notes
- Current implementation uses mock data only
- All images are from Unsplash/Pexels (placeholder)
- Forms are non-functional (no backend yet)
- Ready for backend integration
