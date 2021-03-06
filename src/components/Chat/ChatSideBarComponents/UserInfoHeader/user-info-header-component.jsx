import React, { Component } from "react";
import classes from "./user-info-header.module.css";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

class UserInfoHeader extends Component {
  render() {
    let currentPath = window.location.href;
    if (currentPath !== "") {
      currentPath = "";
    }
    const { userDetails } = this.props;
    return (
      <div className={classes.UserInfoHeader}>
        <Link to={`${currentPath}/profile/${userDetails.id}`}>
          <img src={userDetails.avatar} alt="user-avatar" />
        </Link>
        <Link to={`${currentPath}/profile/${userDetails.id}`}>
          <h3>{userDetails.name}</h3>
        </Link>
        <div className={classes.Icon}>
          <button>
            <i className="fas fa-ellipsis-v fa-lg"></i>
          </button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    userDetails: state.auth.user,
  };
};

export default connect(mapStateToProps)(UserInfoHeader);
