# Socket.IO Implementation Guide

## What We've Implemented

### 1. **Backend Socket.IO Server**

- Custom server setup in `server.js`
- Socket connection handling with rooms
- Real-time event emission from API routes

### 2. **Frontend Socket.IO Context**

- `SocketContext` for managing connection state
- Automatic room joining based on user role
- Connection status tracking

### 3. **Real-time Hooks**

- `useRealtimeParcels` - For parcel lists with live updates
- `useRealtimeParcelTracking` - For individual parcel tracking

### 4. **Updated Components**

- Tracking page with live updates
- Agent dashboard with real-time parcel updates
- Connection status indicator

## How to Test

### 1. **Start the Server**

```bash
npm run dev
```

This will start the custom server with Socket.IO on port 3000.

### 2. **Test Real-time Updates**

#### As an Agent:

1. Login as agent (`agent@demo.com` / `password`)
2. Go to "My Parcels" page
3. Check connection status (should show "Live")

#### As an Admin:

1. Login as admin (`admin@gmail.com` / `12345678`)
2. Go to Admin Dashboard
3. Assign a parcel to an agent
4. The agent should receive a real-time notification

#### As a Customer:

1. Login as customer (`customer@demo.com` / `password`)
2. Track a parcel using tracking number
3. Connection status should show "Live"
4. Any status updates will appear in real-time

### 3. **Test Status Updates**

1. As an agent, update a parcel status
2. Anyone tracking that parcel should see the update immediately
3. Toast notifications should appear

## Socket Events

### Client to Server:

- `join-parcel` - Join room for specific parcel updates
- `join-user` - Join room for user-specific updates
- `join-agent` - Join room for agent-specific updates
- `leave-parcel` - Leave parcel room

### Server to Client:

- `parcel-status-updated` - Parcel status changed
- `parcel-update` - General parcel update
- `parcel-assigned` - New parcel assigned to agent
- `location-update` - Parcel location updated

## Next Steps

1. **Test the implementation**
2. **Add Google Maps integration**
3. **Implement QR codes**
4. **Add email/SMS notifications**

## Troubleshooting

- Check browser console for connection errors
- Verify Socket.IO server is running (check terminal logs)
- Ensure firewall isn't blocking connections
- Test with multiple browser tabs/windows
