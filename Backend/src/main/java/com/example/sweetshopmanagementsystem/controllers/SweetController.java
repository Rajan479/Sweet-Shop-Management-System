package com.example.sweetshopmanagementsystem.controllers;

import com.example.sweetshopmanagementsystem.adapters.CreateSweetDtoToSweetAdapter;
import com.example.sweetshopmanagementsystem.dtos.SweetRequestDto;
import com.example.sweetshopmanagementsystem.models.SweetEntity;
import com.example.sweetshopmanagementsystem.services.SweetService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sweets")
public class SweetController {

    private SweetService sweetService;
    private CreateSweetDtoToSweetAdapter  createSweetDtoToSweetAdapter;

    public SweetController(SweetService sweetService,
                           CreateSweetDtoToSweetAdapter createSweetDtoToSweetAdapter) {
        this.sweetService = sweetService;
        this.createSweetDtoToSweetAdapter = createSweetDtoToSweetAdapter;
    }

    // 1:10:00 explanation of writing dto
    @PostMapping("/add")
    public ResponseEntity<?> addSweet(@Validated @RequestBody SweetRequestDto request) {
        SweetEntity incomingSweet = this.createSweetDtoToSweetAdapter.convertDto(request);
        if(incomingSweet == null) {
            return new ResponseEntity<>("Invalid Arguments",HttpStatus.BAD_REQUEST);
        }

        SweetEntity sweet = this.sweetService.addSweet(incomingSweet);
        return new ResponseEntity<>(sweet, HttpStatus.CREATED);
    }

    @GetMapping("/getAll")
    public ResponseEntity<?> getAllSweets() {
        List<SweetEntity> sweets = this.sweetService.getAllSweets();
        return new ResponseEntity<>(sweets, HttpStatus.OK);
    }

    @GetMapping("/search")
    public  ResponseEntity<List<?>> getSweetById(@RequestParam(required = false) String sweetName,
                                                 @RequestParam(required = false) String category,
                                                 @RequestParam(required = false) Double minPrice,
                                                 @RequestParam(required = false) Double maxPrice) {
        List<SweetEntity> sweets = this.sweetService.searchSweet(sweetName, category, minPrice, maxPrice);
        return new ResponseEntity<>(sweets, HttpStatus.OK);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateSweet(@PathVariable Long id,
            @Validated @RequestBody SweetRequestDto request) {
        SweetEntity incomingSweet = this.createSweetDtoToSweetAdapter.convertDto(request);
        if(incomingSweet == null) {
            return new ResponseEntity<>("Invalid Arguments",HttpStatus.BAD_REQUEST);
        }

        SweetEntity sweet = this.sweetService.updateSweet(id, incomingSweet);
        return new ResponseEntity<>(sweet, HttpStatus.OK);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteSweet(@PathVariable Long id) {
        sweetService.deleteSweet(id);
        return new ResponseEntity<>("Delete the sweet successfully.",HttpStatus.OK);
    }

    @PostMapping("/{id}/purchase")
    public ResponseEntity<?> purchaseSweet(@PathVariable Long id,
                                           @RequestParam Integer quantity) {
        sweetService.purchaseSweet(id,  quantity);
        return new ResponseEntity<>("Purchase the sweet successfully.",HttpStatus.OK);
    }

    @PostMapping("/{id}/restock")
    public ResponseEntity<?> restockSweer(@PathVariable Long id,
                                          @RequestParam Integer quantity) {
        sweetService.restockSweet(id,  quantity);
        return new ResponseEntity<>("Restock the sweet successfully.",HttpStatus.OK);
    }
}
