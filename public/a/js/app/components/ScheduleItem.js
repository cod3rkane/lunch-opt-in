define([
    'react',
    '../entity/ScheduleEntity',
    '../entity/SavedStatusEntity',
    //----
    './ScheduleItem.scss'
], function(React, Schedule, SavedStatusEntity) {

    var defaultProps = {
        schedule: new Schedule()
    };

    return React.createClass({
        displayName: 'ScheduleItem',

        propTypes: {
            schedule: React.PropTypes.instanceOf(Schedule),
            onClickEdit: React.PropTypes.func,
            fullWidth: React.PropTypes.bool
        },

        getDefaultProps: function() {
            return defaultProps;
        },

        render: function() {
            var schedule = this.props.schedule;
            var status;

            switch (schedule.status) {
                case SavedStatusEntity.STATUS_PENDING:
                    status = (<span className="label label-warning">{__('Pending')}</span>);
                    break;
                /*
                case SavedStatusEntity.STATUS_SUCCESS:
                    status = (<span className="label label-success">{__('Success')}</span>);
                    break;
                */
                case SavedStatusEntity.STATUS_ERROR:
                    status = (<span className="label label-danger">{__('Error, Try Again')}</span>);
                    break;
            }

            return (
                <div className={"a-c-schedule-item list-group-item col-xs-12 " + (!this.props.fullWidth ? 'col-sm-4' : '')} onClick={this._onEditClickHandle}>
                    <div className="row">
                        <div className="col-xs-12 text-xs-center">
                            <span>{schedule.date.getDate()}/{schedule.date.getMonth() + 1}/{schedule.date.getFullYear()}</span>
                            <span>{schedule.going ? ' going ' : ' not going '}</span>
                            <span>{(schedule.guests != 0 ? schedule.guests : '')}</span>
                            <span>{status}</span>
                        </div>
                    </div>
                </div>
            );
        },

        _onEditClickHandle: function () {
            this.props.onClickEdit && this.props.onClickEdit(this.props.schedule);
        },
    });
});
