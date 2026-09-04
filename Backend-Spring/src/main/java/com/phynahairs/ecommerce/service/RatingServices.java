package com.phynahairs.ecommerce.service;

import com.phynahairs.ecommerce.exception.ProductException;
import com.phynahairs.ecommerce.model.Rating;
import com.phynahairs.ecommerce.model.User;
import com.phynahairs.ecommerce.request.RatingRequest;

import java.util.List;

public interface RatingServices {
	
	public Rating createRating(RatingRequest req, User user) throws ProductException;
	
	public List<Rating> getProductsRating(Long productId);

}
