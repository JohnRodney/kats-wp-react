import React from 'react';

export default function MainAboveFold() {
  return (
    <div>
      <div className="slogan">
        <h1>FULL LINE MUSIC STORE – HUGE SELECTION</h1>
      </div>
      <div className="call-to-action">
        <a href="/products">
          <button type="button">BUY</button>
        </a>
        <a href="/quote">
          <button type="button">SELL / LOAN</button>
        </a>
        <a href="/#faq">
          <button type="button">QUESTIONS?</button>
        </a>
      </div>
    </div>
  );
}
