export const requestSMSRoute = 'user/request_sms';
export const passwordResetRequestSMSRoute = 'password_reset/request_sms';
export type RequestSMSResponse = {
  authy_id: string;
};

export const verifySMSRoute = 'user/verify_sms';
export const passwordResetVerifySMSRoute = 'password_reset/verify_sms';
export type PasswordResetVerifySMSResponse = {
  access_token: string;
};

export const resetPasswordRoute = 'password_reset/reset';

export const createAccountRoute = 'user/create_account';
export type CreateAccountResponse = {
  access_token: string;
  account_sms_verified: boolean;
};

export const loginRoute = 'user/login';
export type LoginResponse = {
  account_sms_verified: boolean;
  access_token: string;
};
