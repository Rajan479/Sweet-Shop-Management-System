package com.example.sweetshopmanagementsystem.dtos;

import com.example.sweetshopmanagementsystem.models.Role;
import com.example.sweetshopmanagementsystem.models.UserEntity;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserRegisterResponseDto {

    private String username;

    private String email;

    private String password; // encrypted password

    private Role role;

    public static UserRegisterResponseDto from(UserEntity user) {
        UserRegisterResponseDto userRegisterResponseDto = UserRegisterResponseDto.builder()
                .username(user.getUsername())
                .email(user.getEmail())
                .password(user.getPassword())
                .role(user.getRole())
                .build();

        return userRegisterResponseDto;
    }
}
