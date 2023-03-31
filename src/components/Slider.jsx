import React from "react";
import styled from "styled-components";

const StyleSlider = styled.div`
  position: relative;
  border-radius: 3px;
  background: #dddddd;
  height: 15px;
`;

const SliderThumb = styled.div`
  width: 10px;
  height: 25px;
  border-radius: 3px;
  position: relative;
  top: -5px;
  opacity: 0.5;
  background: #823eb7;
  cursor: pointer;
`;

const getPercentage = (current, max) => (100*current) / max;

const getLeft = percentage => `calc(${percentage}% - 5px)`;

const Slider = () => {
  const sliderRef = React.useRef()
  const thumbRef = React.useRef()

  const diff = React.useRef();

  const handleMouseMove = event => {
    let newX = 
      event.clientX -
      diff.current -
      sliderRef.current.getBoundingClientRect().left;

      const end =  sliderRef.current.offsetWidth - thumbRef.current.offsetWidth;

      const start = 0;

      if(newX < start){
        newX = 0;
      }

      if(newX > end){
        newX = end;
      }

      const newPercentage = getPercentage(newX, end);
      thumbRef.current.style.left = getLeft(newPercentage);
  }

  const handleMouseUp = () => {
    document.removeEventListener("mouseup", handleMouseUp);
    document.removeEventListener("mousemove", handleMouseMove);
  }

  const handleMouseDown = event => {
    diff.current = 
      event.clientX - thumbRef.current.getBoundingClientRect().left;
    
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  }

  return(
    <>
      <StyleSlider ref={sliderRef}>
        <SliderThumb ref={thumbRef} onMouseDown={handleMouseDown}/>
      </StyleSlider>
    </>
  );
}

export default Slider;