import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../../shared/utility";

const initialState = {
  posts: [],
  loading: false,
  error: null,
  loadedComments: [],
};

const fetchPostsStart = (state, action) => {
  return updateObject(state, { loading: true });
};
const fetchPostsSuccess = (state, action) => {
  return updateObject(state, {
    posts: action.payload.postData,
    loading: false,
  });
};
const fetchPostsFailed = (state, action) => {
  return updateObject(state, { error: action.payload.error, loading: true });
};

const createPostStart = (state, action) => {
  return updateObject(state, {
    loading: true,
    error: null,
  });
};

const createPostSuccess = (state, action) => {
  const posts = state.posts.concat({
    ...action.payload.postData,
  });
  return updateObject(state, {
    loading: false,
    posts: posts,
  });
};

const createPostFailed = (state, action) => {
  return updateObject(state, {
    loading: false,
    error: action.payload.error,
  });
};
const likePostStart = (state, action) => {
  return updateObject(state, {
    loading: true,
    error: null,
  });
};

const likePostSuccess = (state, action) => {
  const updatedPosts = [...state.posts];
  const likedPost = updatedPosts.find((post) => {
    return post._id === action.payload.postId;
  });
  likedPost.likes = action.payload.likeData;
  const likedPostIndex = updatedPosts.indexOf(likedPost);
  updatedPosts[likedPostIndex] = likedPost;

  return updateObject(state, {
    loading: false,
    posts: updatedPosts,
  });
};

const likePostFailed = (state, action) => {
  return updateObject(state, {
    loading: false,
    error: action.payload.error,
  });
};
const unlikePostStart = (state, action) => {
  return updateObject(state, {
    loading: true,
    error: null,
  });
};

const unlikePostSuccess = (state, action) => {
  const updatedPosts = [...state.posts];
  const unlikedPost = updatedPosts.find((post) => {
    return post._id === action.payload.postId;
  });
  unlikedPost.likes = action.payload.unlikeData;
  const unlikedPostIndex = updatedPosts.indexOf(unlikedPost);
  updatedPosts[unlikedPostIndex] = unlikedPost;
  return updateObject(state, {
    loading: false,
    posts: updatedPosts,
  });
};

const unlikePostFailed = (state, action) => {
  return updateObject(state, {
    loading: false,
    error: action.payload.error,
  });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_POSTS_START:
      return fetchPostsStart(state, action);
    case actionTypes.FETCH_POSTS_SUCCESS:
      return fetchPostsSuccess(state, action);
    case actionTypes.FETCH_POSTS_FAILED:
      return fetchPostsFailed(state, action);
    case actionTypes.CREATE_POST_START:
      return createPostStart(state, action);
    case actionTypes.CREATE_POST_SUCCESS:
      return createPostSuccess(state, action);
    case actionTypes.FETCH_USER_DETAILS_FAILED:
      return createPostFailed(state, action);
    case actionTypes.LIKE_POST_START:
      return likePostStart(state, action);
    case actionTypes.LIKE_POST_SUCCESS:
      return likePostSuccess(state, action);
    case actionTypes.LIKE_POST_FAILED:
      return likePostFailed(state, action);
    case actionTypes.UNLIKE_POST_START:
      return unlikePostStart(state, action);
    case actionTypes.UNLIKE_POST_SUCCESS:
      return unlikePostSuccess(state, action);
    case actionTypes.UNLIKE_POST_FAILED:
      return unlikePostFailed(state, action);
    default:
      return state;
  }
};

export default reducer;
