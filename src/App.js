import React from 'react'
import MessageList from './components/MessageList'

export default class App extends React.Component {
    render() {
        return (
            <div style={{fontFamily: "Calibri, Arial, sans-serif"}}>
                <MessageList/>
            </div>
        )
    }
}