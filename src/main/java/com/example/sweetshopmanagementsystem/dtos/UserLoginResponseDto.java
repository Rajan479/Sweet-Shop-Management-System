package com.example.sweetshopmanagementsystem.dtos;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserLoginResponseDto {

    private String email;
    private String password;

}
