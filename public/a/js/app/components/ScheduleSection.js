define([
    'react',
    '../entity/ScheduleEntity',
    './ScheduleItem',
    'immutable',
    //----
    './ScheduleSection.scss'
], function(React, Schedule, ScheduleItem, Immutable) {

    var defaultProps = {
        schedule: Immutable.List([])
    };
    
    return React.createClass({
        propTypes: {
            schedule: React.PropTypes.instanceOf(Immutable.List([])),
            first: React.PropTypes.bool
        },

        getDefaultProps: function() {
            return defaultProps;
        },

        render: function() {
            /* we are getting the smallest date in iterator */
            var listItems = this.props.schedule.valueSeq().sortBy(function (x) {
                return x.date;
            }).map(
                function(/*../entity/Schedule*/schedule) {
                    return (
                        <ScheduleItem
                            key={schedule.date.getTime()}
                            schedule={schedule}
                        />
                    );
                }
            );

            if (this.props.first) {
                listItems = listItems.first();
            }

            return (
                <div className="a-c-schedule-section">
                    {listItems}
                </div>
            );
        },
    });
});
