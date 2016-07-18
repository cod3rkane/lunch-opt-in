define([
    'react',
    './ListItem',
    'immutable',
    '../store/PersonStore',
    './ScheduleModal',
    '../../../img/lightbox/preloader.gif',
    '../actions/AppActions',
    //----
    './List.scss'
], function(React, ListItem, Immutable, PersonStore, ScheduleModal, preloader, Actions) {

    function getStateStore() {
        return {
            people: PersonStore.getCurrPeople(),
            fetching_items: false,
            fetching_error: ''
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
            PersonStore.addFetchingItemsListener(this._onFetchingItems);
            PersonStore.addReceiveItemsListener(this._onReceiveItems);
            PersonStore.addReceiveItemsWithErrorListener(this._onReceiveItemsError);
        },

        componentWillUnmount: function() {
            PersonStore.removeChangeListener(this._onChange);
            PersonStore.removeFetchingItemsListener(this._onFetchingItems);
            PersonStore.removeReceiveItemsListener(this._onReceiveItems);
            PersonStore.removeReceiveItemsWithErrorListener(this._onReceiveItemsError);
        },

        render: function() {
            var listItems;
            if (this.state.people.size == 0 && !this.state.fetching_error) {
                listItems = <div className="text-xs-center">{__("Search your email.")}</div>
            } else {
                listItems = this.state.people.valueSeq().map(function(/*../entity/Person*/person) {
                    return (
                        <div className="col-xs-12 col-sm-6 list-item_--_" key={person.email.toUpperCase()}>
                            <ListItem
                                person={person}
                            />
                        </div>
                    );
                }, this);
            }

            var personNum = Immutable.OrderedMap();
            var guestsNum = 0;

            this.state.people.valueSeq().sortBy(function (e) {
                return e.schedule.date;
            }).forEach(function (person) {
                person.schedule.forEach(function (schedule) {
                    if (schedule.date.getDate() == (new Date()).getDate()) {
                        if (!schedule.going)
                            personNum = personNum.set(person.email, person);
                        if (schedule.going && schedule.guests > 0)
                            guestsNum += parseInt(schedule.guests);
                    }
                })
            });

            var personStatus;
            var guestsStatus;

            if (personNum.size != guestsNum) {
                var style;
                if (guestsNum > 0) {
                    style = {
                        borderRight: '1px solid #d0d0d0',
                        marginRight: '6px'
                    };
                    guestsStatus = (<span><b>{guestsNum + ' Guests Today'}</b></span>);
                }

                if (personNum.size > 0) {
                    personStatus = (<span style={style}><b>{personNum.size + ' Not Coming '}</b></span>);
                }
            }

            return (
                <div className="a-c-list_--_">
                    <div className="text-xs-center">
                        {personStatus}
                        {guestsStatus}
                    </div>
                    <div className="row">
                        <div className={"list-loading_--_ text-xs-center " + this.state.fetching_items}>
                            <img src={preloader} alt={__("Pacman Loading animation")}/>
                        </div>
                        {this.state.fetching_error}
                        {listItems}
                        <ScheduleModal />
                    </div>
                </div>
            )
        },

        _onChange: function() {
            this.setState(getStateStore());
        },

        _onFetchingItems: function () {
            this.setState({
                fetching_items: true
            });
        },

        _onReceiveItems: function () {
            this.setState(getStateStore());
        },

        _onReceiveItemsError: function () {
            this.setState({
                fetching_items: false,
                fetching_error: <div className="text-xs-center">{__("could not load items, please try again later.")}</div>
            });
        }

    });
});
