const routes = {
  home: () => '/',
  login: () => '/login',
  signup: () => '/signup',
  chat: () => '/chat',
  api: {
    chat: () => '/api/v1/chat',
    login: () => '/api/v1/login',
    signup: () => '/api/v1/signup',
    data: () => '/api/v1/data',
  },
};

export default routes;
