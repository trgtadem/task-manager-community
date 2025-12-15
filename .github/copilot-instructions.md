# Copilot Instructions for Task Manager Community Application

## Project Overview

This is a **Next.js 16 + React** task management application for communities. It features email/password authentication via Firebase, role-based access control (admin/user), and task management capabilities. The application uses Shadcn/ui components for the UI and Firestore for data persistence.

## Architecture

### Core Technology Stack
- **Framework**: Next.js 16 with App Router
- **Auth**: Firebase Authentication (Email/Password)
- **Database**: Firestore (NoSQL)
- **UI**: React + Shadcn/ui + Radix UI
- **Styling**: Tailwind CSS
- **State Management**: React Context API

### Key Directory Structure
```
lib/
  ├── firebase.ts           # Firebase SDK initialization
  ├── auth-context.tsx      # Global authentication state (React Context)
  ├── user-service.ts       # User profile operations
  └── task-service.ts       # Task CRUD operations

components/
  ├── firebase-login.tsx    # Email/password login form (Turkish UI)
  ├── admin-dashboard.tsx   # Admin view (user & task management)
  ├── user-dashboard.tsx    # User view (assigned tasks)
  ├── landing-page.tsx      # Public landing page
  └── ui/                   # Shadcn/ui components

app/
  ├── layout.tsx            # Root layout with AuthProvider wrapper
  ├── page.tsx              # Main app logic (view routing based on auth state)
  └── globals.css           # Global styles

.env.local                   # Firebase credentials (NEXT_PUBLIC_* variables)
```

## Authentication Flow

### User Authentication Pattern
1. **Unauthenticated Users** → Landing Page
2. **Sign-up/Sign-in** → Firebase Auth + Firestore profile creation
3. **Authenticated Users** → Role-based routing:
   - Admin role → Admin Dashboard (manage users & tasks)
   - User role → User Dashboard (view assigned tasks)

### useAuth() Hook
The `useAuth()` hook provides global authentication state:
```tsx
const { user, userProfile, loading, logout } = useAuth()
```
- `user`: FirebaseUser object (email, uid, etc.)
- `userProfile`: Custom UserProfile from Firestore (includes role, displayName, etc.)
- `loading`: Authentication initialization loading state
- `logout`: Async function for signing out

## Data Models

### UserProfile (Firestore /users/{uid})
```typescript
{
  uid: string
  email: string
  displayName: string | null
  photoURL: string | null
  role: "admin" | "user"
  createdAt: Timestamp
  updatedAt: Timestamp
}
```

### Task (Firestore /tasks/{taskId})
```typescript
{
  id: string
  title: string
  description: string
  assignedTo: string (user UID)
  status: "pending" | "in-progress" | "completed"
  priority: "low" | "medium" | "high"
  dueDate: Timestamp
  createdAt: Timestamp
  updatedAt: Timestamp
}
```

## Critical Implementation Patterns

### 1. Server/Client Component Boundaries
- **"use client"** required for: Auth hooks, forms, event handlers
- **"use server"** for: Firestore operations (when migrating to API routes)
- Root layout is Server Component → AuthProvider wraps children

### 2. Firebase Error Handling
Turkish error messages are implemented in `firebase-login.tsx`:
```tsx
// Map Firebase error codes to Turkish messages
const errorCode = err.code
if (errorCode === "auth/email-already-in-use") {
  errorMessage = "Bu email zaten kullanımda."
} else if (errorCode === "auth/wrong-password") {
  errorMessage = "Şifre yanlış."
}
```

### 3. Loading States
All auth-dependent pages must handle `loading` state from `useAuth()`:
```tsx
if (loading) return <LoadingSpinner />
```

### 4. Type Safety
TypeScript interfaces are defined in service files:
- `UserProfile` in `lib/auth-context.tsx`
- `Task` in `lib/task-service.ts`

## Service Functions

### User Service (`lib/user-service.ts`)
- `getUserProfile(uid)` - Fetch profile from Firestore
- `updateUserProfile(uid, updates)` - Update user profile
- `makeUserAdmin(uid)` - Change role to admin
- `makeUserRegular(uid)` - Change role to user

### Task Service (`lib/task-service.ts`)
- `createTask(taskData)` - Create new task
- `updateTask(taskId, updates)` - Update task properties
- `deleteTask(taskId)` - Delete task from Firestore
- `getUserTasks(userId)` - Get all tasks assigned to user
- `getAllTasks()` - Get all tasks (admin only)

## Configuration

### Environment Variables (.env.local)
```env
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
```

