import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import App from './App'
import AuthCallbackHandler from './AuthCallbackHandler'

ReactDOM.render((
    <Router>
        <div>
            <Route exact path="/" component={App}/>
            <Route path="/callback" component={AuthCallbackHandler}/>
        </div>
    </Router>
), document.getElementById("root"))
