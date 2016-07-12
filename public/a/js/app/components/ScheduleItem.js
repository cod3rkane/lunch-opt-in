define([
    'react',
    '../entity/ScheduleEntity',
    //----
    './ScheduleItem.scss'
], function(React, Schedule) {

    var defaultProps = {
        schedule: new Schedule()
    };

    return React.createClass({
        displayName: 'ScheduleItem',

        propTypes: {
            schedule: React.PropTypes.instanceOf(Schedule),
            onClickEdit: React.PropTypes.func
        },

        getDefaultProps: function() {
            return defaultProps;
        },

        render: function() {
            var schedule = this.props.schedule;
            return (
                <div className="a-c-schedule-item" onClick={this._onEditClickHandle}>
                    <div>
                        {schedule.date.getDate()}/{schedule.date.getMonth() + 1}/{schedule.date.getFullYear()}
                                                 <span> - </span>
                        {schedule.going ? ' going ' : ' not going '}
                                                <span> - </span>
                        {schedule.guests}
                        {schedule.status}
                    </div>
                </div>
            );
        },

        _onEditClickHandle: function () {
            this.props.onClickEdit && this.props.onClickEdit(this.props.schedule);
        },
    });
});
