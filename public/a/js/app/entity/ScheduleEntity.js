define([
    'immutable',
    './SavedStatusEntity'
], function(Immutable, SavedStatusEntity) {
    return Immutable.Record({
        date: new Date(),
        going: true,
        guests: 0,
        status: SavedStatusEntity.STATUS_PENDING
    });
});
