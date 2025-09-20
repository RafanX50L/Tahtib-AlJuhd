import { transporter } from "../config/mail.config";
import { env } from "../config/env.config";
import logger from "./logger.utils";

export const sendOtpEmail = async (email: string, otp: string) => {
  try {
    const mailOptions = {
      from: `"Tahtib ALJuhd" <${env.SENDER_EMAIL}>`,
      to: email,
      subject: "Tahtib ALJuhd OTP Verificaiton",
      html: `
                <h1>OTP Verification</h1>
                <p>Your OTP is: ${otp}</p>
                <p>Use this OTP to verify your email. Do not share it with anyone.</p><br />
                <p>If you did not request this verification, you can ignore this email.</p>
                <p>~ Tahtib ALJuhd</p>
                  `,
    };
    await transporter.sendMail(mailOptions);
    logger.info("Email sent successfully to:", email);
  } catch (error) {
    logger.error("Error sending email:", error);
    throw new Error("Error sending email");
  }
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  try {
    const resetLink = `${env.RESET_PASS_URL}?token=${token}`;
    const mailOptions = {
      from: `"Tahtib ALJuhd" <${env.SENDER_EMAIL}>`,
      to: email,
      subject: "Password Reset Request",
      html: `
                <h1>Password Reset Request</h1>
                <p>Click the link below to reset your password:</p>
                <a href="${resetLink}">Reset Password</a><br />
                <p>If you did not request this, please ignore this email.</p>
                <p>~ Tahtib ALJuhd</p>
                  `,
    };
    await transporter.sendMail(mailOptions);
    logger.info("Password reset email sent successfully to:", email);
  } catch (error) {
    logger.error("Error sending password reset email:", error);
    throw new Error("Error sending password reset email");
  }
};

