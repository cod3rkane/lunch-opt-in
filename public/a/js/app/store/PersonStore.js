define([
    'object-assign',
    'events',
    '../dispatcher/AppDispatcher',
    '../constants/AppConstants',
    'immutable',
    '../entity/PersonEntity',
    '../entity/ScheduleEntity',
    '../entity/SavedStatusEntity',
    'reqwest',
    //---
    'string_score',
], function(assign, events, Dispatcher, Constants, Immutable, PersonEntity, ScheduleEntity, SavedStatusEntity, Reqwest) {

    var _people = Immutable.OrderedMap(),
        _currPeople = _people,
        CHANGE_EVENT = 'change',
        FETCHING_ITEMS_EVENT = 'fetching items',
        RECEIVE_ITEMS_EVENT = 'receive items',
        RECEIVE_ITEMS_WITH_ERROR = 'fetching items return error',
        SAVED_PERSON_EVENT = 'person saved with success',
        SAVED_PERSON_ERROR = 'person saved with error';

    // Status Stack
    var _savedStatusStack = Immutable.OrderedMap();

    var fixedHolidays = [
        {d:  1, m:  1, title: 'Confraternização Universal'},
        {d: 21, m:  4, title: 'Tiradentes'},
        {d:  1, m:  5, title: 'Dia do Trabalhador'},
        {d:  9, m:  7, title: 'Revolução Constitucionalista de 1932'},
        {d:  7, m:  9, title: 'Proclamação da Independência'},
        {d: 12, m: 10, title: 'Nossa Senhora Aparecida'},
        {d:  2, m: 11, title: 'Finados'},
        {d: 15, m: 11, title: 'Proclamação da República'},
        {d: 25, m: 12, title: 'Natal'},
    ];

    /**
     *
     * @param {string?} email
     * @private
     */
    function _filterPeople(email) {
        if (!email) {
            _currPeople = _people.sort(function(/*PersonEntity*/a, /*PersonEntity*/b) {
                var emailA = a.email.toUpperCase(),
                    emailB = b.email.toUpperCase();

                if (emailA < emailB) {
                    return -1
                }
                if (emailA > emailB) {
                    return 1
                }

                return 0;
            });
        } else {
            _currPeople = _people.filter(function(/*PersonEntity*/person) {
                return person.email.match(new RegExp(email, 'i'));
            }).sort(function(/*PersonEntity*/a, /*PersonEntity*/b) {
                var scoreA = a.email.score(email),
                    scoreB = b.email.score(email);

                if (scoreA < scoreB) {
                    return -1
                }
                if (scoreA > scoreB) {
                    return 1
                }

                return 0;
            });

            if (!_currPeople.size) {
                _currPeople = _currPeople.set('new-person', new PersonEntity({
                    email: email,
                }));
            }
        }
    }

    function _getPersonByEmail(email) {
        email = email.toUpperCase();
        return _people.get(email.toUpperCase());
    }

    /**
     *
     * @param person
     * @param {Date} date
     * @returns {*}
     * @private
     */
    function _getPersonScheduleByDate(person, date) {
        date.setHours(0, 0, 0, 0);
        return person.schedule.get(date.getTime());
    }

    function _setPeople(people) {
        _people = people;
        _filterPeople();
    }

    /**
     *
     * @param {string} email
     * @returns {PersonEntity}
     * @private
     */
    function _putPerson(email) {
        var person = _getPersonByEmail(email);
        if (!person) {
            person = new PersonEntity({
                email: email,
            });

            _setPeople(_people.set(email.toUpperCase(), person));
        }

        return person;
    }

    /**
     *
     * @param {string} email
     * @param {ScheduleEntity} schedule
     * @returns {ScheduleEntity}
     * @private
     */
    var i = 0;

    function _getNextScheduleDate(person) {
        var lastSchedule = person.schedule.sort(function(/*../entity/Schedule*/a, /*../entity/Schedule*/b) {
            a.date.setHours(0, 0, 0, 0);
            b.date.setHours(0, 0, 0, 0);
            var bTime = b.date.getTime();
            var aTime = a.date.getTime();
            if (aTime > bTime) {
                return 1;
            }
            if (aTime < bTime) {
                return -1;
            }
            return 0;
        }).last();

        var date = new Date();
        if (lastSchedule) {
            date.setTime(lastSchedule.date.getTime());
            date.setDate(lastSchedule.date.getDate() + 1);
        } else {
            if (date.getDay() != 0 && date.getDay() != 6) {
                // Se hoje for um dia de semana, só podemos agendar o almoco até o meio dia de hoje
                if (date.getHours() >= 12) {
                    date.setDate(date.getDate() + 2);
                } else {
                    date.setDate(date.getDate() + 1);
                }
            }
        }

        var nextWorkingDay = function(date) {
            if (date.getDay() == 0 || date.getDay() == 6) {
                date.setDate(date.getDate() + 1);
                return date;
            }

            for (var i in fixedHolidays) {
                var fixedHoliday = fixedHolidays[i];
                if (date.getDate() == fixedHoliday.d && date.getMonth() == fixedHoliday.m - 1) {
                    date.setDate(date.getDate() + 1);
                    return date;
                }
            }

            return null;
        };

        while (nextWorkingDay(date)) {
        }

        return date;
    }

    function _putScheduleIntoPerson(email, schedule) {
        var person = _putPerson(email);

        if (!schedule.date) {
            var date = _getNextScheduleDate(person);
            schedule = schedule.set('date', date);
        }

        var currentSchedule = _getPersonScheduleByDate(person, schedule.date);

        if (currentSchedule) {
            schedule = currentSchedule.set('going', schedule.going)
                .set('guests', schedule.guests);
        } else {
            schedule.date.setHours(0,0,0,0);
        }

        schedule = person.schedule.set(schedule.date.getTime(), schedule);

        var newPerson = person.set('schedule', schedule),
            newPeople = _people.set(person.email.toUpperCase(), newPerson);

        _setPeople(newPeople);

        return schedule;
    }

    function _createPersonSchedule(email, going, guests, date, status) {
        var scheduleEntity = new ScheduleEntity({
            date: date,
            going: going,
            guests: guests,
            status: status
        });
        _putScheduleIntoPerson(email, scheduleEntity);
    }

    function _newSchedule(going, guests, date) {
        return new ScheduleEntity({
            date: date,
            going: going,
            guests: guests,
            status: SavedStatusEntity.STATUS_PENDING
        });
    }

    function _newPersonWithSchedule(email, going, guests, date) {
        var person = new PersonEntity({
            email: email,
        });

        var schedule = _newSchedule(going, guests, date);

        return person.set('schedule', schedule);
    }

    function _personChange(person) {
        var people = Store.getAll(),
            newPeople = people.set(person.email.toUpperCase(), person);

        _setPeople(newPeople);
    }

    function _receiveItems(data) {
        if (!data.length) return;

        for (var key in data) {
            if (data.hasOwnProperty(key) && data[key].schedule) {
                data[key].schedule.forEach(function (e) {
                    _createPersonSchedule(data[key].email, e.going, e.guests, new Date(e.date.date),
                        SavedStatusEntity.STATUS_SUCCESS);
                });
            }
        }
    }

    function _pushSavedStack(id, thread, status) {
        var newStatus = new SavedStatusEntity({
            id: id,
            status: status
        });

        var newSavedStack = _savedStatusStack.set(id, newStatus);
        _setSavedStatusStack(newSavedStack);

        var person = _getPersonByEmail(id);

        var schedule = _getPersonScheduleByDate(person, thread.date);
        var newScheduleStatus = schedule.set('status', status);
        var Schedules = person.schedule.set(person.schedule.keyOf(schedule), newScheduleStatus);
        person = person.set('schedule', Schedules);
        _personChange(person);
    }

    function _setSavedStatusStack(newStack) {
        _savedStatusStack = newStack;
        console.log('new SavedStack');
        console.log(_savedStatusStack);

        return _savedStatusStack;
    }

    function _changeSchedule(email, schedule) {
        var person = _getPersonByEmail(email);
        var Schedules = person.schedule.remove(schedule.date.getTime());
        person = person.set('schedule', Schedules);
        _personChange(person);
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

        emitFetchingItems: function () {
            this.emit(FETCHING_ITEMS_EVENT)
        },

        addFetchingItemsListener: function (callback) {
            this.on(FETCHING_ITEMS_EVENT, callback);
        },

        removeFetchingItemsListener: function (callback) {
            this.removeListener(FETCHING_ITEMS_EVENT, callback);
        },

        emitReceiveItems: function () {
            this.emit(RECEIVE_ITEMS_EVENT);
        },

        addReceiveItemsListener: function (callback) {
            this.on(RECEIVE_ITEMS_EVENT, callback);
        },

        removeReceiveItemsListener: function (callback) {
            this.removeListener(RECEIVE_ITEMS_EVENT, callback);
        },

        emitReceiveItemsWithError: function () {
            this.emit(RECEIVE_ITEMS_WITH_ERROR);
        },

        addReceiveItemsWithErrorListener: function (callback) {
            this.on(RECEIVE_ITEMS_WITH_ERROR, callback);
        },

        removeReceiveItemsWithErrorListener: function (callback) {
            this.removeListener(RECEIVE_ITEMS_WITH_ERROR, callback);
        },

        emitSavedPerson: function () {
            this.emit(SAVED_PERSON_EVENT);
        },

        addSavedPersonListener: function (callback) {
            this.on(SAVED_PERSON_EVENT, callback);
        },

        removeSavedPersonListener: function (callback) {
            this.removeListener(SAVED_PERSON_EVENT, callback);
        },

        emitSavedPersonError: function () {
            this.emit(SAVED_PERSON_ERROR);
        },

        addSavedPersonErrorListener: function (callback) {
            this.on(SAVED_PERSON_ERROR, callback);
        },

        removeSavedPersonErrorListener: function (callback) {
            this.removeListener(SAVED_PERSON_ERROR, callback);
        },

        /**
         *
         * @returns {List<PersonEntity>}
         */
        getAll: function() {
            return _people;
        },

        /**
         *
         * @returns {List<PersonEntity>}
         */
        getCurrPeople: function() {
            return _currPeople;
        },

        /**
         *
         * @param person
         * @returns {*}
         */
        getNextScheduleDate: function (person) {
            return _getNextScheduleDate(person);
        },

        newPersonWithSchedule: function (email, going, guests, date) {
            return _newPersonWithSchedule(email, going, guests, date);
        },

        getSavedStackById: function (email) {
            var thread = _savedStatusStack.get(email);

            if (thread) {
                var newSavedStack = _savedStatusStack.delete(email);
                _setSavedStatusStack(newSavedStack);
                return thread;
            }

            return null;
        }
    });

    Store.dispatchToken = Dispatcher.register(function(action) {
        var payload = action.payload;

        switch (action.actionType) {
            case Constants.APP_SEARCH_PERSON:
                _filterPeople(payload.text);
                Store.emitChange();
                break;

            case Constants.APP_CREATE_PERSON:
                // @todo - Se a pessoa já existir, nos vamos acabar emitindo o change event mesmo assim.
                //          Neste caso, será que o React vai ser capaz de identificar que nada mudou de verdade e sendo assim
                //          não renderizar a minha lista de pessoas novamente.

                break;

            case Constants.APP_CREATE_PERSON_SCHEDULE:
                _createPersonSchedule(payload.email, payload.going, payload.guests, payload.date, SavedStatusEntity.STATUS_PENDING);
                Store.emitChange();
                break;

            case Constants.APP_SAVING_PERSON:
                _personChange(payload.person);
                Store.emitChange();
                break;

            case Constants.APP_FETCHING_ITEMS:
                Store.emitFetchingItems();
                break;

            case Constants.APP_SAVED_PERSON:
                _pushSavedStack(payload.id, payload.thread, payload.status);
                Store.emitSavedPerson();
                Store.emitChange();
                break;

            case Constants.APP_SAVED_PERSON_ERROR:
                _pushSavedStack(payload.id, payload.thread, payload.status);
                Store.emitSavedPersonError();
                Store.emitChange();
                break;

            case Constants.APP_RECEIVE_API_DATA:
                _receiveItems(payload.data);
                Store.emitReceiveItems();
                break;

            case Constants.APP_RECEIVE_API_ERROR:
                Store.emitReceiveItemsWithError();
                break;

            case Constants.APP_CHANGE_SCHEDULE:
                _changeSchedule(payload.email, payload.schedule);
                Store.emitChange();
                break;

            default:
            // no op
        }
    });

    return Store;
});
