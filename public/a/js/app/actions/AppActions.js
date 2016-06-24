define([
    '../dispatcher/AppDispatcher',
    '../constants/AppConstants',
], function(Dispatcher, Constants) {
    return {
        /**
         * @param {string} text
         */
        searchPerson: function(text) {
            Dispatcher.dispatch({
                actionType: Constants.APP_SEARCH_PERSON,
                payload: {
                    text: text,
                },
            });
        },
        /**
         *
         * @param {string} email
         */
        createPerson: function(email) {
        },
        /**
         *
         * @param {String} email
         * @param {Boolean} going
         * @param {Integer?} guests
         * @param {Date?} date
         */
        createPersonSchedule: function(email, going, guests, date) {
            Dispatcher.dispatch({
                actionType: Constants.APP_CREATE_PERSON_SCHEDULE,
                payload: {
                    email: email,
                    going: going,
                    guests: guests,
                    date: date,
                },
            });
        },
    };
});
