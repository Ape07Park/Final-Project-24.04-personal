package com.example.ft.entity;

import java.time.LocalDate;

import lombok.AllArgsConstructor; 
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
@Builder
@ToString
public class Order {
	
	private int oid;
	private String email;
	private String status;
	private String name;
	private String addr;
	private String detailAddr;
	private String tel;
	private String req;
	private String way;
	private int totalPrice;
	private LocalDate regDate;
	private int isDeleted;
	
}
