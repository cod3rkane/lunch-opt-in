<?php
namespace Sta\SnackOptIn;
use Sta\SnackOptIn\Exception\Exception;

/**
 * @author: Stavarengo
 */
class Dirs
{

	/**
	 * @var Dirs 
	 */
	private static $instance;
	/**
	 * @var array
	 */
	private static $cache = array();
    /**
     * @var string[]
     */
    protected $_dirs = null;
    /**
	 * @var bool
	 */
	private $init;

	private function __construct()
	{
	}

	public static function getInstance()
	{
		if (!self::$instance) {
			self::$instance = new self();
		}
		return self::$instance;
	}
	
	/**
	 * Retorna o diretorio root.
     * Quando $asUrl for true o retorno sempre é '/', visto que este é o root do ponto de vista HTTP.
     * Quando $asUrl for false o retorno será o caminho real do diretorio para o root do site, em outras palavras, é 
     * retornado o caminho para o diretorio '/' do HTTP.
     * Quando $asUrl for true, nunca retorna slash no final
	 * 
	 * @param bool $asUrl
	 *
	 * @return string
	 */
	public static function root($asUrl)
    {
        $key = self::k(null, $asUrl, null);
        if (!isset(self::$cache[$key])) {
            self::getInstance()->_init();
            
            if ($asUrl) {
                $basePath = rtrim($_SERVER['REQUEST_URI'], '/');
            } else {
                $basePath = self::trim(realpath(__DIR__ . '/../../public'));
            }

            self::$cache[$key] = self::normalize($basePath, $asUrl, false);
        }

        return self::$cache[$key];
        
    }
    
	public static function var_($asUrl, $slashAtEnd = false)
	{
        $key = self::k(null, $asUrl, $slashAtEnd);
		if (!isset(self::$cache[$key])) {
			self::getInstance()->_init();
			self::$cache[$key] = self::normalize(self::root($asUrl) . '/var', $asUrl, $slashAtEnd);
		}
		return self::$cache[$key];
	}
	
	public static function dist($asUrl, $slashAtEnd = false)
	{
        return self::normalize(self::root($asUrl) . '/dist', $asUrl, $slashAtEnd);
	}
    
	public static function assets($asUrl, $slashAtEnd = false)
	{
        return self::normalize(self::root($asUrl) . '/a', $asUrl, $slashAtEnd);
	}
    
	public static function img($asUrl, $slashAtEnd = false)
	{
        return self::normalize(self::assets($asUrl) . '/img', $asUrl, $slashAtEnd);
	}

    public static function css($asUrl, $slashAtEnd = false)
    {
        return self::normalize(self::assets($asUrl) . '/css', $asUrl, $slashAtEnd);
    }
    
    public static function js($asUrl, $slashAtEnd = false)
    {
        return self::normalize(self::assets($asUrl) . '/js', $asUrl, $slashAtEnd);
    }
    
    public static function data($slashAtEnd = false)
    {
        return self::normalize(self::root(false) . '/../data', false, $slashAtEnd);
    }
    
    public static function log($slashAtEnd = false)
    {
        return self::normalize(self::data(false) . '/log', false, $slashAtEnd);
    }

    public static function cache($slashAtEnd = false)
    {
        return self::normalize(self::data(false) . '/cache', false, $slashAtEnd);
    }
    
	private static function trim($path)
	{
		return rtrim($path, '/\\');
	}
	
	public function _init()
	{
        if (defined('INSTALL_SCRIPT')) {
            return;
        }
		if ($this->init == 'em-progresso') {
			return;
		}
		
		if (!$this->init) {
			$this->init = 'em-progresso';
            $dirs = $this->_getAllDirsNames();
			foreach ($dirs as $dir) {
                if (!file_exists($dir)) {
                    mkdir($dir, 0777, true);
                }
                if (!file_exists($dir)) {
                    throw new Exception('Falha ao tentar criar o diretório "' . $dir . '".');
                }
			}
			$this->init = true;
		}
		
	}

    /**
     * @return string[]
     */
    public static function getAllDirsNames()
    {
        return self::getInstance()->_getAllDirsNames();
    }

    /**
     * @return string[]
     */
    private function _getAllDirsNames()
    {
        if ($this->_dirs === null) {
            $this->_dirs = array();
            $thisClass  = $this;
            $reflection = new \ReflectionClass($thisClass);
            $methods = $reflection->getMethods(\ReflectionMethod::IS_STATIC);
            $ignoreMethods = array(
                'getInstance',
                'root',
                'trim',
                'normalize',
                'classNameToDirName',
                'getAllDirsNames',
                'k',
                'getFileNameWithLang'
            );
            foreach ($methods as $method) {
                $menthodName = $method->getName();
                if (!in_array($menthodName, $ignoreMethods)) {
                    $this->_dirs[] = forward_static_call(array($thisClass, $menthodName), false, false);
                }
            }
        }
        
        return $this->_dirs;
    }

	public static function normalize($path, $asUrl, $slashAtEnd)
	{
        $key = self::k($path, $asUrl, $slashAtEnd);
        if (!isset(self::$cache[$key])) {
            $slash = ($asUrl ? '/' : DIRECTORY_SEPARATOR);
            $otherSlash = ($slash == '/' ? '\\' : '/');
            
            $path = rtrim($path, $otherSlash . $otherSlash);
            $path = ($path == '' ? $slash : $path);
            $path .= ($slashAtEnd ? $slash : '');
            $path = str_replace($otherSlash, $slash, $path);
            
            $doubleSlash = $slash . $slash;
            while (strpos($path, $doubleSlash) !== false) {
                $path = str_replace($doubleSlash, $slash, $path);
            }
            self::$cache[$key] = $path;
        }
		
		return self::$cache[$key];
	}

    public static function classNameToDirName($classOrObject)
    {
        $class = (is_object($classOrObject) ? get_class($classOrObject) : $classOrObject);
        $class = str_replace('\\', DIRECTORY_SEPARATOR, $class);
        return $class;
    }
    
    private static function k($path, $asUrl, $slashAtTheEnd)
    {
        $name = debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 2)[1]['function'];
        $k = $name . $path . ($asUrl ? 1 : 0) . ($slashAtTheEnd ? 1 : 0);

        return $k;
    }

}
Dirs::getInstance()->_init();
