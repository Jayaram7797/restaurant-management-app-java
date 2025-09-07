package com.restaurant.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.restaurant.model.MenuItem;
import com.restaurant.model.Order;
import com.restaurant.model.OrderItem;
import com.restaurant.model.TableEntity;
import com.restaurant.model.Order.OrderStatus;
import com.restaurant.repository.OrderRepository;

@Service
public class OrderService {
    
    @Autowired
    private OrderRepository orderRepository;
    
    @Autowired
    private MenuItemService menuItemService;
    
    @Autowired
    private TableService tableService;
    
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }
    
    public Order getOrderById(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + id));
    }
    
    public List<Order> getOrdersByStatus(OrderStatus status) {
        return orderRepository.findByStatus(status);
    }
    
    @Transactional
    public Order createOrder(Long tableId, List<OrderItem> items) {
        TableEntity table = tableService.getTableById(tableId);
        
        if (table.isOccupied() == false) {
            table.setOccupied(true);
            tableService.updateTable(tableId, table);
        }
        
        Order order = new Order(table);
        
        for (OrderItem item : items) {
            MenuItem menuItem = menuItemService.getMenuItemById(item.getMenuItem().getId());
            OrderItem orderItem = new OrderItem(menuItem, item.getQuantity(), item.getSpecialInstructions());
            order.addOrderItem(orderItem);
        }
        
        return orderRepository.save(order);
    }
    
    public Order updateOrderStatus(Long id, OrderStatus status) {
        Order order = getOrderById(id);
        order.setStatus(status);
        
        if (status == OrderStatus.PAID) {
            TableEntity table = order.getTable();
            table.setOccupied(false);
            tableService.updateTable(table.getId(), table);
        }
        
        return orderRepository.save(order);
    }
}