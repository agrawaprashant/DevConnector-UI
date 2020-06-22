import React from "react";
import classes from "./connection-item.module.css";
import { Link } from "react-router-dom";

const ConnectionItem = ({
  id,
  name,
  avatar,
  isOwner,
  type,
  clicked,
  unfollow,
}) => {
  let currentPath = window.location.href;
  if (currentPath !== "") {
    currentPath = "";
  }
  return (
    <div className={classes.ConnectionItem}>
      <img src={avatar} alt="avatar" />

      <Link
        onClick={() => (clicked ? clicked(false) : null)}
        to={`${currentPath}/profile/${id}`}
      >
        <p>{name}</p>
      </Link>
      {type === "following" && isOwner ? (
        <button onClick={() => unfollow(id)}>Unfollow</button>
      ) : null}
    </div>
  );
};

export default React.memo(ConnectionItem);
