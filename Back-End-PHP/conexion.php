<?php
$host = "localhost";
$user = "root";
$pass = "117546JuA";
$db = "centro_deportivo_uabc";

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    die(json_encode(["error" => "Error de conexión: " . $conn->connect_error]));
}
?>
