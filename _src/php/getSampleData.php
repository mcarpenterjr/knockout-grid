<?php
$root = $_SERVER['DOCUMENT_ROOT'] ? $_SERVER['DOCUMENT_ROOT'] : $_SERVER['HOME'];
require  "$root/inc/dbConn.php";

$db = new dbConn('devbox');

$SQL = "SELECT
          reportID,
          testID,
          eventDateTime,
          userID,
          eventType,
          workstation,
          note
        FROM
          cetec.testtracker_event
        WHERE
          userID IS NOT NULL
        ORDER BY
          eventDateTime
        DESC LIMIT
          100";

$data = $db->getResult($SQL);
$output['rows'] = $data;

// For this simplified case we do this setup manually without class.
// Looking forward, if there was an API, this would be once and done.
// If we were to work at implementing a column class that looked at the 
// select statement of our query we could automate some of the values here.
// This is an over simplification of the model.

$output['header'] = array();

$report['title'] = "Report ID";
$report['data_type'] = "mixed";
$report['sort'] = true;
$report['search'] = true;
$report['col_name'] = "reportID";
array_push($output['header'], $report);

$test['title'] = "Test ID";
$test['data_type'] = "mixed";
$test['sort'] = true;
$test['search'] = true;
$test['col_name'] = "testID";
array_push($output['header'], $test);

$date['title'] = "Date";
$date['data_type'] = "date";
$date['sort'] = true;
$date['search'] = true;
$date['col_name'] = "eventDateTime";
array_push($output['header'], $date);

$user['title'] = "User";
$user['data_type'] = "string";
$user['sort'] = true;
$user['search'] = true;
$user['col_name'] = "userID";
array_push($output['header'], $user);

$event['title'] = "Event";
$event['data_type'] = "mixed";
$event['sort'] = true;
$event['search'] = true;
$event['col_name'] = "eventType";
array_push($output['header'], $event);

$workstation['title'] = "Workstation";
$workstation['data_type'] = "mixed";
$workstation['sort'] = true;
$workstation['search'] = true;
$workstation['col_name'] = "workstation";
array_push($output['header'], $workstation);

$note['title'] = "Notes";
$note['data_type'] = "mixed";
$note['sort'] = true;
$note['search'] = true;
$note['col_name'] = "note";
array_push($output['header'], $note);

// We expect JSON
echo json_encode($output);
