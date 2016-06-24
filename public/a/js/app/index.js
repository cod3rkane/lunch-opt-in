var target = document.getElementsByTagName('body')[0];
var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        switch (mutation.type) {
            case 'childList':
                console.log(mutation.type, mutation.target, 'previousSibling', mutation.previousSibling, 'Added:', mutation.addedNodes, 'Removed:', mutation.removedNodes);
                break;
            case 'characterData':
                console.log(mutation.type, mutation.target.parentElement, 'Change from:', mutation.oldValue, 'to', mutation.target.textContent);
                break;
            case 'attributes':
                console.log(mutation.type, mutation.target, 'Change attribute', mutation.attributeName, 'on NS', mutation.attributeNamespace);
                break;
            default:
                console.log(mutation);
        }
    });
});
var config = {
    childList:true,
    attributes:true,
    characterData:true,
    subtree:true,
    attributeOldValue:true,
    characterDataOldValue:true,
};
observer.observe(target, config);
// observer.disconnect();


// var ReactCompositeComponent = require("react/lib/ReactCompositeComponent");
// var oldRenderValidatedComponent = ReactCompositeComponent.Mixin._renderValidatedComponent;
// ReactCompositeComponent.Mixin._renderValidatedComponent = function() {
//     var name = this.getName();
//     if (name && !name.match(/^ReactDOM/)) {
//         console.log("render: ", this.getName(), {props: this._instance.props, state: this._instance.state});
//     }
//     return oldRenderValidatedComponent.apply(this, arguments);
// }
require([
    'react',
    'react-dom',
    'get-env',
    './components/HomePage'
], function(React, ReactDOM, env, HomePage) {

    window.React = React; // export for http://fb.me/react-devtools
    
    if (env() == 'dev') {
        require('promise/lib/rejection-tracking').enable(
            {allRejections: true}
        );
    }

    ReactDOM.render(
        <HomePage />,
        document.getElementById('page')
    );
});
