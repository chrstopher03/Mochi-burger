<?php

include 'conexion.php';

$data = json_decode(file_get_contents("php://input"), true);

$mesa = $data['mesa'];
$productos = json_encode($data['productos']);
$total = $data['total'];

$sql = "INSERT INTO pedidos(mesa,productos,total)
VALUES('$mesa','$productos','$total')";

$conn->query($sql);

echo "ok";

?>