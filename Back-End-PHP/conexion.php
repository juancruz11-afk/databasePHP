<?php
$servidor = "localhost";
$usuario = "root";
$password = "117546JuA";
$bd = "centro_deportivo_uabc";

$conexion = mysqli_connect($servidor, $usuario, $password, $bd);

if (!$conexion) {
    die("Error de conexión: " . mysqli_connect_error());
}

mysqli_set_charset($conexion, "utf8");
?>