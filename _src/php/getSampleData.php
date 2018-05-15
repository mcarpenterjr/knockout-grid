<?php
$root = $_SERVER['DOCUMENT_ROOT'] ? $_SERVER['DOCUMENT_ROOT'] : $_SERVER['HOME'];
require  "$root/inc/dbConn.php";

$db = new dbConn('devbox');

$SQL = "SELECT
          bin,
          userid,
          last_scan
        FROM
          cetec.bin_scan
        ORDER BY
          last_scan
        DESC LIMIT
          1000";

$data = $db->getResult($SQL);
$output['rows'] = $data;

// For this simplified case we do this setup manually without class.
// Looking forward, if there was an API, this would be done once and done.
// If we were to work at implementing a column class that looked at the 
// select statement of our query we could automate some of the values here.
// THIS IS A SUPER SIMPLIFICATION OF EXPECTED DATA.

$output['header'] = array();

$bin['title'] = "Bin";
$bin['data_type'] = "mixed";
$bin['sort'] = true;
$bin['search'] = true;
$bin['col_name'] = "bin";
array_push($output['header'], $bin);

$user['title'] = "User";
$user['data_type'] = "string";
$user['sort'] = true;
$user['search'] = true;
$user['col_name'] = "userid";
array_push($output['header'], $user);

$scan['title'] = "Last Scanned";
$scan['data_type'] = "date";
$scan['sort'] = true;
$scan['search'] = true;
$scan['col_name'] = "last_scan";
array_push($output['header'], $scan);

// We expect JSON
echo json_encode($output);
