import React from "react";
import classes from "./create-post.module.css";
import { buildFormControl, updateObject } from "../../../shared/utility";
import { checkValidity } from "../../../shared/checkInputValidity";
import { connect } from "react-redux";
import ImagePreview from "../../../components/Posts/ImagePreview/image-preview.component";
import * as actions from "../../../store/actions/actions";

class CreatePost extends React.Component {
  state = {
    postCreationForm: {
      postContent: buildFormControl(
        "input",
        { type: "text", placeholder: "Share Something..." },
        { value: "" },
        { required: true }
      ),
    },
    uplaodedImages: [],
  };

  inputChangedHandler = (event, control) => {
    const updatedFormControl = updateObject(
      this.state.postCreationForm[control],
      {
        value: event.target.value,
        touched: true,
        valid: checkValidity(
          event.target.value,
          this.state.postCreationForm[control].validationRules
        ),
      }
    );

    const updatedForm = updateObject(this.state.postCreationForm, {
      [control]: updatedFormControl,
    });

    this.setState({ postCreationForm: updatedForm });
  };

  onPostClicked = () => {
    const images = this.state.uplaodedImages.map((imageObj) => imageObj.file);

    const postFormData = new FormData();
    postFormData.append("text", this.state.postCreationForm.postContent.value);
    images.forEach((image) => postFormData.append("images", image));

    this.props.onAddPost(postFormData, this.props.token);
  };

  fileInputChangedHandler = (event) => {
    const imageUrl = URL.createObjectURL(event.target.files[0]);
    const file = event.target.files[0];
    const updatedImageList = [...this.state.uplaodedImages];
    let imageOrientation;
    const imgObj = new Image();
    imgObj.onload = () => {
      if (imgObj.width / imgObj.height > 1) {
        imageOrientation = "landscape";
      } else {
        imageOrientation = "portrait";
      }
      const fileObj = {
        file: file,
        url: imageUrl,
        orientation: imageOrientation,
      };
      updatedImageList.push(fileObj);
      this.setState({
        uplaodedImages: updatedImageList,
      });
    };
    imgObj.src = imageUrl;
  };

  imageDeleteHandler = (imgUrl) => {
    const updatedImageList = [...this.state.uplaodedImages];
    const imageFile = updatedImageList.find((image) => image.url === imgUrl);
    const removeIndex = updatedImageList.indexOf(imageFile);
    updatedImageList.splice(removeIndex, 1);
    this.setState({ uplaodedImages: updatedImageList });
  };

  render() {
    const images = this.state.uplaodedImages.map((image) => {
      return (
        <ImagePreview
          key={Math.random()}
          imageUrl={image.url}
          imageOrientation={image.orientation}
          deleteClicked={() => {
            this.imageDeleteHandler(image.url);
          }}
        />
      );
    });
    return (
      <div className={classes.CreatePostBox}>
        <div className={classes.Header}>
          <p>Create Post</p>
        </div>
        <div className={classes.InputBox}>
          <img src={this.props.user.avatar} alt="avatar" />
          <textarea
            type="text"
            placeholder="Share Something..."
            onChange={(event) => this.inputChangedHandler(event, "postContent")}
          />
        </div>

        <div className={classes.CreatePostTools}>
          <button
            className={`${classes.AddPostBtn} ${classes.Btn}`}
            onClick={() => this.onPostClicked()}
          >
            Post
          </button>
          <button
            className={`${classes.AddPictureBtn} ${classes.Btn}`}
            onClick={() => {
              document.getElementById("imagepicker").click();
            }}
          >
            Add Picture
          </button>

          <button className={`${classes.TagPeopleBtn} ${classes.Btn}`}>
            Tag People
          </button>
          <input
            type="file"
            id="imagepicker"
            style={{ display: "none" }}
            onChange={(event) => this.fileInputChangedHandler(event)}
          />
        </div>
        {this.state.uplaodedImages.length !== 0 ? (
          <div className={classes.ImagePreviewSeciton}>
            {images}
            <button
              className={classes.AddMoreImageBtn}
              onClick={() => {
                document.getElementById("imagepicker").click();
              }}
            >
              Add More
            </button>{" "}
          </div>
        ) : null}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    token: state.auth.token,
    user: state.auth.user,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onAddPost: (token, postData) =>
      dispatch(actions.createPost(token, postData)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CreatePost);