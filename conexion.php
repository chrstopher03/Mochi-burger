<?php

$host = "localhost";
$user = "root";
$pass = "";
$db = "burger";

$conn = new mysqli($host, $user, $pass, $db);

if($conn->connect_error){
    die("Error de conexión");
}

?>


CREATE DATABASE burger;

USE burger;

CREATE TABLE pedidos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    mesa VARCHAR(10),
    productos LONGTEXT,
    total DECIMAL(10,2),
    estado VARCHAR(50) DEFAULT 'Pendiente',
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);