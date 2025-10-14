<?php
$host = "localhost";   // servidor local
$user = "root";        // usuario por defecto de XAMPP
$pass = "117546JuA";   // contraseña vacía (por defecto en XAMPP)
$db   = "base_prueba"; // nombre de tu base de datos

// conexión
$conn = new mysqli($host, $user, $pass, $db);

// verificar conexión
if ($conn->connect_error) {
    die("Error de conexión: " . $conn->connect_error);
} else {
    echo "Conexión exitosa a la base de datos.";
}
?>
