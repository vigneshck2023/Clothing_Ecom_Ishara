import React from "react";
import payday from "../assets/payday.png";
import carousel_2 from "../assets/carousel_2.png";
import carousel_3 from "../assets/carousel_3.png";

const Carousel = () => {
  return (
    <div
      id="carouselExampleIndicators"
      className="carousel slide"
      data-bs-ride="carousel"
    >
      {/* Indicators */}
      <div className="carousel-indicators">
        <button
          type="button"
          data-bs-target="#carouselExampleIndicators"
          data-bs-slide-to="0"
          className="active"
          aria-current="true"
          aria-label="Slide 1"
        ></button>
        <button
          type="button"
          data-bs-target="#carouselExampleIndicators"
          data-bs-slide-to="1"
          aria-label="Slide 2"
        ></button>
        <button
          type="button"
          data-bs-target="#carouselExampleIndicators"
          data-bs-slide-to="2"
          aria-label="Slide 3"
        ></button>
      </div>
      {/* Slides */}
      <div className="carousel-inner">
        <div className="carousel-item active" data-bs-interval="5000">
          <img
            src={payday}
            className="d-block w-100 mt-4 img-fluid"
            alt="First slide"
          />
        </div>
        <div className="carousel-item" data-bs-interval="5000">
          <img
            src={carousel_2}
            className="d-block w-100 mt-4"
            alt="Second slide"
          />
        </div>
        <div className="carousel-item" data-bs-interval="5000">
          <img
            src={carousel_3}
            className="d-block w-100 mt-4"
            alt="Third slide"
          />
        </div>
      </div>
    </div>
  );
};

export default Carousel;
