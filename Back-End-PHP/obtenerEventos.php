<?php
$host = "localhost";
$user = "root";
$pass = "117546JuA";
$db   = "base_prueba";

$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
    // devolver JSON de error
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(["error" => "Error de conexión: " . $conn->connect_error]);
    exit;
}

$sql = "SELECT * FROM evento ORDER BY startDate ASC";
$result = $conn->query($sql);

$eventos = [];
while ($row = $result->fetch_assoc()) {
    $eventos[] = $row;
}

header('Content-Type: application/json; charset=utf-8');
echo json_encode($eventos);

$conn->close();
?>
