const Notification = (props) => {
    if (props.message === '') { return null }

    if (props.type === 'error') { <div className="notificationError">{props.message}</div> }
    
    return <div className="notification">{props.message}</div>
}

export default Notification