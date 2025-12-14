package com.example.sweetshopmanagementsystem.dtos;

import com.example.sweetshopmanagementsystem.models.Role;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserRegisterRequestDto {

    private String username;

    private String email;

    private String password;

    private Role role;
}
