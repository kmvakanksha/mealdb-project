package com.mealdb.controller;

import com.mealdb.model.CategoryApiResponse;
import com.mealdb.model.Meal;
import com.mealdb.service.MealService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * MealController
 *
 * All read-only endpoints that proxy TheMealDB external API.
 *
 * Base path: /api/meals
 *
 * ┌──────────────────────────────────────────────────────────┐
 * │  METHOD  │  PATH                       │  DESCRIPTION    │
 * ├──────────────────────────────────────────────────────────┤
 * │  GET     │  /api/meals/search          │  Search by name │
 * │  GET     │  /api/meals/{id}            │  Meal details   │
 * │  GET     │  /api/meals/category        │  Filter by cat  │
 * │  GET     │  /api/meals/categories      │  All categories │
 * │  GET     │  /api/meals/least-ingr.     │  Hackathon feat │
 * └──────────────────────────────────────────────────────────┘
 */
@Slf4j
@RestController
@RequestMapping("/api/meals")
@CrossOrigin(origins = "*")          // allow React dev server + deployed frontend
@RequiredArgsConstructor
public class MealController {

    private final MealService mealService;

    // ─────────────────────────────────────────────────────────
    // 1. SEARCH MEALS BY NAME
    // GET /api/meals/search?name=chicken
    // ─────────────────────────────────────────────────────────

    /**
     * Search meals by name keyword.
     *
     * @param name the search term (e.g. "chicken", "pasta")
     * @return 200 with list of meals, or 204 if nothing found
     */
    @GetMapping("/search")
    public ResponseEntity<List<Meal>> searchMeals(
            @RequestParam(defaultValue = "") String name) {

        log.info("GET /api/meals/search?name={}", name);
        List<Meal> meals = mealService.searchMealsByName(name);

        if (meals.isEmpty()) {
            return ResponseEntity.noContent().build();   // 204
        }
        return ResponseEntity.ok(meals);                 // 200
    }

    // ─────────────────────────────────────────────────────────
    // 2. GET MEAL DETAILS BY ID
    // GET /api/meals/{id}
    // ─────────────────────────────────────────────────────────

    /**
     * Fetch full details (ingredients, instructions, YouTube link…)
     * for a single meal identified by its TheMealDB id.
     *
     * @param id TheMealDB meal id  (e.g. "52772")
     * @return 200 with Meal, or 404 if not found
     */
    @GetMapping("/{id}")
    public ResponseEntity<Meal> getMealById(@PathVariable String id) {
        log.info("GET /api/meals/{}", id);
        return mealService.getMealById(id)
                .map(ResponseEntity::ok)                 // 200
                .orElse(ResponseEntity.notFound().build()); // 404
    }

    // ─────────────────────────────────────────────────────────
    // 3. FILTER BY CATEGORY
    // GET /api/meals/category?name=Seafood
    // ─────────────────────────────────────────────────────────

    /**
     * List all meals in a given category.
     * Results are summary objects (id, name, thumb only).
     * Use GET /api/meals/{id} to get full details for each.
     *
     * @param name category name (e.g. "Seafood", "Vegetarian")
     * @return 200 with list, 204 if category is empty/unknown
     */
    @GetMapping("/category")
    public ResponseEntity<List<Meal>> filterByCategory(
            @RequestParam String name) {

        log.info("GET /api/meals/category?name={}", name);
        List<Meal> meals = mealService.filterByCategory(name);

        if (meals.isEmpty()) {
            return ResponseEntity.noContent().build();   // 204
        }
        return ResponseEntity.ok(meals);                 // 200
    }

    // ─────────────────────────────────────────────────────────
    // 4. LIST ALL CATEGORIES
    // GET /api/meals/categories
    // ─────────────────────────────────────────────────────────

    /**
     * Returns all available meal categories with thumbnails
     * and descriptions — used to populate the filter dropdown.
     */
    @GetMapping("/categories")
    public ResponseEntity<CategoryApiResponse> getCategories() {
        log.info("GET /api/meals/categories");
        CategoryApiResponse categories = mealService.getCategories();
        return ResponseEntity.ok(categories);
    }

    // ─────────────────────────────────────────────────────────
    // 5. HACKATHON FEATURE — MEAL WITH LEAST INGREDIENTS
    // GET /api/meals/least-ingredients?s=Arrabiata
    // ─────────────────────────────────────────────────────────

    /**
     * Among all meals matching the search term, returns the one
     * that requires the fewest ingredients.
     *
     * Default search term is "Arrabiata" as specified in the brief.
     *
     * Response: { "meal": {...}, "ingredientCount": 5 }
     *
     * @param s search term (defaults to "Arrabiata")
     * @return 200 with meal + count, 204 if no meals found
     */
    @GetMapping("/least-ingredients")
    public ResponseEntity<Map<String, Object>> getMealWithLeastIngredients(
            @RequestParam(defaultValue = "Arrabiata") String s) {

        log.info("GET /api/meals/least-ingredients?s={}", s);
        Map<String, Object> result = mealService.getMealWithLeastIngredients(s);

        if (result.isEmpty()) {
            return ResponseEntity.noContent().build();   // 204
        }
        return ResponseEntity.ok(result);                // 200
    }
}
