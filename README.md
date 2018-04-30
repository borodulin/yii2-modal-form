Yii2 Ajax modal form
=================

## Description

This extension allows you to quickly add full-featured modal forms to your appllication.
Main featues are:

1. Based on bootstrap modal forms.
2. Allows quickly add behavior to interact with viewing and updating data in modal dialogs.
3. Catch form post events, converts them to ajax request and display results in the same modal dialog.

## Installation

The preferred way to install this extension is through [composer](http://getcomposer.org/download/). 

To install, either run

```
$ php composer.phar require conquer/modal "*"
```
or add

```
"conquer/modal": "*"
```

to the ```require``` section of your `composer.json` file.

## Usage
Somewhere in the main layout
```php
\conquer\modal\ModalForm::widget([
    'selector' => '.modal-form',
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

**conquer/modal** is released under the MIT License. See the bundled `LICENSE` for details.
