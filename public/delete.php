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

        /**
         * @param $str
         * @return DateTime
         */
        function strToDate($str) {
            $dateStr = explode('-', substr($str, 0, 10));
            $date = new DateTime();
            $date->setTimezone(new DateTimeZone('America/Sao_Paulo'))
                ->setDate($dateStr[0], $dateStr[1], $dateStr[2])
                ->setTime(0,0,0);
            return $date;
        }

        $date = strToDate($data->date);

        $mySchedules = $person->getSchedule();
        foreach ($mySchedules as $item) {
            if ($item->getDate()->setTimezone(new DateTimeZone('America/Sao_Paulo'))->setTime(0,0,0) == $date) {
                $person->removeSchedule($item);
            }
        }

        $store->addItem($person);

        $response = true;
    } catch (Exception $e) {
        $response = ['error' => $e->getMessage()];
    }
}

header('Content-type: application/json');
echo json_encode($response);