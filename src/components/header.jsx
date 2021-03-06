import React from 'react';
import { isDev } from '../utilities/index';
/* TODO: Move this to a constant file */
let prefix = '';

if (isDev()) {
  prefix = '/allpawnwp'
}
const links = [
  { href: `${prefix}/`, content: 'Home' },
  { href: `${prefix}/#about`, content: 'About' },
  { href: `${prefix}/#gear`, content: 'Brands' },
  { href: `${prefix}/#location`, content: 'Location' },
  { href: `${prefix}/products`, content: 'Shop Now' },
];

/* getLinksExpanded()
 *  returns the default link layout for the fixed header
 * * * */
function getLinksExpanded() {
  return (
    <div className="header-links">
      { links.map(link => (<div key={`link-${link.href}`}><a href={link.href}>{link.content}</a></div>)) }
    </div>
  );
}

export default class FixedHeader extends React.Component {
  constructor() {
    super();

    /* menuBreakPoint is the width of the screen when the mobile menu shows up */
    this.menuBreakPoint = 745;

    /* state requires two keys to run this component
     *   Bool: collapsed
     *     true: when the main links should be collapsed to hamburger img
     *       screen width > this.menuBreakPoint
     *     false: when all links should be visible
     *       screen width <= this.menuBreakPoint
     *   Bool: menuHidden
     *     true: when the menu is collapsed and the mobile menu is hidden
     *     false: when the menu is collapsed and the mobile menu is to be shown
     * * */
    this.state = {
      collapsed: false,
      menuHidden: true,
    };
  }

  /* Resize events can be really process intense on a browser so after we mount
   * the component. We utilize a throttle script running from file:
   *   '../scripts.js'
   * this runs our resize function responsibly instead of everytime the browser
   * calls a resize
   * * * */
  componentDidMount() {
    this.handleResize();
    window.addEventListener('optimizedResize', () => this.handleResize());
  }


  /* getMiniMenuLayout()
   *   returns the layout for how the mobile menu looks when it is not hidden
   * * * */
  getMiniMenuLayout() {
    const { ImagePath } = window;

    return (
      <div>
        <img
          alt="hamburger menu icon"
          onClick={() => this.closeMenu()}
          id="hamburger"
          src={`${ImagePath}hamburger.png`}
        />
        <div className="hidden-menu">
          {
            links.map(link => (
              <a
                key={`link-${link.href}`}
                href={link.href}
                onClick={() => this.closeMenu()}
              >
                <div>{link.content}</div>
              </a>
            ))
          }
        </div>
      </div>
    );
  }

  getHamburger() {
    const { ImagePath } = window;

    return (
      <div>
        <img onClick={() => { this.setState({ menuHidden: false }) }} id='hamburger' src={`${ImagePath}hamburger.png`} />
      </div>
    );
  }

  getLinksCollapsed() {
    return (
      <div>
        { this.state.menuHidden ? this.getHamburger() : this.getMiniMenuLayout() }
      </div>
    );
  }


  /* Just a handle for closing the menu in a less verbose way */
  closeMenu() {
    this.setState({ menuHidden: true });
  }

  /* handleResize()
   *   this function is responsible for showing and collapsing the links in the
   *   main menu based on the width of the device viewing the page
   * * * */
  handleResize() {
    if (innerWidth < this.menuBreakPoint && !this.state.collapsed) {
      this.setState({ collapsed: true });
    } else if (this.state.collapsed && innerWidth >= this.menuBreakPoint) {
      this.setState({ collapsed: false, menuHidden: true });
    }
  }


  render() {
    const { ImagePath } = window;

    return (
      <div className="fixed-header">
        <div className="header-title">
          <img alt="allpawn logo" height="50" src={`${ImagePath}allpawnlogo-optimized.png`} />
        </div>
        { this.state.collapsed ? this.getLinksCollapsed() : getLinksExpanded() }
      </div>
    );
  }
}
