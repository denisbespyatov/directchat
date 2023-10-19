<?php
/**
 * by denisbespyatov/directchat
 */
namespace denisbespyatov\directchat;

use yii\web\AssetBundle;

/**
 * Class BaseAsset
 * @package denisbespyatov\directchat
 *
 * @author Denis Bespyatov <denis@bespyatov.ru>
 * @since 1.0
 */
class BaseAsset extends AssetBundle
{
    public $css = [
        'css/default.css',
    ];

    public $depends = [
        'yii\web\YiiAsset',
        'yii\bootstrap5\BootstrapAsset',
    ];

    public function init()
    {
        parent::init();
        $this->sourcePath = __DIR__ . '/assets';
    }
}
