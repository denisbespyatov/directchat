<?php
/**
 * by denisbespyatov/directchat
 */
namespace denisbespyatov\directchat;

use yii\web\AssetBundle;

/**
 * Class ChatAsset
 * @package denisbespyatov\directchat
 *
 * @author Denis Bespyatov <denis@bespyatov.ru>
 * @since 1.0
 */
class ChatAsset extends AssetBundle
{
    public $css = [
//        '//netdna.bootstrapcdn.com/font-awesome/4.0.3/css/font-awesome.css',
//        'css/directChat.css',
//        'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css',
    ];
    public $js = [
        'js/directChat.js'
    ];
    public $depends = [
        'denisbespyatov\directchat\BaseAsset',
//        'denisbespyatov\directchat\TwigAsset',
    ];

    public function init()
    {
        parent::init();
        $this->sourcePath = __DIR__ . '/assets';
    }
}
