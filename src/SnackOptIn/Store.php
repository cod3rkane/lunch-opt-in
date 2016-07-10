<?php
/**
 * snack-opt-in Project ${PROJECT_URL}
 *
 * @link      ${GITHUB_URL} Source code
 */

namespace Sta\SnackOptIn;

use Sta\SnackOptIn\Entity\Person;
use Sta\SnackOptIn\Entity\Schedule;
use Sta\SnackOptIn\Exception\EntityValidation;

class Store
{
    /**
     * @var Person[]
     */
    protected $items;
    /**
     * @var string
     */
    protected $file;

    public function __construct()
    {
        $this->file = $file = __DIR__ . '/../../data/store';
        $items      = [];
        if (file_exists($file)) {
            $items = unserialize(file_get_contents($file));
        }
        $this->items = $items;
    }

    /**
     * @return \Sta\SnackOptIn\Entity\Person[]
     */
    public function fetchAll()
    {
        return $this->items;
    }

    /**
     * @param $email
     *
     * @return Person
     */
    public function byEmail($email)
    {
        $email = strtolower($email);
        foreach ($this->fetchAll() as $person) {
            if (strtolower($person->getEmail()) == $email) {
                return $person;
            }
        }

        return null;
    }

    public function removeSchedule($email, \DateTime $date)
    {
        if ($person = $this->byEmail($email)) {
            if ($schedule = $this->getScheduleByPersonAndDate($email, $date)) {
                $person->removeSchedule($schedule);
            }
        }

        return true;
    }

    /**
     * @param $email
     * @param \DateTime $date
     *
     * @return \Sta\SnackOptIn\Entity\Schedule
     */
    public function getScheduleByPersonAndDate($email, \DateTime $date)
    {
        if ($person = $this->byEmail($email)) {
            $dateStr   = $date->format('dmy');
            $schedules = $person->getSchedule();
            foreach ($schedules as $schedule) {
                if ($schedule->getDate()->format('dmy') == $dateStr) {
                    return $schedule;
                }
            }
        }

        return null;
    }

    public function addSchedule($email, Schedule $newSchedule)
    {

    }

    public function addItem(Person $person)
    {
        if (!$personExist = $this->byEmail($person->getEmail()))
            array_push($this->items, $person);
        else
            $personExist->setSchedule($person->getSchedule());

        $this->write();
    }

//    public function toArray(array $items = null)
//    {
//        $gravatar = new \Sta\SnackOptIn\Gravatar();
//        $items    = array_map(
//            function (Entity\Person $item) use ($gravatar) {
//                return [
//                    'new' => '',
//                    'email' => $item->getEmail(),
//                    'name' => preg_replace('/@.+$/', '', $item->getEmail()),
//                    'domain' => preg_replace('/^.+?@/', '@', $item->getEmail()),
//                    'when' => $item->getSchedule()->format(DATE_ISO8601),
//                    'going' => $item->getGoing(),
//                    'guests' => $item->getGuests(),
//                    'img' => $gravatar->getUrl($item->getEmail(), 320),
//                ];
//            },
//            ($items ? $items : $this->fetchAll())
//        );
//
//        return $items;
//    }

    private function nextWorkingDay()
    {
        $tmpDate         = (new \DateTime())->format('Y-m-d');
        $holidays        = ['01-01', '04-21', '05-01', '07-09', '09-07', '10-12', '11-02', '11-15', '12-25'];
        $i               = 1;
        $nextBusinessDay = date('m-d', strtotime($tmpDate . ' +' . $i . ' Weekday'));

        while (in_array($nextBusinessDay, $holidays)) {
            $i++;
            $nextBusinessDay = date('m-d', strtotime($tmpDate . ' +' . $i . ' Weekday'));
        }

        return \DateTime::createFromFormat('Y-m-d', date('Y') . '-' . $nextBusinessDay);
    }

    private function write()
    {
        ErrorHandler::start();
        $sempahore = Semaphore::acquire(Semaphore::SEM_STORE_WRITE);
        try {
            $dir = dirname($this->file);
            if (!file_exists($dir)) {
                mkdir($dir, 0777, true);
            }

            file_put_contents($this->file, serialize($this->items));
            ErrorHandler::stop(true);
            Semaphore::release($sempahore);
        } catch (\Exception $e) {
            Semaphore::release($sempahore);
            throw $e;
        }
    }
}
