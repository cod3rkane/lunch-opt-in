define([
    'react',
    //----
    './HeaderEmailInput.scss'
], function(React) {

    return React.createClass({
        displayName: 'HeaderEmailInput',
        
        propTypes: {
            onChange: React.PropTypes.func.isRequired,
            value: React.PropTypes.string
        },

        getInitialState: function() {
            return {
                value: this.props.value || ''
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
