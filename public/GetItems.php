<?php
/**
 * Created by Cod3r Kane.
 * Date: 7/8/16
 * Time: 6:35 PM
 */

require __DIR__ . '/../vendor/autoload.php';

$store      = new \Sta\SnackOptIn\Store();
$storeItems = $store->fetchAll();
$items = [];

foreach ($storeItems as $person) {
    $schedules = [];
    foreach ($person->getSchedule() as $schedule) {
        array_push($schedules, [
            'date' => $schedule->getDate(),
            'going' => $schedule->getGoing(),
            'guests' => $schedule->getGuests()
        ]);
    }

    array_push($items, [
        'email' => $person->getEmail(),
        'schedule' => $schedules
    ]);
}

header('Content-type: application/json');
echo json_encode($items);