package com.example.ft.service;

import java.util.List;

import com.example.ft.entity.Order;
import com.example.ft.entity.OrderItem;

public interface OrderService {
	// order에 orderItem을 추가하는 방식으로 할 것임
	
	// 순수 order
	Order getOrder();
	
	List<Order> getOrderList();
	
	void insertOrder();
	
	void deleteOrder();
		
	// orderItem
	List<OrderItem> getOrderItemList();
	
	void insertOrderItem();
	
	void selectOrderItem();
}
