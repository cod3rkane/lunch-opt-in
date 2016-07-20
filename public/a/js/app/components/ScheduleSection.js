import React from 'react';
import Schedule from '../entity/ScheduleEntity';
import ScheduleItem from './ScheduleItem';
import Immutable from 'immutable';
//----
require('./ScheduleSection.scss');

class ScheduleSection extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        /* we are getting the smallest date in iterator */
        var me = this;
        var listItems = this.props.schedule.valueSeq().sortBy(x => x.date).map(
            /*../entity/Schedule*/schedule => {
                return (
                    <ScheduleItem
                        key={schedule.date.getTime()}
                        schedule={schedule}
                        onClickEdit={me.props.onClickEdit.bind(this)}
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
    }
}

ScheduleSection.PropTypes = {
    schedule: React.PropTypes.instanceOf(Immutable.List([])),
    first: React.PropTypes.bool,
    onClickEdit: React.PropTypes.func
};

ScheduleSection.defaultProps = {
    schedule: Immutable.List([]),
};


export default ScheduleSection;