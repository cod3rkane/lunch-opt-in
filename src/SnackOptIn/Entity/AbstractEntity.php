<?php
/**
 * snack-opt-in Project ${PROJECT_URL}
 *
 * @link      ${GITHUB_URL} Source code
 */

namespace Sta\SnackOptIn\Entity;

abstract class AbstractEntity
{
    /**
     * @var \ReflectionClass
     */
    protected $reflectionClass;

    public function __construct()
    {
        $this->reflectionClass = new \ReflectionClass($this);
    }

    public function toJson()
    {
        return json_encode($this->toArray());
    }

    public function toArray()
    {
        $array = [];
        foreach ($this->reflectionClass->getProperties() as $property) {
            $methodName = 'get' . ucfirst($property->getName());
            if (!$this->reflectionClass->hasMethod($methodName)) {
                continue;
            }

            $refMethod                   = $this->reflectionClass->getMethod($methodName);
            $array[$property->getName()] = $this->normalizeValue(call_user_func([$this, $methodName]), $refMethod);
        }

        return $array;
    }

    private function normalizeValue($value, \ReflectionMethod $method)
    {
        if (is_array($value)) {
            $value = array_map(
                function ($item) use ($method) {
                    return $this->normalizeValue($item, $method);
                },
                $value
            );
        } else if ($value instanceof AbstractEntity) {
            $value = $value->toArray();
        } else if (is_object($value)) {
            if ($value instanceof \DateTime) {
                /** @var \DateTime $value */
                $value = $value->format(DATE_ISO8601);
            } else {
                $value = (string)$value;
            }
        }

        return $value;
    }
}
