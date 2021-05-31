const INITIAL_STATE = {
  isSignedIn: null,
  userID: "",
  email: "",
  group: "",
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case "SIGN_IN":
      return {
        ...state,
        isSignedIn: true,
        userID: action.payload.userID,
        email: action.payload.email,
        group: action.payload.group,
      };
    case "SIGN_OUT":
      return { ...state, isSignedIn: false };
    default:
      return state;
  }
};
