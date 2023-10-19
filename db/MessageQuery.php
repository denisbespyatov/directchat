<?php
/**
 * by denisbespyatov/directchat
 */
namespace denisbespyatov\directchat\db;

use yii\db\ActiveQuery;

/**
 * Class MessageQuery
 * @package denisbespyatov\directchat\db
 *
 * @author Denis Bespyatov <denis@bespyatov.ru>
 * @since 1.0
 */
class MessageQuery extends ActiveQuery
{
    public function init()
    {
        parent::init();
        $this->alias('m');
    }

    /**
     * @param int $userId
     * @param int $contactId
     * @return $this
     * @since 2.0
     */
    public function between($userId, $contactId)
    {
        return $this->andWhere(['or',
            ['sender_id' => $contactId, 'receiver_id' => $userId, 'is_deleted_by_receiver' => false],
            ['sender_id' => $userId, 'receiver_id' => $contactId, 'is_deleted_by_sender' => false],
        ]);
    }
}
