<?php
header("Access-Control-Allow-Origin: http://localhost:5173");  // Ganti dengan origin yang sesuai
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Cek jika metode permintaan adalah OPTIONS
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    // Beri respons kosong untuk permintaan OPTIONS
    header("HTTP/1.1 200 OK");
    exit();
}
header("Content-Type: application/json");
$host = "localhost";
$user = "root";
$pass = "";
$db   = "db_tes"; // Ganti dengan nama DB-mu

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["error" => "Koneksi database gagal."]);
    exit();
}

// Ambil data dari request
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    // === READ ===
    $result = $conn->query("SELECT * FROM availability WHERE id = 1 LIMIT 1");
    $data = $result->fetch_assoc();
    echo json_encode($data);

} elseif ($method === 'POST') {
    // === UPDATE ===
    $input = json_decode(file_get_contents("php://input"), true);

    $lokasi = $conn->real_escape_string($input['lokasi']);
    $gedung = $conn->real_escape_string($input['gedung']);
    $jadwal = $conn->real_escape_string($input['jadwal']);
    $status = $conn->real_escape_string($input['status']);

    $sql = "UPDATE availability SET 
                lokasi_kampus='$lokasi',
                gedung_ruangan='$gedung',
                jadwal_libur='$jadwal',
                status_ketersediaan='$status'
            WHERE id = 1";

    if ($conn->query($sql) === TRUE) {
        echo json_encode(["success" => true]);
    } else {
        http_response_code(500);
        echo json_encode(["error" => "Gagal memperbarui data."]);
    }
}

$conn->close();
?>
