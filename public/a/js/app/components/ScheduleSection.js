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
            var touchSeeMore;
            var lastDate;
            var listItems = this.props.schedule.valueSeq().map(function(/*../entity/Schedule*/schedule) {
                return (
                    <ScheduleItem
                        key={schedule.date.getTime()}
                        schedule={schedule}
                    />
                );
            }, this);

            if (touchSeeMore = this.props.schedule.size > 1) {
                listItems = listItems.filter(x => {
                    if (lastDate) {
                        lastDate = (lastDate.date > x.props.schedule.date ? lastDate : x.props.schedule);
                        return (lastDate.date > x.props.schedule.date);
                    } else
                        lastDate = x.props.schedule;

                    return true;
                }).last();
            }

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
