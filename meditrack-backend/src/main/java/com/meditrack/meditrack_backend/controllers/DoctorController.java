package com.meditrack.meditrack_backend.controllers;

import com.meditrack.meditrack_backend.models.DoctorProfile;
import com.meditrack.meditrack_backend.models.DoctorSchedule;
import com.meditrack.meditrack_backend.models.User;
import com.meditrack.meditrack_backend.repository.DoctorProfileRepository;
import com.meditrack.meditrack_backend.repository.DoctorScheduleRepository;
import com.meditrack.meditrack_backend.repository.UserRepository;
import com.meditrack.meditrack_backend.repository.AppointmentRepository;
import com.meditrack.meditrack_backend.repository.NotificationRepository;
import com.meditrack.meditrack_backend.models.Appointment;
import com.meditrack.meditrack_backend.models.Notification;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/doctors")
public class DoctorController {

    private final UserRepository userRepository;
    private final DoctorProfileRepository doctorProfileRepository;
    private final DoctorScheduleRepository doctorScheduleRepository;
    private final AppointmentRepository appointmentRepository;
    private final NotificationRepository notificationRepository;

    public DoctorController(UserRepository userRepository, 
                            DoctorProfileRepository doctorProfileRepository, 
                            DoctorScheduleRepository doctorScheduleRepository,
                            AppointmentRepository appointmentRepository,
                            NotificationRepository notificationRepository) {
        this.userRepository = userRepository;
        this.doctorProfileRepository = doctorProfileRepository;
        this.doctorScheduleRepository = doctorScheduleRepository;
        this.appointmentRepository = appointmentRepository;
        this.notificationRepository = notificationRepository;
    }

    @GetMapping
    public ResponseEntity<?> getAllDoctors() {
        List<User> doctors = userRepository.findAll().stream()
                .filter(u -> u.getRole() != null && "DOCTOR".equals(u.getRole().name()))
                .toList();
                
        List<Map<String, Object>> response = new ArrayList<>();
        for (User user : doctors) {
            DoctorProfile profile = doctorProfileRepository.findByUserId(user.getId()).orElse(null);
            Map<String, Object> map = new HashMap<>();
            map.put("id", user.getId());
            map.put("firstName", user.getFirstName());
            map.put("lastName", user.getLastName());
            if (profile != null) {
                map.put("specialization", profile.getSpecialization());
                map.put("hospital", profile.getHospital());
                map.put("experienceYears", profile.getYearsOfExperience());
                map.put("consultationFee", profile.getConsultationFee());
                map.put("liveStatus", profile.getLiveStatus());
                map.put("about", profile.getAbout());
                map.put("medicalRegistrationNumber", profile.getMedicalRegistrationNumber());
                map.put("doctorId", profile.getDoctorId());
            }
            response.add(map);
        }
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}/slots")
    public ResponseEntity<?> getDoctorSlots(@PathVariable String id) {
        DoctorProfile profile = doctorProfileRepository.findByUserId(id).orElse(null);
        if (profile != null && "Unavailable".equals(profile.getLiveStatus())) {
            // Algorithmic logic to find next closest available slot
            List<DoctorSchedule> allSlots = doctorScheduleRepository.findByDoctorIdAndIsAvailableTrue(id);
            if (allSlots.isEmpty()) {
                return ResponseEntity.ok(Map.of("message", "Doctor is currently unavailable. No future slots found."));
            }
            DoctorSchedule nextSlot = allSlots.get(0); // Assuming ordered, real logic would sort by date/time
            return ResponseEntity.ok(Map.of(
                    "message", "Doctor is unavailable right now.",
                    "nextAvailableSlot", nextSlot
            ));
        }

        List<DoctorSchedule> slots = doctorScheduleRepository.findByDoctorIdAndIsAvailableTrue(id);
        return ResponseEntity.ok(slots);
    }

    @PostMapping("/{id}/slots")
    public ResponseEntity<?> addDoctorSlot(@PathVariable String id, @RequestBody DoctorSchedule schedule) {
        DoctorProfile profile = doctorProfileRepository.findByUserId(id).orElse(null);
        if (profile == null) {
            return ResponseEntity.notFound().build();
        }
        
        List<DoctorSchedule> createdSlots = new ArrayList<>();
        try {
            LocalTime start = LocalTime.parse(schedule.getStartTime());
            LocalTime end = LocalTime.parse(schedule.getEndTime());
            
            while (start.isBefore(end)) {
                LocalTime next = start.plusMinutes(15);
                if (next.isAfter(end)) {
                    next = end;
                }
                DoctorSchedule slot = new DoctorSchedule();
                slot.setDoctorId(id);
                slot.setDate(schedule.getDate());
                slot.setStartTime(start.toString());
                slot.setEndTime(next.toString());
                slot.setIsAvailable(true);
                
                DoctorSchedule saved = doctorScheduleRepository.save(slot);
                createdSlots.add(saved);
                
                start = next;
            }
        } catch (Exception e) {
            schedule.setDoctorId(id);
            schedule.setIsAvailable(true);
            DoctorSchedule saved = doctorScheduleRepository.save(schedule);
            createdSlots.add(saved);
        }
        
        return ResponseEntity.ok(Map.of("message", "Slots added successfully", "slots", createdSlots));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateDoctorStatus(@PathVariable String id, @RequestBody Map<String, String> body) {
        DoctorProfile profile = doctorProfileRepository.findByUserId(id).orElse(null);
        if (profile == null) {
            return ResponseEntity.notFound().build();
        }
        
        String newStatus = body.get("status");
        profile.setLiveStatus(newStatus);
        doctorProfileRepository.save(profile);

        if ("Available".equalsIgnoreCase(newStatus)) {
            // Find appointments for this doctor
            List<Appointment> doctorApts = appointmentRepository.findAll().stream()
                .filter(a -> id.equals(a.getDoctorId()) && ("Scheduled".equals(a.getStatus()) || a.getStatus() == null))
                .toList();
                
            for (Appointment apt : doctorApts) {
                User docUser = userRepository.findById(id).orElse(null);
                String docName = docUser != null ? docUser.getLastName() : "Doctor";

                Notification notif = new Notification();
                notif.setStudentId(apt.getStudentId());
                notif.setTitle("Doctor is Available!");
                notif.setMessage("Dr. " + docName + " is now available for your appointment.");
                notificationRepository.save(notif);
                
                System.out.println("==================================================");
                System.out.println("📧 SIMULATED EMAIL SENT TO STUDENT ID: " + apt.getStudentId());
                System.out.println("Subject: Doctor is Available!");
                System.out.println("Message: Dr. " + docName + " is now available for your appointment.");
                System.out.println("==================================================");
            }
        }

        return ResponseEntity.ok(Map.of("message", "Status updated successfully", "liveStatus", profile.getLiveStatus()));
    }

    @GetMapping("/schedules/all")
    public ResponseEntity<?> getAllSchedules() {
        List<DoctorSchedule> allSchedules = doctorScheduleRepository.findAll();
        return ResponseEntity.ok(allSchedules);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDoctor(@PathVariable String id) {
        if (!userRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        userRepository.deleteById(id);
        
        DoctorProfile profile = doctorProfileRepository.findByUserId(id).orElse(null);
        if (profile != null) {
            doctorProfileRepository.delete(profile);
        }
        
        List<DoctorSchedule> schedules = doctorScheduleRepository.findByDoctorId(id);
        if (schedules != null && !schedules.isEmpty()) {
            doctorScheduleRepository.deleteAll(schedules);
        }
        
        return ResponseEntity.ok(Map.of("message", "Doctor deleted successfully"));
    }
}
