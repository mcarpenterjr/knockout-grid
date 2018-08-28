<?php
require $_SERVER['DOCUMENT_ROOT'].'/inc/smtlogin.php';
?>

<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<meta http-equiv="X-UA-Compatible" content="IE=edge" />
		<meta name="viewport" content="width=device-width, initial-scale=1" />
		<title>KO Grid Sample</title>

		<!-- Styles -->
		<link rel="stylesheet" href="/lib/bootstrap-3.3.7-dist/css/bootstrap.min.css" />
		<link rel="stylesheet" href="/lib/bootstrap-3.3.7-dist/css/bootstrap-theme.min.css" />
		<link rel="stylesheet" type="text/css" href="/lib/sweetalert/sweetalert.css" />
		<link href="css/index.css" rel="stylesheet" type="text/css" />
		<!-- jQuery -->
		<script type="text/javascript" src="/lib/jquery/jquery-3.1.1.min.js"></script>
		<!-- Libraries -->
		<script src="/lib/fontawesome-pro-5.2.0/js/all.min.js" data-auto-replace-svg="nest"></script>
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
				<div class="col-sm-3">
					<div class="panel panel-default">
						<div class="panel-heading">
							<h3 class="panel-title"> List controls (Mockup)</h3>
						</div>
						<div class="panel-body">
							<button class="btn btn-primary btn-sm"><i class="fas fa-plus fa-lg"></i></button>
							<button class="btn btn-primary btn-sm"><i class="fas fa-minus fa-lg"></i></button>
							<button class="btn btn-primary btn-sm"><i class="fas fa-sync-alt fa-lg"></i></button>
							<button class="btn btn-primary btn-sm"><i class="fas fa-undo-alt fa-lg"></i></button>
							<button class="btn btn-primary btn-sm"><i class="fas fa-columns fa-lg"></i></button>
						</div>
					</div>
					<div class="panel panel-info">
						<div class="panel-heading">
							<h3 class="panel-title">Just a Gentle Reminder</h3>
						</div>
						<div class="panel-body">
							<p>1000 Records from the bin_scan table. The purpose of this
							list is to show the simplicity and strength the KOjs lib offers.
						  KO is simply iterating over json data received though an ajax request using an external php file.</p>
							<p>This example showcases a new method of creating custom extendable grids from JSON data. Grids are specified by Custom HTML Elements and basic functionality; themeing, serching, sorting, paging, responsiveness... are all controlled by attributes on the element. This module creates an actual table element keeping semantics in tact.</p>
              <p><a href="http://dev2/gitlab/mcarpenter/knockout-grid">View the README</a></p>
							<p>Documentation on KO is always avaiable on the <a href="http://www.knockoutjs.com" target="_blank">knockoutJS</a> website.</p>
						</div>
					</div>
				</div>
				<div class="col-sm-9">
	        <div class="panel panel-default">
	          <div class="panel-heading">
	            <h3 class="panel-title">KO Grid Sample</h3>
	          </div>
	          <div class="panel-body">
							<p>100 records from the "bin_scan" table.
							<button id="load" class="btn btn-primary btn-sm pull-right">Load Data</button>
							</p>
	          </div>
            <ko-table source="php/getSampleData.php" responsive="true" hover="true" borders="true" fixed-header="true" striped="true" theme="boot-strap" compact="true" filterable="true" paging="true" sortable="true">
            </ko-table>
          </div>
          <div class="panel panel-default">
	          <div class="panel-heading">
	            <h3 class="panel-title">KO Grid Sample</h3>
	          </div>
	          <div class="panel-body">
							<p>100 records from the "bin_scan" table.
							<button id="load" class="btn btn-primary btn-sm pull-right">Load Data</button>
							</p>
	          </div>
            <ko-table source="php/getSampleData.php" responsive="true" hover="true" borders="true" fixed-header="true" striped="true" theme="boot-strap" compact="true" filterable="true" paging="true">
            </ko-table>
          </div>
          <div class="panel panel-default">
	          <div class="panel-heading">
	            <h3 class="panel-title">KO Grid Sample</h3>
	          </div>
	          <div class="panel-body">
							<p>100 records from the "bin_scan" table.
							<button id="load" class="btn btn-primary btn-sm pull-right">Load Data</button>
							</p>
	          </div>
            <ko-table source="php/getSampleData.php" responsive="true" hover="true" borders="true" fixed-header="true" striped="true" theme="boot-strap" compact="true" filterable="true" paging="true">
            </ko-table>
          </div>
          <div class="panel panel-default">
	          <div class="panel-heading">
	            <h3 class="panel-title">KO Grid Sample</h3>
	          </div>
	          <div class="panel-body">
							<p>100 records from the "bin_scan" table.
							<button id="load" class="btn btn-primary btn-sm pull-right">Load Data</button>
							</p>
	          </div>
            <ko-table source="php/getSampleData.php" responsive="true" hover="true" borders="true" fixed-header="true" striped="true" theme="boot-strap" compact="true" filterable="true" paging="true">
            </ko-table>
          </div>
				</div>
      </div>
    </div>
	</body>
</html>
