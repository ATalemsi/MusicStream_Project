package com.youcode.Album_Management.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.youcode.Album_Management.dto.request.SongRequestDTO;
import com.youcode.Album_Management.dto.response.SongResponseDTO;
import com.youcode.Album_Management.service.Interface.SongService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api")
@AllArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
@Slf4j
public class SongController {

    private final SongService songService;


    @GetMapping({"/user/songs", "/admin/songs"})
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<Page<SongResponseDTO>> getAllChansons(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "title") String sortBy) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));
        return ResponseEntity.ok(songService.getAllSongs(pageable));
    }

    @GetMapping({"/user/songs/search", "/admin/songs/search"})
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<Page<SongResponseDTO>> searchChansonsByTitle(
            @RequestParam String title,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "title") String sortBy) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));
        return ResponseEntity.ok(songService.searchSongsByTitle(title, pageable));
    }

    @GetMapping({"/user/songs/album", "/admin/songs/album"})
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<Page<SongResponseDTO>> getSongsByAlbumId(
            @RequestParam String albumId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "title") String sortBy) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));
        return ResponseEntity.ok(songService.getSongsByAlbumId(albumId, pageable));
    }

    @PostMapping("/admin/songs")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SongResponseDTO> createSong(
            @RequestParam(value = "track", required = false) String songJson,
            @RequestParam("audioFile") MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("Audio file is required.");
        }

        String contentType = file.getContentType();
        if (!"audio/mpeg".equals(contentType) && !"audio/wav".equals(contentType)) {
            throw new IllegalArgumentException("Invalid audio file type. Only MP3 and WAV are allowed.");
        }

        log.debug("Raw track JSON: {}", songJson); // Debug raw JSON
        log.debug("Audio file: {}", file.getOriginalFilename());
        ObjectMapper objectMapper = new ObjectMapper();// Debug file name
        SongRequestDTO songRequestDTO = objectMapper.readValue(songJson, SongRequestDTO.class);
        log.debug("SongRequestDTO received: {}", songRequestDTO);
        return ResponseEntity.ok(songService.createSong(songRequestDTO, file));
    }

    @PutMapping("/admin/songs/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SongResponseDTO> updateSong(
            @PathVariable String id,
            @RequestParam("song") String songJson,
            @RequestParam(value = "audioFile") MultipartFile file) throws IOException {
        ObjectMapper objectMapper = new ObjectMapper();
        SongRequestDTO songRequestDTO = objectMapper.readValue(songJson, SongRequestDTO.class);
        return ResponseEntity.ok(songService.updateSong(id, songRequestDTO, file));
    }

    @DeleteMapping("/admin/songs/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteSong(@PathVariable String id) {
        songService.deleteSong(id);
        return ResponseEntity.noContent().build();
    }
}
