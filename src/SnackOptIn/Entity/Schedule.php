<?php
/**
 * snack-opt-in Project ${PROJECT_URL}
 *
 * @link      ${GITHUB_URL} Source code
 */

namespace Sta\SnackOptIn\Entity;

class Schedule extends AbstractEntity
{
    /**
     * @var \DateTime
     */
    protected $date;
    /**
     * @var boolean
     */
    protected $going;
    /**
     * @var int
     */
    protected $guests;

    /**
     * @return \DateTime
     */
    public function getDate()
    {
        return $this->date;
    }

    /**
     * @param \DateTime $date
     *
     * @return $this
     */
    public function setDate($date)
    {
        $this->date = $date;

        return $this;
    }

    /**
     * @return boolean
     */
    public function getGoing()
    {
        return $this->going;
    }

    /**
     * @param boolean $going
     *
     * @return $this
     */
    public function setGoing($going)
    {
        $this->going = $going;

        return $this;
    }

    /**
     * @return int
     */
    public function getGuests()
    {
        return $this->guests;
    }

    /**
     * @param int $guests
     *
     * @return $this
     */
    public function setGuests($guests)
    {
        $this->guests = $guests;

        return $this;
    }

}
