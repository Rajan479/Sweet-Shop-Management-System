package com.example.sweetshopmanagementsystem.dtos;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserLoginRequestDto {

    private String username;

    private String email;

    private String password;


}
