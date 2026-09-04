package com.phynahairs.ecommerce.controller;

import com.phynahairs.ecommerce.exception.CartItemException;
import com.phynahairs.ecommerce.exception.UserException;
import com.phynahairs.ecommerce.model.CartItem;
import com.phynahairs.ecommerce.model.User;
import com.phynahairs.ecommerce.response.ApiResponse;
import com.phynahairs.ecommerce.service.CartItemService;
import com.phynahairs.ecommerce.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart_items")
@RequiredArgsConstructor
public class CartItemController {

	private final CartItemService cartItemService;
	private final UserService userService;

	@DeleteMapping("/{cartItemId}")
	public ResponseEntity<ApiResponse> deleteCartItemHandler(@PathVariable Long cartItemId, @RequestHeader("Authorization") String jwt) throws CartItemException, UserException {
		User user = userService.findUserProfileByJwt(jwt);
		cartItemService.removeCartItem(user.getId(), cartItemId);

		ApiResponse res = new ApiResponse("Item Removed From Cart", true);
		return new ResponseEntity<>(res, HttpStatus.ACCEPTED);
	}

	@PutMapping("/{cartItemId}")
	public ResponseEntity<CartItem> updateCartItemHandler(@PathVariable Long cartItemId, @RequestBody CartItem cartItem, @RequestHeader("Authorization") String jwt) throws CartItemException, UserException {
		User user = userService.findUserProfileByJwt(jwt);
		CartItem updatedCartItem = cartItemService.updateCartItem(user.getId(), cartItemId, cartItem);

		return new ResponseEntity<>(updatedCartItem, HttpStatus.ACCEPTED);
	}
}