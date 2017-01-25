<?php
/**
 * @link https://github.com/borodulin/yii2-modal-form
 * @copyright Copyright (c) 2015 Andrey Borodulin
 * @license https://github.com/borodulin/yii2-modal-form/blob/master/LICENSE
 */
namespace conquer\modal;

use yii\base\Widget;
use yii\helpers\ArrayHelper;

class ModalForm extends Widget
{

    const SIZE_LARGE = "modal-lg";

    const SIZE_SMALL = "modal-sm";

    const SIZE_DEFAULT = "";

    public $size;

    public $loginUrl;

    public $selector = '.modal-form';

    public $singleton = true;

    public $options;

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
        ModalFormAsset::register($this->view);
    }

    public function run()
    {
        $options = json_encode($this->options);
        if ($this->selector) {
            $js = <<<JS
$('body').on('click', '{$this->selector}', function() {
    var options = $.extend($options, $(this).data());
    $.createModalForm(options).ajaxContent({url : $(this).attr('href') || $(this).data('url')});;
    return false;
});
JS;
            $this->view->registerJs($js);
        }

    }
}