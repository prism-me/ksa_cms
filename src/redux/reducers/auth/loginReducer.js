export const login = (state = { userRole: "admin" }, action) => {
  switch (action.type) {
    case "LOGIN_WITH_EMAIL": {
      return { ...state, values: action.payload };
    }
    case "LOGIN_WITH_FB": {
      return { ...state, values: action.payload };
    }
    case "LOGIN_WITH_TWITTER": {
      return { ...state, values: action.payload };
    }
    case "LOGIN_WITH_GOOGLE": {
      return { ...state, values: action.payload };
    }
    case "LOGIN_WITH_GITHUB": {
      return { ...state, values: action.payload };
    }
    case "LOGIN_WITH_JWT": {
      return { ...state, ...action.payload, isAuthenticated: true };
    }
    case "LOGOUT_WITH_JWT": {
      return {
        ...state,
        loggedInUser: null,
        isAuthenticated: false,
        access_token: null,
      };
    }
    case "LOGOUT_WITH_FIREBASE": {
      return { ...state, values: action.payload };
    }
    case "CHANGE_ROLE": {
      return { ...state, userRole: action.userRole };
    }
    default: {
      return state;
    }
  }
};
