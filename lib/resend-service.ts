import { Resend } from 'resend'

const resend = process.env.RESEND_API_KEY 
  ? new Resend(process.env.RESEND_API_KEY)
  : new Resend('test-key')

export async function sendOTPEmail(email: string, otp: string) {
  try {
    const result = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
      to: email,
      subject: 'Your Pioneer1 Financial Credit Union Security Code',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5; }
              .container { max-width: 600px; margin: 0 auto; background-color: white; padding: 40px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); }
              .header { text-align: center; margin-bottom: 30px; }
              .logo { font-size: 28px; font-weight: bold; color: #1e3a8a; margin-bottom: 10px; }
              .title { color: #1e3a8a; font-size: 24px; margin-bottom: 20px; text-align: center; }
              .content { color: #333; line-height: 1.6; margin-bottom: 30px; }
              .otp-box { background-color: #f0f4ff; border-left: 4px solid #1e3a8a; padding: 20px; margin: 20px 0; border-radius: 4px; text-align: center; }
              .otp-code { font-size: 32px; font-weight: bold; color: #1e3a8a; letter-spacing: 4px; font-family: 'Courier New', monospace; }
              .footer { color: #666; font-size: 12px; text-align: center; margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px; }
              .security-note { background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 4px; color: #856404; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <div class="logo">🏦</div>
                <div style="color: #1e3a8a; font-size: 16px; font-weight: 600;">PIONEER1 FINANCIAL CREDIT UNION</div>
              </div>
              
              <h1 class="title">Security Code Required</h1>
              
              <div class="content">
                <p>Hello,</p>
                <p>We received a request to access your Pioneer1 Financial Credit Union account. To protect your security, please use the code below to verify your identity:</p>
              </div>
              
              <div class="otp-box">
                <div class="otp-code">${otp}</div>
                <p style="color: #666; margin-top: 10px;">This code expires in 10 minutes</p>
              </div>
              
              <div class="security-note">
                <strong>⚠️ Security Notice:</strong> Never share this code with anyone. Our team will never ask for this code via email or phone.
              </div>
              
              <div class="content">
                <p>If you didn't request this code, please ignore this email or contact our support team immediately.</p>
              </div>
              
              <div class="footer">
                <p>Pioneer1 Financial Credit Union | Secure Banking Since 1995</p>
                <p style="margin-top: 10px; color: #999;">This is a secure automated message. Please do not reply to this email.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    })

    if (result.error) {
      console.error('Resend error:', result.error)
      throw result.error
    }

    return result
  } catch (error) {
    console.error('Failed to send OTP email:', error)
    throw error
  }
}

export async function sendDepositNotificationEmail(email: string, amount: number, transactionId?: string) {
  try {
    const result = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
      to: email,
      subject: 'Deposit Received - Pioneer1 Financial Credit Union',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5; }
              .container { max-width: 600px; margin: 0 auto; background-color: white; padding: 40px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); }
              .header { text-align: center; margin-bottom: 30px; }
              .logo { font-size: 28px; font-weight: bold; color: #1e3a8a; margin-bottom: 10px; }
              .amount-box { background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); color: white; padding: 30px; border-radius: 8px; text-align: center; margin: 20px 0; }
              .amount { font-size: 36px; font-weight: bold; margin: 10px 0; }
              .details { background-color: #f0f4ff; padding: 15px; margin: 10px 0; border-radius: 4px; }
              .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #ddd; }
              .detail-row:last-child { border-bottom: none; }
              .footer { color: #666; font-size: 12px; text-align: center; margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <div class="logo">🏦</div>
                <div style="color: #1e3a8a; font-size: 16px; font-weight: 600;">PIONEER1 FINANCIAL CREDIT UNION</div>
              </div>
              
              <h1 style="color: #1e3a8a; text-align: center;">Deposit Received</h1>
              
              <div class="amount-box">
                <p style="margin: 0; opacity: 0.9;">Amount Deposited</p>
                <div class="amount">$${amount.toFixed(2)}</div>
              </div>
              
              <div class="details">
                <div class="detail-row">
                  <span><strong>Status:</strong></span>
                  <span style="color: #10b981; font-weight: bold;">✓ Completed</span>
                </div>
                <div class="detail-row">
                  <span><strong>Date:</strong></span>
                  <span>${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</span>
                </div>
                ${transactionId ? `<div class="detail-row">
                  <span><strong>Transaction ID:</strong></span>
                  <span>${transactionId}</span>
                </div>` : ''}
              </div>
              
              <p style="text-align: center; color: #666; margin: 20px 0;">Your deposit has been successfully processed and added to your account. Your updated balance is now available in your dashboard.</p>
              
              <p style="text-align: center; margin: 20px 0;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" style="background-color: #1e3a8a; color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; display: inline-block;">View Dashboard</a>
              </p>
              
              <div class="footer">
                <p>Pioneer1 Financial Credit Union | Secure Banking Since 1995</p>
                <p style="margin-top: 10px; color: #999;">This is an automated message. Please do not reply to this email.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    })

    if (result.error) {
      console.error('Resend error:', result.error)
      throw result.error
    }

    return result
  } catch (error) {
    console.error('Failed to send deposit email:', error)
    throw error
  }
}

export async function sendWithdrawalNotificationEmail(email: string, amount: number, destination: string, transactionId?: string) {
  try {
    const result = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
      to: email,
      subject: 'Withdrawal Processed - Pioneer1 Financial Credit Union',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5; }
              .container { max-width: 600px; margin: 0 auto; background-color: white; padding: 40px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); }
              .header { text-align: center; margin-bottom: 30px; }
              .logo { font-size: 28px; font-weight: bold; color: #1e3a8a; margin-bottom: 10px; }
              .amount-box { background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); color: white; padding: 30px; border-radius: 8px; text-align: center; margin: 20px 0; }
              .amount { font-size: 36px; font-weight: bold; margin: 10px 0; }
              .details { background-color: #f0f4ff; padding: 15px; margin: 10px 0; border-radius: 4px; }
              .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #ddd; }
              .detail-row:last-child { border-bottom: none; }
              .footer { color: #666; font-size: 12px; text-align: center; margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <div class="logo">🏦</div>
                <div style="color: #1e3a8a; font-size: 16px; font-weight: 600;">PIONEER1 FINANCIAL CREDIT UNION</div>
              </div>
              
              <h1 style="color: #1e3a8a; text-align: center;">Withdrawal Processed</h1>
              
              <div class="amount-box">
                <p style="margin: 0; opacity: 0.9;">Amount Withdrawn</p>
                <div class="amount">$${amount.toFixed(2)}</div>
              </div>
              
              <div class="details">
                <div class="detail-row">
                  <span><strong>Status:</strong></span>
                  <span style="color: #10b981; font-weight: bold;">✓ Completed</span>
                </div>
                <div class="detail-row">
                  <span><strong>Destination:</strong></span>
                  <span>${destination}</span>
                </div>
                <div class="detail-row">
                  <span><strong>Date:</strong></span>
                  <span>${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</span>
                </div>
                ${transactionId ? `<div class="detail-row">
                  <span><strong>Transaction ID:</strong></span>
                  <span>${transactionId}</span>
                </div>` : ''}
              </div>
              
              <p style="text-align: center; color: #666; margin: 20px 0;">Your withdrawal request has been successfully processed. The funds should appear in your designated account within 1-3 business days.</p>
              
              <p style="text-align: center; margin: 20px 0;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" style="background-color: #1e3a8a; color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; display: inline-block;">View Dashboard</a>
              </p>
              
              <div class="footer">
                <p>Pioneer1 Financial Credit Union | Secure Banking Since 1995</p>
                <p style="margin-top: 10px; color: #999;">This is an automated message. Please do not reply to this email.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    })

    if (result.error) {
      console.error('Resend error:', result.error)
      throw result.error
    }

    return result
  } catch (error) {
    console.error('Failed to send withdrawal email:', error)
    throw error
  }
}

export async function sendPasswordChangeEmail(email: string, name?: string) {
  try {
    const result = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
      to: email,
      subject: 'Password Changed - Pioneer1 Financial Credit Union',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5; }
              .container { max-width: 600px; margin: 0 auto; background-color: white; padding: 40px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); }
              .header { text-align: center; margin-bottom: 30px; }
              .logo { font-size: 28px; font-weight: bold; color: #1e3a8a; margin-bottom: 10px; }
              .alert-box { background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 4px; color: #856404; }
              .success-box { background-color: #d1fae5; border-left: 4px solid #10b981; padding: 15px; margin: 20px 0; border-radius: 4px; color: #065f46; }
              .footer { color: #666; font-size: 12px; text-align: center; margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <div class="logo">🏦</div>
                <div style="color: #1e3a8a; font-size: 16px; font-weight: 600;">PIONEER1 FINANCIAL CREDIT UNION</div>
              </div>
              
              <h1 style="color: #1e3a8a; text-align: center;">Password Changed</h1>
              
              <div class="success-box">
                <strong>✓ Success:</strong> Your Pioneer1 account password has been successfully changed.
              </div>
              
              <p style="color: #333; line-height: 1.6;">Hello${name ? ` ${name}` : ''},</p>
              
              <p style="color: #333; line-height: 1.6;">This email confirms that your account password was changed on <strong>${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</strong>.</p>
              
              <div class="alert-box">
                <strong>⚠️ Security Alert:</strong> If you did not make this change, please contact our support team immediately at support@pioneer1fcu.com or call 1-800-PIONEER1.
              </div>
              
              <p style="color: #333; line-height: 1.6;"><strong>For your security:</strong></p>
              <ul style="color: #333; line-height: 1.8;">
                <li>Keep your new password secure and private</li>
                <li>Never share your password with anyone</li>
                <li>Use a strong, unique password</li>
                <li>Log out after each banking session</li>
              </ul>
              
              <p style="text-align: center; margin: 20px 0;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" style="background-color: #1e3a8a; color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; display: inline-block;">Go to Dashboard</a>
              </p>
              
              <div class="footer">
                <p>Pioneer1 Financial Credit Union | Secure Banking Since 1995</p>
                <p style="margin-top: 10px; color: #999;">This is an automated message. Please do not reply to this email.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    })

    if (result.error) {
      console.error('Resend error:', result.error)
      throw result.error
    }

    return result
  } catch (error) {
    console.error('Failed to send password change email:', error)
    throw error
  }
}

export async function sendWelcomeEmail(email: string, name: string) {
  try {
    const result = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
      to: email,
      subject: 'Welcome to Pioneer1 Financial Credit Union',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5; }
              .container { max-width: 600px; margin: 0 auto; background-color: white; padding: 40px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); }
              .header { text-align: center; margin-bottom: 30px; }
              .logo { font-size: 28px; font-weight: bold; color: #1e3a8a; margin-bottom: 10px; }
              .title { color: #1e3a8a; font-size: 24px; margin-bottom: 20px; text-align: center; }
              .content { color: #333; line-height: 1.6; margin-bottom: 30px; }
              .feature { background-color: #f0f4ff; padding: 15px; margin: 10px 0; border-radius: 4px; }
              .feature-title { color: #1e3a8a; font-weight: bold; }
              .cta-button { background-color: #1e3a8a; color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; display: inline-block; margin: 20px 0; }
              .footer { color: #666; font-size: 12px; text-align: center; margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <div class="logo">🏦</div>
                <div style="color: #1e3a8a; font-size: 16px; font-weight: 600;">PIONEER1 FINANCIAL CREDIT UNION</div>
              </div>
              
              <h1 class="title">Welcome, ${name}!</h1>
              
              <div class="content">
                <p>Your account has been successfully created. You can now access all of Pioneer1 Financial Credit Union's banking services.</p>
              </div>
              
              <div style="background-color: #f0f4ff; padding: 20px; border-radius: 4px; margin: 20px 0;">
                <p style="color: #1e3a8a; font-weight: bold; margin-bottom: 15px;">Your account features include:</p>
                <div class="feature">
                  <div class="feature-title">💰 Account Management</div>
                  <p>View your balance and transaction history anytime</p>
                </div>
                <div class="feature">
                  <div class="feature-title">₿ Crypto Deposits</div>
                  <p>Secure Bitcoin deposits with real-time tracking</p>
                </div>
                <div class="feature">
                  <div class="feature-title">💸 Withdrawals</div>
                  <p>Easy and secure withdrawal requests</p>
                </div>
                <div class="feature">
                  <div class="feature-title">🔒 Security</div>
                  <p>Industry-leading encryption and protection</p>
                </div>
              </div>
              
              <p style="text-align: center;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" class="cta-button">Access Your Dashboard</a>
              </p>
              
              <div class="content">
                <p>If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
              </div>
              
              <div class="footer">
                <p>Pioneer1 Financial Credit Union | Secure Banking Since 1995</p>
                <p style="margin-top: 10px; color: #999;">This is an automated message. Please do not reply to this email.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    })

    if (result.error) {
      console.error('Resend error:', result.error)
      throw result.error
    }

    return result
  } catch (error) {
    console.error('Failed to send welcome email:', error)
    throw error
  }
}
