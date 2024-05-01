package com.example.ft.dao;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import com.example.ft.entity.Order;

@Mapper
public interface OrderDao {
	
	@Select("select * from order where email=#{email}")
	Order getOrder(String email); 
}
