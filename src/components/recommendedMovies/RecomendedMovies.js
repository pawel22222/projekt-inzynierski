import { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { useAuth } from '../../context/AuthContext';

import Alert from '../UI/AlertMain';
import MovieRanking from './movieRanking/MovieRanking';
import SkeletonLoading from './skeletonLoading/SkeletonLoading';

function RecomendedMovies() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { userInfo } = useAuth();
  const currentYear = new Date().getFullYear();

  const [movies, setMovies] = useState('');
  const [ratings, setRatings] = useState('');
  const [users, setUsers] = useState('');
  const [movieRanking, setMovieRanking] = useState([]);

  const sexes = ['male', 'famale'];
  const ageRanges = [
    { from: 15, to: 21 },
    { from: 21, to: 26 },
    { from: 26, to: 35 },
    { from: 35, to: 50 },
    { from: 50, to: 70 },
  ];
  const genres = [
    'Akcja',
    'Przygodowy',
    'Animowany',
    'Komedia',
    'Kryminał',
    'Dokumentalny',
    'Dramat',
    'Familijny',
    'Fantasy',
    'Historyczny',
    'Horror',
    'Muzyczny',
    'Romans',
    'Science Fiction',
    'Thriller',
    'Wojenny',
    'Western',
  ];

  useEffect(() => {
    const fetchMovies = () => {
      console.log('fetchMovies');

      try {
        setLoading(true);
        setError('');

        db.collection('movies')
          .where('ratingCounter', '>', 0)
          .get()
          .then((querySnapshot) => {
            let moviesArr = [];
            querySnapshot.forEach((doc) => {
              moviesArr.push(doc.data());
            });

            moviesArr.length ? setMovies(moviesArr) : setError('Brak danych');
          });
      } catch (error) {
        setError(`Failed to fetch movies data. ${error}`);
      }
    };

    fetchMovies();
  }, []);

  useEffect(() => {
    const fetchRating = (movies) => {
      console.log('fetchRating');

      return new Promise(() => {
        setError('');
        setLoading(true);

        let batches = [];

        const movieIds = [...new Set(movies.map((el) => el.id.toString()))];

        while (movieIds.length) {
          const batch = movieIds.splice(0, 10);

          batches.push(
            new Promise((response) => {
              try {
                db.collection('ratings')
                  .where('movieId', 'in', [...batch])
                  .get()
                  .then((results) =>
                    response(results.docs.map((result) => ({ ...result.data() }))),
                  );
              } catch (error) {
                setError(`Failed to fetch users data. ${error}`);
              }
            }),
          );
        }

        Promise.all(batches).then((content) => {
          setRatings(content.flat());
        });
      });
    };

    movies.length && fetchRating(movies);
  }, [movies]);

  useEffect(() => {
    const fetchUsers = (ratings) => {
      console.log('fetchUsers');

      return new Promise(() => {
        setError('');
        setLoading(true);

        let batches = [];

        const userIds = [...new Set(ratings.map((el) => el.userId))];

        while (userIds.length) {
          const batch = userIds.splice(0, 10);

          batches.push(
            new Promise((response) => {
              try {
                db.collection('users')
                  .where('id', 'in', [...batch])
                  .get()
                  .then((results) =>
                    response(results.docs.map((result) => ({ ...result.data() }))),
                  );
              } catch (error) {
                setError(`Failed to fetch users data. ${error}`);
              }
            }),
          );
        }

        Promise.all(batches).then((content) => {
          setUsers(content.flat());
        });
      });
    };

    ratings.length && fetchUsers(ratings);
  }, [ratings]);

  useEffect(() => {
    function generateRatingsTree(sexesArr, ageRangesArr, genresArr) {
      const sexes = sexesArr.map((sex) => ({
        sex: sex,
        ratingCounterForSex: 0,
        percentageValueForSex: 0,
      }));

      const ageRanges = ageRangesArr.map((ageRange) => ({
        ageRange: ageRange,
        ratingCounterForAgeRange: 0,
        percentageValueForAgeRange: 0,
      }));

      const genres = genresArr.map((genre) => ({
        genre: genre,
        ratingCounterForGenre: 0,
        percentageValueForGenre: 0,
      }));

      const ratingsTree = { ratingCounter: 0 };

      ratingsTree.sexes = JSON.parse(JSON.stringify(sexes));

      ratingsTree.sexes.forEach((sex) => {
        sex.ageRanges = JSON.parse(JSON.stringify(ageRanges));
      });

      ratingsTree.sexes.forEach((sex) => {
        sex.ageRanges.forEach((ageRange) => {
          ageRange.genres = JSON.parse(JSON.stringify(genres));
        });
      });

      return ratingsTree;
    }

    function updateRatingsWithUserDataAndGenres() {
      return ratings.map((rating) => {
        const currentUser = users.find((user) => user.id === rating.userId);
        const currentMovie = movies.find((movie) => movie.id === rating.movieId);

        return {
          ...rating,
          userAge: -1 * (currentUser.age - currentYear),
          userSex: currentUser.sex,
          movieGenres: currentMovie.genre,
        };
      });
    }

    function countRatingsInRatingsTree(ratingsWithUserDataAndGenres, ratingsTree) {
      ratingsWithUserDataAndGenres.forEach((rating) => {
        ratingsTree.ratingCounter++;

        const findedSex = ratingsTree.sexes.find(({ sex }) => sex === rating.userSex);
        findedSex.ratingCounterForSex++;

        const findedAgeRange = findedSex.ageRanges.find(
          ({ ageRange }) => rating.userAge >= ageRange.from && rating.userAge < ageRange.to,
        );
        findedAgeRange.ratingCounterForAgeRange++;

        findedAgeRange.genres.forEach((genre) => {
          if (rating.movieGenres.includes(genre.genre)) {
            genre.ratingCounterForGenre++;
          }
        });
      });
    }

    function calcPercentageValues(ratingsTree) {
      ratingsTree.sexes.forEach((sex) => {
        sex.percentageValueForSex = sex.ratingCounterForSex / ratingsTree.ratingCounter;

        sex.ageRanges.forEach((ageRange) => {
          ageRange.percentageValueForAgeRange =
            ageRange.ratingCounterForAgeRange / sex.ratingCounterForSex;

          ageRange.genres.forEach((genre) => {
            genre.percentageValueForGenre =
              genre.ratingCounterForGenre / ageRange.ratingCounterForAgeRange;
          });
        });
      });
    }

    function calcProbabilityOfGenres(genresWithProbabilityAndFitFactor, ratingsTree) {
      genresWithProbabilityAndFitFactor.forEach((genreObj) => {
        let total = 0;

        ratingsTree.sexes.forEach((sex) => {
          sex.ageRanges.forEach((ageRange) => {
            const findedGenre = ageRange.genres.find(
              ({ genre }) => genre === genreObj.genre,
            ).percentageValueForGenre;

            const findedGenreOrZero = isNaN(findedGenre) ? 0 : findedGenre;

            total +=
              sex.percentageValueForSex * ageRange.percentageValueForAgeRange * findedGenreOrZero;
          });
        });

        genreObj.probability = total;
      });
    }

    function calcFitFactorOfGenres(genresWithProbabilityAndFitFactor, ratingsTree) {
      genresWithProbabilityAndFitFactor.forEach((genreObj) => {
        const currentUserSex = ratingsTree.sexes.find(({ sex }) => sex === userInfo.sex);
        const currentUserAge = -1 * (userInfo.age - currentYear);
        const currentUserAgeRange = currentUserSex.ageRanges.find(
          ({ ageRange }) => currentUserAge >= ageRange.from && currentUserAge < ageRange.to,
        );
        const currentGenre = currentUserAgeRange.genres.find(
          ({ genre }) => genre === genreObj.genre,
        );

        if (genreObj.probability === 0) {
          genreObj.fitFactor = 0;
        } else {
          genreObj.fitFactor =
            (currentUserSex.percentageValueForSex *
              currentUserAgeRange.percentageValueForAgeRange *
              currentGenre.percentageValueForGenre) /
            genreObj.probability;
        }
      });

      genresWithProbabilityAndFitFactor.sort((a, b) => b.fitFactor - a.fitFactor);
    }

    function calcWeightedAverage(genreWithBiggestFitFactor) {
      const moviesInGenres = Object.fromEntries(genres.map((genre) => [genre, []]));

      movies.forEach((movie) => {
        movie.genre.forEach((genre) => {
          moviesInGenres[genre].push(movie);
        });
      });

      const numberOfRatings = moviesInGenres[genreWithBiggestFitFactor].reduce(
        (total, movie) => (total += movie.ratingCounter),
        0,
      );

      return moviesInGenres[genreWithBiggestFitFactor].map((movie) => ({
        ...movie,
        weightedAverage: (movie.averageRatings * movie.ratingCounter) / numberOfRatings,
      }));
    }

    const rankingProcess = () => {
      console.log('rankingProcess');

      setLoading(true);
      setError('');

      const ratingsTree = generateRatingsTree(sexes, ageRanges, genres);
      const ratingsWithUserDataAndGenres = updateRatingsWithUserDataAndGenres();

      countRatingsInRatingsTree(ratingsWithUserDataAndGenres, ratingsTree);

      calcPercentageValues(ratingsTree);
      console.log(ratingsTree);

      const genresWithProbabilityAndFitFactor = genres.map((genre) => {
        return { genre: genre, probability: 0, fitFactor: 0 };
      });

      calcProbabilityOfGenres(genresWithProbabilityAndFitFactor, ratingsTree);

      calcFitFactorOfGenres(genresWithProbabilityAndFitFactor, ratingsTree);
      console.log(genresWithProbabilityAndFitFactor);

      const genreWithBiggestFitFactor = genresWithProbabilityAndFitFactor[0].genre;

      const rankingOfMovies = calcWeightedAverage(genreWithBiggestFitFactor);

      const sortedRanking = rankingOfMovies.sort((a, b) => b.weightedAverage - a.weightedAverage);
      console.log(sortedRanking);

      setMovieRanking(sortedRanking);
      setLoading(false);
    };

    users.length && rankingProcess();
  }, [users]);

  return (
    <div className='mt-3'>
      <div className='container'>{error && <Alert type='danger' desc={error} />}</div>

      {loading && <SkeletonLoading />}

      {!!movieRanking.length && !loading && <MovieRanking movies={movieRanking} />}
    </div>
  );
}

export default RecomendedMovies;
