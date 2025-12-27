import React from 'react';
import { useLocation } from 'react-router-dom';
import Layout from './Layout';

const ConditionalLayout = ({ children }) => {
  const location = useLocation();
  const noLayoutPaths = ['/login', '/register'];
  const shouldShowLayout = !noLayoutPaths.includes(location.pathname);

  if (shouldShowLayout) {
    return <Layout>{children}</Layout>;
  }

  return <>{children}</>;
};

export default ConditionalLayout;

