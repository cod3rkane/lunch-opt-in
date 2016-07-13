define([
    'react',
    './HeaderEmailInput',
    '../actions/AppActions',
    //----
    './Header.scss'
], function(React, HeaderEmailInput, AppActions) {

    return React.createClass({
        displayName: 'Header',
        
        render: function() {
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
        },

        _onChange: function(/*String*/text) {
            AppActions.searchPerson(text);
        },

        _onSubmitListener: function (e) {
            e.preventDefault();
        }
    });
});
