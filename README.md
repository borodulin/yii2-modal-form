# Yii2 Ajax modal form

[![Latest Version](https://img.shields.io/packagist/v/conquer/modal.svg)](https://packagist.org/packages/conquer/modal)
[![Total Downloads](https://img.shields.io/packagist/dt/conquer/modal.svg)](https://packagist.org/packages/conquer/modal)
[![License](https://img.shields.io/packagist/l/conquer/modal.svg)](LICENSE)

## Description

This extension allows you to quickly add full-featured modal forms to your appllication.
Main featues are:

1. Based on bootstrap modal forms.
2. Allows quickly add behavior to interact with viewing and updating data in modal dialogs.
3. Catch form post events, converts them to ajax request and display results in the same modal dialog.

## Requirements

- PHP 7.4 or 8.x
- Yii 2.0.4 or newer (2.0.x)

## Installation

Install the extension via [Composer](https://getcomposer.org):

```bash
composer require conquer/modal:^1.3
```

## Usage
Somewhere in the main layout
```php
\conquer\modal\ModalForm::widget([
    'selector' => '.modal-form',
]);
```
Bootstrap 4 and 5 are supported via `bsVersion` (default is `3`):
```php
\conquer\modal\ModalForm::widget([
    'selector' => '.modal-form',
    'bsVersion' => \conquer\modal\ModalForm::BS_5,
]);
```
Whenever you want to add behavior to tag a, just add class 'modal-form'
```php
    echo Html::a('Some modal action', ['controller/action'], ['class' => 'modal-form']);
``` 
To improve traffic data and error exceptions you need to control layout rendering when ajax requests.
I recommend you to override default rendering in your controllers:
```php
class Controller extends \yii\web\Controller
{
    /**
     * Exclude layout rendering when ajax requests
     */
    public function render($view, $params = [])
    {
        if (\Yii::$app->request->isAjax) {
            return $this->renderPartial($view, $params);
        }
        return parent::render($view, $params);
    }
}
``` 

### Client Options
To add client options use `clientOptions` key. Available client options are: `id`, `class`, `tabindex`. 
* Id key **replaces** existing auto generated id attribute. 
* Class key **adds** classes to html class attribute. 
* Tabindex key **replaces** existing default tabindex html attribute (-1), when false, then no tabindex attribute appears.
```
\conquer\modal\ModalForm::widget([
    'selector' => '.modal-form',
    'clientOptions' => [
        'id' => 'sample-unique-id',
        'class' => 'sample-class1 sample-class2',
        'tabindex' => false
    ]
]);
```

## License

**conquer/modal** is released under the MIT License. See the bundled [`LICENSE`](LICENSE) for details.
