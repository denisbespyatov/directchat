<?php
use yii\helpers\Html;
?>
<div class="__chatUser <?=$settings['itemCssClass']?> <?= $model['newMessages']['count'] > 0 ? $settings['unreadCssClass'] : '' ?> <?= $isCurrent ? $settings['currentCssClass'] : '' ?>"
     data-key="<?= $key ?>"
     data-contact="<?= $model['contact']['id'] ?>"
     data-contactinfo="<?= Html::encode(json_encode($model['contact'])) ?>"
     data-unreadurl="<?= $model['unreadUrl'] ?>"
     data-readurl="<?= $model['readUrl'] ?>"
     data-deleteurl="<?= $model['deleteUrl'] ?>"
     data-loadurl="<?= $model['loadUrl'] ?>"
     data-sendurl="<?= $model['sendUrl'] ?>">
    <div class="__chatUserAvatarContainer">
        <div class="__chatUserAvatar __initialsScheme<?= $model['contact']['scheme'] ?>">
            <div class="__chatInitials"><?= $model['contact']['initials'] ?></div>
            <?= empty($model['contact']['avatar']) ? '' : '<img src="'.$settings['baseUrl'].'/img/avatars/'.$model['contact']['avatar'].'" alt="'.$model['contact']['name'].'" />'?>
        </div>
    </div>
    <div class="__chatUserInfo">
        <h4><?= $model['contact']['name'] ?></h4>
        <small><?= $model['lastMessage']['text'] ?></small>
    </div>
    <div class="__chatUserExtra">
        <div>
            <small class="time"><?= $model['lastMessage']['date'] ?></small>
            <span class="badge bg-success msg-new ms-1"><?= $model['newMessages']['count'] > 0 ? $model['newMessages']['count'] : '' ?></span>
        </div>
        <div>
            <ul class="list-inline mb-0 lh-1">
                <li>
                    <a class="close" title="<?= $model['newMessages']['count'] > 0 ? $settings['markAsRead'] : $settings['markAsUnread'] ?>">
                        <small class="small-icon" aria-hidden="true">
                            <i class="bi bi-circle<?= $model['newMessages']['count'] > 0 ? '' : '-fill' ?>"></i>
                        </small>
                    </a>
                </li>
                <li>
                    <a class="close" title="<?=$settings['archive']?>">
                        <small class="small-icon" aria-hidden="true">
                            <i class="bi bi-x-lg"></i>
                        </small>
                    </a>
                </li>
            </ul>
        </div>
    </div>
</div>
