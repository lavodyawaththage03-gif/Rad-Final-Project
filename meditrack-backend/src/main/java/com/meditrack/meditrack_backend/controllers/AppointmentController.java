package com.meditrack.meditrack_backend.controllers;

import com.meditrack.meditrack_backend.models.Appointment;
import com.meditrack.meditrack_backend.models.DoctorSchedule;
import com.meditrack.meditrack_backend.repository.AppointmentRepository;
import com.meditrack.meditrack_backend.repository.DoctorScheduleRepository;
import org.springframework.data.mongodb.MongoTransactionException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

    private final AppointmentRepository appointmentRepository;
    private final DoctorScheduleRepository doctorScheduleRepository;

    public AppointmentController(AppointmentRepository appointmentRepository, DoctorScheduleRepository doctorScheduleRepository) {
        this.appointmentRepository = appointmentRepository;
        this.doctorScheduleRepository = doctorScheduleRepository;
    }

    @PostMapping
    public ResponseEntity<?> createAppointment(@RequestBody com.meditrack.meditrack_backend.dto.AppointmentRequest request) {
        try {
            // Find the schedule slot
            DoctorSchedule slot = doctorScheduleRepository.findById(request.getScheduleId())
                    .orElse(null);

            if (slot == null || !slot.getIsAvailable()) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("error", "This slot is no longer available"));
            }

            // Mark slot as unavailable
            slot.setIsAvailable(false);
            doctorScheduleRepository.save(slot);

            // Create appointment
            Appointment appointment = new Appointment();
            appointment.setDoctorId(request.getDoctorId());
            appointment.setStudentId(request.getStudentId());
            appointment.setAppointmentDate(slot.getDate());
            appointment.setStartTime(slot.getStartTime());
            appointment.setEndTime(slot.getEndTime());
            appointment.setReason(request.getReason());
            appointment.setStatus("Scheduled");
            appointment.setZoomLink("https://zoom.us/j/" + (int)(Math.random() * 1000000000));
            
            Appointment saved = appointmentRepository.save(appointment);
            
            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("success", true, "appointment", saved));
        } catch (MongoTransactionException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("error", "Concurrency conflict. Please try again."));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "Internal server error"));
        }
    }

    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<?> getDoctorAppointments(@PathVariable String doctorId) {
        try {
            java.util.List<Appointment> appointments = appointmentRepository.findByDoctorId(doctorId);
            return ResponseEntity.ok(appointments);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "Internal server error"));
        }
    }
    @GetMapping
    public ResponseEntity<?> getAllAppointments() {
        try {
            java.util.List<Appointment> appointments = appointmentRepository.findAll();
            return ResponseEntity.ok(appointments);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "Internal server error"));
        }
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateAppointmentStatus(@PathVariable String id, @RequestBody Map<String, String> body) {
        try {
            Appointment appointment = appointmentRepository.findById(id).orElse(null);
            if (appointment == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Appointment not found"));
            }
            if (body.containsKey("status")) {
                appointment.setStatus(body.get("status"));
                appointmentRepository.save(appointment);
            }
            return ResponseEntity.ok(Map.of("success", true, "appointment", appointment));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "Internal server error"));
        }
    }
}
