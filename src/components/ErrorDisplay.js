import React from 'react'

export default class ErrorDisplay extends React.Component {
    render() {
        return (
            <div>
                <h2>{this.props.errorCode}</h2>
                <span>{this.props.message}</span>
            </div>
        )
    }
}