# Task & Deadline Productivity PWA

![PWA Status](https://img.shields.io/badge/PWA-Ready-brightgreen)
![Version](https://img.shields.io/badge/Version-1.0.0-blue)
![License](https://img.shields.io/badge/License-MIT-yellow)

A comprehensive task management and productivity Progressive Web App with notification systems, Google Drive integration, and folder organization.

## PWA Initialization

### Step 1: Create Web App Manifest
Create a `manifest.ts` file in the `src/app` folder to define your PWA metadata and icons.

### Step 2: Generate PWA Icons
Use the following command to generate all necessary icon sizes for your PWA:

```bash
npx pwa-asset-generator public/icons/calendar-solid-blue.svg public/icons/pwa-icons \
  -m src/app/manifest.ts \
  --padding "calc(50vh - 25%) calc(50vw - 25%)" \
  -b "#050505" \
  --maskable \
  -q 100 \
  -i public/asset-generator-changes.html \
  --favicon
```

This generates:
- Various icon sizes (192x192, 512x512, etc.)
- Maskable icons for Android
- Favicon for browsers
- Updates your manifest.ts with proper icon references

### Step 3: Configure Metadata in Layout
Link the manifest to your root layout by setting up proper metadata exports in `layout.tsx`.

### Step 4: Implement Install Prompt
Create components for PWA installation:
- `useUserAgent` hook to detect browser type
- `AddToHomeScreenPrompt` component with browser-specific instructions
- Support for Chrome, Safari iOS, Firefox, and other browsers

### Step 5: Service Worker Setup
Register a service worker for offline functionality and push notifications.

### Step 6: Deploy and Test
Deploy to a live HTTPS domain (Vercel/Netlify) to test PWA features properly, as localhost has limitations for PWA functionality.

<!-- PWA setup complete -->

## Project Overview

This productivity PWA helps users manage tasks, deadlines, and related documents in one centralized application. With features like priority-based notifications, folder organization, and Google Drive integration, it's designed to streamline workflow and ensure no important deadlines are missed.

### Key Features

#### 1. Core App Features
- **Task Management**: Create, edit, and delete tasks with title, description, and due date/time
- **Priority System**: Set task priority on a 1-5 scale
- **Deadline Tracking**: Automated and manual entry of deadlines with calendar view
- **Folder Organization**: Group tasks into categories like "Office," "Home," and "Miscellaneous"

#### 2. Document Management
- **Google Drive Integration**: Secure login with OAuth for accessing Drive files
- **Document Attachment**: Attach Drive documents to relevant tasks
- **File Upload**: Upload files directly to your Google Drive from within the app

#### 3. Notification System
- **Multi-Channel Alerts**: Browser notifications, email, and WhatsApp integration
- **Priority-Based Notification Levels**:
  - Level 5: Silent browser notification
  - Level 4: Standard notification
  - Level 3: Notification + custom message
  - Level 2: Notification + message + email
  - Level 1: Notification + message + email + alarm (sound)

#### 4. PWA Capabilities
- **Offline Functionality**: Work without internet connection
- **Installable**: Add to home screen on mobile or desktop
- **Responsive Design**: Optimized for all device sizes

## Tech Stack

- **Frontend**: Next.js PWA, Tailwind CSS, Component library (NextUI/Shadcn UI)
- **Backend**: Next.js API Routes, MongoDB/Supabase
- **Notification**: Web Push (service worker), NodeMailer/Resend (email), CallMeBot/Novu (WhatsApp)
- **Storage**: IndexedDB for offline capability
- **Authentication**: Google OAuth via NextAuth.js
- **Hosting**: Vercel with scheduled cron jobs

## Project Timeline

### Phase 1: PWA Setup & Core Task Management 
- Project setup, UI foundation
- Core task management functionality
- Task organization with folders
- Priority system implementation

### Phase 2: Notification System & Reminders 
- Browser notification setup
- Priority-based notification system
- Email integration
- WhatsApp integration

### Phase 3: Google Drive Integration
- Google authentication
- Document listing and access
- File attachment to tasks
- Final testing and optimization

## Development

### Prerequisites
- Node.js 16+
- npm or yarn
- MongoDB/Supabase account
- Google Developer account (for Drive API)

### Installation
```bash
# Clone repository
git clone [your-repo-url]

# Install dependencies
npm install

# Start development server
npm run dev
```