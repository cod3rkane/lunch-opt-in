import React from 'react';
import Header from './Header';
import List from './List';
import AppActions from '../actions/AppActions';
//-----
require('./HomePage.scss');

class HomePage extends React.Component {

    constructor() {
        super();
        this.displayName = 'HomePage';
    }

    componentDidMount() {
        AppActions.loadItems();
    }

    render() {
        return (
            <div className="a-c-home-page">
                <Header />
                <div className="container-fluid content_--_">
                    <List/>
                </div>
            </div>
        );
    }
}

export default HomePage;