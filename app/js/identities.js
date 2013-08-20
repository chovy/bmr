app.identities = window.app.identities = {};

_.extend(app.identities, {
    init: function () {
        if (!api.conn) {
            app.log('No connection.');
            ui.navigateTo(null, 'logout');
            return;
        }

        app.log('app.identities.init');

        ui.init();
        api.listAddresses(); //needs spinner

        $("body > header").show();
        $("a.identities").addClass('active').siblings().removeClass('active');

        $("#identities-action").on('submit.identities', this.actionItem.bind(this));
        $("#identities-select-action").on('change', this.showActionFields.bind(this));

        //handle click events on open addresses
        /* probably not needed for addresses unless we decide to show something when clicking one of them
        $("#identities table").on('click.identities', 'tr.msg', function (e) {
            e.preventDefault();

            var $el = $(e.target) //clicked element
                , $row = $(e.currentTarget)
                , id = $row.attr('data-msgid'); //msg.msgid

            //handle msg actions
            if ( $el.is('a.trash') ) {
                app.log('trash sent msg');
                api.moveToTrash(id, this.moveToTrash);

            } else if ( $el.is('a.close') ) {
                app.log('close msg');
                this.hideMsg(id);
            }
        }.bind(this));
        */
    },

    showActionFields: function(e){
        var $option = $(e.currentTarget).find('option:selected')
            , $form = $("#identities-action")
            , action = $option.val()
            , $active = $form.find('fieldset#'+action)
            , $fieldsets = $active.siblings('fieldset');

        $fieldsets.hide();
        $active.slideDown();
    },

    showIdentities: function (identities, refresh) {
        var $pg = $("#identities")
            , $table = $pg.find('table')
            , $total = $('a.identities .total')
            , $tbody = $pg.find("tbody");

        app.log('identities', identities);

        if ( refresh ) {
            $tbody.empty();
        }

        identities.forEach(function (item) {
            var address = item.address
                , label = item.label
                , stream = item.stream
                , enabled = item.enabled;

            //app.log(item);

            $tbody.append(
                '<tr data-address="' + address + '">' +
                    '<td class="mark-item"><input type="checkbox" name="mark" value="' + address + '"></td>' +
                    '<td data-sort="' + label + '"><span class="nowrap">' + label + '</span></td>' +
                    '<td data-sort="' + address + '"><span class="nowrap">' + address + '</span></td>' +
                    '<td data-sort="' + enabled + '"><span class="enabled">' + enabled + '</span></td>' +
                    '<td data-sort="' + stream + '"><span class="stream">' + stream + '</span></td>' +
                '</tr>'
            );
        });

        //initialize events for the table
        if ( !refresh ) {
            ui.sortTable($table);
        }

        ui.markAll($table);
        ui.shiftCheck.init($table);
        ui.checkItem($table);

        //call to wire up events here for address rows

        $total.text(identities.length);
        $pg.fadeIn();
    },

    actionItem: function (e) {
        e.preventDefault();

        var $form = $(e.target)
            , action = $form.find('option:selected').val()
            , $table = $form.parents('section').find('table')
            , $checked = $table.find('tbody td:first-child [type=checkbox]:checked');

        app.log('actionItem: ' + action);

        ui.clearFormErrors($form);

        if (action === 'enable-address') {
            $.each($checked, function (i, cb) {
                var id = cb.value;

                app.log('enable address: ', id);
            }.bind(this));

        } else if ( action === 'disable-address' ) {
            $.each($checked, function (i, cb) {
                var id = cb.value;

                app.log('disable address: ', id);
            }.bind(this));

        } else if ( action === 'create-address' ) {
            var f = $form.get(0)
                , opts = {};

            opts.label = f.label.value;
            opts.totalDifficulty = f.totalDifficulty.value;
            opts.smallMessageDifficulty = f.smallMessageDifficulty.value;
            opts.eighteenByteRipe = f.eighteenByteRipe.checked;

            app.log('form: ', f, opts);


            if ( opts.label && opts.label.length ) {
                api.createRandomAddress(opts, function(address){
                    var refresh = true;

                    ui.ok('Address ' + address + ' has been created');
                    api.listAddresses(refresh);
                    ui.resetForm($form);
                }.bind(this));
            } else {
                ui.err("Please specify a label for your address");
                $form.find('input[name=label]').parents('label').addClass('error');
            }
        }
    },

    destroy: function () {
        var $pg = $("#identities");

        ui.destroy();
        $(document).add('*').off('.identities .ui');

        $pg.hide();
        $pg.find("tbody").empty();

        if (ui.globals.currPage === 'login') {
            $("body > header").hide();
            ui.$header.hide();
        }
    }
});