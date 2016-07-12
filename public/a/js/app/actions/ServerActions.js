define([
    '../dispatcher/AppDispatcher',
    '../constants/AppConstants',
], function(Dispatcher, Constants) {
    return {
        savedPerson: function (email, thread, status) {
            Dispatcher.dispatch({
                actionType: Constants.APP_SAVED_PERSON,
                payload: {
                    id: email,
                    thread: thread,
                    status: status,
                },
            });
        },

        savedPersonError: function (email, thread, error) {
            Dispatcher.dispatch({
                actionType: Constants.APP_SAVED_PERSON_ERROR,
                payload: {
                    id: email,
                    thread: thread,
                    status: error,
                },
            });
        },

        receiveItemsData: function (data) {
            Dispatcher.dispatch({
                actionType: Constants.APP_RECEIVE_API_DATA,
                payload: {
                    data: data,
                },
            });
        },

        receiveApiError: function (error) {
            Dispatcher.dispatch({
                actionType: Constants.APP_RECEIVE_API_ERROR,
                payload: {
                    error: error,
                },
            });
        },
    };
});