export const sendInterviewScheduleEmail = async (
  email: string,
  trainerName: string,
  date: string | Date,
  time: string | Date,
) => {
  try {
    const mailOptions = {
      from: `"Tahtib ALJuhd" <${env.SENDER_EMAIL}>`,
      to: email,
      subject: "Your Interview Has Been Scheduled",
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Online Interview Schedule - Tahtib ALJuhd</title>
            <style>
                body {
                    margin: 0;
                    padding: 0;
                    font-family: 'Arial', 'Helvetica', sans-serif;
                    line-height: 1.6;
                    color: #333333;
                    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #1a1a2e 100%);
                    min-height: 100vh;
                    padding: 20px 0;
                }
                
                .email-container {
                    max-width: 600px;
                    margin: 0 auto;
                    background-color: #ffffff;
                    border-radius: 12px;
                    overflow: hidden;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
                }
                
                .header {
                    background: linear-gradient(135deg, #2c3e50, #34495e);
                    color: #ffffff;
                    padding: 40px 30px;
                    text-align: center;
                }
                
                .header h1 {
                    margin: 0;
                    font-size: 32px;
                    font-weight: bold;
                    letter-spacing: 2px;
                }
                
                .header .tagline {
                    margin: 10px 0 0 0;
                    font-size: 16px;
                    opacity: 0.95;
                    font-weight: 500;
                }
                
                .content {
                    padding: 40px;
                }
                
                .greeting {
                    font-size: 18px;
                    margin-bottom: 25px;
                    color: #2c3e50;
                    font-weight: 500;
                }
                
                .main-text {
                    font-size: 16px;
                    margin-bottom: 20px;
                    text-align: justify;
                }
                
                .schedule-info {
                    background: linear-gradient(135deg, #f8f9fa, #e9ecef);
                    border: 1px solid #d4af37;
                    padding: 25px;
                    margin: 25px 0;
                    border-radius: 8px;
                    text-align: center;
                }
                
                .schedule-title {
                    font-size: 20px;
                    font-weight: 600;
                    color: #2c3e50;
                    margin-bottom: 20px;
                }
                
                .schedule-details {
                    display: flex;
                    justify-content: space-around;
                    align-items: center;
                    flex-wrap: wrap;
                    gap: 20px;
                }
                
                .detail-item {
                    text-align: center;
                    min-width: 120px;
                }
                
                .detail-icon {
                    font-size: 24px;
                    margin-bottom: 8px;
                }
                
                .detail-label {
                    font-size: 14px;
                    color: #666;
                    margin-bottom: 5px;
                    text-transform: uppercase;
                    font-weight: 500;
                }
                
                .detail-value {
                    font-size: 18px;
                    font-weight: 600;
                    color: #2c3e50;
                }
                
                .meeting-link {
                    background: linear-gradient(135deg, #3498db, #2980b9);
                    color: white;
                    padding: 15px 25px;
                    margin: 20px 0;
                    border-radius: 8px;
                    text-align: center;
                    border: none;
                    font-size: 16px;
                    font-weight: 600;
                    text-decoration: none;
                    display: inline-block;
                    transition: all 0.3s ease;
                    box-shadow: 0 4px 15px rgba(52, 152, 219, 0.3);
                }
                
                .meeting-link:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(52, 152, 219, 0.4);
                }
                
                .tech-requirements {
                    background-color: #e8f4fd;
                    border-left: 4px solid #3498db;
                    padding: 20px;
                    margin: 25px 0;
                    border-radius: 0 4px 4px 0;
                }
                
                .tech-requirements strong {
                    color: #2c3e50;
                    font-size: 16px;
                }
                
                .tech-text {
                    margin-top: 10px;
                    font-size: 15px;
                    color: #555555;
                }
                
                .reminder-section {
                    background-color: #f8f9fa;
                    border-left: 4px solid #d4af37;
                    padding: 20px;
                    margin: 25px 0;
                    border-radius: 0 4px 4px 0;
                }
                
                .reminder-section strong {
                    color: #2c3e50;
                    font-size: 16px;
                }
                
                .reminder-text {
                    margin-top: 10px;
                    font-size: 15px;
                    color: #555555;
                }
                
                .signature-section {
                    margin-top: 40px;
                    padding-top: 25px;
                    border-top: 1px solid #e0e0e0;
                }
                
                .signature {
                    font-size: 16px;
                    color: #2c3e50;
                    margin-bottom: 5px;
                }
                
                .team-name {
                    font-weight: 600;
                    color: #34495e;
                }
                
                .footer {
                    background-color: #2c3e50;
                    color: white;
                    padding: 25px;
                    text-align: center;
                    border-top: 1px solid #34495e;
                    font-size: 13px;
                }
                
                .divider {
                    height: 2px;
                    background: linear-gradient(to right, #2c3e50, #d4af37, #2c3e50);
                    margin: 30px 0;
                    border: none;
                }
                
                @media (max-width: 640px) {
                    .email-container {
                        margin: 20px;
                        max-width: none;
                    }
                    
                    .header, .content {
                        padding: 25px 20px;
                    }
                    
                    .header h1 {
                        font-size: 24px;
                    }
                    
                    .greeting {
                        font-size: 17px;
                    }
                    
                    .main-text {
                        font-size: 15px;
                    }
                    
                    .schedule-details {
                        flex-direction: column;
                        gap: 15px;
                    }
                    
                    .detail-item {
                        min-width: auto;
                    }
                }
            </style>
        </head>
        <body>
            <div class="email-container">
                <div class="header">
                    <h1>TAHTIB ALJUHD</h1>
                    <p class="tagline">💪 Fitness Excellence & Training 🏋️‍♂️</p>
                </div>
                
                <div class="content">
                    <div class="greeting">
                        Hey [Candidate Name], 💪
                    </div>
                    
                    <p class="main-text">
                        Congratulations ${trainerName}! We're excited to invite you for an online interview to join the Tahtib ALJuhd fitness team. We were impressed with your application and would love to learn more about you and your fitness expertise through a virtual meeting.
                    </p>
                    
                    <div class="schedule-info">
                        <div class="schedule-title">💻 Your Online Interview Details</div>
                        <div class="schedule-details">
                            <div class="detail-item">
                                <div class="detail-icon">📅</div>
                                <div class="detail-label">Date</div>
                                <div class="detail-value">${date}</div>
                            </div>
                            <div class="detail-item">
                                <div class="detail-icon">🕐</div>
                                <div class="detail-label">Time</div>
                                <div class="detail-value">${time}</div>
                            </div>
                        </div>
                        
                        <div style="margin-top: 20px;">
                            <a href="[Meeting Link]" class="meeting-link">
                                🔗 Join Interview Meeting
                            </a>
                            <div style="font-size: 13px; color: #666; margin-top: 10px;">
                                Meeting ID: [Meeting ID] | Password: [Password if required]
                            </div>
                        </div>
                    </div>
                    
                    <div class="tech-requirements">
                        <div>
                            <strong>💻 Technical Requirements:</strong>
                        </div>
                        <div class="tech-text">
                            • Stable internet connection (minimum 10 Mbps recommended)<br>
                            • Computer/laptop with working camera and microphone<br>
                            • Quiet, well-lit space for the interview<br>
                            • Test your audio/video 15 minutes before the meeting<br>
                            • Have a backup phone number ready in case of technical issues
                        </div>
                    </div>
                    
                    <div class="reminder-section">
                        <div>
                            <strong>🎯 Interview Preparation:</strong>
                        </div>
                        <div class="reminder-text">
                            • Have digital copies of your certifications and resume ready to share<br>
                            • Join the meeting 5-10 minutes early to test your setup<br>
                            • Dress professionally (business casual recommended)<br>
                            • Prepare to discuss your training philosophy and experience<br>
                            • Be ready to demonstrate exercises on camera if requested<br>
                            • Ensure good lighting and a professional background
                        </div>
                    </div>
                    
                    <hr class="divider">
                    
                    <p class="main-text">
                        If you have any questions about the online interview, technical difficulties, or need to reschedule, please contact us as soon as possible. We're looking forward to meeting you virtually and discussing how you can contribute to our fitness community! 🚀
                    </p>
                    
                    <div class="signature-section">
                        <p class="signature">Looking Forward to Meeting You Online! 💪</p>
                        <p class="team-name">The Tahtib ALJuhd Fitness Team</p>
                    </div>
                </div>
                
                <div class="footer">
                    <p>🏋️‍♂️ Empowering fitness journeys, one session at a time! 🏋️‍♀️</p>
                    <p>© 2025 Tahtib ALJuhd Fitness. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);
    logger.info("Interview schedule email sent successfully to:", email);
  } catch (error) {
    logger.error("Error sending interview schedule email:", error);
    throw new Error("Error sending interview schedule email");
  }
};

export const sendTrainerApprovalEmail = async (
  email: string,
  trainerName: string
) => {
  try {
    const mailOptions = {
      from: `"Tahtib ALJuhd" <${env.SENDER_EMAIL}>`,
      to: email,
      subject: "Congratulations! Your Application Has Been Approved",
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome to the Tahtib ALJuhd Fitness Team!</title>
            <style>
                body {
                    margin: 0;
                    padding: 0;
                    font-family: 'Arial', 'Helvetica', sans-serif;
                    line-height: 1.6;
                    color: #333333;
                    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #1a1a2e 100%);
                    min-height: 100vh;
                    padding: 20px 0;
                }
                
                .email-container {
                    max-width: 600px;
                    margin: 0 auto;
                    background-color: #ffffff;
                    border-radius: 12px;
                    overflow: hidden;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
                }
                
                .header {
                    background: linear-gradient(135deg, #2c3e50, #34495e);
                    color: #ffffff;
                    padding: 40px 30px;
                    text-align: center;
                    position: relative;
                    overflow: hidden;
                }
                
                .header::before {
                    content: '';
                    position: absolute;
                    top: -50%;
                    left: -50%;
                    width: 200%;
                    height: 200%;
                    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="2" fill="rgba(212,175,55,0.1)"/></svg>') repeat;
                    animation: float 20s infinite linear;
                }
                
                @keyframes float {
                    0% { transform: translateX(-50px) translateY(-50px); }
                    100% { transform: translateX(50px) translateY(50px); }
                }
                
                .header h1 {
                    margin: 0;
                    font-size: 32px;
                    font-weight: bold;
                    letter-spacing: 2px;
                    position: relative;
                    z-index: 1;
                }
                
                .header .tagline {
                    margin: 10px 0 0 0;
                    font-size: 16px;
                    opacity: 0.95;
                    font-weight: 500;
                    position: relative;
                    z-index: 1;
                }
                
                .celebration-banner {
                    background: linear-gradient(45deg, #d4af37, #b8860b);
                    color: white;
                    text-align: center;
                    padding: 25px;
                    font-size: 22px;
                    font-weight: bold;
                    text-transform: uppercase;
                    letter-spacing: 3px;
                }
                
                .content {
                    padding: 40px;
                }
                
                .greeting {
                    font-size: 20px;
                    margin-bottom: 25px;
                    color: #2c3e50;
                    font-weight: 600;
                }
                
                .main-text {
                    font-size: 16px;
                    margin-bottom: 20px;
                    line-height: 1.8;
                }
                
                .approval-section {
                    background: linear-gradient(135deg, #f8f9fa, #e9ecef);
                    border: 3px solid #d4af37;
                    padding: 30px;
                    margin: 30px 0;
                    border-radius: 12px;
                    text-align: center;
                    position: relative;
                }
                
                .approval-section::before {
                    content: '💪';
                    position: absolute;
                    top: -15px;
                    left: 50%;
                    transform: translateX(-50%);
                    background: white;
                    padding: 10px;
                    border-radius: 50%;
                    font-size: 24px;
                    border: 3px solid #d4af37;
                }
                
                .approval-section .congrats {
                    font-size: 28px;
                    color: #2c3e50;
                    font-weight: bold;
                    margin: 20px 0 15px 0;
                    text-transform: uppercase;
                    letter-spacing: 2px;
                }
                
                .approval-section .status {
                    font-size: 18px;
                    color: #34495e;
                    margin-bottom: 10px;
                    font-weight: 500;
                }
                
                .fitness-stats {
                    display: flex;
                    justify-content: space-around;
                    margin: 25px 0;
                    padding: 20px;
                    background: #f8f9fa;
                    border-radius: 8px;
                }
                
                .stat-item {
                    text-align: center;
                    flex: 1;
                }
                
                .stat-icon {
                    font-size: 28px;
                    margin-bottom: 8px;
                }
                
                .stat-label {
                    font-size: 12px;
                    color: #666;
                    text-transform: uppercase;
                    font-weight: bold;
                }
                
                .cta-section {
                    background: linear-gradient(135deg, #2c3e50, #34495e);
                    color: white;
                    padding: 35px;
                    margin: 30px 0;
                    border-radius: 12px;
                    text-align: center;
                }
                
                .cta-text {
                    font-size: 18px;
                    margin-bottom: 25px;
                    font-weight: 500;
                }
                
                .cta-button {
                    display: inline-block;
                    background: linear-gradient(135deg, #d4af37, #b8860b);
                    color: white;
                    padding: 18px 40px;
                    text-decoration: none;
                    border-radius: 50px;
                    font-size: 16px;
                    font-weight: bold;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    box-shadow: 0 6px 20px rgba(212, 175, 55, 0.4);
                    transition: all 0.3s ease;
                }
                
                .cta-button:hover {
                    background: linear-gradient(135deg, #b8860b, #9a6914);
                    box-shadow: 0 8px 25px rgba(212, 175, 55, 0.5);
                    transform: translateY(-3px);
                }
                
                .welcome-section {
                    background: linear-gradient(135deg, #f8f9fa, #e9ecef);
                    border-left: 5px solid #d4af37;
                    padding: 25px;
                    margin: 25px 0;
                    border-radius: 0 8px 8px 0;
                }
                
                .welcome-section h3 {
                    color: #2c3e50;
                    margin-top: 0;
                    font-size: 20px;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                
                .welcome-text {
                    color: #34495e;
                    font-size: 16px;
                    line-height: 1.8;
                }
                
                .signature-section {
                    margin-top: 40px;
                    padding-top: 25px;
                    border-top: 2px solid #d4af37;
                    text-align: center;
                }
                
                .signature {
                    font-size: 16px;
                    color: #2c3e50;
                    margin-bottom: 5px;
                    font-weight: 500;
                }
                
                .team-name {
                    font-weight: bold;
                    color: #2c3e50;
                    font-size: 18px;
                }
                
                .footer {
                    background: linear-gradient(135deg, #2c3e50, #34495e);
                    color: white;
                    padding: 25px;
                    text-align: center;
                    font-size: 13px;
                }
                
                .divider {
                    height: 3px;
                    background: linear-gradient(to right, #2c3e50, #d4af37, #2c3e50);
                    margin: 30px 0;
                    border: none;
                    border-radius: 2px;
                }
                
                @media (max-width: 640px) {
                    .email-container {
                        margin: 10px;
                        max-width: none;
                    }
                    
                    .header, .content {
                        padding: 25px 20px;
                    }
                    
                    .header h1 {
                        font-size: 26px;
                    }
                    
                    .celebration-banner {
                        font-size: 18px;
                        padding: 20px;
                        letter-spacing: 2px;
                    }
                    
                    .greeting {
                        font-size: 18px;
                    }
                    
                    .main-text {
                        font-size: 15px;
                    }
                    
                    .approval-section .congrats {
                        font-size: 22px;
                    }
                    
                    .fitness-stats {
                        flex-direction: column;
                        gap: 15px;
                    }
                    
                    .cta-button {
                        padding: 15px 30px;
                        font-size: 14px;
                    }
                }
            </style>
        </head>
        <body>
            <div class="email-container">
                <div class="header">
                    <h1>TAHTIB ALJUHD</h1>
                    <p class="tagline">💪 Fitness Excellence & Training 🏋️‍♂️</p>
                </div>
                
                <div class="celebration-banner">
                    🎉 Welcome to the Team! 🏆
                </div>
                
                <div class="content">
                    <div class="greeting">
                        Hey ${trainerName || '[Trainer Name]'}! 💪
                    </div>
                    
                    <p class="main-text">
                        <strong>Incredible news!</strong> We've reviewed your fitness trainer application, and we're absolutely pumped to have you join the Tahtib ALJuhd fitness family! Your qualifications and passion for fitness have truly impressed our team.
                    </p>
                    
                    <div class="approval-section">
                        <div class="congrats">
                            You're In! 🔥
                        </div>
                        <div class="status">
                            Your fitness trainer application has been <strong>APPROVED</strong>
                        </div>
                    </div>
                    
                    <div class="fitness-stats">
                        <div class="stat-item">
                            <div class="stat-icon">🏋️‍♂️</div>
                            <div class="stat-label">Ready to Train</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-icon">🎯</div>
                            <div class="stat-label">Goal Focused</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-icon">⚡</div>
                            <div class="stat-label">High Energy</div>
                        </div>
                    </div>
                    
                    <p class="main-text">
                        You're now part of a community of elite fitness professionals who are dedicated to transforming lives through fitness. Get ready to inspire, motivate, and help our members achieve their fitness goals!
                    </p>
                    
                    <div class="cta-section">
                        <div class="cta-text">
                            🚀 Ready to start your fitness journey with us?
                        </div>
                        <a href="${env.TRAINER_DASHBOARD_URL || '#'}" class="cta-button">
                            Launch Your Dashboard
                        </a>
                    </div>
                    
                    <div class="welcome-section">
                        <h3>🌟 Welcome to Team Tahtib ALJuhd! 🌟</h3>
                        <div class="welcome-text">
                            As a certified Tahtib ALJuhd trainer, you're joining a movement dedicated to fitness excellence. Whether you're guiding someone through their first workout or helping athletes reach peak performance, you're making a real difference in people's lives. Let's crush those fitness goals together!
                        </div>
                    </div>
                    
                    <hr class="divider">
                    
                    <p class="main-text">
                        We can't wait to see the amazing transformations you'll help create. Welcome aboard, and let's make fitness happen! 🔥
                    </p>
                    
                    <div class="signature-section">
                        <p class="signature">Stay Strong & Keep Pushing! 💪</p>
                        <p class="team-name">The Tahtib ALJuhd Fitness Team</p>
                    </div>
                </div>
                
                <div class="footer">
                    <p>🏋️‍♂️ Ready to transform lives through fitness? Let's do this together! 🏋️‍♀️</p>
                    <p>© 2025 Tahtib ALJuhd Fitness. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
      `
    };

    await transporter.sendMail(mailOptions);
    logger.info("Trainer approval email sent successfully to:", email);
  } catch (error) {
    logger.error("Error sending trainer approval email:", error);
    throw new Error("Error sending trainer approval email");
  }
};

export const sendTrainerRejectionEmail = async (
  email: string,
  trainerName: string,
) => {
  try {
    const mailOptions = {
      from: `"Tahtib ALJuhd" <${env.SENDER_EMAIL}>`,
      to: email,
      subject: "Trainer Application Status – Rejected",
      html:`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Application Status - Tahtib ALJuhd</title>
            <style>
                body {
                    margin: 0;
                    padding: 0;
                    font-family: 'Arial', 'Helvetica', sans-serif;
                    line-height: 1.6;
                    color: #333333;
                    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #1a1a2e 100%);
                    min-height: 100vh;
                    padding: 20px 0;
                }
                
                .email-container {
                    max-width: 600px;
                    margin: 0 auto;
                    background-color: #ffffff;
                    border-radius: 12px;
                    overflow: hidden;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
                }
                
                .header {
                    background: linear-gradient(135deg, #2c3e50, #34495e);
                    color: #ffffff;
                    padding: 40px 30px;
                    text-align: center;
                }
                
                .header h1 {
                    margin: 0;
                    font-size: 32px;
                    font-weight: bold;
                    letter-spacing: 2px;
                }
                
                .header .tagline {
                    margin: 10px 0 0 0;
                    font-size: 16px;
                    opacity: 0.95;
                    font-weight: 500;
                }
                
                .content {
                    padding: 40px;
                }
                
                .greeting {
                    font-size: 18px;
                    margin-bottom: 25px;
                    color: #2c3e50;
                    font-weight: 500;
                }
                
                .main-text {
                    font-size: 16px;
                    margin-bottom: 20px;
                    text-align: justify;
                }
                
                .reason-section {
                    background-color: #f8f9fa;
                    border-left: 4px solid #d4af37;
                    padding: 20px;
                    margin: 25px 0;
                    border-radius: 0 4px 4px 0;
                }
                
                .reason-section strong {
                    color: #2c3e50;
                    font-size: 16px;
                }
                
                .reason-text {
                    margin-top: 10px;
                    font-size: 15px;
                    color: #555555;
                }
                
                .encouragement {
                    background: linear-gradient(135deg, #f8f9fa, #e9ecef);
                    border: 1px solid #d4af37;
                    padding: 20px;
                    margin: 25px 0;
                    border-radius: 4px;
                    font-size: 15px;
                    color: #2c3e50;
                }
                
                .signature-section {
                    margin-top: 40px;
                    padding-top: 25px;
                    border-top: 1px solid #e0e0e0;
                }
                
                .signature {
                    font-size: 16px;
                    color: #2c3e50;
                    margin-bottom: 5px;
                }
                
                .team-name {
                    font-weight: 600;
                    color: #34495e;
                }
                
                .footer {
                    background-color: #2c3e50;
                    color: white;
                    padding: 25px;
                    text-align: center;
                    border-top: 1px solid #34495e;
                    font-size: 13px;
                }
                
                .divider {
                    height: 2px;
                    background: linear-gradient(to right, #2c3e50, #d4af37, #2c3e50);
                    margin: 30px 0;
                    border: none;
                }
                
                @media (max-width: 640px) {
                    .email-container {
                        margin: 20px;
                        max-width: none;
                    }
                    
                    .header, .content {
                        padding: 25px 20px;
                    }
                    
                    .header h1 {
                        font-size: 24px;
                    }
                    
                    .greeting {
                        font-size: 17px;
                    }
                    
                    .main-text {
                        font-size: 15px;
                    }
                }
            </style>
        </head>
        <body>
            <div class="email-container">
                <div class="header">
                    <h1>TAHTIB ALJUHD</h1>
                    <p class="tagline">💪 Fitness Excellence & Training 🏋️‍♂️</p>
                </div>
                
                <div class="content">
                    <div class="greeting">
                        Hey ${trainerName || '[Trainer Name]'}, 💪
                    </div>
                    
                    <p class="main-text">
                        Thank you for your interest in joining the Tahtib ALJuhd fitness team! We really appreciate the time and effort you put into your trainer application.
                    </p>
                    
                    <p class="main-text">
                        After careful review of all applications, we have decided to move forward with other candidates whose experience and specializations most closely match our current program needs.
                    </p>
                    
              
                    
                    <div class="encouragement">
                        <strong>Keep Pushing Forward! 🚀</strong> This decision doesn't reflect your potential as a fitness professional. The fitness industry is always evolving, and we encourage you to keep developing your skills and consider applying for future opportunities. We'll keep your application on file for upcoming positions that might be a better fit.
                    </div>
                    
                    <hr class="divider">
                    
                    <p class="main-text">
                        We truly appreciate your passion for fitness and wish you continued success in your fitness journey and career!
                    </p>
                    
                    <div class="signature-section">
                        <p class="signature">Stay Strong & Keep Training! 💪</p>
                        <p class="team-name">The Tahtib ALJuhd Fitness Team</p>
                    </div>
                </div>
                
                <div class="footer">
                    <p>🏋️‍♂️ Keep pushing your limits and stay connected with the fitness community! 🏋️‍♀️</p>
                    <p>© 2025 Tahtib ALJuhd Fitness. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
      `
    };

    await transporter.sendMail(mailOptions);
    logger.info("Trainer rejection email sent successfully to:", email);
  } catch (error) {
    logger.error("Error sending trainer rejection email:", error);
    throw new Error("Error sending trainer rejection email");
  }
};
