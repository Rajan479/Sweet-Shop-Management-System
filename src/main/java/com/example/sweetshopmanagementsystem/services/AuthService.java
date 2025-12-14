package com.example.sweetshopmanagementsystem.services;

import com.example.sweetshopmanagementsystem.dtos.UserLoginRequestDto;
import com.example.sweetshopmanagementsystem.dtos.UserLoginResponseDto;
import com.example.sweetshopmanagementsystem.dtos.UserRegisterRequestDto;
import com.example.sweetshopmanagementsystem.dtos.UserRegisterResponseDto;
import com.example.sweetshopmanagementsystem.models.Role;
import com.example.sweetshopmanagementsystem.models.UserEntity;
import com.example.sweetshopmanagementsystem.repositories.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class AuthService {

    private final UserRepository userRepository;

    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    private final JwtService jwtService;

    public AuthService(UserRepository userRepository,  BCryptPasswordEncoder bCryptPasswordEncoder, JwtService jwtService) {
        this.userRepository = userRepository;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
        this.jwtService = jwtService;
    }

    public UserRegisterResponseDto register(UserRegisterRequestDto userRegisterRequestDto) {
        UserEntity users = UserEntity.builder()
                .username(userRegisterRequestDto.getUsername())
                .email(userRegisterRequestDto.getEmail())
                .password(bCryptPasswordEncoder.encode(userRegisterRequestDto.getPassword()))
                .role(Role.USER)
                .build();

        UserEntity newUser = userRepository.save(users);
        return UserRegisterResponseDto.from(newUser);

    }

    public UserLoginResponseDto login(UserLoginRequestDto userLoginRequestDto) {
        UserEntity user = userRepository.findByEmail(userLoginRequestDto.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found!"));

        if (!bCryptPasswordEncoder.matches(
                userLoginRequestDto.getPassword(),
                user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        String token = jwtService.createToken(
                Map.of(
                        "role", user.getRole(),
                        "email", user.getEmail()
                ),
                user.getEmail()
        );

        return new UserLoginResponseDto(
                user.getEmail(),
                token
        );
    }

}
