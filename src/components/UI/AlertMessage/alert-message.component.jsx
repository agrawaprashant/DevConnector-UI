import React from "react";
import classes from "./alert-message.module.css";

class AlertMessage extends React.Component {
  render() {
    const { props } = this;
    return (
      <div
        style={{
          backgroundColor: props.type === "success" ? "#5cb85c" : "	#d9534f",
        }}
        className={classes.AlertMessage}
      >
        <p>{props.message}</p>
        <button onClick={() => props.closed()}>
          <i className="fas fa-times fa-lg"></i>
        </button>
      </div>
    );
  }
}

export default AlertMessage;
