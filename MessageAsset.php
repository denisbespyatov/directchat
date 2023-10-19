<?php
/**
 * by denisbespyatov/directchat
 */
namespace denisbespyatov\directchat;

use yii\web\AssetBundle;

/**
 * Class MessageAsset
 * @package denisbespyatov\directchat
 *
 * @author Denis Bespyatov <denis@bespyatov.ru>
 * @since 1.0
 */
class MessageAsset extends AssetBundle
{
    public $js = [
        'js/directChatMessages.js',
    ];

    public function init()
    {
        parent::init();
        $this->sourcePath = __DIR__ . '/assets';
    }
}
