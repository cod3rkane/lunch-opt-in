define([
    'reqwest',
    '../actions/ServerActions',
    '../store/PersonStore'
], function (Reqwest, ServerActions, PersonStore) {
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
                    ServerActions.savedPerson(status);
                },
                error: function (error) {
                    ServerActions.savedPersonError(error);
                }
            });
        },

        createPerson: function (email, going, guests, date) {
            var person = PersonStore.newPersonWithSchedule(email, going, guests, date);
            this.savePerson(person);
        }
    }
});