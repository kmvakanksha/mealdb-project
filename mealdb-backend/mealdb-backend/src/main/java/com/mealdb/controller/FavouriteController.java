package com.mealdb.controller;

import com.mealdb.model.Favourite;
import com.mealdb.service.FavouriteService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * FavouriteController
 *
 * CRUD endpoints for meals saved to the local MySQL database.
 *
 * Base path: /api/favourites
 *
 * ┌──────────────────────────────────────────────────────────┐
 * │  METHOD  │  PATH                    │  DESCRIPTION       │
 * ├──────────────────────────────────────────────────────────┤
 * │  GET     │  /api/favourites         │  All favourites    │
 * │  POST    │  /api/favourites         │  Save favourite    │
 * │  DELETE  │  /api/favourites/{id}    │  Remove favourite  │
 * │  POST    │  /api/favourites/toggle  │  Toggle favourite  │
 * │  GET     │  /api/favourites/check/{id} │ Is it saved?   │
 * └──────────────────────────────────────────────────────────┘
 */
@Slf4j
@RestController
@RequestMapping("/api/favourites")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class FavouriteController {

    private final FavouriteService favouriteService;

    // ─────────────────────────────────────────────────────────
    // GET all favourites
    // ─────────────────────────────────────────────────────────

    @GetMapping
    public ResponseEntity<List<Favourite>> getAll() {
        log.info("GET /api/favourites");
        return ResponseEntity.ok(favouriteService.getAll());
    }

    // ─────────────────────────────────────────────────────────
    // POST — save a favourite
    // Body: { "mealId":"52772", "mealName":"...", "mealThumb":"...", "category":"..." }
    // ─────────────────────────────────────────────────────────

    @PostMapping
    public ResponseEntity<Favourite> save(@Valid @RequestBody Favourite favourite) {
        log.info("POST /api/favourites — mealId={}", favourite.getMealId());
        Favourite saved = favouriteService.save(favourite);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    // ─────────────────────────────────────────────────────────
    // DELETE — remove a favourite by mealId
    // ─────────────────────────────────────────────────────────

    @DeleteMapping("/{mealId}")
    public ResponseEntity<Void> remove(@PathVariable String mealId) {
        log.info("DELETE /api/favourites/{}", mealId);
        favouriteService.deleteByMealId(mealId);
        return ResponseEntity.noContent().build();   // 204
    }

    // ─────────────────────────────────────────────────────────
    // POST /toggle — add if not saved, remove if already saved
    // ─────────────────────────────────────────────────────────

    @PostMapping("/toggle")
    public ResponseEntity<Map<String, String>> toggle(
            @Valid @RequestBody Favourite favourite) {

        log.info("POST /api/favourites/toggle — mealId={}", favourite.getMealId());
        String action = favouriteService.toggle(favourite);
        return ResponseEntity.ok(Map.of("action", action, "mealId", favourite.getMealId()));
    }

    // ─────────────────────────────────────────────────────────
    // GET /check/{mealId} — is this meal already favourited?
    // ─────────────────────────────────────────────────────────

    @GetMapping("/check/{mealId}")
    public ResponseEntity<Map<String, Boolean>> check(@PathVariable String mealId) {
        boolean saved = favouriteService.isFavourite(mealId);
        return ResponseEntity.ok(Map.of("isFavourite", saved));
    }
}
