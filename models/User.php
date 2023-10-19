<?php
/**
 * by denisbespyatov/directchat
 */

namespace denisbespyatov\directchat\models;

use denisbespyatov\directchat\migrations\Migration;
use yii\base\NotSupportedException;
use yii\db\ActiveRecord;
use yii\db\Expression;
use yii\web\IdentityInterface;

/**
 * Class User
 * @package denisbespyatov\directchat\models
 *
 * @property string id
 * @property string email
 * @property string created_at
 *
 * Read Only attributes
 *
 * @property-read string name
 * @property-read string avatar
 *
 * @author Denis Bespyatov <denis@bespyatov.ru>
 * @since 1.0
 *
 */
class User extends ActiveRecord implements IdentityInterface
{
    private $_name;

    /**
     * @inheritDoc
     */
    public static function tableName()
    {
//        return Migration::TABLE_USER;
        return '{{%user}}';
    }

    /**
     * @inheritDoc
     */
    public function rules()
    {
        return [
            [$this->attributes(), 'safe']
        ];
    }

    /**
     * @inheritDoc
     */
    public function fields()
    {
        return [
            'id',
            'name',
            'avatar',
            'initials',
            'scheme',
//            'email',
//            'firstName' => 'firstname',
//            'lastName' => 'lastname',
//            'fullName' => function ($model) {
//                return $model->firstname . ' ' . $model->lastname;
//            },
        ];
    }


    /**
     * @inheritDoc
     */
    public function beforeSave($insert)
    {
        $this->created_at = new Expression('UTC_TIMESTAMP()');
        return parent::beforeSave($insert);
    }


    /**
     * @return string
     */
    public function getName()
    {
        if (null === $this->_name) {
            $this->_name = $this->firstname . ' ' . $this->lastname;
        }
        return $this->_name;
    }

    public function getInitials()
    {
        return mb_strtoupper(mb_substr($this->firstname, 0, 1).mb_substr($this->lastname, 0, 1));
    }

    public function getScheme()
    {
        return $this->id % 20;
    }

    /**
     * @param string $name
     */
    public function setName($name)
    {
        $this->_name = $name;
    }

    /**
     * @return string
     */
    public function getAvatar()
    {
        return $this->avatar;
    }

    /**
     * @return static[]
     */
    public static function getAll()
    {
        return static::find()->all();
    }


    /**
     * @inheritDoc
     * @return static
     */
    public static function findIdentity($id)
    {
        return static::findOne(['id' => $id]);
    }

    /**
     * @inheritDoc
     */
    public static function findIdentityByAccessToken($token, $type = null)
    {
        throw new NotSupportedException(get_called_class() . ' does not support findIdentityByAccessToken().');
    }

    /**
     * @inheritDoc
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @inheritDoc
     */
    public function getAuthKey()
    {
        return null;
    }

    /**
     * @inheritDoc
     */
    public function validateAuthKey($authKey)
    {
        return true;
    }
}
