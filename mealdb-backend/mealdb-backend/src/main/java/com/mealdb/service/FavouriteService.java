package com.mealdb.service;

import com.mealdb.model.Favourite;
import com.mealdb.repository.FavouriteRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * FavouriteService
 *
 * Handles saving, removing, and querying favourite meals
 * in the local MySQL database.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class FavouriteService {

    private final FavouriteRepository repository;

    /** Return all favourites, newest first */
    public List<Favourite> getAll() {
        return repository.findAllByOrderBySavedAtDesc();
    }

    /** Save a new favourite (ignore if already saved) */
    public Favourite save(Favourite favourite) {
        if (repository.existsByMealId(favourite.getMealId())) {
            log.info("Meal '{}' already in favourites, skipping save.", favourite.getMealId());
            return repository.findByMealId(favourite.getMealId()).orElseThrow();
        }
        log.info("Saving favourite: {}", favourite.getMealName());
        return repository.save(favourite);
    }

    /** Remove a favourite by mealId */
    @Transactional
    public void deleteByMealId(String mealId) {
        log.info("Removing favourite mealId={}", mealId);
        repository.deleteByMealId(mealId);
    }

    /** Toggle: adds if not present, removes if already saved */
    @Transactional
    public String toggle(Favourite favourite) {
        if (repository.existsByMealId(favourite.getMealId())) {
            repository.deleteByMealId(favourite.getMealId());
            return "removed";
        } else {
            repository.save(favourite);
            return "added";
        }
    }

    /** Check if a meal is already favourited */
    public boolean isFavourite(String mealId) {
        return repository.existsByMealId(mealId);
    }

    /** Find a single favourite by mealId */
    public Optional<Favourite> findByMealId(String mealId) {
        return repository.findByMealId(mealId);
    }

    /** Search saved favourites by partial meal name */
    public List<Favourite> searchByName(String name) {
        return repository.findByMealNameContainingIgnoreCase(name);
    }
}
