<div class="<?=$settings['itemCssClass']?> <?=($sender['id'] == $user['id']) ? 'msg-right' : 'msg-left'?>" data-key="<?=$key?>">
    <?php /*<a class="pull-left" href="#">
        <img class="media-object rounded-pill me-2"  alt="<?=$sender['name']?>" style="width: 32px; height: 32px;" src="<?=$settings['baseUrl'] ?>/img/avatars/<?=$sender['avatar'] ?>"/>
    </a>*/ ?>
        <div class="msg-text"><?= $model['text']?></div>
        <div class="msg-extra">
        <div class="msg-heading"><?=$sender['name'] ?></div>
        <div class="msg-time"><i class="bi bi-clock me-1"></i><?= $model['date'] ?></div>
        </div>
</div>
