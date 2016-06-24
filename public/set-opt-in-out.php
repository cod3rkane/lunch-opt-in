<?php
require __DIR__ . '/../vendor/autoload.php';

$store      = new \Sta\SnackOptIn\Store();
$storeItems = $store->fetchAll();
$gravatar   = new \Sta\SnackOptIn\Gravatar();

$item = new \Sta\SnackOptIn\Entity\Person();
$item->setEmail($_POST['email']);
$item->setSchedule($_POST['schedule']);

$store->add($item);

header('Content-type: application/json');
echo json_encode($store->toArray());
