<?php
require __DIR__ . '/../vendor/autoload.php';

$store      = new \Sta\SnackOptIn\Store();
$storeItems = $store->fetchAll();
//$gravatar   = new \Sta\SnackOptIn\Gravatar();

// @todo precisamos testar todos os argumentos para ver se existe. se não existir retornar alguma msg.

if (!$Person = $store->byEmail($_POST['person'])) {
    $Person = new \Sta\SnackOptIn\Entity\Person();
    $Person->setEmail($_POST['person']);
}

$data = json_decode($_POST['schedule']);

if (!array_key_exists('date', (array) $data)) {
    foreach ($data as $item) {
        $Schedule = new \Sta\SnackOptIn\Entity\Schedule();
        $Schedule->setDate(new DateTime($item->date));
        $Schedule->setGoing($item->going);
        $Schedule->setGuests((int)($item->guests > 0 ? $item->guests : 0));
        $Person->addSchedule($Schedule);
    }
} else {
    $schedule = new \Sta\SnackOptIn\Entity\Schedule();
    $schedule->setDate(new DateTime($data->date));
    $schedule->setGuests($data->guests);
    $schedule->setGoing($data->going);
    $Person->addSchedule($schedule);
}

$store->addItem($Person);

header('Content-type: application/json');
echo json_encode(true);
