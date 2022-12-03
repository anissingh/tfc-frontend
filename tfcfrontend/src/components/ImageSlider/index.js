import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css'
import {useState} from "react";

const ImageSlider = ({slides}) => {

    const [currentIndex, setCurrentIndex] = useState(0)

    const goToPrevious = () => {
        const newIndex = currentIndex === 0 ? slides.length - 1 : currentIndex - 1
        setCurrentIndex(newIndex)
    }

    const goToNext = () => {
        const newIndex = currentIndex === slides.length - 1 ? 0 : currentIndex + 1
        setCurrentIndex(newIndex)
    }

    const goToSlide = (slideIndex) => {
        setCurrentIndex(slideIndex)
    }

    return (
        <div className="slider">
            <div className="left-arrow" onClick={goToPrevious}>&lt;</div>
            <div className="right-arrow" onClick={goToNext}>&gt;</div>
            <div className="slide" style={{backgroundImage: `url(${slides[currentIndex]})`}}></div>
            <div className="dot-container">
                {slides.map((slides, slideIndex) => (
                    <div key={slideIndex} className="dot" onClick={() => goToSlide(slideIndex)}>&#9679;</div>
                ))}
            </div>
        </div>
    )

}

export default ImageSlider;