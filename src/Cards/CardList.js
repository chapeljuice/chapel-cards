import React from 'react';
import CardListItem from './CardListItem';
import Loading from './../Helpers/Loading';
import './CardList.scss';

class CardList extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      cardsData: [],
      isLoading: false,
      searchValue: '',
      searchPage: 1,
      totalCardCount: 0
    }
  }

  componentDidMount () {
    // setting a scroll event listener here for "inifinite scroll" feature
    this.scrollListener = window.addEventListener( 'scroll', e => {
      this.handleScroll( e );
    });

    // this will fetch the initial set of cards to display
    this.cardFetch();
  }

  loadMore () {
    // we'll call this to load more cards
    // we'll increment the search page so when we call it again we'll get the next set of results
    this.setState({
      searchPage: this.state.searchPage + 1
    });
    // fetching more results with the search query the user has typed (if any)
    this.cardFetch( this.state.searchValue );
  }

  cardFetch ( searchQuery = '' ) {
    // when fetching display the loading spinner
    this.setState({
      isLoading: true
    })
    // decide which page to show (first page for new searches, next page for same query)
    let fetchPage = searchQuery === this.state.searchValue ? this.state.searchPage : 1;
    // GET call to elder scrolls api with page, pageSize, and name search
    fetch(`https://api.elderscrollslegends.io/v1/cards?page=${ fetchPage }&pageSize=20&name=${ searchQuery }`)
      .then( response => response.json() )
      .then((data) => {
        // set data in state for use later
        this.setState({
          cardsData: searchQuery === this.state.searchValue ? [...this.state.cardsData, ...data.cards] : data.cards,
          isLoading: false,
          searchValue: searchQuery,
          searchPage: fetchPage,
          totalCardCount: data._totalCount
        });
      })
      .catch((error) => {
        // console an error if something went wrong
        console.log( 'Error with fetch:', error );
        this.setState({
          isLoading: false
        })
      });
  }

  handleScroll = () => { 
    // set last card variable
    var lastCard = document.querySelector( 'ul.card-list > li:last-child' );
    // set the offset of the last card if there is one
    var lastCardOffset = lastCard ? lastCard.offsetTop + lastCard.clientHeight : 0;
    // set the offset position of the page
    var pageOffset = window.pageYOffset + window.innerHeight;
    // load more cards if appropriate
    if ( pageOffset > lastCardOffset ) {
      this.loadMore();
    }
  };

  updateSearchValue ( e ) {
    // for larger api requests this could be set to only occur after a pause of typing so we don't call too many times
    this.cardFetch( e.target.value );
  }

  render () {
    let renderedComponent;

    if ( this.state.cardsData ) {
      renderedComponent = <div className="card-container">
        <header className="header">
          <div className="form-group">
            <label htmlFor="cardSearch" className="visually-hidden">Enter your serach:</label>
            <input
              type="text"
              id="cardSearch"
              className="card-search"
              placeholder="Search for cards by name..."
              value={this.state.inputValue}
              onChange={e => this.updateSearchValue(e)}
            />
          </div>

          <div className="results-label">
            <p>Showing <span id="returnedResultsLabel">{this.state.cardsData.length}</span> cards out of <span id="totalResultsLabel">{this.state.totalCardCount}</span></p>
          </div>
        </header>

        <ul className="card-list animate">
          {this.state.cardsData.map( ( card, key ) => {
            return <CardListItem card={card} key={key} />;
          })}
        </ul>
        {this.state.searchPage === 1  && (this.state.cardsData.length !== this.state.totalCardCount) ? <button className="btn" onClick={() => this.loadMore()}>Load more</button> : ''}
        {this.state.isLoading ? <div className="infinite-loader"><Loading /></div> : ''}
      </div>
    } else {
      renderedComponent = <Loading />;
    }

    return (
      <div>
        {renderedComponent}
      </div>
    )
  }
}

export default CardList;