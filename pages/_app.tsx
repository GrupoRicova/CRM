import { ChakraProvider, useColorMode } from '@chakra-ui/react';
import { SessionProvider, useSession, getSession } from 'next-auth/react';
import { Router, useRouter } from 'next/router';
import type { AppProps } from 'next/app';
import 'bootstrap/dist/css/bootstrap.min.css';
import LoadingPage from '../components/Tools/LoadingPage';
import React, { useEffect } from 'react';
import { NextComponentType, NextPageContext } from 'next';


type MyAppProps = AppProps & {
  Component: NextComponentType<NextPageContext, any, any>;
};

function MyApp({ Component, pageProps: { session, ...pageProps } }: MyAppProps & { pageProps: { session: any } }) {
  const { data: sessionData, status } = useSession();

  const { colorMode } = useColorMode();
  const isColorModeLoaded = colorMode === undefined;
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const session = await getSession();
     
      if (!session) {
        router.push('/login');
      }
    };

    if (status === 'loading') {
      return;
    }

    checkSession();
  }, [status, router]);

  if (status === 'loading' && isColorModeLoaded) {
    return <LoadingPage />;
  }

  return (
    <ChakraProvider>
   
        <Component {...pageProps} />
   
    </ChakraProvider>
  );
}

export default function App({ Component, pageProps,router }: MyAppProps) {
  return (
    <SessionProvider session={pageProps.session}>
      <MyApp Component={Component} pageProps={pageProps} router={router}  />
    </SessionProvider>
  );
}
