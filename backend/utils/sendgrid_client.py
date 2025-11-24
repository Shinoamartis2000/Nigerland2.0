import os
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail, Email, To, Content
import logging

logger = logging.getLogger(__name__)

SENDGRID_API_KEY = os.getenv('SENDGRID_API_KEY')
SENDGRID_FROM_EMAIL = os.getenv('SENDGRID_FROM_EMAIL', 'info@nigerlandconsult.com')
SENDGRID_FROM_NAME = os.getenv('SENDGRID_FROM_NAME', 'Nigerland Consult Limited')

class SendGridClient:
    def __init__(self):
        self.client = SendGridAPIClient(SENDGRID_API_KEY)
        self.from_email = Email(SENDGRID_FROM_EMAIL, SENDGRID_FROM_NAME)
    
    def send_registration_confirmation(self, to_email: str, name: str, conference: str, registration_id: str):
        """Send conference registration confirmation email"""
        subject = f"Registration Confirmation - {conference}"
        
        html_content = f"""
        <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                    <div style="background-color: #2563eb; padding: 20px; text-align: center;">
                        <h1 style="color: white; margin: 0;">NIGERLAND CONSULT LIMITED</h1>
                    </div>
                    <div style="padding: 30px; background-color: #f9fafb;">
                        <h2 style="color: #2563eb;">Registration Confirmation</h2>
                        <p>Dear {name},</p>
                        <p>Thank you for registering for <strong>{conference}</strong>.</p>
                        <p>Your registration ID is: <strong>{registration_id}</strong></p>
                        <p>We will send you payment instructions shortly.</p>
                        <p>If you have any questions, please don't hesitate to contact us.</p>
                        <p>Best regards,<br>Nigerland Consult Limited Team</p>
                    </div>
                    <div style="background-color: #1f2937; padding: 20px; text-align: center; color: white; font-size: 12px;">
                        <p>© 2025 Nigerland Consult Limited. All rights reserved.</p>
                    </div>
                </div>
            </body>
        </html>
        """
        
        return self._send_email(to_email, subject, html_content)
    
    def send_payment_confirmation(self, to_email: str, name: str, conference: str, amount: float, reference: str):
        """Send payment confirmation email"""
        subject = f"Payment Confirmed - {conference}"
        
        html_content = f"""
        <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                    <div style="background-color: #2563eb; padding: 20px; text-align: center;">
                        <h1 style="color: white; margin: 0;">NIGERLAND CONSULT LIMITED</h1>
                    </div>
                    <div style="padding: 30px; background-color: #f9fafb;">
                        <h2 style="color: #10b981;">Payment Confirmed!</h2>
                        <p>Dear {name},</p>
                        <p>We have received your payment for <strong>{conference}</strong>.</p>
                        <div style="background-color: white; padding: 15px; border-left: 4px solid #2563eb; margin: 20px 0;">
                            <p style="margin: 5px 0;"><strong>Amount Paid:</strong> ₦{amount:,.2f}</p>
                            <p style="margin: 5px 0;"><strong>Reference:</strong> {reference}</p>
                        </div>
                        <p>You will receive further details about the conference closer to the date.</p>
                        <p>Best regards,<br>Nigerland Consult Limited Team</p>
                    </div>
                    <div style="background-color: #1f2937; padding: 20px; text-align: center; color: white; font-size: 12px;">
                        <p>© 2025 Nigerland Consult Limited. All rights reserved.</p>
                    </div>
                </div>
            </body>
        </html>
        """
        
        return self._send_email(to_email, subject, html_content)
    
    def send_contact_confirmation(self, to_email: str, name: str, subject: str):
        """Send contact form confirmation email"""
        email_subject = "We Received Your Message"
        
        html_content = f"""
        <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                    <div style="background-color: #2563eb; padding: 20px; text-align: center;">
                        <h1 style="color: white; margin: 0;">NIGERLAND CONSULT LIMITED</h1>
                    </div>
                    <div style="padding: 30px; background-color: #f9fafb;">
                        <h2 style="color: #2563eb;">Message Received</h2>
                        <p>Dear {name},</p>
                        <p>Thank you for contacting us regarding: <strong>{subject}</strong></p>
                        <p>We have received your message and will respond to you shortly.</p>
                        <p>Best regards,<br>Nigerland Consult Limited Team</p>
                    </div>
                    <div style="background-color: #1f2937; padding: 20px; text-align: center; color: white; font-size: 12px;">
                        <p>© 2025 Nigerland Consult Limited. All rights reserved.</p>
                    </div>
                </div>
            </body>
        </html>
        """
        
        return self._send_email(to_email, email_subject, html_content)
    
    def send_book_purchase_confirmation(self, to_email: str, name: str, book_title: str, download_url: str, amount: float, reference: str):
        """Send book purchase confirmation with download link"""
        subject = f"Your Book Purchase - {book_title}"
        
        html_content = f"""
        <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                    <div style="background-color: #2563eb; padding: 20px; text-align: center;">
                        <h1 style="color: white; margin: 0;">NIGERLAND BOOKS FOUNDATION</h1>
                    </div>
                    <div style="padding: 30px; background-color: #f9fafb;">
                        <h2 style="color: #10b981;">Thank You for Your Purchase!</h2>
                        <p>Dear {name},</p>
                        <p>Thank you for purchasing <strong>{book_title}</strong> from Nigerland Books Foundation.</p>
                        <div style="background-color: white; padding: 15px; border-left: 4px solid #2563eb; margin: 20px 0;">
                            <p style="margin: 5px 0;"><strong>Book:</strong> {book_title}</p>
                            <p style="margin: 5px 0;"><strong>Amount Paid:</strong> ₦{amount:,.2f}</p>
                            <p style="margin: 5px 0;"><strong>Reference:</strong> {reference}</p>
                        </div>
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="{download_url}" style="background-color: #2563eb; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">Download Your Book</a>
                        </div>
                        <p style="font-size: 12px; color: #666;">Note: This download link is available for your use. Please save the book to your device.</p>
                        <p>Best regards,<br>Nigerland Books Foundation Team</p>
                    </div>
                    <div style="background-color: #1f2937; padding: 20px; text-align: center; color: white; font-size: 12px;">
                        <p>© 2025 Nigerland Consult Limited. All rights reserved.</p>
                    </div>
                </div>
            </body>
        </html>
        """
        
        return self._send_email(to_email, subject, html_content)
    
    def send_morelife_assessment_confirmation(self, to_email: str, name: str, assessment_id: str):
        """Send MoreLife assessment confirmation"""
        subject = "MoreLife Assessment Received"
        
        html_content = f"""
        <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                    <div style="background-color: #2563eb; padding: 20px; text-align: center;">
                        <h1 style="color: white; margin: 0;">NIGERLAND MORELIFE SESSIONS</h1>
                    </div>
                    <div style="padding: 30px; background-color: #f9fafb;">
                        <h2 style="color: #2563eb;">Assessment Received</h2>
                        <p>Dear {name},</p>
                        <p>Thank you for submitting your MoreLife assessment. Your assessment ID is: <strong>{assessment_id}</strong></p>
                        <p>Our team will review your information and send you payment details shortly.</p>
                        <p>Best regards,<br>Nigerland MoreLife Team</p>
                    </div>
                </div>
            </body>
        </html>
        """
        return self._send_email(to_email, subject, html_content)
    
    def send_morelife_payment_confirmation(self, to_email: str, name: str, amount: float, reference: str):
        """Send MoreLife payment confirmation"""
        subject = "MoreLife Session Payment Confirmed"
        
        html_content = f"""
        <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                    <div style="background-color: #2563eb; padding: 20px; text-align: center;">
                        <h1 style="color: white; margin: 0;">NIGERLAND MORELIFE SESSIONS</h1>
                    </div>
                    <div style="padding: 30px; background-color: #f9fafb;">
                        <h2 style="color: #10b981;">Payment Confirmed!</h2>
                        <p>Dear {name},</p>
                        <p>Your payment of <strong>₦{amount:,.2f}</strong> has been confirmed.</p>
                        <p>We will contact you shortly to schedule your MoreLife sessions.</p>
                        <p>Best regards,<br>Nigerland MoreLife Team</p>
                    </div>
                </div>
            </body>
        </html>
        """
        return self._send_email(to_email, subject, html_content)
    
    def send_training_enrollment_confirmation(self, to_email: str, name: str, program_title: str, enrollment_id: str):
        """Send training enrollment confirmation"""
        subject = f"Training Enrollment: {program_title}"
        
        html_content = f"""
        <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                    <div style="background-color: #2563eb; padding: 20px; text-align: center;">
                        <h1 style="color: white; margin: 0;">NIGERLAND TRAINING PROGRAMS</h1>
                    </div>
                    <div style="padding: 30px; background-color: #f9fafb;">
                        <h2 style="color: #2563eb;">Enrollment Confirmed</h2>
                        <p>Dear {name},</p>
                        <p>Thank you for enrolling in <strong>{program_title}</strong>.</p>
                        <p>Your enrollment ID is: <strong>{enrollment_id}</strong></p>
                        <p>We will send you payment details and program schedule shortly.</p>
                        <p>Best regards,<br>Nigerland Training Team</p>
                    </div>
                </div>
            </body>
        </html>
        """
        return self._send_email(to_email, subject, html_content)
    
    def send_admin_notification(self, notification_type: str, data: dict):
        """Send notification to admin"""
        admin_email = SENDGRID_FROM_EMAIL
        
        if notification_type == "new_registration":
            subject = f"New Registration: {data.get('conference')}"
            html_content = f"""
            <html>
                <body style="font-family: Arial, sans-serif;">
                    <h2>New Conference Registration</h2>
                    <p><strong>Name:</strong> {data.get('name')}</p>
                    <p><strong>Email:</strong> {data.get('email')}</p>
                    <p><strong>Conference:</strong> {data.get('conference')}</p>
                    <p><strong>Registration ID:</strong> {data.get('registration_id')}</p>
                </body>
            </html>
            """
        elif notification_type == "new_contact":
            subject = f"New Contact Message: {data.get('subject')}"
            html_content = f"""
            <html>
                <body style="font-family: Arial, sans-serif;">
                    <h2>New Contact Message</h2>
                    <p><strong>From:</strong> {data.get('name')}</p>
                    <p><strong>Email:</strong> {data.get('email')}</p>
                    <p><strong>Subject:</strong> {data.get('subject')}</p>
                    <p><strong>Message:</strong><br>{data.get('message')}</p>
                </body>
            </html>
            """
        else:
            return {"status": False, "message": "Unknown notification type"}
        
        return self._send_email(admin_email, subject, html_content)
    
    def _send_email(self, to_email: str, subject: str, html_content: str):
        """Internal method to send email"""
        try:
            message = Mail(
                from_email=self.from_email,
                to_emails=To(to_email),
                subject=subject,
                html_content=Content("text/html", html_content)
            )
            
            response = self.client.send(message)
            logger.info(f"Email sent successfully to {to_email}")
            return {"status": True, "status_code": response.status_code}
        except Exception as e:
            logger.error(f"SendGrid send email error: {e}")
            return {"status": False, "message": str(e)}

sendgrid_client = SendGridClient()
