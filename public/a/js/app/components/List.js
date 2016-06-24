define([
    'react',
    './ListItem',
    'immutable',
    '../store/PersonStore',
], function(React, ListItem, Immutable, PersonStore) {

    function getStateStore() {
        return {
            people: PersonStore.getCurrPeople(),
        };
    }

    return React.createClass({
        displayName: 'List',

        propTypes: {
            people: React.PropTypes.instanceOf(Immutable.List([])),
        },

        getInitialState: function() {
            return getStateStore()
        },

        componentDidMount: function() {
            PersonStore.addChangeListener(this._onChange);
        },

        componentWillUnmount: function() {
            PersonStore.removeChangeListener(this._onChange);
        },

        render: function() {
            var listItems = this.state.people.valueSeq().map(function(/*../entity/Person*/person) {
                return (
                    <div class="card-columns" key={person.email.toUpperCase()}>
                        <ListItem
                            person={person}
                        />
                    </div>
                );
            }, this);

            return (
                <div className="a-c-list_--_">
                    <div className="row">
                        {listItems}
                    </div>
                </div>
            )
        },

        _onChange: function() {
            this.setState(getStateStore());
        }

    });
});
