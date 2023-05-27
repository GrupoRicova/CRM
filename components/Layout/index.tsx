import React, { ReactNode } from 'react'
import SideB from '../SideB'
import NavBar from '../NavBar'
interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <>
      <NavBar />
      <SideB>{children}</SideB>
    </>
  );
};

export default Layout;