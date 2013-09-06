app.create('message', {
    preShowMsg: function(id){
        c.log('app.message.preShowMsg', id);

        var $row = ui.$pg.find('tbody tr[data-id='+id+']')
            , colCount = $row.find('td').length;

        $row.after(ui.tpl('message', { id: id, colCount: colCount }));
    },

    showMsg: function(msg, isSentMessage, renderHtml){
        c.log('app.message.showMsg', msg);

        var $row = ui.$pg.find('tbody tr[data-id='+msg.msgid+']')
            , $msg = $row.next('.msg')
            , $content = $msg.find('.content');

        $content.html(ui.tpl('messageContent', {
            msg: msg
            , isSentMessage: isSentMessage
            , renderHtml: renderHtml
        }));

        $content.find('.message').contents().filter(function() {
                return this.nodeType === 3;
        }).each(function(i, txt){
            var $txt = $(txt);

            $txt.replaceWith(
                $txt.text().replace(/(BM-[123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ]{32,34})/g, '<a href="#" class="address" data-address="$1">$1</a>')
            );
        });

        $content.removeClass('loading');
        $row.data('isopen', true);
        $row.removeClass('unread');
    },

    hideMsg: function(id){
        c.log('app.message.hideMsg', id);

        var $row = ui.$pg.find('tbody tr[data-id='+id+']');

        $row.data('isopen', false);
        $row.next('.msg').remove();
    },

    readMsg: function ($table, isSentMessage) {
        c.log('app.message.readMessage: isSentMessage', isSentMessage);

        //can't open messages that haven't been sent yet
        var subjects = isSentMessage ? 'tr[data-status=ackreceived] .subject' : 'tr .subject';

        $table.on('click.message', subjects, function (e) {
            e.preventDefault();

            var $subject = $(e.currentTarget)
                , $row = $subject.parents('tr')
                , isOpen = !!$row.data('isopen')
                , id = $row.attr('data-id');

            c.log('app.message.readMsg', id);

            if ( isOpen ) {
                this.hideMsg(id);
                return;
            }

            this.preShowMsg(id);

            if ( isSentMessage ) {
                api.getSentMessage(id, function(msg){
                    this.showMsg(msg, isSentMessage);
                }.bind(this));
            } else {
                api.getMessage(id, function(msg){
                    this.showMsg(msg, isSentMessage);
                }.bind(this), true); //mark as read
            }
        }.bind(this));
    },

    renderHtml: function(id, isSentMessage){
        c.log('app.message.renderHtml', id);

        var renderHtml = true;

        this.hideMsg(id);
        this.preShowMsg(id);

        if ( isSentMessage ) {
            api.getSentMessage(id, function(msg){
                this.showMsg(msg, isSentMessage, renderHtml);
            }.bind(this));
        } else {
            api.getMessage(id, function(msg){
                this.showMsg(msg, isSentMessage, renderHtml);
            }.bind(this));
        }
    },

    destroy: function(){
        c.log('app.message.destroy');

        $(document).add('*').off('.message');
    }
});