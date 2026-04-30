import React from 'react';
import './Service.css';
const Servicesection = () => {
  const services = [
    { title: "Frequently Asked Questions", desc: "Updates on safe Shopping in our Stores", image:'/Shopping.jpg' },
    { title: "Online Payment Process", desc: "Secure transactions with multiple methods", image:'/payment.jpg' },
    { title: "Home Delivery Options", desc: "Fast and reliable shipping to your door", image:'/Delivery.jpg' }
  ];
  return (
    <section className="services-section">
      <h2>Services To Help You Shop</h2>
      <div className="services-grid">
        {services.map(service => (
          <div key={service.title} className="service-card">
            <div className="service-header">
               <div className="service-text">
                <h3>{service.title}</h3>
                <p>{service.desc}</p>
              </div>
            </div>
            
            <div className="service-image-container">
              <img src={service.image} alt={service.title} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
export default Servicesection;