import React, { useState, useEffect } from 'react'; 
import './Hero.css';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate
  const themes = [
    {
      title: "New Arrival 2026",
      subtitle: "Experience the Future of Audio",
      description: "Premium sound, zero distractions.",
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000",
      accent: "#FFD700"
    },
    {
      title: "Summer Collection 2026",
      subtitle: "Elevate Your Summer Style",
      description: "New arrivals in sustainable fashion.",
      image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=1000",
      accent: "#FF6B6B" 
    },
    {
      title: "Winter Collection 2026",
      subtitle: "Elevate Your Winter Style",
      description: "Multiple arrivals to keep you toasty and stylish.",
      image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&q=80&auto=format&fit=crop",
      accent: "#3182C0" 
    }
  ];

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 2) % themes.length);
    }, 10000);
    return () => clearInterval(timer);
  }, [themes.length]);

  const activeTheme = themes[current];
const scrollToFooter = () => {
  const footer = document.getElementById('footer-section');
  if (footer) {
    footer.scrollIntoView({ behavior: 'smooth' });
  }
};
  return (
    <>
    <section style={{backgroundColor: activeTheme.accent}} className="hero-container">
      <div 
        className="hero-accent-blob" 
        style={{ backgroundColor: activeTheme.accent }}
      ></div>

      <div className="hero-content">
        <span className="badge" style={{ backgroundColor: activeTheme.accent }}>
          {activeTheme.title}
        </span>
        <h1>{activeTheme.subtitle}</h1>
        <p>{activeTheme.description}</p>
        
        <div className="hero-btns">
        <Link to= '/products/all'><button className="primary-btn">Shop Now</button></Link>
        <button onClick={scrollToFooter} className="secondary-btn">Learn More</button> 
        </div>
      </div>

      <div className="hero-image">
        <img 
          key={activeTheme.image} 
          src={activeTheme.image} 
          alt={activeTheme.subtitle} 
        />
      </div>
    </section>
    </>
  );
};

export default Hero;