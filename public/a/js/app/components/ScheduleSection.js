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
        },

        getDefaultProps: function() {
            return defaultProps;
        },

        render: function() {
            var touchSeeMore = (this.props.schedule.size > 1);
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
            ).first();

            return (
                <div className="a-c-schedule-section">
                    {listItems}
                    <div className={"touch-smore text-xs-center " + touchSeeMore} onClick={this._onClickSeeMore}>
                        <b>{__('Touch see more')}</b>
                    </div>
                </div>
            );
        },

        _onClickSeeMore: function(e) {
            alert("Open Modal See More");
        },
    });
});
