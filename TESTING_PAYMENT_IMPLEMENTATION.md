# Payment/Subscription Implementation Testing Guide

## Overview
This document provides instructions for testing the newly implemented payment and subscription logic integrated with the .NET backend.

## Prerequisites

### Backend Requirements
1. **Backend API must be running** on `http://localhost:5059/api/v1`
2. Backend must have the following endpoints implemented:
   - `POST /api/v1/authentication/sign-in` - User login with username/password
   - `POST /api/v1/authentication/sign-up` - User registration with username/password
   - `POST /api/v1/appointments` - Create appointment
   - `POST /api/v1/subscriptions` - Create subscription/payment
   - `GET /api/v1/appointments/appointments/{userId}` - Get user appointments
   - `GET /api/v1/subscriptions/user/{userId}` - Get user subscriptions

### Frontend Requirements
1. Install dependencies: `npm install`
2. Environment configured in `.env`:
   ```
   VITE_API_BASE_URL=http://localhost:5059/api/v1
   VITE_API_MODE=dynamic
   ```

## Testing Scenarios

### 1. Authentication Testing

#### Test User Registration
1. Start frontend: `npm run dev`
2. Navigate to: `http://localhost:5173/register`
3. Fill in registration form:
   - **Username**: `testuser123`
   - **Password**: `SecurePass123!`
4. Click "Submit"
5. **Expected Result**:
   - Backend receives POST request to `/api/v1/authentication/sign-up`
   - JWT token stored in localStorage
   - User redirected to onboarding page
   - Console log shows: "User registered successfully"

#### Test User Login
1. Navigate to: `http://localhost:5173/login`
2. Fill in login form:
   - **Username**: `testuser123`
   - **Password**: `SecurePass123!`
3. Click "Login"
4. **Expected Result**:
   - Backend receives POST request to `/api/v1/authentication/sign-in`
   - JWT token stored in localStorage as 'authToken'
   - User redirected to dashboard
   - Console log shows user data with token

### 2. Appointment Booking Testing

#### Test Appointment Creation
1. Login as a user
2. Navigate to therapist list: `http://localhost:5173/therapists`
3. Select a therapist
4. Click "Book Appointment"
5. Fill in appointment form:
   - **Date**: Select future date
   - **Time**: Select available slot
   - **Phone**: `+1 (555) 123-4567`
   - **Email**: `test@example.com`
   - **Notes**: (optional)
6. Click "Confirm Reservation"
7. **Expected Result**:
   - Backend receives POST to `/api/v1/appointments` with JWT token
   - Success message displayed
   - Appointment data includes: professionalId, userId, date, time, duration, status, notes, contactPhone, contactEmail

### 3. Payment/Subscription Testing

#### Test Credit Card Payment
1. Follow appointment booking steps above
2. In appointment confirmation screen, select "Credit Card" payment method
3. Fill in credit card form:
   - **Name**: `Juan`
   - **Last Name**: `Pérez`
   - **Card Number**: `4242 4242 4242 4242`
   - **Expiry Date**: `12/25`
   - **CVV**: `123`
4. Fill in contact information:
   - **Email**: `test@example.com`
   - **Phone**: `+1 (555) 123-4567`
5. Click "Confirmar Cita"
6. **Expected Result**:
   - Two backend requests sent:
     1. POST to `/api/v1/appointments` - Creates appointment
     2. POST to `/api/v1/subscriptions` - Creates payment record
   - Both requests include `Authorization: Bearer {JWT_TOKEN}` header
   - Success modal displayed
   - Console logs show both appointment and subscription created

#### Verify Request Payload
Open browser DevTools (F12) > Network tab and verify:

**Appointment Request:**
```json
{
  "professionalId": "1",
  "userId": "user_id",
  "date": "2024-01-15",
  "time": "14:00",
  "duration": 50,
  "status": "confirmed",
  "notes": "...",
  "contactPhone": "+1 (555) 123-4567",
  "contactEmail": "test@example.com",
  "paymentMethod": "credit",
  "amount": 150
}
```

**Subscription Request:**
```json
{
  "userId": "user_id",
  "planId": "appointment_id",
  "nameUser": "Juan",
  "lastNameUser": "Pérez",
  "emailUser": "test@example.com",
  "numberCard": "4242 4242 4242 4242",
  "expirationDate": "12/25",
  "cvv": "123",
  "isActive": true
}
```

### 4. JWT Authentication Testing

