import { useState, useEffect } from 'react';
import { db } from '../../firebase';
import jsPDF from 'jspdf';

import SpinnerLoading from '../UI/SpinnerLoading';
import Alert from '../UI/AlertMain';
import Table from './table/Table';
import FilterStats from './filterStats/FilterStats';

function Statistic() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [errorFilter, setErrorFilter] = useState('');

  const [movies, setMovies] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [users, setUsers] = useState([]);

  const [selectedGenre, setSelectedGenre] = useState('');
  const [ageRanges, setAgeRanges] = useState([]);

  const currentYear = new Date().getFullYear();

  const [dataTable, setDataTable] = useState([]);
  const [theoreticalDataTable, setTheoreticalDataTable] = useState([]);
  const [chiSquare, setChiSquare] = useState(0);
  const [tCzuprow, setTCzuprow] = useState(0);
  const [vCramer, setVCramer] = useState(0);

  useEffect(() => {
    const fetchMovies = (genre) => {
      setLoading(true);
      setError('');

      try {
        db.collection('movies')
          .where('genre', 'array-contains', genre)
          .where('ratingCounter', '>', 0)
          .get()
          .then((querySnapshot) => {
            let moviesOfGenre = [];
            querySnapshot.forEach((doc) => {
              moviesOfGenre.push(doc.data());
            });

            moviesOfGenre.length ? setMovies(moviesOfGenre) : setError('Brak danych');
          });
      } catch (error) {
        setError(`Failed to fetch movies data. ${error}`);
        setLoading(false);
      }
    };

    selectedGenre && fetchMovies(selectedGenre);
  }, [selectedGenre]);

  useEffect(() => {
    const fetchRating = (movies) => {
      setError('');
      setLoading(true);

      return new Promise(() => {
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
                setLoading(false);
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
      setError('');
      setLoading(true);

      return new Promise(() => {
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
                setLoading(false);
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

  function assignUsersToAgeRanges() {
    let usersInRanges = ageRanges.map((el) => []);

    users.forEach((user) => {
      const userAge = -1 * (user.age - currentYear);

      const ageRangeIndex = ageRanges.findIndex(({ from, to }) => userAge >= from && userAge <= to);

      ageRangeIndex >= 0 && usersInRanges[ageRangeIndex].push(user.id);
    });

    return usersInRanges;
  }

  function createTableOfValues(usersInRanges) {
    let table = ageRanges.map((el) => [0, 0, 0, 0, 0]);

    ratings.forEach((rating) => {
      const index = usersInRanges.findIndex((arr) => arr.includes(rating.userId));

      index >= 0 && table[index][rating.ratingValue - 1]++;
    });

    setDataTable(table);
    return table;
  }

  function calcSumValuesInRows(tableOfValues) {
    return tableOfValues.map((arr) => arr.reduce((acc, el) => acc + el));
  }

  function calcSumValuesInColumns(tableOfValues) {
    return tableOfValues.reduce((acc, arr) => {
      arr.forEach((el, i) => {
        acc[i] = (acc[i] || 0) + el;
      });
      return acc;
    }, []);
  }

  function calcSumAllValues(sumValuesInRows) {
    return sumValuesInRows.reduce((acc, el) => acc + el);
  }

  function createTableOfTheoreticalValues(
    tableOfValues,
    sumValuesInRows,
    sumValuesInColumn,
    sumAllValues,
  ) {
    return tableOfValues.map((arr, i) => {
      return arr.map((el, j) => {
        return (el = (sumValuesInRows[i] * sumValuesInColumn[j]) / sumAllValues);
      });
    });
  }

  function calcChiSquare(tableOfValues, tableOfTheoreticalValues) {
    return tableOfValues.reduce((acc, arr, i) => {
      return (acc =
        acc +
        arr.reduce((acc2, el, j) => {
          return tableOfTheoreticalValues[i][j] === 0
            ? (acc2 = acc2 + 0)
            : (acc2 =
                acc2 + (el - tableOfTheoreticalValues[i][j]) ** 2 / tableOfTheoreticalValues[i][j]);
        }, 0));
    }, 0);
  }

  function calcTCzprow(chiSquare, sumValuesInRows, sumValuesInColumn, sumAllValues) {
    return Math.sqrt(
      chiSquare /
        (sumAllValues * Math.sqrt((sumValuesInColumn.length - 1) * (sumValuesInRows.length - 1))),
    );
  }

  function calcVCramer(chiSquare, sumValuesInRows, sumValuesInColumn, sumAllValues) {
    return Math.sqrt(
      chiSquare /
        (sumAllValues *
          Math.sqrt(
            sumValuesInColumn.length - 1 <= sumValuesInRows.length - 1
              ? sumValuesInColumn.length - 1
              : sumValuesInRows.length - 1,
          )),
    );
  }

  const processStatistic = () => {
    setLoading(true);
    setError('');

    const usersInAgeRanges = assignUsersToAgeRanges();

    const tableOfValues = createTableOfValues(usersInAgeRanges);

    const sumValuesInRows = calcSumValuesInRows(tableOfValues);
    const sumValuesInColumn = calcSumValuesInColumns(tableOfValues);
    const sumAllValues = calcSumAllValues(sumValuesInRows);

    const tableOfTheoreticalValues = createTableOfTheoreticalValues(
      tableOfValues,
      sumValuesInRows,
      sumValuesInColumn,
      sumAllValues,
    );

    const chiSquare = calcChiSquare(tableOfValues, tableOfTheoreticalValues);
    const tCzuprow = calcTCzprow(chiSquare, sumValuesInRows, sumValuesInColumn, sumAllValues);
    const vCramer = calcVCramer(chiSquare, sumValuesInRows, sumValuesInColumn, sumAllValues);

    setDataTable(tableOfValues);
    setTheoreticalDataTable(tableOfTheoreticalValues);
    setChiSquare(chiSquare);
    setTCzuprow(tCzuprow);
    setVCramer(vCramer);

    setLoading(false);
  };

  const factors = [
    { value: chiSquare, header: 'Wartosc statystyki chi kwadrat: ' },
    { value: tCzuprow, header: 'Wspolczynnik zbieznosci T-Czuprowa: ' },
    { value: vCramer, header: 'Wspolczynnik V-Cramera: ' },
  ];

  useEffect(() => {
    users.length && ageRanges.length && processStatistic();
  }, [users, ageRanges]);

  function generatePDF() {
    const doc = new jsPDF('p', 'pt', 'b4');

    doc.html(document.querySelector('#statsDoc'), {
      callback: function (pdf) {
        pdf.save('statystyki.pdf');
      },
    });
  }

  return (
    <div>
      <FilterStats
        setSelectedGenre={setSelectedGenre}
        setAgeRanges={setAgeRanges}
        errorFilter={errorFilter}
        setErrorFilter={setErrorFilter}
        generatePDF={generatePDF}
      />
      <div className='container'>
        {error && <Alert type='danger' desc={error} />}
        {loading && <SpinnerLoading />}
      </div>

      {!loading && error.length === 0 && errorFilter.length === 0 && dataTable.length > 0 && (
        <div className='container-md' id='statsDoc'>
          <h1 className='text-center mb-5'>{'Kategoria filmowa: ' + selectedGenre}</h1>

          <Table
            header={`Tabela 1. Liczebnosc ocen uzytkownikow w przedzialach wiekowych. `}
            dataTable={dataTable}
            ageRanges={ageRanges}
          />

          <div className='my-5'></div>

          <Table
            header={`Tabela 2. Oczekiwana (teoretyczna) liczebnosc ocen uzytkownikow w przedzialach wiekowych.`}
            dataTable={theoreticalDataTable}
            ageRanges={ageRanges}
          />

          <div className='my-5'>
            {factors.map(({ value, header }, i) => (
              <h2 key={i}>
                {header}
                <b>{value.toFixed(2)}</b>
              </h2>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Statistic;
