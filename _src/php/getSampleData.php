<?php
$root = $_SERVER['DOCUMENT_ROOT'] ? $_SERVER['DOCUMENT_ROOT'] : $_SERVER['HOME'];
require  "$root/inc/dbConn.php";

$db = new dbConn('devbox');

$SQL = "SELECT * FROM cetec.bin_scan ORDER BY last_scan DESC LIMIT 100";

$data = $db->getResult($SQL);

echo json_encode($data);
