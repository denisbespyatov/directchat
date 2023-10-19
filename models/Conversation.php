<?php
/**
 * by denisbespyatov/directchat
 */

namespace denisbespyatov\directchat\models;

use yii\db\ActiveQuery;
use yii\helpers\StringHelper;
use yii\helpers\Url;
use yii\helpers\VarDumper;

/**
 * Class Conversation
 * @package denisbespyatov\directchat\models
 *
 * @property-read User contact
 *
 * @author Buba Suma <bubasuma@gmail.com>
 * @since 2.0
 */
class Conversation extends \denisbespyatov\directchat\db\Conversation
{
    /**
     * @return ActiveQuery
     */
    public function getContact()
    {
        return $this->hasOne(User::className(), ['id' => 'contact_id']);
    }

    /**
     * @inheritDoc
     */
    public function fields()
    {
        return [
            'lastMessage' => function ($model) {

            if (!isset($model['lastMessage'])) {
                VarDumper::dump($model,4,true);die();
            }
                return [
                    'text' => isset($model['lastMessage']['text']) ? StringHelper::truncate($model['lastMessage']['text'], 20) : "",
                    'date' => isset($model['lastMessage']['created_at']) ? static::formatDate($model['lastMessage']['created_at']) : "",
                    'senderId' => isset($model['lastMessage']['sender_id']) ? $model['lastMessage']['sender_id'] : null
                ];
            },
            'newMessages' => function ($model) {
                return [
                    'count' => count($model['newMessages'])
                ];
            },
            'contact' => function ($model) {
                return $model['contact'];
            },
            'loadUrl',
            'sendUrl',
            'deleteUrl',
            'readUrl',
            'unreadUrl',
        ];
    }

    /**
     * @inheritDoc
     */
    protected static function baseQuery($userId)
    {
        return parent::baseQuery($userId)->with(['newMessages', 'contact']);
    }

    public static function formatDate($value)
    {
        $today = date_create()->setTime(0, 0, 0);
        $date = date_create($value)->setTime(0, 0, 0);
        if ($today == $date) {
            $formatted = \Yii::$app->formatter->asTime($value, 'short');
        } elseif ($today->getTimestamp() - $date->getTimestamp() == 24 * 60 * 60) {
            $formatted = 'Yesterday';
        } elseif ($today->format('W') == $date->format('W') && $today->format('Y') == $date->format('Y')) {
            $formatted = \Yii::$app->formatter->asDate($value, 'php:D');
        } elseif ($today->format('Y') == $date->format('Y')) {
            $formatted = \Yii::$app->formatter->asDate($value, 'php:M d');
        } else {
            $formatted = \Yii::$app->formatter->asDate($value, 'medium');
        }
        return $formatted;
    }

    public function getLoadUrl()
    {
        return Url::to(['messages', 'contactId' => $this->contact_id]);
    }

    public function getSendUrl()
    {
        return Url::to(['create-message', 'contactId' => $this->contact_id]);
    }

    public function getDeleteUrl()
    {
        return Url::to(['delete-conversation', 'contactId' => $this->contact_id]);
    }

    public function getReadUrl()
    {
        return Url::to(['mark-conversation-as-read', 'contactId' => $this->contact_id]);
    }

    public function getUnreadUrl()
    {
        return Url::to(['mark-conversation-as-unread', 'contactId' => $this->contact_id]);
    }
}
