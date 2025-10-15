<?php
session_start();
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

// Verificar que el admin esté logueado
if (!isset($_SESSION['admin_logged']) || $_SESSION['admin_logged'] !== true) {
    echo json_encode([
        'success' => false,
        'mensaje' => 'No autorizado. Inicia sesión como administrador.'
    ]);
    exit;
}

include '../Back-End-PHP/conexion.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $nombre = mysqli_real_escape_string($conexion, $_POST['nombre']);
    $descripcion = mysqli_real_escape_string($conexion, $_POST['descripcion']);
    $fecha = mysqli_real_escape_string($conexion, $_POST['fecha']);
    $lugar = mysqli_real_escape_string($conexion, $_POST['lugar']);
    $actividad = mysqli_real_escape_string($conexion, $_POST['actividad']);
    
    // Validar campos obligatorios
    if (empty($nombre) || empty($fecha) || empty($lugar) || empty($actividad)) {
        echo json_encode([
            'success' => false,
            'mensaje' => 'Todos los campos son obligatorios'
        ]);
        exit;
    }
    
    $sql = "INSERT INTO evento (nombre, descripcion, fecha, lugar, actividad) 
            VALUES ('$nombre', '$descripcion', '$fecha', '$lugar', '$actividad')";
    
    if (mysqli_query($conexion, $sql)) {
        echo json_encode([
            'success' => true,
            'mensaje' => 'Evento creado exitosamente',
            'id' => mysqli_insert_id($conexion)
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'mensaje' => 'Error al crear evento: ' . mysqli_error($conexion)
        ]);
    }
} else {
    echo json_encode([
        'success' => false,
        'mensaje' => 'Método no permitido'
    ]);
}

mysqli_close($conexion);
?>