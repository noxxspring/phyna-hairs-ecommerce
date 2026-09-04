package com.phynahairs.ecommerce.service;

import com.phynahairs.ecommerce.exception.ProductException;
import com.phynahairs.ecommerce.model.Review;
import com.phynahairs.ecommerce.model.User;
import com.phynahairs.ecommerce.request.ReviewRequest;

import java.util.List;

public interface ReviewService {

	public Review createReview(ReviewRequest req, User user) throws ProductException;
	
	public List<Review> getAllReview(Long productId);
	
	
}
