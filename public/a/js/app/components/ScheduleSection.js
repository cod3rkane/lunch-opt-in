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
            first: React.PropTypes.bool,
            onClickEdit: React.PropTypes.func
        },

        getDefaultProps: function() {
            return defaultProps;
        },

        render: function() {
            /* we are getting the smallest date in iterator */
            var me = this;
            var listItems = this.props.schedule.valueSeq().sortBy(function (x) {
                return x.date;
            }).map(
                function(/*../entity/Schedule*/schedule) {
                    return (
                        <ScheduleItem
                            key={schedule.date.getTime()}
                            schedule={schedule}
                            onClickEdit={me.props.onClickEdit}
                            fullWidth={(me.props.first)}
                        />
                    );
                }
            );

            if (this.props.first) {
                listItems = listItems.first();
            }

            return (
                <div className="a-c-schedule-section list-group">
                    {listItems}
                </div>
            );
        },
    });
});
