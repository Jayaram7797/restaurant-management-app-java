import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import Navbar from "./components/Navbar";
import Home from "./components/Home";
import MenuManagement from "./components/menu/MenuManagement";
import TableManagement from "./components/table/TableManagement";
import OrderManagement from "./components/order/OrderManagement";
import CreateOrder from "./components/order/CreateOrder";

function App() {
    return (
        <Router>
            <div className="App">
                <Navbar />
                <div className="container mt-4">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/menu" element={<MenuManagement />} />
                        <Route path="/tables" element={<TableManagement />} />
                        <Route path="/orders" element={<OrderManagement />} />
                        <Route path="/create-order/:tableId" element={<CreateOrder />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
}

export default App;
