import React from 'react'

export default class AppContainer extends React.Component {
    render() {
        return (
            <div style={{fontFamily: "Calibri, Arial, sans-serif"}}>
                {this.props.children}
            </div>
        )
    }
}