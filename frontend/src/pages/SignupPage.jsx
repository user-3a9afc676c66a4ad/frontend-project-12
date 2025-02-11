import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthCont';
import apiClient from '../api/client';

const SignupPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { login, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/chat');
    }
  }, [isAuthenticated, navigate]);

  const handleSignup = async (values, { setErrors }) => {
    try {
      const response = await apiClient.post('/api/v1/signup', {
        username: values.username,
        password: values.password,
      });

      if (response.data?.token) {
        login(response.data.token);
      }
    } catch (error) {
      if (error.response?.status === 409) {
        setErrors({ username: 'Такой пользователь уже существует' });
      } else {
        setErrors({ username: 'Ошибка регистрации. Попробуйте позже.' });
      }
    }
  };

  const validationSchema = Yup.object({
    username: Yup.string().min(3, t('signup.validation.username')).max(20, t('signup.validation.username')).required(t('signup.validation.required')),
    password: Yup.string().min(6, t('signup.validation.password')).required(t('signup.validation.required')),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password')], t('signup.validation.confirmPassword'))
      .required(t('signup.validation.required')),
  });

  return (
    <div className="h-100 d-flex align-items-center justify-content-center bg-light">
      <div className="container-fluid h-100">
        <div className="row justify-content-center align-content-center h-100">
          <div className="col-12 col-md-8 col-xxl-6">
            <div className="card shadow-sm">
              <div className="card-body d-flex flex-column flex-md-row justify-content-around align-items-center p-5">
                <div>
                  <img src="./src/assets/registration.jpg" className="rounded-circle" alt="Регистрация" />
                </div>
                <Formik initialValues={{ username: '', password: '', confirmPassword: '' }} validationSchema={validationSchema} onSubmit={handleSignup}>
                  {({ errors, touched }) => (
                    <Form className="w-50">
                      <h1 className="text-center mb-4">{t('login.signup')}</h1>

                      {/* Username Field */}
                      <div className="form-floating mb-3 position-relative">
                        <Field id="username" name="username" className={`form-control ${touched.username && errors.username ? 'is-invalid' : ''}`} required />
                        <label htmlFor="username">{t('signup.username')}</label>
                        {touched.username && errors.username && <div className="invalid-tooltip">{errors.username}</div>}
                      </div>

                      {/* Password Field */}
                      <div className="form-floating mb-3 position-relative">
                        <Field
                          name="password"
                          id="passwordField"
                          type="password"
                          autoComplete="new-password"
                          placeholder="Не менее 6 символов"
                          className={`form-control ${touched.password && errors.password ? 'is-invalid' : ''}`}
                        />
                        <label htmlFor="passwordField">{t('signup.password')}</label>
                        {touched.password && errors.password && <div className="invalid-tooltip">{errors.password}</div>}
                      </div>

                      {/* Confirm Password Field */}
                      <div className="form-floating mb-4 position-relative">
                        <Field
                          name="confirmPassword"
                          id="confirmPasswordField"
                          type="password"
                          autoComplete="new-password"
                          placeholder="Пароли должны совпадать"
                          className={`form-control ${touched.confirmPassword && errors.confirmPassword ? 'is-invalid' : ''}`}
                        />
                        <label htmlFor="confirmPasswordField">{t('signup.confirmPassword')}</label>
                        {touched.confirmPassword && errors.confirmPassword && <div className="invalid-tooltip">{errors.confirmPassword}</div>}
                      </div>

                      <button type="submit" className="btn btn-outline-primary w-100">
                        {t('signup.signup')}
                      </button>
                    </Form>
                  )}
                </Formik>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
