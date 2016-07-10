<?php
require __DIR__ . '/../vendor/autoload.php';

$store      = new \Sta\SnackOptIn\Store();
$storeItems = $store->fetchAll();
//$gravatar   = new \Sta\SnackOptIn\Gravatar();

$Person = new \Sta\SnackOptIn\Entity\Person();
$Person->setEmail($_POST['person']);
$schedule = json_decode($_POST['schedule']);
$schedules = [];

foreach ($schedule as $item) {
    $Schedule = new \Sta\SnackOptIn\Entity\Schedule();
    $Schedule->setDate(new DateTime($item->date));
    $Schedule->setGoing($item->going);
    $Schedule->setGuests((int)($item->guests > 0 ? $item->guests : 0));
    array_push($schedules, $Schedule);
}

$Person->setSchedule($schedules);
$store->addItem($Person);

header('Content-type: application/json');
echo json_encode(true);
