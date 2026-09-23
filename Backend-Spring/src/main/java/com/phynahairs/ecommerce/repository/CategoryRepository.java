package com.phynahairs.ecommerce.repository;

import com.phynahairs.ecommerce.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface CategoryRepository extends JpaRepository<Category, Long> {

	Category findByName(String name);

	@Query("SELECT c FROM Category c WHERE c.name = :name AND c.parentCategory.name = :parentCategoryName")
	Category findByNameAndParent(@Param("name") String name, @Param("parentCategoryName") String parentCategoryName);

	// Get all top-level categories (Level 1)
	List<Category> findByLevel(int level);

	// Get all categories marked for Homepage display
	List<Category> findByFeaturedTrue();

	@Transactional
	@Modifying
	@Query("UPDATE Category c SET c.parentCategory = null WHERE c.parentCategory.id = :categoryId")
	void unlinkChildCategories(@Param("categoryId") Long categoryId);
}