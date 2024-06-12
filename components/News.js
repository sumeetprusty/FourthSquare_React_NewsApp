import React, { Component } from 'react';
import NewsItem from './NewsItem';
import Spinner from './Spinner';
import PropTypes from 'prop-types';
import InfiniteScroll from "react-infinite-scroll-component";

export default class News extends Component {
  static defaultProps = {
    country: 'in',
    pageSize: 8,
    category: 'general'
  }

  static propTypes = {
    country: PropTypes.string,
    pageSize: PropTypes.number,
    category: PropTypes.string,
    setProgress: PropTypes.func
  }

  capatalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  constructor(props) {
    super(props);
    this.state = {
      articles: [],
      loading: true,
      page: 1,
      totalResults: 0,
      error: null
    }
    document.title = `${this.capatalizeFirstLetter(this.props.category)} - NewsMonkey`;
  }

  async updateNews() {
    this.props.setProgress(10);
    const { country, category, pageSize } = this.props;
    const { page } = this.state;
    const apiKey = '6918404e10604d198969ee8b6e6858dc';
    const url = `https://newsapi.org/v2/top-headlines?country=${country}&category=${category}&apiKey=${apiKey}&page=${page}&pageSize=${pageSize}`;
    console.log("Fetching URL: ", url);  // Debugging line
    this.setState({ loading: true, error: null });

    try {
      let response = await fetch(url);
      console.log("Response Status: ", response.status);  // Debugging line
      if (response.status === 426) {
        throw new Error("Upgrade Required");
      }
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      this.props.setProgress(30);
      let parsedData = await response.json();
      this.props.setProgress(70);
      this.setState({
        articles: parsedData.articles || [],
        totalResults: parsedData.totalResults || 0,
        loading: false
      });
      this.props.setProgress(100);
    } catch (error) {
      console.error("Fetching error: ", error);
      this.setState({ loading: false, error: error.message });
      this.props.setProgress(100);
    }
  }

  async componentDidMount() {
    this.updateNews();
  }

  fetchMoreData = async () => {
    this.setState({ page: this.state.page + 1 });
    const { country, category, pageSize } = this.props;
    const { page } = this.state;
    const apiKey = '6918404e10604d198969ee8b6e6858dc';
    const url = `https://newsapi.org/v2/top-headlines?country=${country}&category=${category}&apiKey=${apiKey}&page=${page+1}&pageSize=${pageSize}`;
    console.log("Fetching More Data URL: ", url);  // Debugging line

    try {
      let response = await fetch(url);
      console.log("Response Status for More Data: ", response.status);  // Debugging line
      if (response.status === 426) {
        throw new Error("Upgrade Required");
      }
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      let parsedData = await response.json();
      this.setState({
        articles: this.state.articles.concat(parsedData.articles || []),
        totalResults: parsedData.totalResults || 0,
        loading: false
      });
    } catch (error) {
      console.error("Fetching error: ", error);
      this.setState({ loading: false, error: error.message });
    }
  }

  render() {
    return (
      <>
        <h1 className="text-center" style={{ margin: `35px 0px`, marginTop: '90px' }}>
          NewsMonkey - Top {this.capatalizeFirstLetter(this.props.category)} Headlines
        </h1>
        {this.state.loading && <Spinner />}
        {this.state.error && <p className="text-center text-danger">{this.state.error}</p>}
        <InfiniteScroll
          dataLength={this.state.articles.length}
          next={this.fetchMoreData}
          hasMore={this.state.articles.length !== this.state.totalResults}
          loader={<Spinner />}
        >
          <div className="container">
            <div className="row">
              {this.state.articles.map((element, index) => {
                return (
                  <div className='col-md-4' key={`${element?.url}-${index}`}>
                    <NewsItem
                      title={element?.title || ""}
                      description={element?.description || ""}
                      imageUrl={element?.urlToImage}
                      newsUrl={element?.url}
                      author={element?.author}
                      date={element?.publishedAt}
                      source={element?.source.name}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </InfiniteScroll>
      </>
    );
  }
}
