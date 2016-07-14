define([
    'react',
    './Header',
    './List',
    '../actions/AppActions',
    //----
    './HomePage.scss'
], function(React, Header, List, AppActions) {

    return React.createClass({
        displayName: 'HomePage',

        componentDidMount: function() {
            AppActions.loadItems();
        },

        render: function() {
            return (
                <div className="a-c-home-page">
                    <Header />
                    <div className="container-fluid content_--_">
                        <List />
                    </div>
                </div>
            );
        }
    });
});
