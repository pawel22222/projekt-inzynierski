import React from 'react'
import styled from 'styled-components'

const HomeDiv = styled.div`
    background-color: #e7edff;
    border: 1px solid #7998ff;
    border-radius: 5px;
    padding: 10px;
`
const P = styled.p`
    text-align: justify;
    font-size: 16px;
    text-indent: 20px;
    margin: 0;
`
const H1 = styled.h1`
    color: #7998ff;
    font-size: 24px;
    `
const Li = styled.li`
    color: #7998ff;
    font-weight: bold;
`

function Home() {

    return (
        <div style={{padding: '0 10px'}}>
        <HomeDiv className='container my-3'>
            <H1 className='text-center'>Projekt inżynierski</H1>
            <P>Celem tej aplikacji jest umożliwienie użytkownikom wyszukiwanie, ocenianie oraz trafniejszego sugerowania filmów.</P>

            <P>Główne widoki w aplikacji to:</P>
            <ul>
                <Li>Strona główna</Li>
                <P>Strona, na której aktualnie się znajdujesz ;)</P>

                <Li>Filmy</Li>
                <P>Pozwala przeglądać filmy. Pozycje mogą być filtrowane za pomocą opcji wyboru wyświetlanych kategorii. Po kliknięciu w kafelek, zostanie wyświetlona strona zawierająca szczegóły filmu.</P>

                <Li>Polecane Filmy</Li>
                <P>Jest dostępna po zalogowaniu i uzupełnieniu danych profilu o płeć i rok urodzenia.</P>
                <P>Na stronie generowany jest spersonalizowany ranking filmów. Algorytm proponujący filmy bierze pod uwagę wiek i płeć aktualnie zalogowanego użytkownika.</P>

                <Li>Statystyki</Li>
                <P>Jest dostępna po zalogowaniu. Przeznaczona jest dla osób interesujących sie korelacją statystyczną, pozwala na generowanie statystyk dotyczących wystawianych ocen przez użytkowników. Obliczone statystyki pomagają w wyznaczeniu mocy korelacji pomiędzy wiekiem użytkowników, a gatunkami filmowymi.</P>
                <P>Po wybraniu gatunku filmowego i przedziałów wiekowych zostanie wygenerowana tabela ilości ocen w poszczególnych przedziałach wiekowych. Druga tabela zawiera teoretyczne ilości ocen jakie statystycznie są oczekiwane. Pod tabelami znajduje się policzony test zgodności chi kwadrat oraz współczynnik zbieżności T-Czuprowa i współczynnik V-Cramera</P>
            </ul>
        </HomeDiv>
        </div>
    )
}

export default Home
