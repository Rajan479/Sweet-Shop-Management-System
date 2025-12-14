package com.example.sweetshopmanagementsystem.controllers;

import com.example.sweetshopmanagementsystem.dtos.*;
import com.example.sweetshopmanagementsystem.services.AuthService;
import org.apache.catalina.User;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<UserRegisterResponseDto> signup(@RequestBody UserRegisterRequestDto userRegisterRequestDto) {
        UserRegisterResponseDto userRegisterResponseDto = authService.register(userRegisterRequestDto);
        return new ResponseEntity<>(userRegisterResponseDto, HttpStatus.OK);
    }

    @PostMapping("/login")
    public ResponseEntity<UserLoginResponseDto> signin(@RequestBody UserLoginRequestDto  userLoginRequestDto) {
        UserLoginResponseDto token = authService.login(userLoginRequestDto);
        return new ResponseEntity<>(token, HttpStatus.OK);

    }
}
