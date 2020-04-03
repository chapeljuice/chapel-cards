import React from 'react';
import './CardListItem.scss';

const CardListItem = ({ card }) => {

  // card should contain:
  // image, name, text, set name, & type
  let cardImageSrc = './../chapel-default-card.png',
      cardName = '...',
      cardText = '...',
      cardSetName = '...',
      cardType = '...';

  return (
    <li className="card-item">
      <div className="card-front">
        <img src={ card.imageUrl  || cardImageSrc } alt="" />
      </div>
      <div className="card-back">
        <div className="card-info">
          <p className="card-name">{ card.name || cardName }</p>
          <p className="card-text">{ card.text || cardText }</p>
          <div className="card-details">
            <p className="card-type">{ card.type || cardType }</p>
            <p className="card-set-name">{ card.set.name || cardSetName }</p>
          </div>
        </div>
      </div>
    </li>
  )
}

export default CardListItem;