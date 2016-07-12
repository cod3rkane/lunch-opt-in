define([
    'immutable',
], function(Immutable) {

    var Entity = Immutable.Record({
        id: '',
        status: this.STATUS_PENDING,
    });

    Entity.STATUS_SUCCESS = 1;
    Entity.STATUS_ERROR = 2;
    Entity.STATUS_PENDING = 0;

    return Entity;
});
