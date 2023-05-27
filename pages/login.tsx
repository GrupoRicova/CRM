import { CtxOrReq } from 'next-auth/client/_utils';
import { getCsrfToken, getSession } from 'next-auth/react';
import LoginPage from '../components/LoginPage';

export default function login(props: JSX.IntrinsicAttributes) {
  return <LoginPage {...props} />;
}

export async function getServerSideProps(context: CtxOrReq | undefined) {
  const session = await getSession(context);

  if (session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  const csrfToken = await getCsrfToken(context);
  
  return {
    props: {
      csrfToken: csrfToken || null,
    },
  };
}

