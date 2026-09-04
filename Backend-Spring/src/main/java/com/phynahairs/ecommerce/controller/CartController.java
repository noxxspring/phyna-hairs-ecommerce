package com.phynahairs.ecommerce.controller;

import com.phynahairs.ecommerce.exception.ProductException;
import com.phynahairs.ecommerce.exception.UserException;
import com.phynahairs.ecommerce.model.Cart;
import com.phynahairs.ecommerce.model.User;
import com.phynahairs.ecommerce.request.AddItemRequest;
import com.phynahairs.ecommerce.response.ApiResponse;
import com.phynahairs.ecommerce.service.CartService;
import com.phynahairs.ecommerce.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

	private final CartService cartService;
	private final UserService userService;

	@GetMapping("/")
	public ResponseEntity<Cart> findUserCartHandler(@RequestHeader("Authorization") String jwt) throws UserException {
		User user = userService.findUserProfileByJwt(jwt);
		Cart cart = cartService.findUserCart(user.getId());
		return new ResponseEntity<>(cart, HttpStatus.OK);
	}

	@PutMapping("/add")
	public ResponseEntity<ApiResponse> addItemToCart(@RequestBody AddItemRequest req, @RequestHeader("Authorization") String jwt) throws UserException, ProductException {
		User user = userService.findUserProfileByJwt(jwt);
		cartService.addCartItem(user.getId(), req);

		ApiResponse res = new ApiResponse("Item Added To Cart Successfully", true);
		return new ResponseEntity<>(res, HttpStatus.ACCEPTED);
	}
}