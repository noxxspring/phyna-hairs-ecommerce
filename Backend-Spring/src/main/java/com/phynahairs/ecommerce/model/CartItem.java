package com.phynahairs.ecommerce.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.Objects;

@Entity
@Table(name = "cart_items")
@AllArgsConstructor
@Data
@NoArgsConstructor
public class CartItem {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@JsonIgnore
	@ManyToOne
	private Cart cart;

	@ManyToOne
	private Product product;

	private String size; // Length/Cap Size (e.g. "24 inches / Medium Cap")
	private Integer quantity;
	private BigDecimal price;
	private BigDecimal discountedPrice;
	private Long userId;


	@Override
	public boolean equals(Object o) {
		if (this == o) return true;
		if (o == null || getClass() != o.getClass()) return false;
		CartItem cartItem = (CartItem) o;
		return Objects.equals(id, cartItem.id);
	}

	@Override
	public int hashCode() {
		return Objects.hash(id);
	}
}