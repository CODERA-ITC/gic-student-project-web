# Security Questions Setup for OAuth Users

This document explains the security questions feature implemented for new users who sign in via Google or GitHub OAuth.

## Overview

When a user signs in for the first time using Google or GitHub OAuth, they will be prompted to answer 3 security questions. These answers will be stored securely and can be used later for password recovery/reset verification.

## Components

### 1. SecurityQuestionsModal Component
**Location:** `app/components/SecurityQuestionsModal.vue`

A modal dialog that presents three predefined security questions:
1. What is your mother's maiden name?
2. What was the name of your first pet?
3. What city were you born in?

**Features:**
- Required validation for all fields
- Minimum 2 characters per answer
- Cannot be closed by clicking outside (when `allowClose` is false)
- Loading state during submission
- Error handling display
- Dark mode support

**Props:**
- `isOpen` (Boolean): Controls modal visibility
- `allowClose` (Boolean): Whether users can close the modal without submitting

**Events:**
- `@submit`: Emitted when form is submitted with answers object
- `@close`: Emitted when user tries to close modal

### 2. Auth Store Updates
**Location:** `app/stores/auth.ts`

**New State Property:**
- `needsSecurityQuestions` (Boolean): Indicates if the current user needs to set up security questions

**New Method:**
```typescript
async submitSecurityQuestions(answers: {
  question1: { question: string; answer: string };
  question2: { question: string; answer: string };
  question3: { question: string; answer: string };
}): Promise<void>
```

This method:
- Sends security question answers to the backend API
- Endpoint: `POST /users/security-questions`
- Requires authentication token
- Updates `needsSecurityQuestions` to false on success

**Updated Method:**
- `handleOAuthCallback()`: Now checks for `isNewUser` or `hasSecurityQuestions` flags in the JWT token payload to determine if security questions modal should be shown

### 3. Auth Callback Page
**Location:** `app/pages/auth/callback.vue`

**Updates:**
- Imports and renders `SecurityQuestionsModal` component
- Checks `authStore.needsSecurityQuestions` after OAuth callback
- Shows security questions modal for new users
- Handles form submission and redirects after successful save
- Prevents navigation until security questions are answered

## Flow Diagram

```
User clicks Google/GitHub login
         ↓
OAuth provider authenticates
         ↓
Backend generates JWT with flags (isNewUser/hasSecurityQuestions)
         ↓
User redirected to /auth/callback with token
         ↓
Frontend decodes JWT and checks flags
         ↓
    Is new user?
         ↓
    Yes ────→ Show SecurityQuestionsModal
         ↓          ↓
         ↓    User fills 3 questions
         ↓          ↓
         ↓    Submit to backend API
         ↓          ↓
         ↓    Mark needsSecurityQuestions = false
         ↓          ↓
    No ←──────────┘
         ↓
Redirect to dashboard
```

## Backend Requirements

Your backend API needs to support the following:

### 1. JWT Token Payload
When a user signs in via OAuth, include these flags in the JWT:

```json
{
  "id": "user_id",
  "email": "user@example.com",
  "firstname": "John",
  "lastname": "Doe",
  "role": "student",
  "isNewUser": true,           // or hasSecurityQuestions: false
  "exp": 1234567890
}
```

### 2. Security Questions Endpoint

**Endpoint:** `POST /users/security-questions`

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "securityQuestions": [
    {
      "question": "What is your mother's maiden name?",
      "answer": "Smith"
    },
    {
      "question": "What was the name of your first pet?",
      "answer": "Fluffy"
    },
    {
      "question": "What city were you born in?",
      "answer": "New York"
    }
  ]
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Security questions saved successfully"
}
```

**Response (Error):**
```json
{
  "success": false,
  "message": "Error message here"
}
```

### 3. Storage Recommendations

**Security Best Practices:**
1. **Hash the answers** using a secure hashing algorithm (bcrypt, argon2)
2. **Do NOT store answers in plain text**
3. Store with salt for additional security
4. Associate with user ID in database

**Example Database Schema:**
```sql
CREATE TABLE security_questions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  question TEXT NOT NULL,
  answer_hash TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## Testing the Feature

### Test Case 1: New User via Google OAuth
1. Clear browser local storage
2. Click "Sign in with Google"
3. Complete Google authentication
4. Should see security questions modal
5. Fill in all three questions
6. Click "Save Security Questions"
7. Should redirect to dashboard

### Test Case 2: Returning User via GitHub OAuth
1. Sign in with GitHub (user who already set security questions)
2. Should NOT see security questions modal
3. Should redirect directly to dashboard

### Test Case 3: Form Validation
1. Try to submit with empty answers → Should show error
2. Try to submit with 1-character answers → Should show validation error
3. Fill valid answers → Should submit successfully

## Future Enhancements

1. **Password Recovery Flow:**
   - Create `/forgot-password` page that uses security questions
   - Verify answers match stored hashes
   - Allow password reset if answers match

2. **Allow Users to Update Questions:**
   - Add settings page for users to change security questions
   - Require current password before changing

3. **Multiple Question Sets:**
   - Allow users to choose from different question sets
   - Store question IDs instead of full question text

4. **Rate Limiting:**
   - Limit answer verification attempts
   - Lock account after multiple failed attempts

## API Base URL

The current API base URL is configured as:
```javascript
const API_BASE_URL = "https://gic-project.darororo.dev";
```

Make sure your backend is configured to handle the security questions endpoint at this URL.

## Notes

- The modal cannot be dismissed without answering questions (for new users)
- All answers are trimmed of whitespace before submission
- The feature uses the existing authentication token for API calls
- Dark mode is fully supported
- The implementation is TypeScript-safe with proper type definitions
