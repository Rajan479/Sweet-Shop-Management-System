package com.example.sweetshopmanagementsystem.services;

import com.example.sweetshopmanagementsystem.models.SweetEntity;
import com.example.sweetshopmanagementsystem.repositories.SweetRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SweetService {

    private final SweetRepository sweetRepository;

    public SweetService(SweetRepository sweetRepository) {
        this.sweetRepository = sweetRepository;
    }

    // Add sweet
    public SweetEntity addSweet(SweetEntity sweet){
        return sweetRepository.save(sweet);
    }

    // Get the all sweets
    public List<SweetEntity> getAllSweets(){
        return sweetRepository.findAll();
    }

    // Update the sweet
    public SweetEntity updateSweet(Long id, SweetEntity updatedSweet){
        SweetEntity sweet =  sweetRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sweet is not available to update"));

        sweet.setSweetName(updatedSweet.getSweetName());
        sweet.setCategory(updatedSweet.getCategory());
        sweet.setPrice(updatedSweet.getPrice());
        sweet.setQuantity(updatedSweet.getQuantity());
        sweet.setDescription(updatedSweet.getDescription());

        return sweetRepository.save(sweet);
    }

    // Delete the sweet and this operation is done by admin
    public void deleteSweet(Long id){
        if(!sweetRepository.existsById(id)){
            throw new RuntimeException("Sweet is not available to delete");
        }
        else{
            sweetRepository.deleteById(id);
        }
    }

    // Search sweet by using sweetName or category or price range
    public List<SweetEntity> searchSweet(String itemName, String category, Double minimumPrice,
                                         Double maximumPrice){
        if(itemName != null){
            return sweetRepository.findBySweetName(itemName);
        }
        if(category != null){
            return sweetRepository.findByCategory(category);
        }
        if(minimumPrice != null && maximumPrice != null){
            return sweetRepository.findByPriceBetween(minimumPrice, maximumPrice);
        }
        return sweetRepository.findAll();
    }

    public SweetEntity purchaseSweet(Long sweetId, Integer quantity){
        if (quantity == null || quantity <= 0) {
            throw new IllegalArgumentException("Quantity must be greater than 0");
        }

        // Find sweet
        SweetEntity sweet = sweetRepository.findById(sweetId)
                .orElseThrow(() -> new RuntimeException("Sweet not found with id: " + sweetId));

        // Check stock availability
        if (sweet.getQuantity() < quantity) {
            throw new RuntimeException(
                    String.format("Insufficient stock. Available: %d, Requested: %d",
                            sweet.getQuantity(), quantity)
            );
        }

        // Update quantity
        sweet.setQuantity(sweet.getQuantity() - quantity);

        // Save and return
        return sweetRepository.save(sweet);
    }

    public SweetEntity restockSweet(Long sweetId, Integer quantity){
        if (quantity == null || quantity <= 0) {
            throw new IllegalArgumentException("Quantity must be greater than 0");
        }

        // Find sweet
        SweetEntity sweet = sweetRepository.findById(sweetId)
                .orElseThrow(() -> new RuntimeException("Sweet not found with id: " + sweetId));

        // Update quantity
        sweet.setQuantity(sweet.getQuantity() + quantity);

        // Save and return
        return sweetRepository.save(sweet);
    }
}
