import React, { useState, useEffect } from 'react';
import './Gallery.css';

const Gallery = () => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await fetch('/api/gallery');
        if (res.ok) {
          const data = await res.json();
          setImages(data);
        }
      } catch (error) {
        console.error('Error fetching gallery:', error);
      }
    };
    fetchGallery();
  }, []);

  if (images.length === 0) return null; // Don't show section if no images

  return (
    <section id="gallery" className="section bg-main">
      <div className="container">
        <span className="section-subtitle reveal text-center">Our Facilities</span>
        <h2 className="section-title reveal delay-100 text-center">Hospital Gallery</h2>
        
        <div className="gallery-masonry reveal delay-200 mt-5">
          {images.map((img) => (
            <div key={img.id} className="gallery-item">
              <img src={img.url} alt={img.caption || "Hospital Facility"} loading="lazy" />
              {img.caption && (
                <div className="gallery-overlay">
                  <span>{img.caption}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Gallery;
