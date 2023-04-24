import React from 'react';
import styled, { keyframes } from 'styled-components';

//#region Styled components
const color1 = '#e7edff';
const color2 = '#7998ff';

const ContainerDiv = styled.div`
  display: flex;
  flex-flow: column;
`;
const MovieDiv = styled.div`
  background-color: ${color1};
  display: flex;
  padding: 5px;
  width: 100%;
  min-height: 150px;
  margin-bottom: 5px;
  border: 1px solid #7998ff;
  border-radius: 5px;
`;
const RankDiv = styled.div`
  display: flex;
  flex-flow: column;
  height: 50%;
  width: 100px;
  margin: auto 0;
`;
const PosterDiv = styled.div`
  min-width: 100px;
`;
const MainDiv = styled.div`
  display: flex;
  flex-flow: column;
  width: 100%;
`;
const TitleDiv = styled.div`
  height: 40px;
  width: 50%;
  margin-bottom: 5px;
`;
const GenreDiv = styled.div`
  height: 30px;
  width: 25%;
  margin-bottom: 5px;
`;
const DescDiv = styled.div`
  height: 20px;
  width: 100%;
  margin-bottom: 5px;
`;
const shine = keyframes`
    100% { transform: translateX(100%); }
`;
const SkeletonBox = styled.div`
  background-color: ${color2};
  margin: 0 5px;
  height: 100%;
  border-radius: 5px;

  position: relative;
  overflow: hidden;
  ::before {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    transform: translateX(-100%);
    background-image: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0) 0,
      rgba(255, 255, 255, 0.2) 25%,
      rgba(255, 255, 255, 0.5) 60%,
      rgba(255, 255, 255, 0)
    );
    animation: ${shine} 4s infinite;
    content: '';
  }
`;
//#endregion

export default function SkeletonLoading() {
  return (
    <ContainerDiv>
      <h1 className='text-center'>Personalizowanie rankingu...</h1>
      {[1, 2, 3].map((el) => {
        return (
          <MovieDiv key={el} className='container'>
            <RankDiv>
              <div className='w-100'>
                <SkeletonBox style={{ height: '30px' }}></SkeletonBox>
                <div className='py-2'></div>
                <SkeletonBox style={{ height: '30px' }}></SkeletonBox>
              </div>
            </RankDiv>

            <PosterDiv>
              <SkeletonBox></SkeletonBox>
            </PosterDiv>

            <MainDiv>
              <TitleDiv>
                <SkeletonBox></SkeletonBox>
              </TitleDiv>

              <GenreDiv>
                <SkeletonBox></SkeletonBox>
              </GenreDiv>

              <DescDiv>
                <SkeletonBox></SkeletonBox>
              </DescDiv>

              <DescDiv>
                <SkeletonBox></SkeletonBox>
              </DescDiv>

              <DescDiv className='m-0 w-75'>
                <SkeletonBox></SkeletonBox>
              </DescDiv>
            </MainDiv>
          </MovieDiv>
        );
      })}
    </ContainerDiv>
  );
}
