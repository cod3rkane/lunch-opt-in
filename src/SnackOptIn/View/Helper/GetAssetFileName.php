<?php
/**
 * lunch-opt-in Project ${PROJECT_URL}
 *
 * @link      ${GITHUB_URL} Source code
 */

namespace Sta\SnackOptIn\View\Helper;

use Sta\SnackOptIn\Dirs;
use Sta\SnackOptIn\Exception\Exception;

class GetAssetFileName
{
    public function getLayerFileName($layerName, $currLocale, $fallbackLocale)
    {
        $files = scandir(Dirs::dist(false));
        foreach ($files as $file) {
            if (preg_match('!^' . $currLocale . '-' . preg_quote($layerName) . '(-.{20}\.|\.)js$!', $file)) {
                return $file;
            }
        }

        if ($fallbackLocale) {
            return $this->getLayerFileName($layerName, $fallbackLocale, null);
        }

        throw new Exception("There is no JS file for the layer '$layerName'.");
    }
}
