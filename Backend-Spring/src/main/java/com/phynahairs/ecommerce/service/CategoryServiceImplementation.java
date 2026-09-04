package com.phynahairs.ecommerce.service;

import com.phynahairs.ecommerce.exception.ProductException;
import com.phynahairs.ecommerce.model.Category;
import com.phynahairs.ecommerce.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CategoryServiceImplementation implements CategoryService {

    private final CategoryRepository categoryRepository;

    @Override
    public Category createCategory(Category category) throws ProductException {
        Category existing = categoryRepository.findByName(category.getName());
        if (existing != null) {
            throw new ProductException("Category already exists with name: " + category.getName());
        }
        return categoryRepository.save(category);
    }

    @Override
    public Category updateCategory(Long categoryId, Category category) throws ProductException {
        Category existing = getCategoryById(categoryId);

        if (category.getName() != null) existing.setName(category.getName());
        if (category.getDescription() != null) existing.setDescription(category.getDescription());
        if (category.getImageUrl() != null) existing.setImageUrl(category.getImageUrl());
        if (category.getImagePublicId() != null) existing.setImagePublicId(category.getImagePublicId());
        existing.setFeatured(category.isFeatured());

        return categoryRepository.save(existing);
    }

    @Override
    public void deleteCategory(Long categoryId) throws ProductException {
        Category category = getCategoryById(categoryId);
        categoryRepository.delete(category);
    }

    @Override
    public Category getCategoryById(Long categoryId) throws ProductException {
        Optional<Category> opt = categoryRepository.findById(categoryId);
        if (opt.isPresent()) {
            return opt.get();
        }
        throw new ProductException("Category not found with id: " + categoryId);
    }

    @Override
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    @Override
    public List<Category> getTopLevelCategories() {
        return categoryRepository.findByLevel(1);
    }

    @Override
    public List<Category> getFeaturedCategories() {
        return categoryRepository.findByFeaturedTrue();
    }
}