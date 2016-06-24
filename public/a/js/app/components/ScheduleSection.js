define([
    'react',
    '../entity/ScheduleEntity',
    './ScheduleItem',
    'immutable'
    //----
], function(React, Schedule, ScheduleItem, Immutable) {

    var defaultProps = {
        schedule: Immutable.List([])
    };
    
    return React.createClass({
        propTypes: {
            schedule: React.PropTypes.instanceOf(Immutable.List([])),
        },

        getDefaultProps: function() {
            return defaultProps;
        },

        render: function() {
            var listItems = this.props.schedule.valueSeq().map(function(/*../entity/Schedule*/schedule) {
                return (
                    <ScheduleItem
                        key={schedule.date.getTime()}
                        schedule={schedule}
                    />
                );
            }, this);

            return (
                <div className="a-c-schedule-section">
                    {listItems}
                </div>
            );
        },

    });
});
