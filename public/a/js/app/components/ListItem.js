define([
    'react',
    '../entity/PersonEntity',
    '../entity/ScheduleEntity',
    '../actions/AppActions',
    './ScheduleSection',
    '../store/PersonStore',
    //----
    './ListItem.scss'
], function(React, Person, Schedule, Actions, ScheduleSection, PersonStore) {

    var defaultProps = new Person();

    return React.createClass({
        displayName: 'ListItem',

        propTypes: {
            person: React.PropTypes.instanceOf(Person)
        },

        getDefaultProps: function() {
            return defaultProps;
        },

        getInitialState: function () {
            return {
                currDate: this._getNextWorkDate(this.props.person)
            }
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

            return (
                <div className="a-c-list-item">
                    <div className="col-xs-4">
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
                                <ScheduleSection schedule={this.props.person.schedule} />
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

            this.setState({
                currDate: nextDate
            })
        },

        _onClickLessOneDay: function (e) {
            var nextDate = new Date();
            nextDate.setDate(this.state.currDate.getDate() - 1);

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
    });
});
/*
*/