### Firebase Analytics
Google Analytics tracking is integrated:
- `lib/analytics.ts` - Analytics helper functions
- Tracks: login, sign-up, logout, errors, task creation/completion
- Measurement ID from Firebase Console is required

### Firestore Security Rules
Located in Firebase Console. Current rules:
- Users can only read/write their own profile
- Only admins can manage tasks
- All authenticated users can read tasks

## Development Workflow

### Starting Development
```bash
npm install              # Install dependencies
npm run dev              # Start dev server on localhost:3000
```

### Building & Testing
```bash
npm run build            # Build for production
npm run start            # Run production server
npm run lint             # Run ESLint
```

### Common Tasks

**Adding new components:**
1. Create in `components/` or `components/ui/`
2. Use Shadcn/ui as base when applicable
3. Import from `@/components/` (alias)


## Service Functions

### User Service (`lib/user-service.ts`)
- `getUserProfile(uid)` - Fetch profile from Firestore
- `updateUserProfile(uid, updates)` - Update user profile
- `makeUserAdmin(uid)` - Change role to admin
- `makeUserRegular(uid)` - Change role to user

### Task Service (`lib/task-service.ts`)
- `createTask(taskData)` - Create new task
- `updateTask(taskId, updates)` - Update task properties
- `deleteTask(taskId)` - Delete task from Firestore
- `getUserTasks(userId)` - Get all tasks assigned to user
- `getAllTasks()` - Get all tasks (admin only)

### Analytics Service (`lib/analytics.ts`)
- `trackEvent(eventName, eventParams)` - Track custom event
- `trackLogin(userId, method)` - Track user login
- `trackSignUp(userId, method)` - Track user sign-up
- `trackLogout(userId)` - Track user logout
- `trackTaskCreated(taskId, priority)` - Track task creation
- `trackTaskCompleted(taskId)` - Track task completion
- `trackPageView(pageName)` - Track page view
- `trackError(errorMessage, errorCode)` - Track errors

**Adding Firebase operations:**
1. Create service function in `lib/user-service.ts` or `lib/task-service.ts`
2. Export typed functions
3. Import and use in components with error handling

**Adding Analytics tracking:**
1. Import tracking function from `lib/analytics.ts`
2. Call tracking function after successful operation
3. Example: `trackTaskCreated(taskId, priority)` after task creation

**Updating Firestore schema:**
1. Update TypeScript interface
2. Update Firestore Security Rules if permissions change
3. Update service function to handle new fields

## Known Limitations & TODOs

### Current State
- ✅ Email/Password authentication
- ✅ Basic role-based access (admin/user)
- ✅ Firestore profile persistence
- ✅ Google Analytics integration
- ❌ Task filtering/sorting not implemented
- ❌ Real-time listeners not implemented (Firestore snapshots)
- ❌ Social authentication (Google, GitHub)
- ❌ Email verification
- ❌ Password reset flow
- ❌ User avatar uploads (Firebase Storage)

### Planned Enhancements
1. Implement Firestore Snapshot listeners for real-time updates
2. Add task filtering, sorting, and search
3. Add email verification on sign-up
4. Implement password reset flow
5. Add Google/GitHub OAuth
6. Add user profile page with avatar upload

## Debugging Tips

### Common Issues
1. **"Firebase config not found"** → Check `.env.local` exists and has all NEXT_PUBLIC_* variables
2. **Auth state stuck loading** → Check Firestore rules allow user collection access
3. **Tasks not saving** → Verify Firestore rules allow write to /tasks collection
4. **Role-based routing not working** → Check userProfile?.role is being set in auth-context.tsx

### Debug Commands
```bash
# Check environment variables are loaded
echo $NEXT_PUBLIC_FIREBASE_PROJECT_ID

# Tail dev server logs for errors
npm run dev 2>&1 | grep -i error

# Check Firestore security rules in Firebase Console
# Go to Firestore → Rules tab
```

## Code Style Conventions

- **Components**: PascalCase, exported as named exports
- **Hooks**: camelCase, prefix with "use"
- **Constants**: UPPER_SNAKE_CASE for globals, camelCase for module-scoped
- **Types/Interfaces**: PascalCase
- **Naming**: Turkish comments allowed, English code/variable names preferred for consistency

## External Resources

- **Firebase Documentation**: https://firebase.google.com/docs
- **Next.js App Router**: https://nextjs.org/docs/app
- **Shadcn/ui Components**: https://ui.shadcn.com
- **Tailwind CSS**: https://tailwindcss.com/docs
- **TypeScript**: https://www.typescriptlang.org/docs
