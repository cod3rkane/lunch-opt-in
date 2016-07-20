import React from 'react';
import ModalStore from '../store/ModalStore';
import AppActions from '../actions/AppActions';
import ScheduleSection from './ScheduleSection';
import ScheduleEntity from '../entity/ScheduleEntity';
import SavedStatusEntity from '../entity/SavedStatusEntity';
import PersonStore from '../store/PersonStore';
//-----
require('./ScheduleModal.scss');

function getStateStore() {
    return {
        person: ModalStore.getPerson(),
        shownEdit: false,
        currEditSchedule: new ScheduleEntity(),
    };
}

class ScheduleModal extends React.Component {
    constructor() {
        super();
        this.state = getStateStore();
    }

    componentWillMount() {
        ModalStore.addChangeListener(() => this._changed());
        PersonStore.addChangeListener(() => this._onPersonStoreChange());
    }

    componentWillUnmount() {
        ModalStore.removeChangeListener(() => this._changed());
        PersonStore.removeChangeListener(() => this._onPersonStoreChange());
    }

    render() {
        if (this.state.person.size) {
            $('.a-c-schedule-modal').modal('show').on('hidden.bs.modal', () => this._onClickCancel());
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
                                    <ScheduleSection schedule={this.state.person.schedule} onClickEdit={this._onEditHandle.bind(this)}/>
                                </div>
                                <div className="item">
                                    <div>
                                        <button className="btn btn-info waves-effect waves-light" onClick={this._onClickBack.bind(this)}>
                                            {__("Back")}
                                        </button>
                                    </div>
                                    <div>
                                        <div className="new-schedule">
                                            <section>
                                                <div className="col-xs-12">
                                                    <input type="date" className="form-control text-xs-center"
                                                           value={(editDate ? editDate[0] + '-' + editDate[1] + '-' + editDate[2] : '')}
                                                           onChange={this._onDatePicker.bind(this)}
                                                    />
                                                </div>
                                            </section>
                                        </div>
                                        <div className="schedule-btn-section text-xs-center">
                                            <button
                                                onClick={this._onClickOpt.bind(this)}
                                                className="btn btn-primary bt-opt-in waves-effect waves-light">
                                                {(this.state.shownEdit && this.state.shownEdit.going ? __('Not coming') : __('coming'))}
                                            </button>
                                            <button
                                                className={"btn waves-effect waves-light btn-default"}
                                                disabled={(!this.state.shownEdit.going)}
                                                onClick={this._onClickGuests.bind(this)}>
                                                {__('Bringing guests')}
                                            </button>
                                            <button className="btn btn-success waves-effect waves-light"
                                                    onClick={this._onClickSave.bind(this)}>{__("Save")}</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" data-dismiss="modal"
                                    onClick={this._onClickCancel.bind(this)}>{__("Cancel")}</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    //==== Private Methods ====//

    _changed() {
        var person = ModalStore.getPerson();
        this.setState({
            person: person
        });
    }

    _onClickCancel(e) {
        AppActions.openScheduleModal();
        setTimeout(() => this.setState(getStateStore()), 200);
    }

    _onEditHandle(/*Schedule*/schedule) {
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
    }

    _onClickBack(e) {
        this.setState({
            shownEdit: false
        });
    }

    _onClickOpt(e) {
        var newSChedule = this.state.shownEdit.set('going', !this.state.shownEdit.going);

        if (this.state.shownEdit.going) {
            newSChedule = newSChedule.set('guests', 0);
        }

        this._updateSchedule(newSChedule);
    }

    _onClickGuests() {
        if (!this.state.shownEdit.going) return;
        var result = prompt(__("Number of Guests"));

        while (isNaN(result)) {
            result = prompt(__("Number of Guests, please write a number!"));
        }

        var newSChedule = this.state.shownEdit.set('guests', result);
        this._updateSchedule(newSChedule);
    }

    _updateSchedule(newSchedule) {
        this.setState({
            shownEdit: newSchedule
        });
    }

    _onClickSave(e) {
        AppActions.changeSchedule(this.state.person.email, this.state.currEditSchedule, this.state.shownEdit);
    }

    _onDatePicker(e) {
        var dateStr = e.target.value.split('-');
        var newEdit = this.state.shownEdit.set('date', new Date(dateStr[1] + '-' + dateStr[2] + '-' + dateStr[0]));
        this.setState({
            shownEdit: newEdit
        });
    }

    _onPersonStoreChange() {
        if (this.state.person.email) {
            var person = PersonStore.getAll();
            this.setState({
                person: person.get(this.state.person.email.toUpperCase())
            });
        }
    }
}

export default ScheduleModal;