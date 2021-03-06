import React from "react";
import { buildFormControl, updateObject } from "../../../../shared/utility";
import {
  checkValidity,
  checkFormValidity,
} from "../../../../shared/checkInputValidity";
import classes from "./add-new-skill.module.css";
import Input from "../../../../components/UI/Input/input.component";
import { connect } from "react-redux";
import * as actions from "../../../../store/actions/actions";
import AlertMessage from "../../../../components/UI/AlertMessage/alert-message.component";
import Aux from "../../../../hoc/Auxilliary/auxilliary";
class AddNewSkill extends React.Component {
  state = {
    addSkillForm: {
      skills: buildFormControl(
        "input",
        { placeholder: "Enter skills", type: "text" },
        { value: this.props.skills ? this.props.skills : "" },
        { required: true }
      ),
    },
    showAlert: false,
    isFormValid: false,
  };

  componentDidMount() {
    this.setState({ isFormValid: checkFormValidity(this.state.addSkillForm) });
  }
  editSkillsCallback = () => {
    this.setState({ showAlert: true });
  };
  alertCloseHandler = () => {
    this.setState({
      showAlert: false,
    });
    clearTimeout();
  };

  inputChangedHandler = (event) => {
    const updatedSkills = updateObject(this.state.addSkillForm.skills, {
      value: event.target.value,
      valid: checkValidity(
        event.target.value,
        this.state.addSkillForm.skills.validationRules
      ),
      touched: true,
    });

    const updatedForm = updateObject(this.state.addSkillForm, {
      skills: updatedSkills,
    });

    this.setState({
      addSkillForm: updatedForm,
      isFormValid: checkFormValidity(updatedForm),
    });
  };

  formSubmitHandler = (event) => {
    event.preventDefault();
    const skillData = {
      skills: this.state.addSkillForm.skills.value,
    };
    this.props.onAddSkills(
      this.props.token,
      skillData,
      this.editSkillsCallback
    );
  };

  render() {
    if (this.state.showAlert) {
      setTimeout(() => {
        this.alertCloseHandler();
      }, 6000);
    }
    let formControl = (
      <Input
        elementType={this.state.addSkillForm.skills.elementType}
        elementConfig={this.state.addSkillForm.skills.elementConfig}
        value={this.state.addSkillForm.skills.value}
        valid={this.state.addSkillForm.skills.valid}
        touched={this.state.addSkillForm.skills.touched}
        changed={this.inputChangedHandler}
      />
    );
    return (
      <Aux>
        {this.state.showAlert ? (
          <div className={classes.AlertBox}>
            <AlertMessage
              message="Skills updated!"
              closed={this.alertCloseHandler}
              type="success"
            />
          </div>
        ) : null}
        <form onSubmit={this.formSubmitHandler} className={classes.SkillForm}>
          {formControl}
          <div className={classes.BtnArea}>
            <button
              type="submit"
              disabled={!this.state.isFormValid}
              className={classes.SaveBtn}
            >
              Save
            </button>
            <button className={classes.CancelBtn} onClick={this.props.cancel}>
              Cancel
            </button>
          </div>
        </form>
      </Aux>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onAddSkills: (token, skillData, callback) =>
      dispatch(actions.addSkills(token, skillData, callback)),
  };
};

const mapStateToProps = (state) => {
  return {
    token: state.auth.token,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddNewSkill);
