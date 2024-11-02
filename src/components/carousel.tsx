import React, { useState, useEffect } from 'react';
import classNames from 'classnames';

interface CarouselProps {
  images: {
    large: string;
    small: string;
  }[];
}

const Carousel: React.FC<CarouselProps> = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrevClick = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  };

  const handleNextClick = () => {
    setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
  };

  const handleThumbnailClick = (index: number) => {
    setCurrentIndex(index);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        handlePrevClick();
      } else if (event.key === 'ArrowRight') {
        handleNextClick();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className="carousel-container">
      <div className="carousel">
        <button onClick={handlePrevClick} className="carousel-button prev-button">Prev</button>
        <img src={images[currentIndex].large} alt={`Slide ${currentIndex}`} className="carousel-image" />
        <button onClick={handleNextClick} className="carousel-button next-button">Next</button>
      </div>
      <div className="carousel-thumbnails">
        {images.map((image, index) => (
          <div 
            className={classNames('carousel-thumbnail', {'is-active': index === currentIndex})} key={index}
          >
          <img
            src={image.small}
            alt={`Thumbnail ${index}`}
            onClick={() => handleThumbnailClick(index)}
          />
        </div>
        ))}
      </div>
    </div>
  );
};

export default Carousel;
