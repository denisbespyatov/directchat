(function ($) {
    $.fn.directChatConversations = function (method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.directChatConversations');
            return false;
        }
    };

    var view = null;

    var loadTypes  = {
        down:'history',
        up:'new'
    };

    var events = {
        init: 'initialized',
        load:{
            beforeSend: 'beforeSend.load',
            complete: 'complete.load',
            error: 'error.load',
            success: 'success.load'
        }
    };

    var defaults = {
        loadUrl: '',
        loadMethod: 'GET',
        unreadMethod: 'PATCH',
        readMethod: 'PATCH',
        deleteMethod: 'DELETE',
        limit: 10,
        templateUrl: '',
        itemCssClass:'conversation'
    };

    var methods = {
        init: function (user, current, options) {
            return this.each(function () {
                var $chat = $(this);
                if ($chat.data('directChatConversations')) {
                    return;
                }
                $chat.data('directChatConversations', {
                    settings: $.extend({}, defaults, options || {}),
                    user: user,
                    current: $.extend({}, {deleteUrl: null, unreadUrl: null, readUrl: null}, current || {}),
                    status: 0  // load status, 0: pending load, 1: loading
                });
                $chat.trigger(events.init);
            });
        },
        load: function (args) {


            var $chat = $(this);
            var widget = $chat.data('directChatConversations');
            var data = {
                type: loadTypes.down,
                limit: widget.settings.limit
            };
            if(typeof args == 'number'){
                data['limit'] = args;
            }else if(typeof args == 'string'){
                data['type'] = args;
            }else {
                data = $.extend({}, data, args || {});
            }
            var $conversation = find($chat, data['type'] == loadTypes.up ?'first':'last');
            if($conversation){
                data['key'] = $conversation.data('key');
            }
            if(widget.status == 0) {
                $.ajax({
                    url: widget.settings.loadUrl,
                    type: widget.settings.loadMethod,
                    dataType: 'JSON',
                    data: data,
                    beforeSend: function (xhr, settings) {
                        widget.status = 1;
                        $chat.trigger(events.load.beforeSend, [data['type'], xhr,settings]);
                    },
                    complete: function (xhr, textStatus) {
                        widget.status = 0;
                        $chat.trigger(events.load.complete,[data['type'], xhr,textStatus]);
                    },
                    success: function (res, textStatus, xhr) {
                        $chat.trigger(events.load.success,[data['type'], res, textStatus, xhr]);
                    },
                    error: function (xhr, textStatus, errorThrown) {
                        $chat.trigger(events.load.error,[data['type'], xhr,textStatus,errorThrown]);
                    }
                });
            }
        },

        unread: function (settings) {
            var $chat = $(this);
            var widget = $chat.data('directChatConversations');
            $.ajax($.extend({}, {
                dataType: 'JSON',
                url: widget.current.unreadUrl,
                type: widget.settings.unreadMethod
            }, settings || {}));
        },

        read: function (settings) {
            var $chat = $(this);
            var widget = $chat.data('directChatConversations');
            $.ajax($.extend({}, {
                dataType: 'JSON',
                url: widget.current.readUrl,
                type: widget.settings.readMethod
            }, settings || {}));
        },

        delete: function (settings) {
            var $chat = $(this);
            var widget = $chat.data('directChatConversations');
            $.ajax($.extend({}, {
                dataType: 'JSON',
                url: widget.current.deleteUrl,
                type: widget.settings.deleteMethod
            }, settings || {}));
        },

        append: function (data) {
            var $chat = $(this);
            var widget = $chat.data('directChatConversations');
            if(typeof data == 'object'){
                $chat.append(tmpl(widget.settings.templateUrl, data));
            }else{
                $chat.append(data);
            }
        },

        prepend: function (data) {
            var $chat = $(this);
            var widget = $chat.data('directChatConversations');
            if(typeof data == 'object'){
                $chat.prepend(tmpl(widget.settings.templateUrl, data));
            }else{
                $chat.prepend(data);
            }
        },

        insert: function (data, selector, before) {
            var $chat = $(this);
            var widget = $chat.data('directChatConversations');
            var $elem = $chat.find(selector);
            var $conversation = null;
            if(typeof data == 'object'){
                $conversation = tmpl(widget.settings.templateUrl, data);
            }else{
                $conversation = data;
            }
            if(before){
                $elem.before($conversation);
            }else{
                $elem.after($conversation);
            }
        },

        widget: function () {
            return this.data('directChatConversations');
        },

        destroy: function () {
            return this.each(function () {
                var $chat = $(this);
                $chat.removeData('directChatConversations');
            });
        },

        find: function (id, dataAttr) {
            var $chat = $(this);
            return find($chat, id, dataAttr);
        }
    };



    var find = function ($chat, id, dataAttr) {
        // console.log('CONV FIND')
        var widget = $chat.data('directChatConversations');
        if(typeof id == 'number' || typeof dataAttr != 'undefined'){
            dataAttr = typeof dataAttr == 'undefined' ? 'key' : dataAttr;
            return $chat.find('[data-' + dataAttr +'=' + id + ']');
        } else if(id == 'last') {
            return $chat.find('.' + widget.settings.itemCssClass).last();
        } else if(id == 'first') {
            return $chat.find('.' + widget.settings.itemCssClass).first();
        }else{
            return $chat.find(id);
        }
    };

    let escape = function (str) {
        return str
            .replace(/[\"]/g, '&quot;')
            .replace(/[\\]/g, '\\\\')
            .replace(/[\/]/g, '\\/')
            .replace(/[\b]/g, '\\b')
            .replace(/[\f]/g, '\\f')
            .replace(/[\n]/g, '\\n')
            .replace(/[\r]/g, '\\r')
            .replace(/[\t]/g, '\\t');
    }, tmpl = function (url, data){
        let res = '';
        let avatar = '';
        if (data.model.contact.avatar != '')
            if(data.model.contact.avatar != null)
                avatar = '<img src="'+data.settings.baseUrl+'/img/avatars/'+data.model.contact.avatar+'" alt="'+data.model.contact.name+'" />';

        res+='\n' +
            '<div class="__chatUser media '+data.settings.itemCssClass+' '+ (data.model.newMessages.count > 0 ? data.settings.unreadCssClass : '') +' ' + (data.isCurrent ? data.settings.currentCssClass : '' ) + '" ' +
            '     data-key="'+data.key+'" data-contact="'+data.model.contact.id+'" ' +
            '     data-contactinfo="'+escape(JSON.stringify(data.model.contact))+'" ' +
            '     data-unreadurl="'+data.model.unreadUrl+'" data-readurl="'+data.model.readUrl+'" data-deleteurl="'+data.model.deleteUrl+'" ' +
            '     data-loadurl="'+data.model.loadUrl+'" data-sendurl="'+data.model.sendUrl+'"> ' +
            '\n' +
            '    <div class="__chatUserAvatarContainer">\n' +
            '        <div class="__chatUserAvatar __initialsScheme'+data.model.contact.scheme+'">\n' +
            '            <div class="__chatInitials">'+data.model.contact.initials+'</div>\n' +
            '            '+avatar+'\n' +
            '        </div>\n' +
            '    </div>\n' +
            '    <div class="__chatUserInfo">\n' +
            '        <h4>'+data.model.contact.name+'</h4>\n' +
            '        <small>'+data.model.lastMessage.text+'</small>\n' +
            '    </div>\n' +
            '    <div class="__chatUserExtra">\n' +
            '        <div>\n' +
            '            <small class="time">'+data.model.lastMessage.date+'</small>\n' +
            '            <span class="badge bg-success msg-new ms-1">'+(data.model.newMessages.count > 0 ? data.model.newMessages.count : '')+'</span>\n' +
            '        </div>\n' +
            '        <div>\n' +
            '            <ul class="list-inline mb-0 lh-1">\n' +
            '                <li>\n' +
            '                    <a class="close" title="'+(data.model.newMessages.count > 0 ? data.settings.markAsRead : data.settings.markAsUnread)+'">\n' +
            '                        <small class="small-icon" aria-hidden="true">\n' +
            '                            <i class="bi bi-circle'+(data.model.newMessages.count > 0 ? '' : '-fill')+'"></i>\n' +
            '                        </small>\n' +
            '                    </a>\n' +
            '                </li>\n' +
            '                <li>\n' +
            '                    <a class="close" title="'+data.settings.archive+'">\n' +
            '                        <small class="small-icon" aria-hidden="true">\n' +
            '                            <i class="bi bi-x-lg"></i>\n' +
            '                        </small>\n' +
            '                    </a>\n' +
            '                </li>\n' +
            '            </ul>\n' +
            '        </div>\n' +
            '    </div>\n' +
            '</div>';

        return res;
    }



    /*var tmpl0 = function (url, data){
        if(null == view){
            view = twig({
                id: 'conversation',
                href: url,
                async: false
            })
        }
        return view.render(data);
    }*/

})(jQuery);
