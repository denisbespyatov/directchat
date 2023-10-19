#Yii2 Direct chat
A simple chat for your yii2 application

##Installation

The preferred way to install this extension is through [composer](http://getcomposer.org/download/).

Either run

```
php composer.phar require --prefer-dist denisbespyatov/directchat
```

or add

```
"denisbespyatov/directchat": "*"
```

to the require section of your `composer.json` file.

##Demo

Once the extension is installed, simply modify your application configuration as follows:

```php
return [
    'bootstrap' => ['directchat'],
    'modules' => [
        'directchat' => [
            'class' => 'denisbespyatov\directchat\Module',
        ],
        // ...
    ],
    // ...
];
```

##Usage

Extend the main `conversation` class like follow:

```php
namespace common\models;

use common\models\User;
//...

class Conversation extends \denisbespyatov\directchat\db\Conversation
{
    public function getContact()
    {
        return $this->hasOne(User::className(), ['id' => 'contact_id']);
    }
    
    /**
     * @inheritDoc
     */
    protected static function baseQuery($userId)
    {
        return parent::baseQuery($userId) ->with(['contact.profile']);
    }
    
    /**
     * @inheritDoc
     */
    public function fields()
    {
        return [
            //...
            'contact' => function ($model) {
                return $model['contact'];
            },
            'deleteUrl',
            'readUrl',
            'unreadUrl',
            //...
        ];
    }
}
```

Extend the main `message` class like follow:

```php
namespace common\models;

//...

class Message extends \denisbespyatov\directchat\db\Message
{
    /**
     * @inheritDoc
     */
    public function fields()
    {
        return [
            //...
            'text',
            'date' => 'created_at',
            //...
        ];
    }
}
```

Create a controller like follow:

```php
namespace frontend\controllers;

//...
use yii\web\Controller;
use common\models\Conversation;
use common\models\Message;
use denisbespyatov\directchat\controllers\ControllerTrait;
//...

class MessageController extends Controller
{
    use ControllerTrait;
    
    /**
     * @return string
     */
    public function getMessageClass()
    {
        return Message::className();
    }

    /**
     * @return string
     */
    public function getConversationClass()
    {
        return Conversation::className();
    }
}
```
>Note: If you are using this extension in your frontend application, you can find the usage of widgets  in `index.twig`.
