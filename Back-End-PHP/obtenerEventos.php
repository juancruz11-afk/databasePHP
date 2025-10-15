<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

include 'conexion.php';

// Obtener el tipo de actividad del parámetro GET
$tipoActividad = isset($_GET['tipo']) ? $_GET['tipo'] : '';

// Construir la consulta SQL
$sql = "SELECT * FROM evento";

if (!empty($tipoActividad)) {
    $tipoActividad = mysqli_real_escape_string($conexion, $tipoActividad);
    $sql .= " WHERE actividad = '$tipoActividad'";
}

$sql .= " ORDER BY fecha DESC";

$resultado = mysqli_query($conexion, $sql);

$eventos = array();

if ($resultado) {
    while ($fila = mysqli_fetch_assoc($resultado)) {
        $eventos[] = $fila;
    }
    
    echo json_encode([
        'success' => true,
        'eventos' => $eventos,
        'total' => count($eventos)
    ]);
} else {
    echo json_encode([
        'success' => false,
        'mensaje' => 'Error al obtener eventos: ' . mysqli_error($conexion)
    ]);
}

mysqli_close($conexion);
?>