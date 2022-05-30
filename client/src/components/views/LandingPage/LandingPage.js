import React, { useEffect, useState, useRef } from "react";
import "./LandingPage.css";
import { Typography, Row, Button } from "antd";
import {
  API_URL,
  API_KEY,
  IMAGE_BASE_URL,
  IMAGE_SIZE,
  POSTER_SIZE,
} from "../../Config";
import MainImage from "./Sections/MainImage";
import GridCard from "../../commons/GridCards";
const { Title } = Typography;

function LandingPage() {
  const buttonRef = useRef(null);
  const [Search, setSearch] = useState("");
  const [SearchMovies, setSearchMovies] = useState([]);
  const [Movies, setMovies] = useState([]);
  const [MainMovieImage, setMainMovieImage] = useState(null);
  const [Loading, setLoading] = useState(true);
  const [CurrentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    setSearchMovies(null);
    const endpoint = `${API_URL}movie/popular?api_key=${API_KEY}&language=en-US&page=1`;
    fetchMovies(endpoint);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
  }, []);

  const fetchMovies = (endpoint) => {
    fetch(endpoint)
      .then((result) => result.json())
      .then((result) => {
        // console.log(result)
        // console.log('Movies',...Movies)
        // console.log('result',...result.results)
        setMovies([...Movies, ...result.results]);
        setMainMovieImage(MainMovieImage || result.results[0]);
        setCurrentPage(result.page);
      }, setLoading(false))
      .catch((error) => console.error("Error:", error));
  };

  const loadMoreItems = () => {
    let endpoint = "";
    setLoading(true);
    // console.log('CurrentPage', CurrentPage)
    endpoint = `${API_URL}movie/popular?api_key=${API_KEY}&language=en-US&page=${
      CurrentPage + 1
    }`;
    fetchMovies(endpoint);
  };

  const handleScroll = () => {
    const windowHeight =
      "innerHeight" in window
        ? window.innerHeight
        : document.documentElement.offsetHeight;
    const body = document.body;
    const html = document.documentElement;
    const docHeight = Math.max(
      body.scrollHeight,
      body.offsetHeight,
      html.clientHeight,
      html.scrollHeight,
      html.offsetHeight
    );
    const windowBottom = windowHeight + window.pageYOffset;
    if (windowBottom >= docHeight - 1) {
      // loadMoreItems()
      // console.log('clicked')
      buttonRef.current.click();
    }
  };

  const fetchSearchMovies = (endpoint) => {
    setMovies([]);
    fetch(endpoint)
      .then((result) => result.json())
      .then((result) => {
        // console.log(result)
        // console.log('Movies',...Movies)
        // console.log("result", ...result.results);
        setSearchMovies([...result.results]);
        setMainMovieImage(MainMovieImage || result.results[0]);
        setCurrentPage(result.page);
      }, setLoading(false))
      .catch((error) => console.error("Error:", error));
  };

  const searchMovie = () => {
    const endpoint = `${API_URL}search/movie?api_key=${API_KEY}&language=en-US&query=${Search}`;
    setMovies([]);
    fetchSearchMovies(endpoint);
  };

  return (
    <div style={{ width: "100%", margin: "0" }}>
      <form action="">
        <div className="input">
          <input
            id="search-text"
            type="text"
            className="search"
            placeholder="Search Movies..."
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button
            id="search-button"
            onClick={searchMovie}
            type="submit"
            className="searchButton"
          >
            <b> Search</b>
          </Button>
        </div>
      </form>
      {/* {MainMovieImage && !SearchMovies && (
        <MainImage
          image={`${IMAGE_BASE_URL}${IMAGE_SIZE}${MainMovieImage.backdrop_path}`}
          title={MainMovieImage.original_title}
          text={MainMovieImage.overview}
        />
      )} */}

      <div style={{ width: "85%", margin: "1rem auto" }}>
        {!SearchMovies && <Title level={2}> Popular Movies </Title>}
        {SearchMovies && <Title level={2}> Search Results </Title>}
        <hr />
        <Row gutter={[16, 16]}>
          {SearchMovies &&
            SearchMovies.map((movie, index) => (
              <React.Fragment key={index}>
                <GridCard
                  image={
                    movie.poster_path
                      ? `${IMAGE_BASE_URL}${POSTER_SIZE}${movie.poster_path}`
                      : null
                  }
                  movieId={movie.id}
                  movieName={movie.original_title}
                />
              </React.Fragment>
            ))}
          {Movies &&
            !SearchMovies &&
            Movies.map((movie, index) => (
              <React.Fragment key={index}>
                <GridCard
                  image={
                    movie.poster_path
                      ? `${IMAGE_BASE_URL}${POSTER_SIZE}${movie.poster_path}`
                      : null
                  }
                  movieId={movie.id}
                  movieName={movie.original_title}
                />
              </React.Fragment>
            ))}
        </Row>

        {Loading && <div>Loading...</div>}

        <br />
        <div style={{ display: "flex", justifyContent: "center" }}>
          {Movies && (
            <button
              ref={buttonRef}
              className="loadMore"
              onClick={loadMoreItems}
            >
              Load More
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
