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
$now = new DateTime('now');
$now->setTime(0,0,0);
foreach ($storeItems as $person) {
    $schedules = [];
    foreach ($person->getSchedule() as $schedule) {
        $schedule->getDate()->setTime(0,0,0);
        $schedule->getDate()->setTimezone(new DateTimeZone('America/Sao_Paulo'));
        if ($schedule->getDate()->getTimestamp() >= $now->getTimestamp()) {
            array_push($schedules, [
                'date' => $schedule->getDate(),
                'going' => $schedule->getGoing(),
                'guests' => $schedule->getGuests()
            ]);
        } else {
            $person->removeSchedule($schedule);
        }
    }

    array_push($items, [
        'email' => $person->getEmail(),
        'schedule' => $schedules
    ]);

    $store->addItem($person);
}

header('Content-type: application/json');
echo json_encode($items);