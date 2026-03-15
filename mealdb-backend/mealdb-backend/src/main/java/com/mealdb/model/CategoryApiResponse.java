package com.mealdb.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;

/** Wrapper for /categories.php response */
@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class CategoryApiResponse {
    private List<Category> categories;

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Category {
        @JsonProperty("idCategory")      private String idCategory;
        @JsonProperty("strCategory")     private String strCategory;
        @JsonProperty("strCategoryThumb") private String strCategoryThumb;
        @JsonProperty("strCategoryDescription") private String strCategoryDescription;
    }
}
