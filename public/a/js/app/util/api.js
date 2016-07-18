define([
    'reqwest',
    '../actions/ServerActions',
    '../store/PersonStore',
    '../entity/SavedStatusEntity'
], function (Reqwest, ServerActions, PersonStore, SavedStatusEntity) {

    function _post(url, data, successCb, errorCb) {
        return Reqwest({
            url: url,
            type: 'json',
            method: 'post',
            timeout: 30000,
            data: data,
            success: function (data) {
                successCb(data);
            },
            error: function (error) {
                errorCb(error);
            }
        });
    }

    return {
        loadItems: function () {
            console.log('Loading items... please wait!');
            _post('/GetItems.php', null, ServerActions.receiveItemsData, ServerActions.receiveApiError);
        },

        /**
         *
         * @param person PersonEntity
         */
        savePerson: function (/*PersonEntity*/person) {
            console.log('saving person... please wait!');
            _post('/save.php', {
                person: person.email,
                schedule: JSON.stringify(person.schedule)
            }, function (status) {
                console.info('Saved Success');
                console.log(status);
                if(status === true) {
                    ServerActions.savedPerson(person.email, person.schedule, SavedStatusEntity.STATUS_SUCCESS);
                } else {
                    ServerActions.savedPerson(person.email, person.schedule, SavedStatusEntity.STATUS_ERROR);
                }
            }, function (error) {
                console.info('Saved Error');
                console.log(error);
                ServerActions.savedPersonError(person.email, person.schedule, SavedStatusEntity.STATUS_ERROR);
            });
        },

        createPerson: function (email, going, guests, date) {
            var person = PersonStore.newPersonWithSchedule(email, going, guests, date);
            this.savePerson(person);
        },

        removeSchedle: function (email, schedule) {
            _post('/delete.php', {
                person: email,
                schedule: JSON.stringify(schedule)
            }, function (status) {
                console.log("Remove Schedule");
                console.log(status);
            }, function (error) {
                console.info('Remove Schedule Error');
                console.log(error);
                ServerActions.savedPersonError(email, schedule, SavedStatusEntity.STATUS_ERROR);
            });
        }
    }
});