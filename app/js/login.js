app.create('login', {
    init: function(){
        ui.init();
        c.log('app.login.init');

        ui.$pg = $(ui.tpl('login', {}));
        ui.$header.after(ui.$pg);
        ui.$header.hide();

        //events
        ui.$pg.on('submit.login', this.login);
    },

    login: function(e){
        e.preventDefault();

        var $form = $(e.target)
            , data = {};

        data.user = $form.find('input[name=user]').val();
        data.pass = $form.find('input[name=pass]').val();
        data.host = $form.find('input[name=host]').val();
        data.port = $form.find('input[name=port]').val();

        api.init(data, function(){
            ui.init();
            ui.ok('Successfully connected to API');
            //move to app.hideLogin
            ui.$pg.hide({
                duration: 0,
                complete: function(){
                    ui.navigateTo('login', 'inbox');
                }
            });
        });
    },

    destroy: function(){
        c.log('app.login.destroy');

        ui.destroy();
        ui.$pg.remove();
        $(document).add('*').off('.' + this.ns);

        this.parent.destroy();
    }
});
