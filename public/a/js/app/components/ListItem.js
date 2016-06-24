define([
    'react',
    '../entity/PersonEntity',
    '../entity/ScheduleEntity',
    '../actions/AppActions',
    './ScheduleSection',
    //----
    './ListItem.scss'
], function(React, Person, Schedule, Actions, ScheduleSection) {

    var defaultProps = new Person();

    return React.createClass({
        displayName: 'ListItem',

        propTypes: {
            person: React.PropTypes.instanceOf(Person)
        },

        getDefaultProps: function() {
            return defaultProps;
        },

        render: function() {
            var email = this.props.person.email;
            var name = email.replace(/@.*/, ''),
                domain = '';
            if (email.indexOf('@') > -1) {
                domain = email.replace(/^.+?@/, '@')
            }

            return (
                <div className="a-c-list-item">
                    <div className="col-xs-4">
                        <div className="card testimonial-card">
                            <div className="card-up default-color-dark"></div>
                            <div className="avatar">
                                <img className="img-circle img-responsive" src={Person.getPicUrl(email)}/>
                            </div>
                            <div className="card-block">
                                <h4 className="card-title">
                                    {name}<br/>
                                    <small className="text-muted">{domain}</small>
                                </h4>
                                <hr/>
                                <ScheduleSection schedule={this.props.person.schedule} />
                            </div>
                            <div className="btn-group">
                                <button onClick={this._onClick}
                                    className="btn btn-primary bt-opt-in">{__('Opt-out')}</button>
                                <button className="btn btn-default waves-effect waves-light">{__('+guests')}</button>
                            </div>
                        </div>
                    </div>
                </div>
            );
        },

        _onClick: function() {
            Actions.createPersonSchedule(this.props.person.email, false);
        }

    });
});
/*
*/
