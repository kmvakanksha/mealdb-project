package com.mealdb.repository;

import com.mealdb.model.Favourite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FavouriteRepository extends JpaRepository<Favourite, Long> {

    /** Find by TheMealDB meal id */
    Optional<Favourite> findByMealId(String mealId);

    /** Check existence without loading entity */
    boolean existsByMealId(String mealId);

    /** Delete by meal id (used in toggle endpoint) */
    void deleteByMealId(String mealId);

    /** All favourites ordered newest first */
    List<Favourite> findAllByOrderBySavedAtDesc();

    /** Search saved favourites by partial name */
    List<Favourite> findByMealNameContainingIgnoreCase(String name);
}
