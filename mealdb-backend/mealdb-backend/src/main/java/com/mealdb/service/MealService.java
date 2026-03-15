package com.mealdb.service;

import com.mealdb.model.CategoryApiResponse;
import com.mealdb.model.Meal;
import com.mealdb.model.MealApiResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.*;

/**
 * MealService
 *
 * All communication with https://www.themealdb.com/api/json/v1/1
 * is centralised here.  Controllers stay thin; all logic lives
 * in this service layer.
 */
@Slf4j
@Service
public class MealService {

    @Value("${mealdb.api.base-url}")
    private String baseUrl;

    // RestTemplate is thread-safe; one instance is fine
    private final RestTemplate restTemplate = new RestTemplate();

    // ─────────────────────────────────────────────────────────
    // 1. SEARCH MEALS BY NAME
    // GET /search.php?s={name}
    // ─────────────────────────────────────────────────────────

    /**
     * Search meals by name keyword.
     * Returns an empty list (never null) if nothing is found.
     */
    public List<Meal> searchMealsByName(String name) {
        String url = UriComponentsBuilder
                .fromHttpUrl(baseUrl + "/search.php")
                .queryParam("s", name)
                .toUriString();

        log.debug("Searching meals with name='{}' → {}", name, url);

        MealApiResponse response = restTemplate.getForObject(url, MealApiResponse.class);
        return extractMeals(response);
    }

    // ─────────────────────────────────────────────────────────
    // 2. GET MEAL DETAILS BY ID
    // GET /lookup.php?i={id}
    // ─────────────────────────────────────────────────────────

    /**
     * Fetch full details for a single meal by its TheMealDB id.
     * Returns Optional.empty() when the id is not found.
     */
    public Optional<Meal> getMealById(String id) {
        String url = UriComponentsBuilder
                .fromHttpUrl(baseUrl + "/lookup.php")
                .queryParam("i", id)
                .toUriString();

        log.debug("Fetching meal details id='{}' → {}", id, url);

        MealApiResponse response = restTemplate.getForObject(url, MealApiResponse.class);
        List<Meal> meals = extractMeals(response);
        return meals.isEmpty() ? Optional.empty() : Optional.of(meals.get(0));
    }

    // ─────────────────────────────────────────────────────────
    // 3. FILTER BY CATEGORY
    // GET /filter.php?c={category}
    // ─────────────────────────────────────────────────────────

    /**
     * List meals belonging to a category (returns summary objects,
     * NOT full details — caller must call getMealById for details).
     */
    public List<Meal> filterByCategory(String category) {
        String url = UriComponentsBuilder
                .fromHttpUrl(baseUrl + "/filter.php")
                .queryParam("c", category)
                .toUriString();

        log.debug("Filtering by category='{}' → {}", category, url);

        MealApiResponse response = restTemplate.getForObject(url, MealApiResponse.class);
        return extractMeals(response);
    }

    // ─────────────────────────────────────────────────────────
    // 4. LIST ALL CATEGORIES
    // GET /categories.php
    // ─────────────────────────────────────────────────────────

    public CategoryApiResponse getCategories() {
        String url = baseUrl + "/categories.php";
        log.debug("Fetching categories → {}", url);
        return restTemplate.getForObject(url, CategoryApiResponse.class);
    }

    // ─────────────────────────────────────────────────────────
    // 5. LEAST-INGREDIENTS FEATURE (Hackathon core requirement)
    // Searches a term, returns the meal needing fewest ingredients
    // ─────────────────────────────────────────────────────────

    /**
     * Among all meals matching {@code searchTerm}, returns the one
     * with the smallest number of non-blank ingredients.
     *
     * @param searchTerm keyword passed to /search.php?s=
     * @return map with "meal" and "ingredientCount" keys, or empty map
     */
    public Map<String, Object> getMealWithLeastIngredients(String searchTerm) {
        List<Meal> meals = searchMealsByName(searchTerm);

        if (meals.isEmpty()) {
            log.warn("No meals found for searchTerm='{}'", searchTerm);
            return Collections.emptyMap();
        }

        Meal leastMeal = meals.stream()
                .min(Comparator.comparingInt(Meal::countIngredients))
                .orElseThrow();

        log.debug("Least-ingredient meal: '{}' with {} ingredients",
                leastMeal.getStrMeal(), leastMeal.countIngredients());

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("meal", leastMeal);
        result.put("ingredientCount", leastMeal.countIngredients());
        return result;
    }

    // ─────────────────────────────────────────────────────────
    // PRIVATE HELPERS
    // ─────────────────────────────────────────────────────────

    /** Safely unwrap the meals list; never returns null. */
    private List<Meal> extractMeals(MealApiResponse response) {
        if (response == null || response.getMeals() == null) {
            return Collections.emptyList();
        }
        return response.getMeals();
    }
}
