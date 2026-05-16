<?php

include 'conexion.php';

$data = json_decode(file_get_contents("php://input"), true);

$id = $data['id'];
$status = $data['status'];

$sql = "UPDATE pedidos
SET estado='$status'
WHERE id='$id'";

$conn->query($sql);

echo "ok";

?>