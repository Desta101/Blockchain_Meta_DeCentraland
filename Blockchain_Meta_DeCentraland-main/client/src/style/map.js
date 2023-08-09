import styled from 'styled-components';

export const MapContainer = styled.div`
  position: relative;
  max-width: 100%;
  overflow: scroll;
  padding: 40px 100px;
`;

export const ContentContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  background: #ffffff;
  height: 38px;
  font-weight: bold;
  font-family: Verdana;
`;

export const ContentTitle = styled.div`
  font-size: 22px;
  font-family: Verdana;
  margin: auto 0;
  margin-left: 10px;
  color: #000000;
`;

export const LandType = styled.div`
  font-size: 20px;
  font-family: Verdana;
  margin: auto 0;
  margin-left: 35px;
`;