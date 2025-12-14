package com.example.sweetshopmanagementsystem.adapters;

import com.example.sweetshopmanagementsystem.dtos.SweetRequestDto;
import com.example.sweetshopmanagementsystem.models.SweetEntity;
import org.springframework.stereotype.Component;

@Component
public class CreateSweetDtoToSweetAdapterImple implements CreateSweetDtoToSweetAdapter {

    @Override
    public SweetEntity convertDto(SweetRequestDto sweetrequestDto) {

        return SweetEntity.builder()
                .sweetName(sweetrequestDto.getSweetName())
                .category(sweetrequestDto.getCategory())
                .price(sweetrequestDto.getPrice())
                .quantity(sweetrequestDto.getQuantity())
                .description(sweetrequestDto.getDescription())
                .build();
    }
}
