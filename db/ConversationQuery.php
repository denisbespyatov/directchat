<?php
/**
 * by denisbespyatov/directchat
 */
namespace denisbespyatov\directchat\db;

use yii\db\ActiveQuery;
use yii\db\Expression;

/**
 * Class ConversationQuery
 * @package denisbespyatov\directchat\db
 *
 * @author Denis Bespyatov <denis@bespyatov.ru>
 * @since 1.0
 */
class ConversationQuery extends ActiveQuery
{
    public function init()
    {
        parent::init();
        $this->alias('c');
        $this->select([
                 'last_message_id' => new Expression('MAX([[id]])'),
                 'contact_id' => new Expression('IF([[sender_id]] = :userId, [[receiver_id]], [[sender_id]])')
            ])
            ->andWhere(['or',
                ['receiver_id' => new Expression(':userId'), 'is_deleted_by_receiver' => false],
                ['sender_id' => new Expression(':userId'), 'is_deleted_by_sender' => false],
            ])
            ->groupBy(['contact_id']);
    }

    /**
     * @param int $userId
     * @return $this
     * @since 2.0
     */
    public function forUser($userId)
    {
        return $this->addParams(['userId' => $userId]);
    }
}
