<?php
/**
 * by denisbespyatov/directchat
 */
namespace denisbespyatov\directchat;

use yii\web\AssetBundle;

/**
 * Class ConversationAsset
 * @package denisbespyatov\directchat
 *
 * @author Denis Bespyatov <denis@bespyatov.ru>
 * @since 1.0
 */
class ConversationAsset extends AssetBundle
{
    public $js = [
        'js/directChatConversations.js',
    ];

    public function init()
    {
        parent::init();
        $this->sourcePath = __DIR__ . '/assets';
    }
}
