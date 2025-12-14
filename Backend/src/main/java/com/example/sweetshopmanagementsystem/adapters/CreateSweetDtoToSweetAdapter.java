package com.example.sweetshopmanagementsystem.adapters;

import com.example.sweetshopmanagementsystem.dtos.SweetRequestDto;
import com.example.sweetshopmanagementsystem.models.SweetEntity;

public interface CreateSweetDtoToSweetAdapter {

    public SweetEntity convertDto(SweetRequestDto sweetrequestDto);

}
