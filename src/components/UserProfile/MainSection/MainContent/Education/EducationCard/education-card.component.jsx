import React from "react";
import classes from "./education-card.module.css";

const EducationCard = (props) => {
  return (
    <div className={classes.EducationCard}>
      <h3>{props.data.school}</h3>
      <p>
        {props.data.degree}, {props.data.fieldofstudy}
      </p>
      <small>
        {props.data.from} - {props.data.to}
      </small>
      <div className={classes.ExtraContent}>
        {props.data.description ? <p>{props.data.description}</p> : null}
      </div>
      <div className={classes.Buttons}>
        <button className={classes.EditBtn}>
          <i class="fas fa-2x fa-edit"></i>
        </button>
        <button className={classes.DeleteBtn}>
          <i class="fas fa-2x fa-trash"></i>
        </button>
      </div>
    </div>
  );
};

export default EducationCard;