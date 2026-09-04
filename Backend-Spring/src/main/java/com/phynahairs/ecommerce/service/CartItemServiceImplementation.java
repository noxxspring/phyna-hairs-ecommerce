package com.phynahairs.ecommerce.service;

import com.phynahairs.ecommerce.exception.CartItemException;
import com.phynahairs.ecommerce.exception.UserException;
import com.phynahairs.ecommerce.model.Cart;
import com.phynahairs.ecommerce.model.CartItem;
import com.phynahairs.ecommerce.model.Product;
import com.phynahairs.ecommerce.model.User;
import com.phynahairs.ecommerce.repository.CartItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CartItemServiceImplementation implements CartItemService {

	private final CartItemRepository cartItemRepository;
	private final UserService userService;

	@Override
	public CartItem createCartItem(CartItem cartItem) {
		cartItem.setQuantity(1);

		if (cartItem.getProduct() != null) {
			BigDecimal qty = BigDecimal.valueOf(cartItem.getQuantity());
			BigDecimal itemPrice = cartItem.getProduct().getPrice() != null ? cartItem.getProduct().getPrice() : BigDecimal.ZERO;
			BigDecimal discPrice = cartItem.getProduct().getDiscountedPrice() != null ? cartItem.getProduct().getDiscountedPrice() : itemPrice;

			cartItem.setPrice(itemPrice.multiply(qty));
			cartItem.setDiscountedPrice(discPrice.multiply(qty));
		}

		return cartItemRepository.save(cartItem);
	}

	@Override
	public CartItem updateCartItem(Long userId, Long id, CartItem cartItem) throws CartItemException, UserException {
		CartItem item = findCartItemById(id);
		User user = userService.findUserById(item.getUserId());

		if (user.getId().equals(userId)) {
			item.setQuantity(cartItem.getQuantity());

			BigDecimal qty = BigDecimal.valueOf(item.getQuantity());
			BigDecimal itemPrice = item.getProduct().getPrice() != null ? item.getProduct().getPrice() : BigDecimal.ZERO;
			BigDecimal discPrice = item.getProduct().getDiscountedPrice() != null ? item.getProduct().getDiscountedPrice() : itemPrice;

			item.setPrice(itemPrice.multiply(qty));
			item.setDiscountedPrice(discPrice.multiply(qty));

			return cartItemRepository.save(item);
		} else {
			throw new CartItemException("You cannot update another user's cart item");
		}
	}

	@Override
	public CartItem isCartItemExist(Cart cart, Product product, String size, Long userId) {
		return cartItemRepository.isCartItemExist(cart, product, size, userId);
	}

	@Override
	public void removeCartItem(Long userId, Long cartItemId) throws CartItemException, UserException {
		CartItem cartItem = findCartItemById(cartItemId);

		User user = userService.findUserById(cartItem.getUserId());
		User reqUser = userService.findUserById(userId);

		if (user.getId().equals(reqUser.getId())) {
			cartItemRepository.deleteById(cartItem.getId());
		} else {
			throw new UserException("You cannot remove another user's item");
		}
	}

	@Override
	public CartItem findCartItemById(Long cartItemId) throws CartItemException {
		Optional<CartItem> opt = cartItemRepository.findById(cartItemId);
		if (opt.isPresent()) {
			return opt.get();
		}
		throw new CartItemException("Cart item not found with id: " + cartItemId);
	}
}