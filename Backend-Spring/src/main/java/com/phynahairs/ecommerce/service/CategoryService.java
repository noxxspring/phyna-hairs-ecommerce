package com.phynahairs.ecommerce.service;

import com.phynahairs.ecommerce.exception.ProductException;
import com.phynahairs.ecommerce.model.Category;

import java.util.List;

public interface CategoryService {
    Category createCategory(Category category) throws ProductException;
    Category updateCategory(Long categoryId, Category category) throws ProductException;
    void deleteCategory(Long categoryId) throws ProductException;
    Category getCategoryById(Long categoryId) throws ProductException;
    List<Category> getAllCategories();
    List<Category> getTopLevelCategories();
    List<Category> getFeaturedCategories();
}