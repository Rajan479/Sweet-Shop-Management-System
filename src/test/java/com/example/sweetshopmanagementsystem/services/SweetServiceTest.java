package com.example.sweetshopmanagementsystem.services;

import com.example.sweetshopmanagementsystem.models.SweetEntity;
import com.example.sweetshopmanagementsystem.repositories.SweetRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class SweetServiceTest {

    @Mock
    private SweetRepository sweetRepository;

    @InjectMocks
    private SweetService sweetService;

    private SweetEntity testSweet;

    @BeforeEach
    void setUp() {
        testSweet = new SweetEntity();
        testSweet.setId(1L);
        testSweet.setSweetName("Chocolate Bar");
        testSweet.setCategory("Chocolate");
        testSweet.setPrice(2.99);
        testSweet.setQuantity(100);
        testSweet.setDescription("Delicious chocolate bar");
    }

    @Test
    @DisplayName("Should purchase sweet successfully")
    void shouldPurchaseSweetSuccessfully() {
        // Given
        when(sweetRepository.findById(1L)).thenReturn(Optional.of(testSweet));
        when(sweetRepository.save(any(SweetEntity.class))).thenReturn(testSweet);

        // When
        SweetEntity result = sweetService.purchaseSweet(1L, 10);

        // Then
        assertNotNull(result);
        assertEquals(90, result.getQuantity());
        verify(sweetRepository).save(any(SweetEntity.class));
    }

}
