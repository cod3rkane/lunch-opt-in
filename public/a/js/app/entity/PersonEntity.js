define([
    'immutable',
    'md5',
], function(Immutable, md5) {

    function _getPicUrl(email) {
        return 'https://www.gravatar.com/avatar/' + md5(email.match(/.+?@.+\..+/) ? email : '') + '?s=200&d=mm';
    }

    var Record = Immutable.Record({
        email: '',

        picture: _getPicUrl('NO-EMAIL'),

        // ./Schedule[]
        schedule: Immutable.OrderedMap(),
    });

    Record.getPicUrl = _getPicUrl;

    return Record;
});
