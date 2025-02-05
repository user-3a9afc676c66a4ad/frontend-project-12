import React from 'react';
import LoginForm from '../Components/LoginForm.jsx';

const Login = () => {
  return (
    <div className="form-container">
      <h1 className="form-title">Войти</h1>
      <LoginForm />
      <div className="form-footer">
        <span>Нет аккаунта?</span>
        <a href="#">Регистрация</a>
      </div>
    </div>
  );
};

export default Login;
