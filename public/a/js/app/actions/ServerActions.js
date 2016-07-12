define([
    '../dispatcher/AppDispatcher',
    '../constants/AppConstants',
], function(Dispatcher, Constants) {
    return {
        savedPerson: function (email, status) {
            Dispatcher.dispatch({
                actionType: Constants.APP_SAVED_PERSON,
                payload: {
                    id: email,
                    status: status,
                },
            });
        },

        savedPersonError: function (email, error) {
            Dispatcher.dispatch({
                actionType: Constants.APP_SAVED_PERSON_ERROR,
                payload: {
                    id: email,
                    error: error,
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
