import React from 'react'

function Table({ dataTable, header }) {
    return (
        <div>
            <h1>{ header }</h1>
            <table border="2" cellpadding="10">
                <tbody>
                    <font size="5">
                        <tr>
                            <td rowSpan="2"><b>Wiek</b></td>
                            <td colSpan="5"><b>Oceny</b></td>
                        </tr>
                        <tr>
                            <td><b>1</b></td>
                            <td><b>2</b></td>
                            <td><b>3</b></td>
                            <td><b>4</b></td>
                            <td><b>5</b></td>
                        </tr>
                        <tr>
                            <td><b>10-20</b></td>
                            { dataTable.age1.map(el => <td>{ el }</td>) }
                        </tr>
                        <tr>
                            <td><b>20-30</b></td>
                            { dataTable.age2.map(el => <td>{ el }</td>) }
                        </tr>
                        <tr>
                            <td><b>30-40</b></td>
                            { dataTable.age3.map(el => <td>{ el }</td>) }
                        </tr>
                    </font>
                </tbody>
            </table>
        </div>
    )
}

export default Table
