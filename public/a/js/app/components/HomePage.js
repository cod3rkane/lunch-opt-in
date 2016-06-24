define([
    'react',
    './Header',
    './List',
    //----
    './HomePage.scss'
], function(React, Header, List) {

    return React.createClass({
        displayName: 'HomePage',
        
        render: function() {
            return (
                <div className="a-c-home-page">
                    <Header />
                    <div className="container-fluid">
                        <List />
                    </div>
                </div>
            );
        }
    });
});
