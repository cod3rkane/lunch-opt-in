define([
    'react',
    '../store/ModalStore',
    '../actions/AppActions',
    './ScheduleSection',
    '../entity/ScheduleEntity',
    '../store/PersonStore',
    'immutable',
    //---
    './ScheduleModal.scss'
], function (React, ModalStore, AppActions, ScheduleSection, ScheduleEntity, PersonStore, Immutable) {

    function getStateStore() {
        return {
            person: ModalStore.getPerson(),
            shownEdit: false,
            currEditSchedule: new ScheduleEntity(),
        };
    }

    return React.createClass({

        componentWillMount: function () {
            ModalStore.addChangeListener(this._changed);
        },

        getInitialState: function () {
          return getStateStore();
        },

        render: function () {
            if (this.state.person.size) {
                $('.a-c-schedule-modal').modal('show').on('hidden.bs.modal', this._onClickCancel);
            }

            return (
                <div className="a-c-schedule-modal modal fade">
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h4 className="modal-title">{this.state.person.email + ' ' + __("Schedules")}</h4>
                            </div>
                            <div className="modal-body">
                                <div className={"item-content " + (this.state.shownEdit ? 'shown-edit' : '')}>
                                    <div className="item">
                                        <ScheduleSection schedule={this.state.person.schedule} onClickEdit={this._onEditHandle}/>
                                    </div>
                                    <div className="item">
                                        <div>
                                            <button className="btn btn-info waves-effect waves-light" onClick={this._onClickBack}>
                                                {__("Back")}
                                            </button>
                                        </div>
                                        <div>
                                            <div className="new-schedule text-xs-center">
                                                <p className="bq-title">{__("Edit Schedule")}</p>
                                                <section className="row">
                                                    <div className="col-xs-2">
                                                        <p className="text-xs-center">
                                                            {__("For:")}
                                                        </p>
                                                    </div>
                                                    <div className="col-xs-4 text-xs-center">
                                                        {(this.state.shownEdit ? this.state.shownEdit.date.toDateString() : '')}
                                                    </div>
                                                    <div className="col-xs-6">
                                                        <div className="col-xs-12">
                                                            <button
                                                                data-changedate="1"
                                                                className="btn btn-large btn-primary waves-effect waves-light full-width"
                                                                onClick={this._onClickChangeDate}>+</button>
                                                        </div>
                                                        <div className="col-xs-12">
                                                            <button
                                                                data-changedate="0"
                                                                className="btn btn-primary waves-effect waves-light full-width"
                                                                onClick={this._onClickChangeDate}>-</button>
                                                        </div>
                                                    </div>
                                                </section>
                                            </div>
                                            <div className="schedule-btn-section">
                                                <button
                                                    onClick={this._onClickOpt}
                                                    className="btn btn-primary bt-opt-in waves-effect waves-light">
                                                    {(this.state.shownEdit && this.state.shownEdit.going ? __('Not coming') : __('coming'))}
                                                </button>
                                                <button
                                                    className={"btn waves-effect waves-light " +
                                                    (!this.state.shownEdit.going ? 'btn-danger' : 'btn-default')}
                                                    onClick={this._onClickGuests}>
                                                    {__('Bringing guests')}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" data-dismiss="modal"
                                        onClick={this._onClickCancel}>{__("Cancel")}</button>
                                <button className="btn btn-primary" onClick={this._onClickSave}>{__("Save all change")}</button>
                            </div>
                        </div>
                    </div>
                </div>
            );
        },

        _changed: function () {
            var person = ModalStore.getPerson();
            this.setState({
                person: person
            });
        },

        _onClickCancel: function (e) {
            AppActions.openScheduleModal();
            setTimeout(this.setState(getStateStore()), 200);
        },

        _onEditHandle: function (/*Schedule*/schedule) {
            this.setState({
                shownEdit: schedule,
                currEditSchedule: schedule
            });
        },

        _onClickBack: function (e) {
            this.setState({
                shownEdit: false
            });
        },

        _onClickChangeDate: function (e) {
            var nextDate = new Date();

            if (e.target.getAttribute('data-changedate') == 1)
                nextDate.setDate(this.state.shownEdit.date.getDate() + 1);
            else
                nextDate.setDate(this.state.shownEdit.date.getDate() - 1);

            var newSchedule = this.state.shownEdit.set('date', nextDate);
            this._updateSchedule(newSchedule);
        },

        _onClickOpt: function(e) {
            var newSChedule = this.state.shownEdit.set('going', !this.state.shownEdit.going);

            if (this.state.shownEdit.going) {
                newSChedule = newSChedule.set('guests', 0);
            }

            this._updateSchedule(newSChedule);
        },

        _onClickGuests: function() {
            if (!this.state.shownEdit.going) return;
            var result = prompt(__("Number of Guests"));

            while (isNaN(result)) {
                result = prompt(__("Number of Guests, please write a number!"));
            }

            var newSChedule = this.state.shownEdit.set('guests', result);
            this._updateSchedule(newSChedule);
        },

        _updateSchedule: function (newSchedule) {
            var key = this.state.person.schedule.keyOf(this.state.currEditSchedule),
                schedules = this.state.person.schedule.set(key, newSchedule),
                newPerson = this.state.person.set('schedule', schedules);

            this.setState({
                shownEdit: newSchedule,
                currEditSchedule: newSchedule,
                person: newPerson
            });
        },

        _onClickSave: function (e) {
            var people = PersonStore.getAll(),
                newPeople = people.set(this.state.person.email.toUpperCase(), this.state.person);
            AppActions.changePeople(newPeople);
        }
    })
});