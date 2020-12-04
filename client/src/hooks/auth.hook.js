import { useState, useCallback, useEffect } from 'react';

const storageName = 'userData';

export const useAuth = () => {
  const [token, setToken] = useState(null);
  const [ready, setReady] = useState(false);
  const [userId, setUserId] = useState(null);

  //login
  const login = useCallback((jwtToken, id) => {
    setToken(jwtToken);
    setUserId(id);
    localStorage.setItem(
      storageName,
      JSON.stringify({ userId: id, token: jwtToken }),
    );
  }, []);

  //logout
  const logout = useCallback(() => {
    setToken(null);
    setUserId(null);
    localStorage.removeItem(storageName);
  }, []);

  //проверка на то, есть в localstorage что-то при закгрузке страницы
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem(storageName));

    if (data && data.token) {
      login(data.token, data.userId);
    }
    setReady(true);
  }, [login]);

  return { login, logout, token, userId, ready };
};
