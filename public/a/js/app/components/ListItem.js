define([
    'react',
    '../entity/PersonEntity',
    '../entity/ScheduleEntity',
    '../actions/AppActions',
    './ScheduleSection',
    '../store/PersonStore',
    '../entity/SavedStatusEntity',
    '../util/CheckDate',
    //----
    './ListItem.scss'
], function(React, Person, Schedule, Actions, ScheduleSection, PersonStore, SavedStatusEntity, CheckDate) {

    var defaultProps = new Person();
    return React.createClass({
        displayName: 'ListItem',
        _setTimeOut: '',

        propTypes: {
            person: React.PropTypes.instanceOf(Person)
        },

        getDefaultProps: function() {
            return defaultProps;
        },

        getDefaultState: function () {
            return {
                currDate: this._getNextWorkDate(this.props.person),
                savedStatus: PersonStore.getSavedStackById(this.props.person.email)
            }
        },

        getInitialState: function () {
            return this.getDefaultState()
        },

        componentDidMount: function () {
            PersonStore.addSavedPersonListener(this._onSaveStatus);
            PersonStore.addSavedPersonErrorListener(this._onSaveStatus);
        },

        componentWillUnmount: function () {
            PersonStore.removeSavedPersonListener(this._onSaveStatus);
            PersonStore.removeSavedPersonErrorListener(this._onSaveStatus);
        },

        componentWillReceiveProps: function (nextProps) {
            this.setState({
                currDate: this._getNextWorkDate(nextProps.person)
            })
        },

        render: function() {
            var email = this.props.person.email;
            var name = email.replace(/@.*/, ''),
                domain = '';
            if (email.indexOf('@') > -1) {
                domain = email.replace(/^.+?@/, '@')
            }

            var touchSeeMore = (this.props.person.schedule.size > 1 || this.props.person.schedule.size == 1 &&
                this.props.person.schedule.first().status == SavedStatusEntity.STATUS_ERROR);

            if (this.state.savedStatus && this.state.savedStatus.status) {
                switch (this.state.savedStatus.status) {
                    case SavedStatusEntity.STATUS_SUCCESS:
                        this.state.savedStatus = (<div className="alert alert-success text-xs-center">{__("Schedule Saved.")}</div>);
                        break;
                    case SavedStatusEntity.STATUS_ERROR:
                        this.state.savedStatus = (<div className="alert alert-danger text-xs-center">{__("An error occurred")}</div>);
                        break;
                    case SavedStatusEntity.STATUS_PENDING:
                        this.state.savedStatus = (<div className="alert alert-warning text-xs-center">{__("Pending")}</div>);
                        break;
                    default:
                        this.state.savedStatus = (<div className="alert alert-danger text-xs-center">{__("Unknown error occurred")}</div>);
                }

                var me = this;

                if (this._setTimeOut) {
                    clearTimeout(this._setTimeOut);
                    this._setTimeOut = '';
                    setTimeout(function () {
                        me.setState(me.getDefaultState);
                    }, 5000);
                } else {
                    this._setTimeOut = setTimeout(function () {
                        me.setState(me.getDefaultState);
                    }, 5000);
                }
            }

            return (
                <div className="a-c-list-item">
                    <div className="col-xs-12">
                        <div className="card testimonial-card">
                            <div className="card-up default-color-dark"></div>
                            <div className="avatar">
                                <img className="img-circle img-responsive" src={Person.getPicUrl(email)}/>
                            </div>
                            <div className="card-block">
                                <h4 className="card-title">
                                    {name}<br/>
                                    <small className="text-muted">{domain}</small>
                                </h4>
                                <hr/>
                                <ScheduleSection schedule={this.props.person.schedule} first={true} onClickEdit={this._onClickSeeMore}/>
                                <div className={"touch-smore text-xs-center " + touchSeeMore} onClick={this._onClickSeeMore}>
                                    <b>{__('Touch see more')}</b>
                                </div>
                            </div>
                            <div className="new-schedule text-xs-center">
                                <p className="bq-title">{__("New Schedule")}</p>
                                <section className="row">
                                    <div className="col-xs-2">
                                        <p className="text-xs-center">
                                            {__("For:")}
                                        </p>
                                    </div>
                                    <div className="col-xs-4 text-xs-center">
                                        {this.state.currDate.toDateString()}
                                    </div>
                                    <div className="col-xs-6">
                                        <div className="col-xs-12">
                                            <button
                                                className="btn btn-large btn-primary waves-effect waves-light full-width"
                                                onClick={this._onClickMoreOneDay}>+</button>
                                        </div>
                                        <div className="col-xs-12">
                                            <button
                                                className="btn btn-primary waves-effect waves-light full-width"
                                                onClick={this._onClickLessOneDay}>-</button>
                                        </div>
                                    </div>
                                </section>
                            </div>
                            {(this.state.savedStatus ? this.state.savedStatus : '')}
                            <div className="schedule-btn-section">
                                <button
                                    onClick={this._onClickOptOut}
                                    className="btn btn-primary bt-opt-in waves-effect waves-light">
                                    {__('Not coming')}
                                </button>
                                <button
                                    className="btn btn-default waves-effect waves-light"
                                    onClick={this._onClickGuests}>
                                    {__('Bringing guests')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            );
        },

        _nextDate: function () {
            var newDate = new Date();

            newDate.setDate(this.state.currDate.getDate() + 1);

            this.setState({
                currDate: newDate
            })
        },

        _onClickOptOut: function() {
            Actions.createPersonSchedule(this.props.person.email, false, false, this.state.currDate);
            this._nextDate();
        },

        _onClickGuests: function() {
            // Actions.openInputGuests(true);
            // this.props.onGuest(this.props.person.email);
            //Actions.createPersonSchedule(this.props.person.email, true, 2);
            var result = prompt(__("Number of Guests"));

            while (isNaN(result)) {
                result = prompt(__("Number of Guests, please write a number!"));
            }

            if (result) {
                Actions.createPersonSchedule(this.props.person.email, true, result, this.state.currDate);
                this._nextDate();
            }
        },

        _onClickMoreOneDay: function (e) {
            var nextDate = new Date();

            nextDate.setDate(this.state.currDate.getDate() + 1);
            nextDate = CheckDate.check(nextDate, CheckDate.TYPE_MORE);

            this.setState({
                currDate: nextDate
            })
        },

        _onClickLessOneDay: function (e) {
            var nextDate = new Date();
            nextDate.setDate(this.state.currDate.getDate() - 1);
            nextDate = CheckDate.check(nextDate, CheckDate.TYPE_LESS);

            this.setState({
                currDate: nextDate
            })
        },

        /**
         *
         * @param person
         * @returns {Date}
         * @private
         */
        _getNextWorkDate: function (person) {
            return PersonStore.getNextScheduleDate(person);
        },

        _onClickSeeMore: function(e) {
            Actions.openScheduleModal(this.props.person);
        },

        _onSaveStatus: function () {
            // pode ser que o PersonStore emita o evento avisando que mudou o status, mas foi para outro user.
            if (this.state.savedStatus) {
                var existStatus = PersonStore.getSavedStackById(this.props.person.email);
                if (existStatus) {
                    this.setState({
                        savedStatus: existStatus
                    });
                }
            } else {
                this.setState(this.getDefaultState());
            }
        }
    });
});
/*
*/
