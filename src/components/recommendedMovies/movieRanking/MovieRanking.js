import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

//#region Styled components
const MovieRankingDiv = styled.div`
  display: flex;
  flex-flow: column;
  padding: 5px;
`;
const MovieDiv = styled(Link)`
  display: flex;
  flex-flow: row;
  width: 100%;
  background-color: #e7edff;
  padding: 5px;
  margin-bottom: 5px;
  color: black;
  text-decoration: none;
  border: 1px solid #7998ff;
  border-radius: 5px;
  :hover {
    color: black;
    text-decoration: none;
    transition: background-color 0.3s ease;
    background-color: #c6d4ff;
  }
`;
const OrderRatingDiv = styled.div`
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
  width: 100px;
  min-width: 50px;
  margin-right: 5px;
`;
const PosterDiv = styled.img`
  width: 100px;
  border-radius: 5px;
  margin-right: 5px;
`;
const MainDiv = styled.div`
  display: flex;
  flex-flow: column;
`;
//#endregion

const MovieRanking = ({ movies }) => (
  <MovieRankingDiv className='container'>
    <h1 className='text-center mb-4'>Spersonalizowany ranking filmów</h1>

    {movies.map(({ id, title, desc, genre, release_date, poster, weightedAverage }, index) => (
      <MovieDiv key={id} to={`/movie/${id}`}>
        <OrderRatingDiv>
          <h1>{`#${index + 1}`}</h1>
          <span>{`(${weightedAverage.toFixed(2)})`}</span>
        </OrderRatingDiv>

        <PosterDiv
          src={`https://image.tmdb.org/t/p/w500/${poster}`}
          alt={`Plakat filmu "${title}"`}
        ></PosterDiv>

        <MainDiv>
          <h1>{`${title} (${release_date.slice(0, 4)})`}</h1>
          <h3>{genre.join(' ')}</h3>
          <p>{`${desc.slice(0, 100)}...`}</p>
        </MainDiv>
      </MovieDiv>
    ))}
  </MovieRankingDiv>
);

export default MovieRanking;
