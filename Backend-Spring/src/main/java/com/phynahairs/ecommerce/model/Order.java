package com.phynahairs.ecommerce.model;

import com.phynahairs.ecommerce.domain.OrderStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "orders")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Order {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(name="order_id", unique = true)
	private String orderId; // e.g. PHYNA-ORD-9821

	@ManyToOne
	private User user;

	@OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<OrderItem> orderItems = new ArrayList<>();

	private LocalDateTime orderDate;
	private LocalDateTime deliveryDate;

	@OneToOne
	private Address shippingAddress;

	@Embedded
	private PaymentDetails paymentDetails = new PaymentDetails();

	private BigDecimal totalPrice;
	private BigDecimal totalDiscountedPrice;
	private BigDecimal discount;

	@Enumerated(EnumType.STRING)
	private OrderStatus orderStatus;

	private int totalItem;
	private LocalDateTime createdAt;

}