define([
    'react',
    '../entity/ScheduleEntity',
    //----
], function(React, Schedule) {

    var defaultProps = {
        schedule: new Schedule()
    };
    
    return React.createClass({
        displayName: 'ScheduleItem',

        propTypes: {
            schedule: React.PropTypes.instanceOf(Schedule),
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
                    </div>
                </div>
            );
        },

        _onEditClickHandle: function (e) {
            console.log("Open Edit Modal!");
        },
    });
});
