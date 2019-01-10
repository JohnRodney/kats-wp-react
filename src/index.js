import './router';
import { isDev } from './utilities/index';
import ImagePath from './constants/image-path';

if (isDev()) {
  window.ImagePath = '/allpawnwp/wp-content/themes/wp-theme/images/';
} else {
  window.ImagePath = ImagePath;
}
