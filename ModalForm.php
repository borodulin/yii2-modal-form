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

    public $single = true;

    public $options;

    public function init()
    {
        if (! $this->loginUrl && ! empty(\Yii::$app->user->loginUrl)) {
            $this->loginUrl = \Yii::$app->user->loginUrl;
        }
        $this->options = ArrayHelper::merge([
            'size' => $this->size,
            'loginUrl' => $this->loginUrl,
            'selector' => $this->selector,
            'single' => $this->single,
        ], (array) $this->options);
        ModalFormAsset::register($this->view);
    }

    public function run()
    {
        $options = json_encode($this->options);
        $this->view->registerJs("$.modalForm($options);");
    }
}