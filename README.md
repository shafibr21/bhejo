# CourierPro - Complete README

CourierPro is a robust web application designed to streamline operations for courier and parcel delivery companies.
It facilitates real-time communication between customers, delivery agents, and administrators through a fully digital platform.

This project aims to solve common logistical challenges such as inefficient parcel tracking, manual agent assignment, lack of real-time visibility,
and limited reporting capabilities.

With CourierPro, logistics companies gain access to an end-to-end system that provides:

- Online booking of parcel pickups with flexible payment options (COD/Prepaid)
- Intelligent assignment and routing of delivery agents
- Real-time GPS tracking of parcels and delivery agents
- Admin dashboards for operational oversight and analytics
- Notification systems to keep users informed at every step

Built with Next.js, MongoDB, Socket.IO, and Google Maps APIs, this system is both scalable and efficient.
## Project Overview

CourierPro is a modern logistics platform that enables courier companies to manage parcel bookings, real-time tracking, delivery agent assignment, and administrative reporting through a web-based interface.

It supports three user roles: Admin, Delivery Agent, and Customer.

## Tech Stack

Frontend: Next.js (App Router), React, Tailwind CSS, Google Maps API
Backend: Node.js, Express/NestJS, MongoDB
Auth: JWT (JSON Web Tokens)
Real-Time: Socket.IO
Other: QR/Barcode scanning, Email/SMTP, PDF/CSV export, Google Maps Directions

## Folder Structure

- app/: App Router structure with layouts and pages
- components/: All UI components (maps, forms, dashboards)
- context/: React Context providers (Auth, Socket)
- hooks/: Custom logic (parcels, tracking, auth)
- lib/: Core utilities (auth, db, socket setup)
- models/: MongoDB schemas via Mongoose
- services/: Notification and socket emitters
- types/: TypeScript types
- utils/: Email, export, and geolocation utilities

## Features by Role

Customer:
- Register/Login, Book Parcel Pickup, Track parcels on map
- View history and status of deliveries

Agent:
- View assigned parcels, Status update interface
- Optimized delivery route via Google Maps
- Scan barcode for parcel confirmation

Admin:
- Dashboard with real-time metrics
- Assign agents to parcels
- View all users and export reports (CSV/PDF)
- Receive live notifications of all updates

## Real-Time Features

Socket.IO enables instant updates across the system.

- Customers receive live updates when agents update parcel status
- Admins get notified when parcels are booked or assigned
- Agents receive real-time assignments

All events are scoped by user role and rooms to ensure correct targeting of updates.

## Google Maps Integration

Agents see optimized delivery routes (Directions API).
Customers view real-time parcel location on map (Geolocation API).
Maps used across Admin, Agent, and Customer dashboards.

## Email Notifications

Nodemailer is configured to send email updates to customers using Gmail SMTP.
Environment variables:
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email
SMTP_PASS=your_app_password

## How to Run Locally

1. Clone the repo: git clone <your-repo-url>
2. Install dependencies: npm install
3. Configure .env.local with:
   - MONGODB_URI
   - JWT_SECRET
   - NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
   - SMTP credentials
4. Start dev server: npm run dev
   - App runs on http://localhost:3000

## Testing Real-Time Updates

- Open Admin Dashboard, Customer Tracking, and Agent Dashboard in separate tabs.
- Book a parcel as customer, assign via admin, and update via agent.
- Observe real-time updates, toasts, and map location markers.

## Documentation

This project contains internal implementation of real-time logic, parcel tracking, route optimization, and notifications.

If you'd like to contribute or understand the core logic, refer to:
- `components/`, `hooks/`, and `services/` directories
- Real-time features are in `SocketContext`, `useRealtimeParcels`, and `socketService.ts`
- Google Maps integration lives in `LiveMap.tsx` and `RouteMap.tsx`
