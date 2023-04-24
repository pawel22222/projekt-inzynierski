import React from 'react';

function Table({ dataTable, header, ageRanges }) {
  const ratingValues = [1, 2, 3, 4, 5];

  return (
    <div>
      <h1>{header}</h1>
      <table className='table border border-secondary'>
        <thead>
          <tr className='text-center '>
            <td></td>
            <td colSpan='5'>
              <b>Oceny</b>
            </td>
          </tr>
          <tr>
            <td>
              <b>Przedzialy wiekowe</b>
            </td>
            {ratingValues.map((el) => (
              <td key={el}>
                <b>{el}</b>
              </td>
            ))}
          </tr>
        </thead>
        <tbody>
          {dataTable.map((array, index) => (
            <tr key={index}>
              <th scope='row'>{`${ageRanges[index].from}-${ageRanges[index].to}`}</th>
              {array.map((el, i) => (
                <td key={i + 4}>{el % 1 === 0 ? el : el.toFixed(2)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
