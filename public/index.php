<?php
use Sta\SnackOptIn\Dirs;
use Sta\SnackOptIn\View\Helper\GetAssetFileName;

require __DIR__ . '/../vendor/autoload.php';

$store      = new \Sta\SnackOptIn\Store();
$storeItems = $store->fetchAll();
$getAssetFileName = new GetAssetFileName();
$urlDist = Dirs::dist(true, true);
?>
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
        <meta http-equiv="x-ua-compatible" content="ie=edge">

        <title>Lunch opt-in</title>

        <!-- Font Awesome -->
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.6.0/css/font-awesome.min.css">

        <!-- Bootstrap core CSS -->
        <link href="a/css/bootstrap.min.css" rel="stylesheet">

        <!-- Material Design Bootstrap -->
        <link href="a/css/mdb.min.css" rel="stylesheet">
        <link href="a/css/mdb-pro.css" rel="stylesheet">

        <!-- Your custom styles (optional) -->
        <link href="a/css/style.css" rel="stylesheet">

    </head>

    <body>
        <div id="page"></div>

        <!-- Modal -->
        <div class="modal fade" id="dlg" tabindex="-1">
            <div class="modal-dialog" role="document">
                <!--Content-->
                <div class="modal-content">
                    <!--Header-->
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                        <h4 class="modal-title" id="dlgTitle"></h4>
                    </div>
                    <!--Body-->
                    <div class="modal-body" id="dlgBody">
                    </div>
                    <!--Footer-->
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-primary" id="dlgSave">Save changes</button>
                    </div>
                </div>
                <!--/.Content-->
            </div>
        </div>


        <!-- SCRIPTS -->

        <!-- JQuery -->
        <script type="text/javascript" src="a/js/vendor/jquery-2.2.3.min.js"></script>

        <!-- Bootstrap tooltips -->
        <script type="text/javascript" src="a/js/vendor/tether.min.js"></script>

        <!-- Bootstrap core JavaScript -->
        <script type="text/javascript" src="a/js/vendor/bootstrap.min.js"></script>

        <!-- MDB core JavaScript -->
        <script type="text/javascript" src="a/js/vendor/mdb.min.js"></script>
        <script type="text/javascript" src="<?php echo $urlDist . $getAssetFileName->getLayerFileName('main', 'en', 'en') ?>"></script>
        <script type="text/javascript" src="<?php echo $urlDist . $getAssetFileName->getLayerFileName('home', 'en', 'en') ?>"></script>

    </body>

</html>
