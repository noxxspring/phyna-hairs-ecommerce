package com.phynahairs.ecommerce.repository;

import com.phynahairs.ecommerce.model.Product;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

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

	@Query("SELECT p FROM Product p WHERE p.category.id = :categoryId")
	List<Product> findByCategoryId(@Param("categoryId") Long categoryId);

	@Transactional
	@Modifying
	@Query("UPDATE Product p SET p.category = null WHERE p.category.id = :categoryId")
	void nullifyCategoryInProducts(@Param("categoryId") Long categoryId);

	// Fetch top 8 newest products by creation date
	List<Product> findTop8ByOrderByCreatedAtDesc();

	// Fetch top-selling products based on customer order quantities
	@Query("SELECT oi.product FROM OrderItem oi GROUP BY oi.product ORDER BY SUM(oi.quantity) DESC")
	List<Product> findTopSellingProducts(Pageable pageable);

	// Fallback query for Best Sellers if sales history is empty
	List<Product> findTop8ByProductAvailableTrueOrderByPriceDesc();

	@Query("SELECT p FROM Product p WHERE " +
			"LOWER(p.title) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
			"LOWER(p.description) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
			"LOWER(p.brand) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
			"LOWER(p.color) LIKE LOWER(CONCAT('%', :query, '%'))")
	List<Product> searchProducts(@Param("query") String query);
}