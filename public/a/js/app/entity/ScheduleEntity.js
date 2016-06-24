define([
    'immutable',
], function(Immutable) {
    return Immutable.Record({
        date: new Date(),
        going: true,
        guests: 0,
    });
});
