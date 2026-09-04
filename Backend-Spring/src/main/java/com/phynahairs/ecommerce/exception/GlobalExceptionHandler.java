package com.phynahairs.ecommerce.exception;

import com.phynahairs.ecommerce.response.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {

	// 1. Handle Invalid Email / Password Errors
	@ExceptionHandler(BadCredentialsException.class)
	public ResponseEntity<ApiResponse> handleBadCredentialsException(BadCredentialsException ex) {
		String msg = ex.getMessage() != null && !ex.getMessage().isEmpty()
				? ex.getMessage()
				: "Invalid email address or password.";
		return new ResponseEntity<>(new ApiResponse(msg, false), HttpStatus.UNAUTHORIZED);
	}

	// 2. Handle Existing Email / User Errors
	@ExceptionHandler(UserException.class)
	public ResponseEntity<ApiResponse> handleUserException(UserException ex) {
		return new ResponseEntity<>(new ApiResponse(ex.getMessage(), false), HttpStatus.BAD_REQUEST);
	}

	// 3. Handle Product Errors
	@ExceptionHandler(ProductException.class)
	public ResponseEntity<ApiResponse> handleProductException(ProductException ex) {
		return new ResponseEntity<>(new ApiResponse(ex.getMessage(), false), HttpStatus.BAD_REQUEST);
	}

	// 4. Handle Order Errors
	@ExceptionHandler(OrderException.class)
	public ResponseEntity<ApiResponse> handleOrderException(OrderException ex) {
		return new ResponseEntity<>(new ApiResponse(ex.getMessage(), false), HttpStatus.BAD_REQUEST);
	}

	// 5. Generic Fallback Exception
	@ExceptionHandler(Exception.class)
	public ResponseEntity<ApiResponse> handleGenericException(Exception ex) {
		return new ResponseEntity<>(new ApiResponse(ex.getMessage(), false), HttpStatus.INTERNAL_SERVER_ERROR);
	}
}