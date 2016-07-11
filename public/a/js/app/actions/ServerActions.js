define([
    '../dispatcher/AppDispatcher',
    '../constants/AppConstants',
], function(Dispatcher, Constants) {
    return {
        savedPerson: function (status) {
            Dispatcher.dispatch({
                actionType: Constants.APP_SAVED_PERSON,
                payload: {
                    status: status,
                },
            });
        },

        savedPersonError: function (error) {
            Dispatcher.dispatch({
                actionType: Constants.APP_SAVED_PERSON_ERROR,
                payload: {
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
