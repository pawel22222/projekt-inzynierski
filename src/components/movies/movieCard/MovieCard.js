import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const MovieInfo = styled.div`
  background-color: #00000089;
  color: white;
  backdrop-filter: blur(3px);
  padding: 10px 15px;
  width: 100%;
  height: 70px;
  display: flex;
  flex-flow: column;
  text-align: center;
  justify-content: center;
  font-size: 1.2em;
  z-index: 10;
  position: absolute;
  transition: all 0.3s ease;
`;
const Movie = styled.div`
  position: relative;
  display: flex;
  align-items: flex-end;
  &:hover ${MovieInfo} {
    background-color: #000000b7;
  }
`;
const Poster = styled.img`
  width: 100%;
  height: 100%;
  overflow: hidden;
`;
const StyledLink = styled(Link)`
  text-decoration: none;
  color: black;
`;

function MovieCard({ id, title, release_date, backdrop }) {
  const dateToYear = release_date.slice(0, 4);
  const titleWithDate = `${title} (${dateToYear})`;

  return (
    <StyledLink to={`/movie/${id}`}>
      <Movie>
        <Poster src={`https://image.tmdb.org/t/p/w500/${backdrop}`} />
        <MovieInfo>{titleWithDate}</MovieInfo>
      </Movie>
    </StyledLink>
  );
}

export default MovieCard;
