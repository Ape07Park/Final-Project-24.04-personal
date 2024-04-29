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
public class User {
	private String email;
	private String name;
	private String addr;
	private String detailAddr;
	private String tel;
	private String req;
	private String def;
	private int isDeleted;
	
}
