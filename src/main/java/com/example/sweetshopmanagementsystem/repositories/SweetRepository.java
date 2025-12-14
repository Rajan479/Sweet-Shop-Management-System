package com.example.sweetshopmanagementsystem.repositories;

import com.example.sweetshopmanagementsystem.models.SweetEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SweetRepository extends JpaRepository<SweetEntity,Long> {

    List<SweetEntity> findBySweetName(String sweetName);

    List<SweetEntity> findByCategory(String category);

    List<SweetEntity> findByPriceBetween(Double minimumPrice, Double maximumPrice);
}
