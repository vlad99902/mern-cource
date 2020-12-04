import { createContext } from 'react';

//zero function for nothing to do functionn down strokes
function noop() {}

export const AuthContext = createContext({
  token: null,
  userId: noop,
  login: noop,
  isAuth: false,
});
