define([
    'react',
    '../store/ModalStore',
    '../actions/AppActions',
    './ScheduleSection',
    'immutable'
], function (React, ModalStore, AppActions, ScheduleSection, Immutable) {

    function getStateStore() {
        return {
            person: ModalStore.getPerson(),
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
                                <h4 className="modal-title">{this.state.person.email + " " + __("Schedules")}</h4>
                            </div>
                            <div className="modal-body">
                                <ScheduleSection schedule={this.state.person.schedule}/>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" data-dismiss="modal"
                                        onClick={this._onClickCancel}>{__("Cancel")}</button>
                                <button className="btn btn-primary">{__("Save")}</button>
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
            })
        },

        _onClickCancel: function (e) {
            AppActions.openScheduleModal();
        }
    })
});