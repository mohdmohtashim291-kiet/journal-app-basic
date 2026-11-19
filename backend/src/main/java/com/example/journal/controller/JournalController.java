package com.example.journal.controller;

import com.example.journal.model.JournalEntry;
import com.example.journal.repository.JournalRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/journals")
@CrossOrigin(origins = "http://localhost:5173")
public class JournalController {

    private final JournalRepository journalRepository;

    public JournalController(JournalRepository journalRepository) {
        this.journalRepository = journalRepository;
    }

    @GetMapping
    public List<JournalEntry> getAllEntries() {
        return journalRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<JournalEntry> getEntryById(@PathVariable String id) {
        return journalRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<JournalEntry> createEntry(@RequestBody JournalEntry entry) {
        entry.setId(null);
        JournalEntry saved = journalRepository.save(entry);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<JournalEntry> updateEntry(
            @PathVariable String id,
            @RequestBody JournalEntry updatedEntry) {

        return journalRepository.findById(id)
                .map(existing -> {
                    existing.setTitle(updatedEntry.getTitle());
                    existing.setContent(updatedEntry.getContent());
                    return ResponseEntity.ok(journalRepository.save(existing));
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEntry(@PathVariable String id) {
        if (!journalRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        journalRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
