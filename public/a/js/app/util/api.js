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
                timeout: 100,
                data: {
                    person: person.email,
                    schedule: JSON.stringify(person.schedule)
                },
                success: function (status) {
                    console.log(person);
                    console.info('Saved Success');
                    console.info(status);
                    ServerActions.savedPerson(person.email, SavedStatusEntity.STATUS_SUCCESS);
                },
                error: function (error) {
                    console.info('Saved Error');
                    console.info(error);
                    ServerActions.savedPersonError(person.email, SavedStatusEntity.STATUS_ERROR);
                }
            });
        },

        createPerson: function (email, going, guests, date) {
            var person = PersonStore.newPersonWithSchedule(email, going, guests, date);
            this.savePerson(person);
        }
    }
});