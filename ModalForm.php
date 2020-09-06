<?php
/**
 * @link https://github.com/borodulin/yii2-modal-form
 * @copyright Copyright (c) 2015 Andrey Borodulin
 * @license https://github.com/borodulin/yii2-modal-form/blob/master/LICENSE
 */
namespace conquer\modal;

use yii\base\Widget;
use yii\helpers\ArrayHelper;
use conquer\modal\ModalFormAsset;
use conquer\modal\ModalFormAsset4;

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

    public $size;

    public $loginUrl;

    public $selector = '.modal-form';

    public $singleton = true;

    public $options;

    public $clientOptions;

    private $_bsVersion;

    public $forceBsVersion = false;

    public function init()
    {
        if (! $this->loginUrl && ! empty(\Yii::$app->user->loginUrl)) {
            $this->loginUrl = \Yii::$app->user->loginUrl;
        }
        $this->options = ArrayHelper::merge([
            'size' => $this->size,
            'loginUrl' => $this->loginUrl,
            'singleton' => $this->singleton,
        ], (array) $this->options);

        //force bootstrap version usage
        if ($this->forceBsVersion) {
            $this->_bsVersion = self::BS_4;
        }

        //dynamic asset version here
        $assetClassName = 'conquer\modal\ModalFormAsset'.$this->_bsVersion;
        $class = $assetClassName;
        $class::register($this->view);
        
    }

    public function run()
    {
        $options = json_encode($this->options);
        $clientOptions = json_encode($this->clientOptions);
        if ($this->selector) {
            $js = <<<JS
$('body').on('click', '{$this->selector}', function() {
    var options = $.extend($options, $(this).data());
    $.createModalForm(options, $clientOptions).ajaxContent({url : $(this).attr('href') || $(this).data('url')});;
    return false;
});
JS;
            $this->view->registerJs($js);
        }

    }
}