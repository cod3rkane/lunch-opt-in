import React from 'react';
import HeaderEmailInput from './HeaderEmailInput';
import AppActions from '../actions/AppActions';
//-----
require('./Header.scss');

class Header extends React.Component {

    constructor() {
        super();
        this.displayName = 'Header';
    }

    render() {
        return (
            <div className="a-c-showheader">
                <nav className="navbar navbar-dark bg-primary">
                    <div className="container-fluid">
                        <div className="col-xs-12">
                            <form className="form-inline" onSubmit={this._onSubmitListener}>
                                <HeaderEmailInput onChange={this._onChange}/>
                            </form>
                        </div>
                    </div>
                </nav>
            </div>
        );
    }

    //==== Private Methods ====//

    _onChange(/*String*/text) {
        AppActions.searchPerson(text);
    }

    _onSubmitListener(e) {
        e.preventDefault();
    }
}

export default Header;