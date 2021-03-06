import React from "react";
import { buildFormControl, updateObject } from "../../../../shared/utility";
import {
  checkValidity,
  checkFormValidity,
} from "../../../../shared/checkInputValidity";
import classes from "./add-new-bio.module.css";
import Input from "../../../../components/UI/Input/input.component";
import { connect } from "react-redux";
import * as actions from "../../../../store/actions/actions";
class AddNewBio extends React.Component {
  state = {
    addBioForm: {
      bio: buildFormControl(
        "textarea",
        { placeholder: "Enter Bio", type: "text" },
        { value: this.props.bio ? this.props.bio : "" },
        { required: true }
      ),
    },
    isFormValid: false,
  };

  componentDidMount() {
    this.setState({ isFormValid: checkFormValidity(this.state.addBioForm) });
  }

  inputChangedHandler = (event) => {
    const updatedBio = updateObject(this.state.addBioForm.bio, {
      value: event.target.value,
      valid: checkValidity(
        event.target.value,
        this.state.addBioForm.bio.validationRules
      ),
      touched: true,
    });

    const updatedForm = updateObject(this.state.addBioForm, {
      bio: updatedBio,
    });

    this.setState({
      addBioForm: updatedForm,
      isFormValid: checkFormValidity(updatedForm),
    });
  };

  formSubmitHandler = (event) => {
    event.preventDefault();
    const bioData = {
      bio: this.state.addBioForm.bio.value,
    };
    this.props.onAddBio(this.props.token, bioData);
  };

  render() {
    let formControl = (
      <Input
        elementType={this.state.addBioForm.bio.elementType}
        elementConfig={this.state.addBioForm.bio.elementConfig}
        value={this.state.addBioForm.bio.value}
        valid={this.state.addBioForm.bio.valid}
        touched={this.state.addBioForm.bio.touched}
        changed={this.inputChangedHandler}
      />
    );
    return (
      <form onSubmit={this.formSubmitHandler} className={classes.BioForm}>
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
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onAddBio: (token, bioData) => dispatch(actions.addBio(token, bioData)),
  };
};

const mapStateToProps = (state) => {
  return {
    token: state.auth.token,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddNewBio);
