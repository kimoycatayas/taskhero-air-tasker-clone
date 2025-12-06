const LoginUser = (loginData: {
  email: string | null;
  password: string | null;
}) => {
  console.log(loginData);
};

const SignupUser = (signupData: {
  email: string | null;
  password: string | null;
}) => {
  console.log(signupData);
};

export const Api = {
  LoginUser,
  SignupUser,
};
