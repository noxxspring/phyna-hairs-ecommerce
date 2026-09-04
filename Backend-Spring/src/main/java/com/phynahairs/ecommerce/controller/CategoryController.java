package com.phynahairs.ecommerce.controller;

import com.phynahairs.ecommerce.exception.ProductException;
import com.phynahairs.ecommerce.model.Category;
import com.phynahairs.ecommerce.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    // Public Get All Categories
    @GetMapping("/")
    public ResponseEntity<List<Category>> getAllCategories() {
        List<Category> categories = categoryService.getAllCategories();
        return new ResponseEntity<>(categories, HttpStatus.OK);
    }

    // Public Get Featured Categories (for Homepage Sections)
    @GetMapping("/featured")
    public ResponseEntity<List<Category>> getFeaturedCategories() {
        List<Category> categories = categoryService.getFeaturedCategories();
        return new ResponseEntity<>(categories, HttpStatus.OK);
    }

    // Public Get Category By ID
    @GetMapping("/{categoryId}")
    public ResponseEntity<Category> getCategoryById(@PathVariable Long categoryId) throws ProductException {
        Category category = categoryService.getCategoryById(categoryId);
        return new ResponseEntity<>(category, HttpStatus.OK);
    }
}