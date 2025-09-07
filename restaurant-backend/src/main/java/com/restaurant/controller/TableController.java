package com.restaurant.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.restaurant.model.TableEntity;
import com.restaurant.service.TableService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/tables")
@CrossOrigin(origins = "http://localhost:3000")
public class TableController {
    
    @Autowired
    private TableService tableService;
    
    @GetMapping
    public ResponseEntity<List<TableEntity>> getAllTables() {
        return ResponseEntity.ok(tableService.getAllTables());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<TableEntity> getTableById(@PathVariable Long id) {
        return ResponseEntity.ok(tableService.getTableById(id));
    }
    
    @GetMapping("/available")
    public ResponseEntity<List<TableEntity>> getAvailableTables() {
        return ResponseEntity.ok(tableService.getAvailableTables());
    }
    
    @PostMapping
    public ResponseEntity<TableEntity> createTable(@Valid @RequestBody TableEntity table) {
        return ResponseEntity.ok(tableService.createTable(table));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<TableEntity> updateTable(@PathVariable Long id, @Valid @RequestBody TableEntity table) {
        return ResponseEntity.ok(tableService.updateTable(id, table));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTable(@PathVariable Long id) {
        tableService.deleteTable(id);
        return ResponseEntity.noContent().build();
    }
}