package com.phynahairs.ecommerce.service;

import com.phynahairs.ecommerce.exception.ProductException;
import com.phynahairs.ecommerce.exception.UserException;
import com.phynahairs.ecommerce.model.Cart;
import com.phynahairs.ecommerce.model.CartItem;
import com.phynahairs.ecommerce.model.Product;
import com.phynahairs.ecommerce.model.User;
import com.phynahairs.ecommerce.repository.CartRepository;
import com.phynahairs.ecommerce.request.AddItemRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class CartServiceImplementation implements CartService {

	private final CartRepository cartRepository;
	private final CartItemService cartItemService;
	private final ProductService productService;
	private final UserService userService;

	@Override
	public Cart createCart(User user) {
		Cart cart = new Cart();
		cart.setUser(user);
		return cartRepository.save(cart);
	}

	@Override
	public Cart findUserCart(Long userId) throws UserException {
		Cart cart = cartRepository.findByUserId(userId);

		// Auto-create a cart if the user doesn't have one yet
		if (cart == null) {
			User user = userService.findUserById(userId);
			cart = createCart(user);
		}

		BigDecimal totalPrice = BigDecimal.ZERO;
		BigDecimal totalDiscountedPrice = BigDecimal.ZERO;
		int totalItem = 0;

		if (cart.getCartItems() != null) {
			for (CartItem cartItem : cart.getCartItems()) {
				if (cartItem.getPrice() != null) {
					totalPrice = totalPrice.add(cartItem.getPrice());
				}
				if (cartItem.getDiscountedPrice() != null) {
					totalDiscountedPrice = totalDiscountedPrice.add(cartItem.getDiscountedPrice());
				} else if (cartItem.getPrice() != null) {
					totalDiscountedPrice = totalDiscountedPrice.add(cartItem.getPrice());
				}
				totalItem += cartItem.getQuantity();
			}
		}

		cart.setTotalPrice(totalPrice);
		cart.setTotalDiscountedPrice(totalDiscountedPrice);
		cart.setDiscount(totalPrice.subtract(totalDiscountedPrice));
		cart.setTotalItem(totalItem);

		return cartRepository.save(cart);
	}

	@Override
	public String addCartItem(Long userId, AddItemRequest req) throws ProductException, UserException {
		Cart cart = cartRepository.findByUserId(userId);

		// Auto-create a cart if the user doesn't have one yet
		if (cart == null) {
			User user = userService.findUserById(userId);
			cart = createCart(user);
		}

		Product product = productService.findProductById(req.getProductId());

		CartItem isPresent = cartItemService.isCartItemExist(cart, product, req.getSize(), userId);

		if (isPresent == null) {
			CartItem cartItem = new CartItem();
			cartItem.setProduct(product);
			cartItem.setCart(cart);
			cartItem.setQuantity(req.getQuantity());
			cartItem.setUserId(userId);
			cartItem.setSize(req.getSize());

			BigDecimal qty = BigDecimal.valueOf(req.getQuantity());
			BigDecimal unitPrice = product.getPrice() != null ? product.getPrice() : BigDecimal.ZERO;
			BigDecimal unitDiscPrice = product.getDiscountedPrice() != null ? product.getDiscountedPrice() : unitPrice;

			cartItem.setPrice(unitPrice.multiply(qty));
			cartItem.setDiscountedPrice(unitDiscPrice.multiply(qty));

			CartItem createdCartItem = cartItemService.createCartItem(cartItem);
			cart.getCartItems().add(createdCartItem);
		}

		return "Item Added To Cart Successfully";
	}
}