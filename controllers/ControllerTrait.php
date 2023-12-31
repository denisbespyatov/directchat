<?php
/**
 * by denisbespyatov/directchat
 */
namespace denisbespyatov\directchat\controllers;

use denisbespyatov\directchat\DataProvider;
use denisbespyatov\directchat\db\Conversation;
use denisbespyatov\directchat\db\Message;
use yii\base\NotSupportedException;
use yii\filters\ContentNegotiator;
use yii\web\IdentityInterface;
use yii\web\Response;
use yii\web\ForbiddenHttpException;

/**
 * Trait DefaultController
 * @package denisbespyatov\directchat\controllers
 *
 * @author Denis Bespyatov <denis@bespyatov.ru>
 * @since 2.0
 *
 * @property-read IdentityInterface user
 * @property-read string messageClass
 * @property-read string conversationClass
 */
trait ControllerTrait
{
    public function behaviors()
    {
        return [
            [
                'class' => ContentNegotiator::className(),
                'only' => [
                    'messages',
                    'create-message',
                    'conversations',
                    'delete-conversation',
                    'mark-conversation-as-read',
                    'mark-conversation-as-unread',
                ],
                'formats' => [
                    'application/json' => Response::FORMAT_JSON,
                ],
            ],
            'access' => [
                'class' => \yii\filters\AccessControl::class,
                'only' => [
                    'messages',
                    'conversations',
                    'create-message',
                    'delete-conversation',
                    'mark-conversation-as-read',
                    'mark-conversation-as-unread',
                ],
                'rules' => [
                    [
                        'allow' => false,
//                        'verbs' => ['POST'],
                        'roles' => ['?'],

                    ],
                    [
                        'allow' => true,
                        'roles' => ['@'],
                    ],
                ],
            ],
        ];
    }

    /**
     * @inheritdoc
     */
    public function afterAction($action, $result)
    {
        $result = parent::afterAction($action, $result);
        if ($result instanceof DataProvider) {
            return $result->toArray();
        }
        return $result;
    }

    public function actionConversations()
    {
        $userId = $this->user->getId();
        $request = \Yii::$app->request;
        $limit = $request->get('limit', $request->post('limit'));
        $key = $request->get('key', $request->post('key'));
        $history = strcmp('new', $request->get('type', $request->post('type')));
        /** @var $conversationClass Conversation */
        $conversationClass = $this->conversationClass;
        return $conversationClass::get($userId, $limit, $history, $key);
    }

    public function actionMessages($contactId)
    {
        $userId = $this->user->getId();
        $request = \Yii::$app->request;
        $limit = $request->get('limit', $request->post('limit'));
        $key = $request->get('key', $request->post('key'));
        $history = strcmp('new', $request->get('type', $request->post('type')));
        /** @var $messageClass Message */
        $messageClass = $this->messageClass;
        return $messageClass::get($userId, $contactId, $limit, $history, $key);
    }

    public function actionCreateMessage($contactId)
    {
        $userId = $this->user->getId();
        if ($userId == $contactId) {
            throw new ForbiddenHttpException('You cannot send a message in this conversation');
        }
        $text = \Yii::$app->request->post('text');
        /** @var $messageClass Message */
        $messageClass = $this->messageClass;
        return $messageClass::create($userId, $contactId, $text);
    }

    public function actionDeleteMessage($id)
    {
        throw new NotSupportedException(get_class($this) . " does not support actionDeleteMessage($id).");
    }

    public function actionDeleteConversation($contactId)
    {
        $userId = $this->user->getId();
        /** @var $conversationClass Conversation */
        $conversationClass = $this->conversationClass;
        return $conversationClass::remove($userId, $contactId);
    }

    public function actionMarkConversationAsRead($contactId)
    {
        $userId = $this->user->getId();
        /** @var $conversationClass Conversation */
        $conversationClass = $this->conversationClass;
        return $conversationClass::read($userId, $contactId);
    }

    public function actionMarkConversationAsUnread($contactId)
    {
        $userId = $this->user->getId();
        /** @var $conversationClass Conversation */
        $conversationClass = $this->conversationClass;
        return $conversationClass::unread($userId, $contactId);
    }

    /**
     * @return IdentityInterface
     */
    public function getUser()
    {
        return \Yii::$app->user->identity;
    }

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
