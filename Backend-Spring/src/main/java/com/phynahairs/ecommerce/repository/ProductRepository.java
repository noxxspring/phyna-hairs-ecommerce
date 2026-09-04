package com.phynahairs.ecommerce.repository;

import com.phynahairs.ecommerce.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {

	@Query("SELECT p FROM Product p " +
			"WHERE (:category = '' OR p.category.name = :category) " +
			"AND ((:minPrice IS NULL AND :maxPrice IS NULL) OR (p.discountedPrice BETWEEN :minPrice AND :maxPrice)) " +
			"AND (:minDiscount IS NULL OR p.discountedPercent >= :minDiscount) " +
			"ORDER BY " +
			"CASE WHEN :sort = 'price_low' THEN p.discountedPrice END ASC, " +
			"CASE WHEN :sort = 'price_high' THEN p.discountedPrice END DESC")
	List<Product> filterProducts(@Param("category") String category,
								 @Param("minPrice") Integer minPrice,
								 @Param("maxPrice") Integer maxPrice,
								 @Param("minDiscount") Integer minDiscount,
								 @Param("sort") String sort);

	@Query("SELECT p FROM Product p WHERE LOWER(p.title) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(p.description) LIKE LOWER(CONCAT('%', :query, '%'))")
	List<Product> searchProduct(@Param("query") String query);

	@Query("SELECT p FROM Product p WHERE p.category.name = :category")
	List<Product> findByCategory(@Param("category") String category);

	List<Product> findByCategoryId(Long categoryId);
}