package com.phynahairs.ecommerce.repository;

import com.phynahairs.ecommerce.model.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

    @Transactional
    @Modifying
    @Query("UPDATE OrderItem o SET o.product = null WHERE o.product.id = :productId")
    void nullifyProductInOrderItems(@Param("productId") Long productId);

}