#### Verify JWT Token is Sent
1. Login to application
2. Open DevTools > Application > Local Storage
3. Verify 'authToken' key exists with JWT value
4. Make any authenticated request (e.g., book appointment)
5. Open DevTools > Network tab
6. Check request headers for:
   ```
   Authorization: Bearer {JWT_TOKEN}
   ```

#### Test Without JWT Token
1. Clear localStorage: `localStorage.clear()`
2. Try to access protected route (e.g., `/dashboard`)
3. **Expected Result**: Redirect to `/login`
4. Try to book appointment without login
5. **Expected Result**: Backend returns 401 Unauthorized

### 5. Error Handling Testing

#### Test Invalid Credentials
1. Navigate to login page
2. Enter invalid username/password
3. **Expected Result**: 
   - Error message displayed
   - No redirect occurs
   - Console shows authentication error

#### Test Missing Card Information
1. Navigate to appointment confirmation
2. Select "Credit Card"
3. Leave card fields empty
4. Try to submit
5. **Expected Result**:
   - Submit button disabled
   - Form validation prevents submission

#### Test Backend Connection Error
1. Stop backend server
2. Try to login or book appointment
3. **Expected Result**:
   - Error message displayed to user
   - Console shows connection error
   - Application remains functional (doesn't crash)

## Debugging Tips

### Check Console Logs
The application logs detailed information to the console:
- Authentication responses
- Appointment creation
- Subscription creation
- Error details

### Verify Backend Logs
Check your .NET backend logs for:
- Received POST requests
- JWT token validation
- Database saves
- Any errors or exceptions

### Common Issues

#### Issue: "Failed to create subscription"
**Solution**: 
- Verify backend `/api/v1/subscriptions` endpoint is implemented
- Check backend accepts the exact field names in the payload
- Verify JWT token is valid and not expired

#### Issue: "Failed to book appointment"
**Solution**:
- Verify backend `/api/v1/appointments` endpoint is implemented
- Check userId is correctly extracted from JWT token
- Verify all required fields are provided

#### Issue: "Invalid credentials"
**Solution**:
- Verify username and password are correct
- Check backend authentication endpoint is working
- Verify backend returns token in response

## Manual Testing Checklist

- [ ] User can register with username/password
- [ ] User can login with username/password
- [ ] JWT token is stored in localStorage after login
- [ ] JWT token is sent in Authorization header for all requests
- [ ] User can view therapist list
- [ ] User can book an appointment with all details
- [ ] Appointment is saved to backend database
- [ ] User can fill in credit card information
- [ ] Credit card form validates all fields
- [ ] Subscription/payment is created in backend
- [ ] Success modal displays after successful booking
- [ ] Error messages display for invalid inputs
- [ ] Application handles backend errors gracefully
- [ ] User is redirected to dashboard after successful actions

## API Contract Reference

### Authentication Endpoints

**POST /api/v1/authentication/sign-in**
Request:
```json
{
  "username": "string",
  "password": "string"
}
```
Response:
```json
{
  "id": "string",
  "username": "string",
  "token": "jwt_token_string"
}
```

**POST /api/v1/authentication/sign-up**
Request:
```json
{
  "username": "string",
  "password": "string"
}
```
Response:
```json
{
  "id": "string",
  "username": "string",
  "message": "User created successfully"
}
```

### Appointment Endpoints

**POST /api/v1/appointments**
Headers:
```
Authorization: Bearer {jwt_token}
```
Request:
```json
{
  "professionalId": "string",
  "userId": "string",
  "date": "string (YYYY-MM-DD)",
  "time": "string (HH:mm)",
  "duration": "number",
  "status": "string",
  "notes": "string",
  "contactPhone": "string",
  "contactEmail": "string",
  "paymentMethod": "string",
  "amount": "number"
}
```

### Subscription Endpoints

**POST /api/v1/subscriptions**
Headers:
```
Authorization: Bearer {jwt_token}
```
Request:
```json
{
  "userId": "string",
  "planId": "string",
  "nameUser": "string",
  "lastNameUser": "string",
  "emailUser": "string",
  "numberCard": "string",
  "expirationDate": "string (MM/YY)",
  "cvv": "string",
  "isActive": "boolean"
}
```

## Next Steps

After successful testing:
1. Document any backend API adjustments needed
2. Implement additional validation if required
3. Add loading states and better error messages
4. Consider implementing payment gateway integration (Stripe, PayPal, etc.)
5. Add unit and integration tests
6. Perform security review of sensitive data handling

## Support

If you encounter issues:
1. Check browser console for errors
2. Verify backend is running and accessible
3. Check Network tab for request/response details
4. Review backend logs for errors
5. Ensure JWT token is valid and not expired
