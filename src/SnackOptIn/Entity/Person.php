<?php
/**
 * snack-opt-in Project ${PROJECT_URL}
 *
 * @link      ${GITHUB_URL} Source code
 */

namespace Sta\SnackOptIn\Entity;

class Person extends AbstractEntity
{
    /**
     * @var string
     */
    protected $email;
    /**
     * @var Schedule[]
     */
    protected $schedule = [];

    /**
     * @return string
     */
    public function getEmail()
    {
        return $this->email;
    }

    /**
     * @param string $email
     */
    public function setEmail($email)
    {
        $this->email = $email;
    }

    /**
     * @return Schedule[]
     */
    public function getSchedule()
    {
        return $this->schedule;
    }

    /**
     * @param Schedule[] $schedule
     */
    public function setSchedule(array $schedule)
    {
        $this->schedule = $schedule;
    }

    public function removeSchedule(Schedule $schedule)
    {
        $dateStr        = $schedule->getDate()->format('dmy');
        $this->schedule = array_filter(
            $this->schedule,
            function (Schedule $currSchedule) use ($dateStr) {
                return $currSchedule->getDate()->format('dmy') != $dateStr;
            }
        );

        return $this;
    }

    public function addSchedule(Schedule $newSchedule)
    {
        $this->removeSchedule($newSchedule);
        $this->schedule[] = $newSchedule;
    }
    
}
