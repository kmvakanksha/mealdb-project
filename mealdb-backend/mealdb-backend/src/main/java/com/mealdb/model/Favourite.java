package com.mealdb.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Favourite — JPA entity persisted to MySQL.
 *
 * Stores a lightweight snapshot of a meal so favourites
 * survive even if the external API is unreachable.
 */
@Entity
@Table(name = "favourites",
       uniqueConstraints = @UniqueConstraint(columnNames = "mealId"))
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Favourite {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false, unique = true)
    private String mealId;           // idMeal from TheMealDB

    @NotBlank
    @Column(nullable = false)
    private String mealName;         // strMeal

    private String mealThumb;        // strMealThumb  (image URL)

    private String category;         // strCategory

    private String area;             // strArea

    @Column(updatable = false)
    private LocalDateTime savedAt = LocalDateTime.now();

    @PrePersist
    protected void onCreate() {
        savedAt = LocalDateTime.now();
    }
}
