/**
 * Created by kylejohnson on 16/09/2016.
 */
import './styles/screen.scss';
import {render} from 'react-dom';
import {Router, browserHistory} from 'react-router';
import routes from './routes';
import React from 'react';
import {AppContainer} from 'react-hot-loader';


// Render the React application to the DOM

const el = <Router isClient={true} history={browserHistory} routes={routes}/>;
const renderEl = () => {
    render(
        <AppContainer>
            {el}
        </AppContainer>,
        document.getElementById('react')
    );
};

renderEl();
if (module.hot) {
    module.hot.accept('./routes', renderEl);
}