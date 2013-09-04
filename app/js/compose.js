app.create('compose', {
    init: function(id){
        c.log('app.compose.init');

        var modal = ui.modal.show('', {
            header: 'Compose message'
            , primaryButton: 'Send'
        });

        modal.$el.on('hide.ui.modal', this.destroy.bind(this));

        api.listAddresses(function(identities){
            identities[0].selected = true; //pre-select the first address in menu

            var options = ui.tpl('fromOptions', { identities: identities });
            var form = ui.tpl('compose', {
                toAddress: id
                , options: options
                , selectedId: identities[0].address
            });

            //populate the modal
            modal.$section.html(form);
            modal.resize();
            modal.$section.find('textarea.message').focus();

            //update the address shown
            modal.$section.find('#compose-from').on('change.ui.modal', function(e){
                modal.$section.find("#compose-id").text(this.value);
            });

            //handle modal primary button click
            modal.$el.on('primary.ui.modal', function(e, spin){
                var f = $("#compose").get(0)
                    , toAddress = f.to.value
                    , fromAddress = f.from.value
                    , subject = f.subject.value
                    , message = f.message.value;

                c.log('Sending message', toAddress, fromAddress, subject);

                api.sendMessage(toAddress, fromAddress, subject, message, function(ackdata){
                    c.log('ackdata', ackdata);

                    spin.stop();
                    modal.hide();
                    ui.ok("Your message has been sent");
                });
            });
        });

    },

    destroy: function(){
        c.log('app.compose.destroy');
    }
});