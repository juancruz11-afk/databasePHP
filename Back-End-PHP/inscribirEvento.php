<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

include 'conexion.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Obtener y validar datos
    $nombre = mysqli_real_escape_string($conexion, trim($_POST['nombre']));
    $correo = mysqli_real_escape_string($conexion, trim($_POST['correo']));
    $telefono = mysqli_real_escape_string($conexion, trim($_POST['telefono']));
    $evento_id = mysqli_real_escape_string($conexion, $_POST['evento_id']);
    
    // Validar campos obligatorios
    if (empty($nombre) || empty($correo) || empty($telefono) || empty($evento_id)) {
        echo json_encode([
            'success' => false,
            'mensaje' => 'Todos los campos son obligatorios'
        ]);
        exit;
    }
    
    // Validar formato de correo
    if (!filter_var($correo, FILTER_VALIDATE_EMAIL)) {
        echo json_encode([
            'success' => false,
            'mensaje' => 'El correo electrónico no es válido'
        ]);
        exit;
    }
    
    // Verificar que el evento existe
    $verificarEvento = "SELECT id FROM evento WHERE id = $evento_id";
    $resultadoEvento = mysqli_query($conexion, $verificarEvento);
    
    if (mysqli_num_rows($resultadoEvento) == 0) {
        echo json_encode([
            'success' => false,
            'mensaje' => 'El evento no existe'
        ]);
        exit;
    }
    
    // Verificar si ya está inscrito
    $verificarInscripcion = "SELECT * FROM inscripcion 
                             WHERE correo = '$correo' AND evento_id = $evento_id";
    $resultadoInscripcion = mysqli_query($conexion, $verificarInscripcion);
    
    if (mysqli_num_rows($resultadoInscripcion) > 0) {
        echo json_encode([
            'success' => false,
            'mensaje' => 'Ya estás inscrito en este evento con este correo'
        ]);
        exit;
    }
    
    // Insertar inscripción
    $sql = "INSERT INTO inscripcion (nombre, correo, telefono, evento_id, fecha_inscripcion) 
            VALUES ('$nombre', '$correo', '$telefono', $evento_id, NOW())";
    
    if (mysqli_query($conexion, $sql)) {
        echo json_encode([
            'success' => true,
            'mensaje' => '¡Inscripción exitosa! Recibirás más información por correo.',
            'id' => mysqli_insert_id($conexion)
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'mensaje' => 'Error al procesar inscripción: ' . mysqli_error($conexion)
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