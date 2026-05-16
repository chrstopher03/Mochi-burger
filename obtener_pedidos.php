<?php

include 'conexion.php';

$sql = "SELECT * FROM pedidos ORDER BY id DESC";

$result = $conn->query($sql);

$pedidos = []; 

while($row = $result->fetch_assoc()){

$pedidos[] = $row;

}

echo json_encode($pedidos);

?>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     