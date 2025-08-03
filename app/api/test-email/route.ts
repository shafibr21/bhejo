import { NextRequest, NextResponse } from 'next/server';
import { NotificationService, NotificationData } from '@/services/notificationService';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Test notification data
    const testData: NotificationData = {
      trackingNumber: 'TEST123456',
      recipientName: 'Test User',
      recipientEmail: email,
      senderName: 'Test Sender',
      status: 'picked_up',
      estimatedDelivery: 'Tomorrow 2-4 PM',
      agentName: 'John Doe',
      agentPhone: '+1234567890',
    };

    // Send test email
    const result = await NotificationService.sendEmail(testData, 'pickup_confirmation');

    if (result) {
      return NextResponse.json({ 
        success: true, 
        message: `Test email sent successfully to ${email}` 
      });
    } else {
      return NextResponse.json({ 
        success: false, 
        message: 'Failed to send test email' 
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Test email error:', error);
    return NextResponse.json({ 
      error: 'Failed to send test email',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
