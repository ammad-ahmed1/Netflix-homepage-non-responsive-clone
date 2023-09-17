import React, { useEffect, useState } from "react";
import axios from "./axios";
import "./Row.css";
import YouTube from "react-youtube";
import movieTrailer from "movie-trailer";
const Row = ({ title, fetchUrl, isLargeRow }) => {
  const base_imgUrl = "https://image.tmdb.org/t/p/original";
  const [movies, setMovies] = useState([]);
  const [trailerUrl, setTrailerUrl] = useState("");
  useEffect(() => {
    
    const fetchData = async () => {
      try {
        const request = await axios.get(fetchUrl);
        console.log(request.data.results, "data getting from backend");
        setMovies(request.data.results);
      } catch (e) {
        console.log(e);
      }
    };
    fetchData();
  }, [fetchUrl]);
  const opts = {
    height: "390",
    width: "100%",
    playerVars: {
      //https://developers.google.com/youtube/player_parameters
      autoplay: 1,
    }
  }
  const handleClick = (movie) => {
    if(trailerUrl){
      setTrailerUrl('');
    }else{
      movieTrailer(movie?.name || "")
      .then(url => {
        const urlParams = new URLSearchParams(new URL(url).search);
        setTrailerUrl(urlParams.get('v'));
      }).catch((error)=>console.log(error))
    }
  }
  return (
    <div className="row">
      <h2>{title}</h2>
      <div className="row_posters">
        {movies.map((movie) => (
          <img
          onClick={()=>handleClick(movie)}
            className={`row_poster ${isLargeRow && "row_posterLarge"}`}
            key={movie.id}
            //src={`${base_imgUrl}${movie.poster_path}`}
            src={`${base_imgUrl}${
              isLargeRow ? movie.poster_path : movie.backdrop_path
            }`}
            alt={movie.name}
          />
          
        ))}
        {trailerUrl && <YouTube videoId = {trailerUrl} opts = {opts} />}
        
      </div>
    </div>
  );
};

export default Row;
