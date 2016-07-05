define([
    'object-assign',
    'events',
    '../dispatcher/AppDispatcher',
    '../constants/AppConstants',
    'immutable',
    '../entity/ScheduleEntity',
    //---
    'string_score',
], function(assign, events, Dispatcher, Constants, Immutable, ScheduleEntity) {

    // ./Person
    var _person = Immutable.Record(),
        CHANGE_EVENT = 'change';

    function _setPerson(person) {
        _person = (person ? person : false);
    }

    var Store = assign({}, events.EventEmitter.prototype, {
        emitChange: function() {
            this.emit(CHANGE_EVENT);
        },

        /**
         * @param {function} callback
         */
        addChangeListener: function(callback) {
            this.on(CHANGE_EVENT, callback);
        },

        removeChangeListener: function(callback) {
            this.removeListener(CHANGE_EVENT, callback);
        },

        /**
         *
         * @returns {Record.Class|false}
         */
        getPerson: function () {
            return _person;
        }
    });

    Store.dispatchToken = Dispatcher.register(function(action) {
        var payload = action.payload;
        
        switch (action.actionType) {
            case Constants.APP_OPEN_SCHEDULE_MODAL:
                _setPerson(payload.person);
                Store.emitChange();
                break;
            default:
            // no op
        }
    });

    return Store;
});
