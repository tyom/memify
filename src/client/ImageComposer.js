import React from 'react';
import { parse } from 'query-string';
import styled from '@emotion/styled';

const params = {};
updateParams(parse(window.location.hash.slice(1)));

function updateParams({ img, text}) {
  params.img = img;
  params.text = text;
}

window.onhashchange = evt => {
  const newQuery = parse(evt.newURL.split('#')[1]);
  updateParams(newQuery);
};

export default () => (
  <ImageComposer>
    <div id="image" className="image">
      <img src={params.img} alt="" />
      <div className="text">
        {params.text}
      </div>
    </div>
  </ImageComposer>
);

const ImageComposer = styled.div`
  height: 800px;
  box-shadow: 0 1px 10px rgba(0, 0, 0, 0.5);
  
  .image {
    position: relative;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .image img {
    display: block;
    max-height: 100%;
    max-width: 100%;
    width: auto;
  }
  
  .text {
    font-size: 30px;
    position: absolute;
  }    
`;
