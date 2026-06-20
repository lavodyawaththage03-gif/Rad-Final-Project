package com.meditrack.meditrack_backend.scheduler;

import com.meditrack.meditrack_backend.models.Appointment;
import com.meditrack.meditrack_backend.models.Notification;
import com.meditrack.meditrack_backend.models.User;
import com.meditrack.meditrack_backend.repository.AppointmentRepository;
import com.meditrack.meditrack_backend.repository.NotificationRepository;
import com.meditrack.meditrack_backend.repository.UserRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Component
public class NotificationScheduler {

    private final AppointmentRepository appointmentRepository;
    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    public NotificationScheduler(AppointmentRepository appointmentRepository, NotificationRepository notificationRepository, UserRepository userRepository) {
        this.appointmentRepository = appointmentRepository;
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
    }

    // Runs every minute
    @Scheduled(fixedRate = 60000)
    public void checkUpcomingAppointments() {
        System.out.println("[SCHEDULER] Checking for upcoming appointments...");

        List<Appointment> allAppointments = appointmentRepository.findAll();
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime tenMinsFromNow = now.plusMinutes(10);

        for (Appointment apt : allAppointments) {
            if ("Completed".equals(apt.getStatus()) || "Cancelled".equals(apt.getStatus())) {
                continue;
            }

            try {
                // Parse the appointment date and time
                // Assuming appointmentDate is java.util.Date and startTime is "HH:mm"
                LocalDateTime aptDate = apt.getAppointmentDate().toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime();
                
                String[] timeParts = apt.getStartTime().split(":");
                int hours = Integer.parseInt(timeParts[0]);
                int mins = Integer.parseInt(timeParts[1]);
                
                LocalDateTime aptDateTime = aptDate.withHour(hours).withMinute(mins).withSecond(0).withNano(0);

                // If appointment is exactly between 9 and 10 minutes away
                if (aptDateTime.isAfter(now.plusMinutes(9)) && aptDateTime.isBefore(tenMinsFromNow.plusMinutes(1))) {
                    
                    // Create Notification
                    Notification notif = new Notification();
                    notif.setStudentId(apt.getStudentId());
                    notif.setTitle("Upcoming Appointment Reminder");
                    notif.setMessage("Your appointment is starting in 10 minutes (" + apt.getStartTime() + "). Please get ready!");
                    notificationRepository.save(notif);

                    // Simulate Email
                    User student = userRepository.findById(apt.getStudentId()).orElse(null);
                    if (student != null) {
                        System.out.println("==================================================");
                        System.out.println("📧 SIMULATED EMAIL SENT TO: " + student.getEmail());
                        System.out.println("Subject: Upcoming Appointment Reminder");
                        System.out.println("Message: Dear " + student.getFirstName() + ", your appointment is starting in 10 minutes (" + apt.getStartTime() + "). Please get ready!");
                        System.out.println("==================================================");
                    }
                }
            } catch (Exception e) {
                System.out.println("[SCHEDULER] Error processing appointment: " + apt.getId());
            }
        }
    }
}
