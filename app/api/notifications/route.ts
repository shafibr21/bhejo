import { NextRequest, NextResponse } from 'next/server';
import { NotificationService, NotificationData } from '@/services/notificationService';
import clientPromise from '@/lib/mongodb';
import jwt from 'jsonwebtoken';

// MongoDB connection helper
async function connectDB() {
  try {
    const client = await clientPromise;
    return client.db('courier_system');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

// Verify JWT token
function verifyToken(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7);
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
    return decoded as { userId: string; role: string };
  } catch (error) {
    return null;
  }
}

// POST /api/notifications/send
export async function POST(request: NextRequest) {
  try {
    const user = verifyToken(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only agents and admins can send notifications
    if (!['agent', 'admin'].includes(user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { 
      trackingNumber, 
      type, 
      recipientEmail, 
      recipientPhone, 
      customMessage,
      sendEmail = true,
      sendSMS = true 
    } = body;

    if (!trackingNumber || !type) {
      return NextResponse.json({ 
        error: 'Missing required fields: trackingNumber, type' 
      }, { status: 400 });
    }

    const db = await connectDB();

    // Fetch parcel details from database
    const parcel = await db.collection('parcels').findOne({ trackingNumber });
    if (!parcel) {
      return NextResponse.json({ error: 'Parcel not found' }, { status: 404 });
    }

    // Get agent information if available
    let agent = null;
    if (parcel.assignedAgent) {
      agent = await db.collection('users').findOne({ 
        _id: parcel.assignedAgent,
        role: 'agent'
      });
    }

    // Prepare notification data
    const notificationData: NotificationData = {
      trackingNumber: parcel.trackingNumber,
      recipientName: parcel.recipientName,
      recipientEmail: recipientEmail || parcel.recipientEmail,
      recipientPhone: recipientPhone || parcel.recipientPhone,
      senderName: parcel.senderName,
      status: parcel.status,
      estimatedDelivery: parcel.estimatedDelivery,
      currentLocation: parcel.currentLocation?.address,
      agentName: agent?.name,
      agentPhone: agent?.phone,
    };

    // Send notifications
    const results = { email: false, sms: false };

    if (sendEmail && notificationData.recipientEmail) {
      results.email = await NotificationService.sendEmail(notificationData, type);
    }

    if (sendSMS && notificationData.recipientPhone) {
      results.sms = await NotificationService.sendSMS(notificationData, type);
    }

    // Log notification in database
    await db.collection('notifications').insertOne({
      trackingNumber,
      type,
      recipientEmail: notificationData.recipientEmail,
      recipientPhone: notificationData.recipientPhone,
      sentBy: user.userId,
      sentAt: new Date(),
      results,
      customMessage,
    });

    return NextResponse.json({
      success: true,
      results,
      message: 'Notifications sent successfully',
    });

  } catch (error) {
    console.error('Notification error:', error);
    return NextResponse.json({ 
      error: 'Failed to send notifications' 
    }, { status: 500 });
  }
}

// GET /api/notifications/history
export async function GET(request: NextRequest) {
  try {
    const user = verifyToken(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const trackingNumber = searchParams.get('trackingNumber');
    const limit = parseInt(searchParams.get('limit') || '50');

    const client = await clientPromise;
    const db = client.db('courier_system');

    const query: any = {};
    if (trackingNumber) {
      query.trackingNumber = trackingNumber;
    }

    // If user is not admin, only show their own notifications
    if (user.role !== 'admin') {
      if (user.role === 'agent') {
        query.sentBy = user.userId;
      }
      // For customers, we'd need to implement a different approach
      // as we don't have email in the JWT token
    }

    const notifications = await db.collection('notifications')
      .find(query)
      .sort({ sentAt: -1 })
      .limit(limit)
      .toArray();

    return NextResponse.json({
      success: true,
      notifications,
    });

  } catch (error) {
    console.error('Notification history error:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch notification history' 
    }, { status: 500 });
  }
}
