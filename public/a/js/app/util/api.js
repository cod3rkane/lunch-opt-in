define([
    'reqwest',
    '../actions/ServerActions',
    '../store/PersonStore',
    '../entity/SavedStatusEntity'
], function (Reqwest, ServerActions, PersonStore, SavedStatusEntity) {
    return {
        loadItems: function () {
            console.log('Loading items... please wait!');
            Reqwest({
                url: '/GetItems.php',
                type: 'json',
                method: 'post',
                timeout: 30000,
                success: function (data) {
                    ServerActions.receiveItemsData(data);
                },
                error: function (error) {
                    ServerActions.receiveApiError(error);
                }
            });
        },

        /**
         *
         * @param person PersonEntity
         */
        savePerson: function (/*PersonEntity*/person) {
            console.log('saving person... please wait!');
            Reqwest({
                url: '/save.php',
                type: 'json',
                method: 'post',
                timeout: 30000,
                data: {
                    person: person.email,
                    schedule: JSON.stringify(person.schedule)
                },
                success: function (status) {
                    console.info('Saved Success');
                    console.log(status);
                    if(status === true) {
                        ServerActions.savedPerson(person.email, person.schedule, SavedStatusEntity.STATUS_SUCCESS);
                    } else {
                        ServerActions.savedPerson(person.email, person.schedule, SavedStatusEntity.STATUS_ERROR);
                    }
                },
                error: function (error) {
                    console.info('Saved Error');
                    console.log(error);
                    ServerActions.savedPersonError(person.email, person.schedule, SavedStatusEntity.STATUS_ERROR);
                }
            });
        },

        createPerson: function (email, going, guests, date) {
            var person = PersonStore.newPersonWithSchedule(email, going, guests, date);
            this.savePerson(person);
        }
    }
});