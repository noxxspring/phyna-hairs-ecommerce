package com.phynahairs.ecommerce.service;

import com.phynahairs.ecommerce.exception.CartItemException;
import com.phynahairs.ecommerce.exception.UserException;
import com.phynahairs.ecommerce.model.Cart;
import com.phynahairs.ecommerce.model.CartItem;
import com.phynahairs.ecommerce.model.Product;

public interface CartItemService {
	
	public CartItem createCartItem(CartItem cartItem);
	
	public CartItem updateCartItem(Long userId, Long id,CartItem cartItem) throws CartItemException, UserException;
	
	public CartItem isCartItemExist(Cart cart, Product product, String size, Long userId);
	
	public void removeCartItem(Long userId,Long cartItemId) throws CartItemException, UserException;
	
	public CartItem findCartItemById(Long cartItemId) throws CartItemException;
	
}
