import React from 'react';
//-----
require('./HeaderEmailInput.scss');

class HeaderEmailInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: ''
        };
        this.displayName = 'HeaderEmailInput';
    }

    render() {
        return (
            <div className="a-c-header-email-input">
                <input
                    className="form-control form-control-lg"
                    type="email"
                    placeholder={__('Type your email here')}
                    onChange={this._onChange.bind(this)}
                    value={this.state.value}
                />
            </div>
        );
    }

    //==== Private Methods ====//

    _onChange(/*object*/event) {
        this.setState({
            value: event.target.value,
        });
        this.props.onChange(event.target.value.trim());
    }
}

HeaderEmailInput.propTypes = {
    onChange: React.PropTypes.func.isRequired
};

export default HeaderEmailInput;