import React from 'react';
/* About Info is the constant where the content for this page is kept
 *   go to '../constants/about' to edit the verbiage on this section
 * * */
import AboutInfo from '../constants/about';


/* Simple static component for the #about section
 *   getInfo
 *     returns [Array] of <JSX-Layouts />
 *       content is based on an { Object } with keys "text" and "img"
 *         text(String):  the text to display on the page
 *         img(String): the path of the image
 * * * */

function getInfo() {
  const { ImagePath } = window;

  return AboutInfo.map(info => (
    <div className="column" key={`info-${info.text}`}>
      <div className="about-content">
        <img alt="info" src={ImagePath + info.img} />
        <p>{info.text}</p>
      </div>
    </div>
  ));
}

export default function About() {
  return (
    <div>
      <div className="about" id="about">
        <h1>KAT&apos;S GUITARS: INSTRUMENTS, REPAIRS, LESSONS, OH MY!</h1>
        { getInfo() }
      </div>
      <div className="divider" />
    </div>
  );
}
