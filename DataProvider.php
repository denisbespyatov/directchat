<?php
/**
 * by denisbespyatov/directchat
 */
namespace denisbespyatov\directchat;

use yii\base\Arrayable;
use yii\base\ArrayableTrait;
use yii\data\ActiveDataProvider;
use yii\helpers\ArrayHelper;

/**
 * Class DataProvider
 * @package denisbespyatov\directchat
 *
 * @author Denis Bespyatov <denis@bespyatov.ru>
 * @since 1.0
 */
class DataProvider extends ActiveDataProvider implements Arrayable
{
    use ArrayableTrait;

    /**
     * @inheritDoc
     */
    public function fields()
    {
        return [
            'totalCount',
            'keys',
            'models',
        ];
    }

    /**
     * @inheritDoc
     */
    public function getModels()
    {
        return ArrayHelper::toArray(parent::getModels());
    }
}
