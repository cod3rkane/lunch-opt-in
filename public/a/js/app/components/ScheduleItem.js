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
                <div className="a-c-schedule-item">
                    <div>
                        {schedule.date.getDate()}/{schedule.date.getMonth() + 1}/{schedule.date.getFullYear()}
                                                 -
                        {schedule.going ? ' going ' : ' not going '}
                                                 -
                        {schedule.guests}
                    </div>
                </div>
            );
        },

    });
});
