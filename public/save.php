<?php
require __DIR__ . '/../vendor/autoload.php';

$store      = new \Sta\SnackOptIn\Store();
$storeItems = $store->fetchAll();
//$gravatar   = new \Sta\SnackOptIn\Gravatar();

$response = false;
if (!isset($_POST['person'])) {
    $response = ['error' => 'Please check your email.'];
}

if (!isset($_POST['schedule'])) {
    $response = ['error' => 'Please check schedules.'];
}

if (!$response) {
    try {
        if (!$Person = $store->byEmail($_POST['person'])) {
            $Person = new \Sta\SnackOptIn\Entity\Person();
            $Person->setEmail($_POST['person']);
        }

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

        if (!array_key_exists('date', (array) $data)) {
            foreach ($data as $item) {
                $Schedule = new \Sta\SnackOptIn\Entity\Schedule();
                $Schedule->setDate(strToDate($item->date))
                         ->setGoing($item->going)
                         ->setGuests((int)($item->guests > 0 ? $item->guests : 0));
                $Person->addSchedule($Schedule);
            }
        } else {
            $schedule = new \Sta\SnackOptIn\Entity\Schedule();
            $schedule->setDate(strToDate($data->date))
                     ->setGuests($data->guests)
                     ->setGoing($data->going);
            $Person->addSchedule($schedule);
        }

        $store->addItem($Person);
        $response = true;
    } catch (Exception $e) {
        $response = ['error' => $e->getMessage()];
    }
}

header('Content-type: application/json');
echo json_encode($response);
