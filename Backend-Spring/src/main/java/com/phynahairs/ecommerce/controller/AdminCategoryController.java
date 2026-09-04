package com.phynahairs.ecommerce.controller;

import com.phynahairs.ecommerce.exception.ProductException;
import com.phynahairs.ecommerce.model.Category;
import com.phynahairs.ecommerce.response.ApiResponse;
import com.phynahairs.ecommerce.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/categories")
@RequiredArgsConstructor
public class AdminCategoryController {

    private final CategoryService categoryService;

    // 1. Admin Create Category with Cloudinary Image
    @PostMapping("/")
    public ResponseEntity<Category> createCategoryHandler(@RequestBody Category category) throws ProductException {
        Category createdCategory = categoryService.createCategory(category);
        return new ResponseEntity<>(createdCategory, HttpStatus.CREATED);
    }

    // 2. Admin Update Category
    @PutMapping("/{categoryId}")
    public ResponseEntity<Category> updateCategoryHandler(
            @PathVariable Long categoryId,
            @RequestBody Category category) throws ProductException {
        Category updatedCategory = categoryService.updateCategory(categoryId, category);
        return new ResponseEntity<>(updatedCategory, HttpStatus.OK);
    }

    // 3. Admin Delete Category
    @DeleteMapping("/{categoryId}")
    public ResponseEntity<ApiResponse> deleteCategoryHandler(@PathVariable Long categoryId) throws ProductException {
        categoryService.deleteCategory(categoryId);
        ApiResponse res = new ApiResponse("Category deleted successfully", true);
        return new ResponseEntity<>(res, HttpStatus.OK);
    }

    // 4. Admin Get All Categories
    @GetMapping("/")
    public ResponseEntity<List<Category>> getAllCategoriesHandler() {
        List<Category> categories = categoryService.getAllCategories();
        return new ResponseEntity<>(categories, HttpStatus.OK);
    }
}