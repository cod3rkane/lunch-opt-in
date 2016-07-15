define([
    'react',
    //----
    './HeaderEmailInput.scss'
], function(React) {

    return React.createClass({
        displayName: 'HeaderEmailInput',

        propTypes: {
            onChange: React.PropTypes.func.isRequired
        },

        getInitialState: function() {
            return {
                value: ''
            };
        },

        render: function() {
            return (
                <div className="a-c-header-email-input">
                    <input
                        className="form-control form-control-lg"
                        type="email"
                        placeholder={__('Type your email here')}
                        onChange={this._onChange}
                        value={this.state.value}
                    />
                </div>
            );
        },

        _onChange: function(/*object*/event) {
            this.setState({
                value: event.target.value,
            });
            this.props.onChange(event.target.value.trim());
        }
    });
});
