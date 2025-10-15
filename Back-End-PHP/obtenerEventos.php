<?php
include("conexion.php");

$sql = "SELECT e.id, e.nombre, e.descripcion, e.fecha, e.lugar, a.nombre AS actividad
        FROM evento e
        LEFT JOIN actividaddeportiva a ON e.id_actividad = a.id";
$result = $conn->query($sql);

$eventos = [];

if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $eventos[] = $row;
    }
}

echo json_encode($eventos, JSON_UNESCAPED_UNICODE);

$conn->close();
?>
