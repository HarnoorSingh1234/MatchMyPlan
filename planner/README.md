# Task & Deadline Productivity PWA

![PWA Status](https://img.shields.io/badge/PWA-Ready-brightgreen)
![Version](https://img.shields.io/badge/Version-1.0.0-blue)
![License](https://img.shields.io/badge/License-MIT-yellow)

A comprehensive task management and productivity Progressive Web App with notification systems, Google Drive integration, and folder organization.

## PWA Initialization

1. Make a manifest.ts file in src/app folder.
2. Use 
    npx pwa-asset-generator public/icons/calendar-solid-blue.svg public/icons/pwa-icons -m app/manifest.ts --padding "calc(50vh - 25%) calc(50vw - 25%)" -b "#050505" --maskable "linear-gradient(to bottom, transparent 0%, transparent 45%, #00f2ff 45%, #00f2ff 55%, transparent 55%, transparent 100%),linear-gradient(to right, transparent 0%, transparent 45%, #00f2ff 45%, #00f2ff 55%, transparent 55%, transparent 100%)" -q 100 -i public/asset-generator-changes.html --favicon

    this code to generate useful screensize of icons for your and them have them linked up to your rootlayout by setting up metadata (use chatgpt)
3. Now we will be adding the install promt. we will create a useUserAgent hook to determine the type of browser and then we will create the popup components for the specific browsers
4. 
<!-- Add your specific PWA setup and initialization steps above this line -->

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

### Phase 1: PWA Setup & Core Task Management (Weeks 1-4)
- Project setup, UI foundation
- Core task management functionality
- Task organization with folders
- Priority system implementation

### Phase 2: Notification System & Reminders (Weeks 5-8)
- Browser notification setup
- Priority-based notification system
- Email integration
- WhatsApp integration

### Phase 3: Google Drive Integration (Weeks 9-12)
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