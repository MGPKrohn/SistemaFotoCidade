package com.example.fotocidade.repository;

import com.example.fotocidade.models.CheckoutModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CheckoutRepository extends JpaRepository<CheckoutModel, Long> {
}
