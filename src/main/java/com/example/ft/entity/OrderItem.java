package com.example.ft.entity;

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

public class OrderItem {
	private int oiid;
	private int oid;
	private int ioid;
	private int count;
	private int price;
	private int isDeleted;
	
}
