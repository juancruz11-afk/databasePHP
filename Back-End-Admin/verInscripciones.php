<?php
session_start();
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

if (!isset($_SESSION['admin_logged']) || $_SESSION['admin_logged'] !== true) {
    echo json_encode([
        'success' => false,
        'mensaje' => 'No autorizado'
    ]);
    exit;
}

include '../Back-End-PHP/conexion.php';

// Obtener inscripciones con información del evento
$sql = "SELECT 
            i.id,
            i.nombre,
            i.correo,
            i.telefono,
            i.fecha_inscripcion,
            e.nombre as nombre_evento,
            e.fecha as fecha_evento,
            e.lugar
        FROM inscripcion i 
        INNER JOIN evento e ON i.evento_id = e.id 
        ORDER BY i.fecha_inscripcion DESC";
        
$resultado = mysqli_query($conexion, $sql);

$inscripciones = array();

if ($resultado) {
    while ($fila = mysqli_fetch_assoc($resultado)) {
        $inscripciones[] = $fila;
    }
    
    echo json_encode([
        'success' => true,
        'inscripciones' => $inscripciones,
        'total' => count($inscripciones)
    ]);
} else {
    echo json_encode([
        'success' => false,
        'mensaje' => 'Error al obtener inscripciones: ' . mysqli_error($conexion)
    ]);
}

mysqli_close($conexion);
?>