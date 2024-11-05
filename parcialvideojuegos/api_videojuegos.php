<?php
header('Content-Type: application/json');
$host = "localhost";
$user = "root";
$pass = "";
$dbname = "juegosDB";

$conn = new mysqli($host, $user, $pass, $dbname);

if ($conn->connect_error) {
    die("Error de conexión: " . $conn->connect_error);
}

// Establecer el conjunto de caracteres y el idioma de la conexión
$conn->set_charset("utf8mb4");
$conn->query("SET lc_time_names = 'es_ES'");

// Obtener los parámetros de la URL
$seccion = isset($_GET['seccion']) ? $_GET['seccion'] : '';
$nombre = isset($_GET['nombre']) ? $_GET['nombre'] : ''; // Parámetro para búsqueda por nombre
$anio = isset($_GET['anio']) ? $_GET['anio'] : ''; // Nuevo parámetro para el año

// Usar DATE_FORMAT para formatear la fecha de lanzamiento en español
if ($seccion) {
    // Preparar la consulta con filtro por sección
    $query = "SELECT titulo, descripcion, imagen_url, plataformas, DATE_FORMAT(lanzamiento, '%d %M %Y') AS lanzamiento FROM juegos WHERE seccion = ?";
    $params = [$seccion];

    if ($nombre) {
        // Si hay un nombre, agregar filtro por nombre
        $query .= " AND titulo LIKE CONCAT('%', ?, '%')";
        $params[] = $nombre;
    }
    
    if ($anio) {
        // Si hay un año, agregar filtro por año
        $query .= " AND YEAR(lanzamiento) = ?";
        $params[] = $anio;
    }
    
    $stmt = $conn->prepare($query);
    $stmt->bind_param(str_repeat("s", count($params)), ...$params);
} else {
    // Si no hay sección, pero hay un nombre, filtrar solo por nombre
    if ($nombre) {
        $stmt = $conn->prepare("SELECT titulo, descripcion, imagen_url, plataformas, DATE_FORMAT(lanzamiento, '%d %M %Y') AS lanzamiento FROM juegos WHERE titulo LIKE CONCAT('%', ?, '%')");
        $stmt->bind_param("s", $nombre);
    } else {
        // Si no hay sección ni nombre, obtener todos los juegos
        $stmt = $conn->prepare("SELECT titulo, descripcion, imagen_url, plataformas, DATE_FORMAT(lanzamiento, '%d %M %Y') AS lanzamiento FROM juegos");
    }
}

$stmt->execute();
$result = $stmt->get_result();

$juegos = [];
while ($row = $result->fetch_assoc()) {
    $juegos[] = $row;
}

echo json_encode($juegos);
$stmt->close();
$conn->close();
?>