package com.example.sweetshopmanagementsystem.dtos;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SweetRequestDto {

    private String sweetName;

    private String category;

    private Double price;

    private Integer quantity;

    private String description;

}
