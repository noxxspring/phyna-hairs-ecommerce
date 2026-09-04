package com.phynahairs.ecommerce.service;

import com.phynahairs.ecommerce.exception.ProductException;
import com.phynahairs.ecommerce.exception.UserException;
import com.phynahairs.ecommerce.model.Cart;
import com.phynahairs.ecommerce.model.User;
import com.phynahairs.ecommerce.request.AddItemRequest;

public interface CartService {
	
	public Cart createCart(User user);
	
	public String addCartItem(Long userId,AddItemRequest req) throws ProductException, UserException;
	
	public Cart findUserCart(Long userId) throws UserException;

}
