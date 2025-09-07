package com.restaurant.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.restaurant.model.TableEntity;

@Repository
public interface TableRepository extends JpaRepository<TableEntity, Long> {
    List<TableEntity> findByOccupied(boolean occupied);
    TableEntity findByTableNumber(Integer tableNumber);
}