import { createContext, useContext, useReducer, useEffect } from 'react';
import { getProfile } from '../api/api';

const AuthContext = createContext(null);

const initialState = { user: null, token: localStorage.getItem('token'), loading: true };

function reducer(state, action) {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, user: action.user, token: action.token, loading: false };
    case 'LOGOUT':
      return { user: null, token: null, loading: false };
    case 'LOADED':
      return { ...state, user: action.user, loading: false };
    case 'MARK_VOTED':
      return { ...state, user: { ...state.user, isvoted: true } };
    default:
      return state;
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (!state.token) {
      dispatch({ type: 'LOADED', user: null });
      return;
    }
    getProfile()
      .then((data) => dispatch({ type: 'LOADED', user: data.user }))
      .catch(() => {
        localStorage.removeItem('token');
        dispatch({ type: 'LOGOUT' });
      });
  }, []);

  const loginAction = (user, token) => {
    localStorage.setItem('token', token);
    dispatch({ type: 'LOGIN', user, token });
  };

  const logoutAction = () => {
    localStorage.removeItem('token');
    dispatch({ type: 'LOGOUT' });
  };

  const markVoted = () => dispatch({ type: 'MARK_VOTED' });

  return (
    <AuthContext.Provider value={{ ...state, loginAction, logoutAction, markVoted }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
