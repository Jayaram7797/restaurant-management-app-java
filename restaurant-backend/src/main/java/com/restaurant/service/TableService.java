package com.restaurant.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.restaurant.model.TableEntity;
import com.restaurant.repository.TableRepository;

@Service
public class TableService {
    
    @Autowired
    private TableRepository tableRepository;
    
    public List<TableEntity> getAllTables() {
        return tableRepository.findAll();
    }
    
    public TableEntity getTableById(Long id) {
        return tableRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Table not found with id: " + id));
    }
    
    public List<TableEntity> getAvailableTables() {
        return tableRepository.findByOccupied(false);
    }
    
    public TableEntity createTable(TableEntity table) {
        return tableRepository.save(table);
    }
    
    public TableEntity updateTable(Long id, TableEntity tableDetails) {
        TableEntity table = getTableById(id);
        
        table.setTableNumber(tableDetails.getTableNumber());
        table.setCapacity(tableDetails.getCapacity());
        table.setOccupied(tableDetails.isOccupied());
        
        return tableRepository.save(table);
    }
    
    public void deleteTable(Long id) {
        TableEntity table = getTableById(id);
        tableRepository.delete(table);
    }
}