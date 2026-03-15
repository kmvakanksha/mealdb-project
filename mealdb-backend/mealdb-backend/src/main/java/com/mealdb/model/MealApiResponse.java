package com.mealdb.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

import java.util.List;

/**
 * Wrapper that mirrors TheMealDB JSON envelope:
 * { "meals": [ {...}, {...} ] }
 *
 * Used by RestTemplate / Jackson to deserialize API responses.
 */
@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class MealApiResponse {
    private List<Meal> meals;   // null when no results found
}
