import { mount } from 'react-mounter';
import Home from './components/home';
// import Products from './components/products';
// import Quote from './components/quote';
// import Loans from './components/loans';
// import Login from './components/admin/login';
// import Terms from './components/terms';

const devRoutes = {
  '/allpawnwp/': Home,
};

const routes = {
  '/': Home,
/*
  '/products': Products,
  '/quote': Quote,
  '/loans': Loans,
  '/secret/backend/portal': Login,
  '/terms': Terms,
*/
};

if (window.location.pathname.indexOf('allpawnwp') > -1) {
  mount(devRoutes[window.location.pathname]);
} else {
  mount(routes[window.location.pathname]);
}
