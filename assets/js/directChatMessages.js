(function ($) {
    $.fn.directChatMessages = function (method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.directChatMessages');
            return false;
        }
    };

    var view = null;

    var loadTypes  = {
        up:'history',
        down:'new'
    };

    var events = {
        init: 'initialized',
        send:{
            beforeSend: 'beforeSend.send',
            complete: 'complete.send',
            error: 'error.send',
            success: 'success.send'
        },
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
        sendUrl: false,
        sendMethod: false,
        limit: 10,
        templateUrl: '',
        itemCssClass:'msg'
    };

    var methods = {
        init: function (user,contact,options) {
            // console.log('ChatMessagesInit');
            // console.log(user);
            // console.log(contact);
            // console.log(options);
            return this.each(function () {
                var $chat = $(this);
                if ($chat.data('directChatMessages')) {
                    return;
                }
                var settings = $.extend({}, defaults, options || {});
                $chat.data('directChatMessages', {
                    settings: settings,
                    user: user,
                    contact: contact,
                    status: 0  // status of the chat, 0: pending load, 1: loading
                });
                var $form = $(settings.form);
                $form.on('submit.directChatMessages', function (e) {
                    e.preventDefault();

                    // console.log('----SUBMIT')
                    methods.send.apply($chat);
                });

                if(settings.sendUrl){
                    $form.attr('action', settings.sendUrl)
                }
                if(settings.sendMethod){
                    $form.attr('method', settings.sendMethod)
                }
                $chat.trigger(events.init);
            });
        },


        resetForm: function () {
            var $chat = $(this);
            var widget = $chat.data('directChatMessages');
            var $form = $chat.find(widget.settings.form);
            $form.find('input, textarea, select').each(function () {
                var $input = $(this);
                $input.val('');
            });
        },

        send: function () {
            var $chat = $(this);
            var widget = $chat.data('directChatMessages');
            var $form = $chat.find(widget.settings.form);
            var url = $form.attr('action');
            $.ajax({
                url: url,
                type: $form.attr('method'),
                dataType: 'JSON',
                data: $form.serialize(),
                beforeSend: function (xhr,settings) {
                    $chat.trigger(events.send.beforeSend, [xhr,settings]);
                },
                complete: function (xhr,textStatus) {
                    $chat.trigger(events.send.complete,[xhr,textStatus]);
                },
                success: function (data) {
                    $chat.trigger(events.send.success,[data]);
                },
                error: function (xhr,textStatus,errorThrown) {
                    $chat.trigger(events.send.error,[xhr,textStatus,errorThrown]);
                }
            });
        },

        reload: function () {
            var $chat = $(this);
            methods.resetForm.apply($chat);
            methods.empty.apply($chat);
            methods.load.apply($chat);
        },

        load: function (args) {
            var $chat = $(this);
            var widget = $chat.data('directChatMessages');
            var data = {
                type: loadTypes.up,
                limit: widget.settings.limit
            };
            if(typeof args == 'number'){
                data['limit'] = args;
            }else if(typeof args == 'string'){
                data['type'] = args;
            }else {
                data = $.extend({}, data, args || {});
            }

            var elem = find($chat, data['type'] == loadTypes.up ?'first':'last');
            if(elem){
                data['key'] = elem.data('key');
            }

            var url = widget.settings.loadUrl;

            if(widget.status == 0) {
                $.ajax({
                    url: url,
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

        empty: function () {
            var $chat = $(this);
            var widget = $chat.data('directChatMessages');
            var $container = $chat.find(widget.settings.container);
            $container.empty();
        },

        append: function (data) {
            var $chat = $(this);
            var widget = $chat.data('directChatMessages');
            var $container = $chat.find(widget.settings.container);
            if(typeof data == 'object'){
                $container.append(tmpl(widget.settings.templateUrl,data));
                // console.log('APPEND');
                // console.log(data);

            }else{
                $container.append(data);
            }
        },

        prepend: function (data) {
            var $chat = $(this);
            var widget = $chat.data('directChatMessages');
            var $container = $chat.find(widget.settings.container);
            if(typeof data == 'object'){
                $container.prepend(tmpl(widget.settings.templateUrl,data));
                // console.log('PREPEND');
                // console.log(data);

            }else{
                $container.prepend(data);
            }
        },

        insert: function (data, selector, before) {
            var $chat = $(this);
            var widget = $chat.data('directChatMessages');
            var $container = $chat.find(widget.settings.container);
            var $elem = $container.find(selector);
            var $message = null;
            if(typeof data == 'object'){
                $message = tmpl(widget.settings.templateUrl, data);
                // console.log('INSERT');
                // console.log(data);
            }else{
                $message = data;
            }
            if(before){
                $elem.before($message);
            }else{
                $elem.after($message);
            }
        },

        destroy: function () {
            return this.each(function () {
                var $chat = $(this);
                var widget = $chat.data('directChatMessages');
                var $form = $chat.find(widget.settings.form);
                $form.off('.directChatMessages');
                $chat.removeData('directChatMessages');
            });
        },

        widget: function () {
            return this.data('directChatMessages');
        },

        find: function (id) {
            var $chat = $(this);
            return find($chat, id);
        }
    };



    var find = function ($chat, id) {
        var widget = $chat.data('directChatMessages');
        var $container = $chat.find(widget.settings.container);
        if(typeof id == 'number'){
            return $container.find('[data-key=' + id + ']');
        } else if(id == 'last') {
            return $container.find('.' + widget.settings.itemCssClass).last();
        } else if(id == 'first') {
            return $container.find('.' + widget.settings.itemCssClass).first();
        }else{
            return $container.find(id);
        }
    };


    var tmpl = function (url, data){
        let res = '';
        let msgClass = (data.sender.id == data.user.id) ? 'msg-right' : 'msg-left';
        res += '<div class="'+data.settings.itemCssClass+' '+msgClass+'" data-key="'+data.key+'">\n' +
            // '    <a class="pull-left" href="#">\n' +
            // '        <img class="media-object rounded-pill me-2"  alt="'+data.sender.name+'" style="width: 32px; height: 32px;" src="'+data.settings.baseUrl+'/img/avatars/'+data.sender.avatar+'"/>\n' +
            // '    </a>\n' +
            '       <div class="msg-text">'+data.model.text+'</div>\n' +
            '       <div class="msg-extra">\n' +
            '         <div class="msg-heading">'+data.sender.name+'</div>\n' +
            '         <div class="msg-time"><i class="bi bi-clock"></i> '+data.model.date+'</div>\n' +
            '       </div>\n' +
            '</div>';
// console.log('---tmpl---')
// console.log(data)
        return res;
    }

    var tmpl2 = function (url, data){
        if(null == view){
            view = twig({
                id: 'message',
                href: url,
                async: false
            })
        }
        // console.log('---------tmpl-----------');
        // console.log(data.settings.itemCssClass);
        // console.log(data.sender.name);
        // console.log(data.key);
        // console.log(data.settings.baseUrl);
        // console.log(data.sender.avatar);
        return view.render(data);
    }

})(jQuery);
