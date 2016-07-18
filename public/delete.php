<?php
/**
 * Created by PhpStorm.
 * User: jlopes
 * Date: 7/17/16
 * Time: 8:46 PM
 */

require __DIR__ . '/../vendor/autoload.php';

$store      = new \Sta\SnackOptIn\Store();
$response = false;

if (!isset($_POST['person'])) {
    $response = ['error' => 'Please check your email.'];
}

if (!isset($_POST['schedule'])) {
    $response = ['error' => 'Please check schedules.'];
}

if (!$response) {
    try {
        $person = $store->byEmail($_POST['person']);
        $data = json_decode($_POST['schedule']);
        $schedule = new \Sta\SnackOptIn\Entity\Schedule();
        $schedule->setDate(new DateTime($data->date));
        $schedule->setGoing($data->going);
        $schedule->setGuests((int)($data->guests > 0 ? $data->guests : 0));

        $person->removeSchedule($schedule);

        $store->addItem($person);

        $response = true;
    } catch (Exception $e) {
        $response = ['error' => $e->getMessage()];
    }
}

header('Content-type: application/json');
echo json_encode($response);