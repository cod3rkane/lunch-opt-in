define([
    'react',
    '../store/ModalStore',
    '../actions/AppActions',
    './ScheduleSection',
    '../entity/ScheduleEntity',
    '../entity/SavedStatusEntity',
    '../store/PersonStore',
    'immutable',
    //---
    './ScheduleModal.scss'
], function (React, ModalStore, AppActions, ScheduleSection, ScheduleEntity, SavedStatusEntity, PersonStore, Immutable) {

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
            PersonStore.addChangeListener(this._onPersonStoreChange);
        },

        componentWillUnmount: function () {
            ModalStore.removeChangeListener(this._changed);
            PersonStore.removeChangeListener(this._onPersonStoreChange);
        },

        getInitialState: function () {
          return getStateStore();
        },

        render: function () {
            if (this.state.person.size) {
                $('.a-c-schedule-modal').modal('show').on('hidden.bs.modal', this._onClickCancel);
            }
            var editDate = this.state.shownEdit ? this.state.shownEdit.date.toISOString().slice(0, 10).split('-') : '';

            return (
                <div className="a-c-schedule-modal modal fade">
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header text-xs-center">
                                <h4 className="modal-title">{this.state.person.email + ' ' + __("Calendar")}</h4>
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
                                            <div className="new-schedule">
                                                <section>
                                                    <div className="col-xs-12">
                                                        <input type="date" className="form-control text-xs-center"
                                                               value={(editDate ? editDate[0] + '-' + editDate[1] + '-' + editDate[2] : '')}
                                                               onChange={this._onDatePicker}
                                                        />
                                                    </div>
                                                </section>
                                            </div>
                                            <div className="schedule-btn-section text-xs-center">
                                                <button
                                                    onClick={this._onClickOpt}
                                                    className="btn btn-primary bt-opt-in waves-effect waves-light">
                                                    {(this.state.shownEdit && this.state.shownEdit.going ? __('Not coming') : __('coming'))}
                                                </button>
                                                <button
                                                    className={"btn waves-effect waves-light btn-default"}
                                                    disabled={(!this.state.shownEdit.going)}
                                                    onClick={this._onClickGuests}>
                                                    {__('Bringing guests')}
                                                </button>
                                                <button className="btn btn-success waves-effect waves-light"
                                                        onClick={this._onClickSave}>{__("Save")}</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" data-dismiss="modal"
                                        onClick={this._onClickCancel}>{__("Cancel")}</button>
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
            var now = new Date();
            now.setHours(0,0,0,0);

            if (schedule.date.getDate() == now.getDate()) {
                alert(__("You don't cannot edit the date for today"));
                return;
            }

            if (schedule.status == SavedStatusEntity.STATUS_ERROR) {
                AppActions.createPersonSchedule(this.state.person.email, schedule.going, schedule.guests, schedule.date);
            } else {
                this.setState({
                    shownEdit: schedule,
                    currEditSchedule: schedule
                });
            }
        },

        _onClickBack: function (e) {
            this.setState({
                shownEdit: false
            });
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
            this.setState({
                shownEdit: newSchedule
            });
        },

        _onClickSave: function (e) {
            AppActions.changeSchedule(this.state.person.email, this.state.currEditSchedule, this.state.shownEdit);
        },

        _onDatePicker: function (e) {
            var dateStr = e.target.value.split('-');
            var newEdit = this.state.shownEdit.set('date', new Date(dateStr[1] + '-' + dateStr[2] + '-' + dateStr[0]));
            this.setState({
                shownEdit: newEdit
            });
        },

        _onPersonStoreChange: function () {
            if (this.state.person.email) {
                var person = PersonStore.getAll();
                this.setState({
                    person: person.get(this.state.person.email.toUpperCase())
                });
            }
        }
    })
});