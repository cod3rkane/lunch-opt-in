define([
    '../dispatcher/AppDispatcher',
    '../constants/AppConstants',
    '../util/api'
], function(Dispatcher, Constants, API) {
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

            API.createPerson(email, going, guests, date);
        },

        openScheduleModal: function (person) {
            Dispatcher.dispatch({
                actionType: Constants.APP_OPEN_SCHEDULE_MODAL,
                payload: {
                    person: person,
                },
            });
        },

        changePerson: function (person) {
            Dispatcher.dispatch({
                actionType: Constants.APP_SAVING_PERSON,
                payload: {
                    person: person,
                },
            });
            
            API.savePerson(person);
        },
        
        changeSchedule: function (email, schedule, newSchedule) {
            API.removeSchedle(email, schedule);
            this.createPersonSchedule(email, newSchedule.going, newSchedule.guests, newSchedule.date);
            Dispatcher.dispatch({
                actionType: Constants.APP_CHANGE_SCHEDULE,
                payload: {
                    email: email,
                    schedule: schedule
                },
            });
        },

        loadItems: function () {
            Dispatcher.dispatch({
                actionType: Constants.APP_FETCHING_ITEMS,
            });

            API.loadItems();
        },
    };
});
