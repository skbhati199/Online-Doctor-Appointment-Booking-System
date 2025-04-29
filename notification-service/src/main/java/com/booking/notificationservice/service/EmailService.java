package com.booking.notificationservice.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    @Autowired
    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    /**
     * Send a simple email notification
     * 
     * @param to recipient email address
     * @param subject email subject
     * @param body email content
     */
    public void sendEmail(String to, String subject, String body) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(subject);
        message.setText(body);
        
        mailSender.send(message);
    }
    
    /**
     * Send appointment confirmation email
     * 
     * @param to recipient email address
     * @param doctorName name of the doctor
     * @param appointmentDate date of the appointment
     * @param appointmentTime time of the appointment
     */
    public void sendAppointmentConfirmation(String to, String doctorName, String appointmentDate, String appointmentTime) {
        String subject = "Appointment Confirmation";
        String body = String.format(
                "Dear Patient,\n\n" +
                "Your appointment with Dr. %s has been confirmed for %s at %s.\n\n" +
                "Please arrive 15 minutes before your scheduled appointment time.\n\n" +
                "If you need to reschedule or cancel, please do so at least 24 hours in advance.\n\n" +
                "Thank you,\nOnline Appointment Booking System",
                doctorName, appointmentDate, appointmentTime);
        
        sendEmail(to, subject, body);
    }
    
    /**
     * Send appointment reminder email
     * 
     * @param to recipient email address
     * @param doctorName name of the doctor
     * @param appointmentDate date of the appointment
     * @param appointmentTime time of the appointment
     */
    public void sendAppointmentReminder(String to, String doctorName, String appointmentDate, String appointmentTime) {
        String subject = "Appointment Reminder";
        String body = String.format(
                "Dear Patient,\n\n" +
                "This is a reminder for your upcoming appointment with Dr. %s scheduled for %s at %s.\n\n" +
                "Please arrive 15 minutes before your scheduled appointment time.\n\n" +
                "Thank you,\nOnline Appointment Booking System",
                doctorName, appointmentDate, appointmentTime);
        
        sendEmail(to, subject, body);
    }
    
    /**
     * Send appointment cancellation email
     * 
     * @param to recipient email address
     * @param doctorName name of the doctor
     * @param appointmentDate date of the appointment
     * @param appointmentTime time of the appointment
     */
    public void sendAppointmentCancellation(String to, String doctorName, String appointmentDate, String appointmentTime) {
        String subject = "Appointment Cancellation";
        String body = String.format(
                "Dear Patient,\n\n" +
                "Your appointment with Dr. %s scheduled for %s at %s has been cancelled.\n\n" +
                "If you did not request this cancellation, please contact our support team.\n\n" +
                "Thank you,\nOnline Appointment Booking System",
                doctorName, appointmentDate, appointmentTime);
        
        sendEmail(to, subject, body);
    }
}