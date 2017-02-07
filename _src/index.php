<?php
require $_SERVER['DOCUMENT_ROOT'].'/inc/smtlogin.php';
?>

<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<meta http-equiv="X-UA-Compatible" content="IE=edge" />
		<meta name="viewport" content="width=device-width, initial-scale=1" />
		<title>Excess Inventory Entry</title>

		<!-- Styles -->
		<link rel="stylesheet" type="text/css" href="/lib/font-awesome-4.7.0/css/font-awesome.min.css" />
		<link rel="stylesheet" href="/lib/bootstrap-3.3.7-dist/css/bootstrap.min.css" />
		<link rel="stylesheet" type="text/css" href="/lib/sweetalert/sweetalert.css" />
		<link href="css/index.css" rel="stylesheet" type="text/css" />
		<!-- jQuery -->
		<script type="text/javascript" src="/lib/jquery/jquery-3.1.1.min.js"></script>
		<!-- Libraries -->
		<script src="/lib/knockout-2.7.17/knockout.js"></script>
		<script src="/lib/bootstrap-3.3.7-dist/js/bootstrap.min.js"></script>
		<script src="/lib/sweetalert/sweetalert.min.js"></script>

		<script>
		var curPrinter = '<?php echo $_COOKIE['vrf_printer']; ?>',
		userName = '<?php echo $_SESSION['fullname']; ?>',
		userID = '<?php echo $_SESSION['userid']; ?>';
		</script>
		<!-- Our App -->
		<script type="text/javascript" src="js/index.js"></script>

	</head>
  <body>
    <div class="container-fluid">
      <div class="row">
        <div class="panel col-sm-6 col-sm-offset-3">
          <div class="panel-heading">
            <h3 class="panel-title">KO Grid Sample</h3>
          </div>
          <div clas="panel-body">
            100 records from the "bin_scan" table. <button id="load" class="btn btn-primary btn-sm pull-right">Load Data</button>
          </div>
          <table class="table">
            <thead>
              <tr>
                <th>Bin</th>
                <th>User Id</th>
                <th>Last Scan</th>
              </tr>
            </thead>
            <tbody data-bind='foreach: items'>
              <tr>
                <td><span data-bind='text: bin'></span></td>
                <td><span data-bind='text: userid'></span></td>
                <td><span data-bind='text: last_scan'></span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
	</body>
</html>
