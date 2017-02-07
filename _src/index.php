<?php
require $_SERVER['DOCUMENT_ROOT'].'/mc-dev/smtlogin.php';
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
          <div class="panel-body">

          </div>
        </div>
      </div>
    </div>
	</body>
</html>
