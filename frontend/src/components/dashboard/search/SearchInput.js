import React, { Component } from "react";
import { search } from "frontend/src/components/store/modules";

export class SearchInput extends Component {
  constructor() {
    super();
    this.state = {
      searches: [],
    };
  }

  componentDidMount() {
    fetch(`${SEARCH_LIST}`)
      .then((res) => res.json())
      .then((res) =>
        this.setState({
          searches: res.SEARCH_LIST,
        })
      );
  }

  render() {
    const { searches } = this.state;
    const { userInput, searchClicked, handleSearch, searchTitle } = this.props;

    const filteredSearches = searches.filter((search) => {
      return search.search_name.includes(userInput);
    });

    return (
      <>
        <input
          name="userInput"
          type="text"
          className="search-input"
          placeholder="Search"
          onClick={handleSearch}
          onChange={searchTitle}
        />
        {searchClicked && (
          <SearchBar
            searches={searches}
            onClick={this.onClick}
            filteredSearches={filteredSearches}
          />
        )}
      </>
    );
  }
}

export default SearchInput;
