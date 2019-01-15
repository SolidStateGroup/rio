import React, {Component, PropTypes} from 'react';
import {Link, IndexLink} from 'react-router';

const Header = class extends Component {
    static displayName = 'Header';

    render () {
        return (
            <div>
                <nav className="navbar navbar-light bg-faded">
                    <IndexLink to="/" className="navbar-brand" href="#">Brand</IndexLink>
                    <ul className="nav navbar-nav">
                        <li className="nav-item">
                            <IndexLink activeClassName="active" to="/" className="nav-link" href="#">Canvas draw</IndexLink>
                        </li>
                        <li className="nav-item">
                            <Link activeClassName="active" to="/pong" className="nav-link" href="#">Play Pong</Link>
                        </li>
                        <li className="nav-item">
                            <Link activeClassName="active" to="/pong-vs" className="nav-link" href="#">Play 2P Pong</Link>
                        </li>
                        <li className="nav-item">
                            <Link activeClassName="active" to="/particles" className="nav-link" href="#">Particles</Link>
                        </li>
                        <li className="nav-item">
                            <Link activeClassName="active" to="/snake" className="nav-link" href="#">Snake</Link>
                        </li>
                        <li className="nav-item">
                            <Link activeClassName="active" to="/breakout" className="nav-link" href="#">Breakout!</Link>
                        </li>
                        <li className="nav-item">
                            <Link activeClassName="active" to="/atari" className="nav-link" href="#">Atari 2600</Link>
                        </li>
                        <li className="nav-item">
                            <Link activeClassName="active" to="/nesbox" className="nav-link" href="#">Nesbox</Link>
                        </li>
                        <li className="nav-item">
                            <Link activeClassName="active" to="/jsnes" className="nav-link" href="#">JSNES</Link>
                        </li>
                        <li className="nav-item">
                            <Link activeClassName="active" to="/preview" className="nav-link" href="#">Wall Preview</Link>
                        </li>
                    </ul>
                </nav>
            </div>
        );
    }
};

module.exports = Header;
