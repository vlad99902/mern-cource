import React, { useContext } from 'react';

//для работы навигации вместо a
import { NavLink, useHistory } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export const Navbar = () => {
  const history = useHistory();
  const auth = useContext(AuthContext);

  const logoutHandler = (event) => {
    event.preventDefault();
    auth.logout();
    history.push('/');
  };

  return (
    <nav className="nav-extended blue darken-1">
      <div className="nav-wrapper">
        <span className="brand-logo">Сокращение ссылок</span>
      </div>
      <div className="nav-content">
        <ul className="tabs tabs-transparent">
          <li className="tab">
            <NavLink to="/create">Создать</NavLink>
          </li>
          <li className="tab">
            <NavLink to="/links">Ссылки</NavLink>
          </li>
          <li className="tab">
            <a href="/" onClick={logoutHandler}>
              Выйти
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};
