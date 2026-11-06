<?php
/**
 * @link https://github.com/borodulin/yii2-modal-form
 * @copyright Copyright (c) 2015 Andrey Borodulin
 * @license https://github.com/borodulin/yii2-modal-form/blob/master/LICENSE
 */
namespace conquer\modal;

use yii\base\Widget;
use yii\helpers\ArrayHelper;
use yii\helpers\Json;
use yii\helpers\Url;
use conquer\modal\ModalFormAsset;
use conquer\modal\ModalFormAsset4;
use conquer\modal\ModalFormAsset5;

class ModalForm extends Widget
{

    const SIZE_LARGE = "modal-lg";

    const SIZE_SMALL = "modal-sm";

    const SIZE_DEFAULT = "";

    /**
     * BS VERSION
     */
    const BS_3 = 3;
    const BS_4 = 4;
    const BS_5 = 5;

    public $size;

    public $loginUrl;

    public $selector = '.modal-form';

    public $singleton = true;

    public $options;

    public $clientOptions;

    /**
     * Bootstrap version: 3, 4 or 5.
     * null (default) detects it from the installed Yii Bootstrap extension
     * (yii2-bootstrap, then yii2-bootstrap4, then yii2-bootstrap5).
     * @var int|null
     */
    public $bsVersion;

    public function init()
    {
        if (! $this->loginUrl && \Yii::$app->has('user') && ! empty(\Yii::$app->user->loginUrl)) {
            $this->loginUrl = \Yii::$app->user->loginUrl;
        }
        if ($this->bsVersion === null) {
            $this->bsVersion = static::detectBsVersion();
        }
        $this->options = ArrayHelper::merge([
            'size' => $this->size,
            // routes such as the default ['site/login'] must be turned into a URL for the browser
            'loginUrl' => $this->loginUrl ? Url::to($this->loginUrl) : null,
            'singleton' => $this->singleton,
        ], (array) $this->options);

        $assets = [
            self::BS_3 => ModalFormAsset::class,
            self::BS_4 => ModalFormAsset4::class,
            self::BS_5 => ModalFormAsset5::class,
        ];
        $version = (int) $this->bsVersion;
        if (!isset($assets[$version])) {
            throw new \yii\base\InvalidConfigException("Unsupported bsVersion: {$this->bsVersion}");
        }
        $class = $assets[$version];
        $class::register($this->view);
        
    }

    /**
     * @return int Bootstrap version of the installed Yii Bootstrap extension, 3 if none is found
     */
    public static function detectBsVersion()
    {
        if (class_exists('yii\bootstrap\BootstrapPluginAsset')) {
            return self::BS_3;
        }
        if (class_exists('yii\bootstrap4\BootstrapPluginAsset')) {
            return self::BS_4;
        }
        if (class_exists('yii\bootstrap5\BootstrapPluginAsset')) {
            return self::BS_5;
        }
        return self::BS_3;
    }

    public function run()
    {
        $options = Json::htmlEncode($this->options);
        $clientOptions = Json::htmlEncode($this->clientOptions);
        if ($this->selector) {
            $selector = Json::htmlEncode($this->selector);
            $js = <<<JS
$('body').on('click', {$selector}, function() {
    var options = $.extend($options, $(this).data());
    $.createModalForm(options, $clientOptions).ajaxContent({url : $(this).attr('href') || $(this).data('url')});;
    return false;
});
JS;
            $this->view->registerJs($js);
        }

    }
}