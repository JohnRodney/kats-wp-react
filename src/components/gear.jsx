import React from 'react';
import $ from 'jquery';
/* GearBrandMap is an {Object} with [keys] who are types of gear IE: "Amps,
 * pedals, ect"
 *   each Type is the key and the value is an [Array] of "brandNames" in that
 *   category
 *
 * If you wish to edit the list of categories and brand names do so in the file
 *   '../constants/gear.jsx'
 * * * */
import GearBrandMap from '../constants/gear';

/* getListItem (key)
 *  accepts argument key which is the type IE: "AMPLIFIERS"
 *    then (maps) over all {brandName}s in that type
 *    return [Array] of <JSX-Layouts />
 * * * */
function getListItems(key) {
  const { ImagePath } = window;

  return GearBrandMap[key].map(brandName => (
    <li key={`brands-${brandName.name}`}>
      <div className="brand-name">{brandName.name}</div>
      <div className="brand-image">
        <img alt={`${brandName} logo`} src={ImagePath + brandName.logoPath} />
      </div>
      <button
        type="button"
        onClick={() => {
          window.location = `/products?q=${brandName.name.replace(/MXR\//g, '').replace(/-/g, ' ')}`;
        }}
      >
        CHECK OUR STOCK
      </button>
    </li>
  ));
}

function getCategoryPathImageFromIndex(index) {
  const { ImagePath } = window;

  return [
    <img alt="pedal filter" src={`${ImagePath}pedal.png`} />,
    <img alt="amp filter" src={`${ImagePath}amp.png`} />,
    <img alt="pickup filter" src={`${ImagePath}pickup.png`} />,
    <img alt="tube filter" src={`${ImagePath}tube.png`} />,
    <img alt="lighting filter" src={`${ImagePath}lighting.png`} />,
  ][index];
}

/* Another static component for displaying a set of gear "types" with a list of
 * brands.
 *   The type is the "key" IE "AMPLIFIERS".
 *   The value is an [Array] of {Objects} that is as follows
 *   {
 *     name: "The name of the brand",
 *     logoPath: "A href path to the logo asset img",
 *   }
 *   TODO: When we add the store these should have a third [key] which is a
 *   "link" [key] this will allow users to tap/click on the li and go to a
 *   search in that category for that brand.
 * * */
export default class GearList extends React.Component {
  constructor() {
    super();
    this.state = {
      activeCategory: Object.keys(GearBrandMap)[0],
    };
  }

  /* getLists
   *  iterate over all types IE: "AMPLIFIERS", "PEDALS & EFFECTS", ect
   *    returns [Array] of <JSX-Layouts />
   * * */
  getLists() {
    const { activeCategory } = this.state;

    return Object.keys(GearBrandMap).map((key, i) => (
      <div
        role="button"
        tabIndex={0}
        key={`gear-category-${key}`}
        className={`a-gear-category ${activeCategory === key ? 'focus' : ''}`}
        onKeyPress={() => { window.scroll(0, $('#gear').offset().top + 30); this.setState({ activeCategory: key }); }}
        onClick={() => { window.scroll(0, $('#gear').offset().top + 30); this.setState({ activeCategory: key }); }}
      >
        <div>{key}</div>
        { getCategoryPathImageFromIndex(i) }
      </div>
    ));
  }

  render() {
    const { activeCategory } = this.state;
    return (
      <div id="gear" className="gear-list">
        <h1>Full line brand selection!</h1>
        <div className="category-container">
          {this.getLists()}
        </div>
        <ul>
          { getListItems(activeCategory) }
        </ul>
        <div className="divider" />
      </div>
    );
  }
}
