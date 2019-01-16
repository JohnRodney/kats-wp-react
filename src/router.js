import { mount } from 'react-mounter';
import Home from './components/home';
import Products from './components/products';
import Quote from './components/quote';
import Loans from './components/loans';
// import Login from './components/admin/login';
import Terms from './components/terms';

const devRoutes = {
  '/allpawnwp/': Home,
  '/allpawnwp/quote/': Quote,
  '/allpawnwp/loans/': Loans,
  '/allpawnwp/terms/': Terms,
  '/allpawnwp/products/': Products,
};

const routes = {
  '/': Home,
  '/quote/': Quote,
  '/loans/': Loans,
  '/terms/': Terms,
  '/products/': Products,
/*
  '/secret/backend/portal': Login,
  '/products': Products,
*/
};

if (window.location.pathname.indexOf('allpawnwp') > -1) {
  mount(devRoutes[window.location.pathname]);
} else {
  mount(routes[window.location.pathname]);
}
