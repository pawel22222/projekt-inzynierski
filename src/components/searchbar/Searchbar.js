import { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { db } from '../../firebase';

import SearchedMovie from './searchedMovie/SearchedMovie';

//#region Styled components
const SearchbarDiv = styled.div`
  z-index: 50;
  width: 100%;
  display: flex;
  flex-flow: column;
  align-items: center;
`;
const Input = styled.input`
  height: 35px;
  width: 70%;
  border-radius: 5px;
  border: 2px solid #7998ff;
  @media (max-width: 768px) {
    width: 95%;
  }
  &:focus {
    outline: 3px #7998ff solid;
  }
  &::placeholder {
    color: #7998ff;
  }
`;
const SearchResults = styled.div`
  background-color: #e7edff;
  width: 70%;
  border: 2px solid #7998ff;
  border-top: none;
  border-radius: 5px;
  @media (max-width: 768px) {
    width: 95%;
  }
`;
//#endregion

function Searchbar() {
  const [input, setInput] = useState('');
  const [searchedMovies, setSearchedMovies] = useState([]);
  const inputRef = useRef(null);

  const [searchbarResult, setSearchbarResult] = useState(false);

  useEffect(() => {
    const fetchMovies = async () => {
      const moviesArr = [];

      await db
        .collection('movies')
        .where('title', '>=', input)
        .where('title', '<=', input + '\uf8ff')
        .orderBy('title')
        .limit(3)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            moviesArr.push(doc.data());
          });
          setSearchedMovies(moviesArr);
        });
    };

    input.length > 2 ? fetchMovies() : setSearchedMovies([]);
  }, [input]);

  const firstCharToUpper = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  return (
    <SearchbarDiv>
      <Input
        type='search'
        ref={inputRef}
        placeholder='Szukaj filmu..'
        value={input}
        onChange={(e) => setInput(firstCharToUpper(e.target.value))}
        onBlur={() => setTimeout(() => setSearchbarResult(false), 100)}
        onFocus={() => setSearchbarResult(true)}
      />
      {searchbarResult && !!searchedMovies.length && (
        <SearchResults>
          {searchedMovies.map((movie) => (
            <SearchedMovie key={movie.title} {...movie} />
          ))}
        </SearchResults>
      )}
    </SearchbarDiv>
  );
}

export default Searchbar;
