export const API_BASE_URL_PROD =
  'https://c79g0ywgx0.execute-api.eu-central-1.amazonaws.com/prod';
export const API_BASE_URL_DEV =
  'https://4f1jn814vk.execute-api.eu-central-1.amazonaws.com/dev';

export type AwsEnvironment = 'dev' | 'prod';

export const AWS_ENVIRONMENT: AwsEnvironment =
  process.env.NEXT_PUBLIC_AWS_ENVIRONMENT === 'dev' ? 'dev' : 'prod';

export const API_BASE_URL =
  AWS_ENVIRONMENT === 'dev' ? API_BASE_URL_DEV : API_BASE_URL_PROD;

export function getCognitoUserPoolId(): string {
  return AWS_ENVIRONMENT === 'dev'
    ? process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID_DEV ||
        process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID ||
        ''
    : process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID || '';
}

export function getCognitoClientId(): string {
  return AWS_ENVIRONMENT === 'dev'
    ? process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID_DEV ||
        process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID ||
        ''
    : process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID || '';
}
