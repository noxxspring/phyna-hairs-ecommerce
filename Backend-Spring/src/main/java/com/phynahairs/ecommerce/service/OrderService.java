package com.phynahairs.ecommerce.service;

import com.phynahairs.ecommerce.exception.OrderException;
import com.phynahairs.ecommerce.exception.UserException;
import com.phynahairs.ecommerce.model.Address;
import com.phynahairs.ecommerce.model.Order;
import com.phynahairs.ecommerce.model.User;

import java.util.List;

public interface OrderService {
	
	public Order createOrder(User user, Address shippingAdress) throws UserException;
	
	public Order findOrderById(Long orderId) throws OrderException;
	
	public List<Order> usersOrderHistory(Long userId);
	
	public Order placedOrder(Long orderId) throws OrderException;
	
	public Order confirmedOrder(Long orderId)throws OrderException;
	
	public Order shippedOrder(Long orderId) throws OrderException;
	
	public Order deliveredOrder(Long orderId) throws OrderException;
	
	public Order cancledOrder(Long orderId) throws OrderException;
	
	public List<Order>getAllOrders();
	
	public void deleteOrder(Long orderId) throws OrderException;
	
}
