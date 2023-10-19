(function ($) {
    var directChat = {
        init: function () {
            this.messenger = $('#messenger');
            this.messages = this.messenger.find('#msg-container');
            this.conversations = $('#conversations');
            this.messages.get(0).scrollTop = this.messages.get(0).scrollHeight;
        },
        registerListeners: function () {
            var self = this;
            $(document).ready(function () {
                var messagesScrollPosition = self.messages.get(0).scrollHeight;
                var messagesLoader = $('#messages-loader');
                var conversationsLoader = $('#conversations-loader');

                var tempHandler4 = function () {
                    var current = self.conversations.directChatConversations('widget').current;
                    // check whether the current conversation has unread messages
                    if( current.newMessages.count){
                        var $conversation = self.conversations.directChatConversations('find', current.contact.id, 'contact');
                        if($conversation.length){
                            $conversation.find('.bi-circle').trigger('click');
                        }else{
                            self.conversations.directChatConversations('read');
                        }
                    }
                    var re = /\/(\s*\d+\s*)$/;
                    if (!location.href.match(re)) {
                        var url = location.href + '/' + current.contact.id;
                        window.history.replaceState(null, document.title, url);
                    }
                    self.messenger.off('initialized', tempHandler4)
                };

                // on scroll conversations content
                self.conversations.on('initialized',tempHandler4)
                    // on scroll conversations content
                    .on('scroll', function () {
                        // check whether not all history is loaded
                        if (!self.conversations.data('loaded')) {
                            // check whether the scroll is at the bottom
                            if (self.conversations.get(0).scrollTop + self.conversations.innerHeight() >= self.conversations.get(0).scrollHeight) {
                                // load conversations
                                self.conversations.directChatConversations('load', 8);
                            }
                        }
                    })
                    // on click conversation block
                    .on('click', '.conversation:not(.current)', function () {
                        var $conversation = $(this);
                        //copy previous configuration
                        var widget = $.extend({}, self.messenger.directChatMessages('widget'));
                        //destroy previous chat
                        self.messenger.directChatMessages('destroy');
                        self.messenger.removeData('loaded');
                        //reinitialize the chat
                        var current = {
                            contact: $conversation.data('contactinfo'),
                            deleteUrl: $conversation.data('deleteurl'),
                            readUrl: $conversation.data('readurl'),
                            unreadUrl: $conversation.data('unreadurl'),
                            loadUrl: $conversation.data('loadurl'),
                            sendUrl: $conversation.data('sendurl')
                        };
                        widget.settings.loadUrl = current.loadUrl;
                        widget.settings.sendUrl = current.sendUrl;
                        self.messenger.directChatMessages(widget.user, current.contact, widget.settings);

                        var tempHandler1 = function () {
                            // show loader
                            $('.loading').show();
                            // remove itself as handler
                            self.messenger.off('beforeSend.load', tempHandler1);
                        };

                        // register a handler on messages before load
                        // this handler is executed once after it has been registered
                        // Because it removes itself as handler at the end of its body
                        self.messenger.on('beforeSend.load', tempHandler1);

                        var tempHandler2 = function () {
                            // hide the loader
                            $('.loading').hide();
                            // remove itself as handler
                            self.messenger.off('complete.load', tempHandler2);
                        };

                        // register a handler on messages load completed
                        // this handler is executed once after it has been registered
                        // Because it removes itself as handler at the end of its body
                        self.messenger.on('complete.load', tempHandler2);

                        var tempHandler3 = function () {
                            // add class current to this conversation and remove from others
                            $conversation.addClass('current').siblings('.current').removeClass('current');

                            // set this conversation as current conversation
                            self.conversations.directChatConversations('widget').current = current;

                            // check whether the current conversation has unread messages
                            if ($conversation.is('.unread')) {
                                // read all messages in this conversation
                                $conversation.find('.bi-circle').trigger('click');
                            }
                            // update the window state
                            document.title = current.contact.name;
                            var re = /\/(\s*\d+\s*)/;
                            var url = location.href.replace(re, '/' + current.contact.id);
                            window.history.replaceState(null, document.title, url);
                            // remove itself as handler
                            self.messenger.off('success.load', tempHandler3);
                        };
                        // register a handler on messages load success
                        // this handler is executed once after it has been registered
                        // Because it removes itself as handler at the end of its body
                        self.messenger.on('success.load', tempHandler3);
                        //reload messages
                        self.messenger.directChatMessages('reload');

                    })
                    // on click delete icon
                    .on('click', '.conversation .bi-x-lg', function (e) {
                        e.preventDefault();
                        e.stopPropagation();

                        if (confirm('Are you sure?')) {
                            var $conversation = $(this).parents('.conversation');
                            self.conversations.directChatConversations('delete', {
                                url: $conversation.data('deleteurl'),
                                success: function (data) {
                                    if (data['count'] && $conversation.length) {
                                        // remove conversation
                                        $conversation.hide('slow', function () {
                                            $conversation.remove();
                                        });

                                        // check whether this conversation is the current
                                        if($conversation.is('.current')){
                                            // remove messages from messenger
                                            self.messenger.directChatMessages('empty');
                                        }
                                    }
                                }
                            });
                        } else {
                            console.log('Thing was not saved to the database.');
                        }



                    })
                    // on click read icon
                    .on('click', '.conversation .bi-circle', function (e) {
                        e.preventDefault();
                        e.stopPropagation();
                        var $conversation = $(this).parents('.conversation');
                        self.conversations.directChatConversations('read', {
                            url: $conversation.data('readurl'),
                            success: function (data) {
                                if (data['count'] && $conversation.length) {
                                    // remove unread class and change read icon to unread
                                    $conversation.removeClass('unread')
                                        .find('.bi-circle')
                                        .removeClass('bi-circle')
                                        .addClass('bi-circle-fill')
                                        .closest('a')
                                        .attr('title', 'Mark as unread');
                                    // empty the unread messages counter
                                    $conversation.find('.msg-new').text('');
                                }
                            }
                        });
                    })
                    // on click unread icon
                    .on('click', '.conversation .bi-circle-fill', function (e) {
                        e.preventDefault();
                        e.stopPropagation();
                        var $conversation = $(this).parents('.conversation');
                        self.conversations.directChatConversations('unread', {
                            url: $conversation.data('unreadurl'),
                            success: function (data) {
                                if (data['count'] && $conversation.length) {
                                    // add unread class and change unread icon to read
                                    $conversation.addClass('unread')
                                        .find('.bi-circle-fill')
                                        .removeClass('bi-circle-fill')
                                        .addClass('bi-circle')
                                        .closest('a')
                                        .attr('title', 'Mark as read');
                                    // update unread messages counter to 1
                                    $conversation.find('.msg-new').text('1');
                                }
                            }
                        });
                    })
                    // on conversations before load
                    .on('beforeSend.load', function (e, type) {
                        // check whether we load history
                        if (type == 'history') {
                            // show the loader
                            conversationsLoader.appendTo(self.conversations).show();
                        }
                    })
                    // on conversations load completed
                    .on('complete.load', function (e, type) {
                        // check whether we load history
                        if (type == 'history') {
                            // hide the loader
                            conversationsLoader.hide();
                        }
                    })
                    // on conversations load successful
                    .on('success.load', function (e, type, data) {
                        var widget = self.conversations.directChatConversations('widget');
                        var index, conversation;
                        // check whether we load history or new conversations
                        if (type == 'history') {
                            // set loaded attribute to true if all history is loaded
                            if (data['totalCount'] == data['models'].length) {
                                self.conversations.data('loaded', true);
                            }
                            // loop through data.models
                            for (index = 0; index < data['models'].length; index++) {
                                // object to inject to template
                                conversation = {
                                    model: data['models'][index],
                                    key: data['keys'][index],
                                    index: index,
                                    user: widget.user,
                                    isCurrent: widget.current.contact.id == data['models'][index]['contact']['id'],
                                    settings: widget.settings
                                };
                                //prepend conversation
                                self.conversations.directChatConversations('append', conversation);
                            }
                        } else {
                            // loop through data.models
                            for (index = data['models'].length - 1; index >= 0; index--) {
                                // object to inject to template
                                conversation = {
                                    model: data['models'][index],
                                    key: data['keys'][index],
                                    index: index,
                                    user: widget.user,
                                    isCurrent: widget.current.contact.id == data['models'][index]['contact']['id'],
                                    settings: widget.settings
                                };
                                // remove conversation if it existed before
                                var $conversation = self.conversations.directChatConversations('find', conversation.model.contact.id, 'contact');
                                if ($conversation.length) {
                                    $conversation.remove();
                                }
                                // prepend conversation
                                self.conversations.directChatConversations('prepend', conversation);
                            }
                        }
                    });

                // on scroll messages content
                self.messages.on('scroll', function () {
                    // check whether the scroll is at the top  and not all history is loaded
                    if (self.messages.get(0).scrollTop == 0 && !self.messenger.data('loaded')) {
                        // load messages
                        self.messenger.directChatMessages('load', 10);
                    }
                });

                // on messages before load
                self.messenger.on('beforeSend.load', function (e, type) {

                        // check whether we are loading history
                        if (type == 'history') {
                            //  remember the scroll height
                            messagesScrollPosition = self.messages.get(0).scrollHeight;
                            // show the loader
                            messagesLoader.prependTo(self.messages).show();
                        }
                    })
                    // on messages load completed
                    .on('complete.load', function (e, type) {
                        // check whether we are loading history
                        if (type == 'history') {
                            // hide the loader
                            messagesLoader.hide();
                            // scroll to previous scroll height
                            self.messages.get(0).scrollTop = self.messages.get(0).scrollHeight - messagesScrollPosition;
                        }
                    })
                    // on message load successful
                    .on('success.load', function (e, type, data) {
                        // console.log('Success load');
                        // console.log(type);
                        // console.log(data);

                        var when = false, options = self.messenger.directChatMessages('widget');
                        var index, msg;
                        // check whether we load history or new messages
                        if (type == 'history') {
                            // get the first date block
                            var _top_when_text = false,
                                _top_when = self.messenger.directChatMessages('find', '.msg-date').first();
                            if (_top_when) {
                                when = _top_when_text = _top_when.find('strong').text();
                            }
                            // set loaded attribute to true if all history is loaded
                            if (data['totalCount'] == data['models'].length) {
                                self.messenger.data('loaded', true);
                            }
                            // loop trough data.models object
                            for (index = 0; index < data['models'].length; index++) {
                                // check whether to insert date block
                                if (data['models'][index]['when'] != when) {
                                    if (when != _top_when_text) {
                                        self.messenger.directChatMessages('prepend', '<div class="msg-date"><strong>' + when + '</strong></div>');
                                    }
                                    when = data['models'][index]['when'];
                                }
                                // object to inject to the template
                                msg = {
                                    model: data['models'][index],
                                    key: data['keys'][index],
                                    index: index,
                                    user: options.user,
                                    sender: data['models'][index]['senderId'] == options.user.id ? options.user : options.contact,
                                    settings: options.settings
                                };

                                if (when == _top_when_text) {
                                    // insert message after the first date block from the top of the container
                                    self.messenger.directChatMessages('insert', msg, _top_when);
                                } else {
                                    // prepend message to a container
                                    self.messenger.directChatMessages('prepend', msg);
                                }
                            }
                            // prepend the the date block
                            if (when != _top_when_text) {
                                self.messenger.directChatMessages('prepend', '<div class="msg-date"><strong>' + when + '</strong></div>');
                            }
                        } else {
                            // get the last date block
                            var _last_when_text = false,
                                _last_when = self.messenger.directChatMessages('find', '.msg-date').last();
                            if (_last_when) {
                                when = _last_when_text = _last_when.find('strong').text();
                            }
                            // loop trough data.models object
                            for (index = data['models'].length - 1; index >= 0; index--) {
                                // check whether to insert date block
                                if (data['models'][index]['when'] != when) {
                                    when = data['models'][index]['when'];
                                    if (when != _last_when_text) {
                                        self.messenger.directChatMessages('append', '<div class="msg-date"><strong>' + when + '</strong></div>');
                                    }
                                }
                                // object to inject to the template
                                msg = {
                                    model: data['models'][index],
                                    key: data['keys'][index],
                                    index: index,
                                    user: options.user,
                                    sender: data['models'][index]['senderId'] == options.user.id ? options.user : options.contact,
                                    settings: options.settings
                                };
                                // append the message
                                // console.log('Options');
                                // console.log(options);
                                // console.log(data['models'][index]);
                                // console.log(data['models']);
                                // console.log(options.user.id);
                                self.messenger.directChatMessages('append', msg);
                            }
                            // scroll down the messages container
                            if (data['models'].length > 0) {
                                self.messages.get(0).scrollTop = self.messages.get(0).scrollHeight;
                            }
                        }

                    })
                    // on message send successful
                    .on('success.send', function (e, data) {
                        // check whether we got empty array
                        if (data.length == 0) {
                            // reset form
                            self.messenger.directChatMessages('resetForm');
                            // load new messages
                            self.messenger.directChatMessages('load', 'new');
                            // load new conversations
                            if (self.conversations.length>0)
                            self.conversations.directChatConversations('load', 'new');
                        }else{
                            console.error(data);
                        }
                    });

                // on click to send button
                $('#msg-send').click(function (e) {
                    e.preventDefault();
                    // submit message form
                    $('#msg-form').trigger('submit');

                });

                // load new messages every 10 seconds
                setInterval(function () {
                    self.messenger.directChatMessages('load', 'new');
                }, 10000);

                // load new conversations every 15 seconds

                // console.log(self.conversations.length);
                if (self.conversations.length>0)
                setInterval(function () {
                    self.conversations.directChatConversations('load', 'new');
                    // console.log('conv renew');
                }, 15000);
            });
        }
    };
    directChat.init();
    directChat.registerListeners();
})(jQuery);
