import React, { useState, useEffect } from 'react';
import { Star, Quote } from 'lucide-react';
import './Testimonials.css';

const Testimonials = () => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch('http://localhost:3001/api/reviews');
        if (res.ok) {
          const data = await res.json();
          setReviews(data);
        }
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };
    fetchReviews();
  }, []);

  return (
    <section id="reviews" className="section subtle-bg-section">
      <div className="container relative z-10">
        <h2 className="section-title reveal">Patient Reviews</h2>
        <div className="rating-summary reveal delay-100">
          <div className="stars">
            <Star fill="#FFD700" color="#FFD700" size={32} />
            <Star fill="#FFD700" color="#FFD700" size={32} />
            <Star fill="#FFD700" color="#FFD700" size={32} />
            <Star fill="#FFD700" color="#FFD700" size={32} />
            <Star fill="#FFD700" color="#FFD700" size={32} />
          </div>
          <h3>5.0 Out of 5 Stars</h3>
          <p>Based on 18 Google Reviews</p>
        </div>

        <div className="testimonials-grid">
          {reviews.map((review, index) => (
            <div className={`testimonial-card reveal delay-${(index + 1) * 100}`} key={review.id}>
              <Quote className="quote-icon" size={40} />
              <div className="stars mb-2">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} fill="#FFD700" color="#FFD700" size={16} />
                ))}
              </div>
              <p className="testimonial-text">"{review.text}"</p>
              <div className="testimonial-author">
                <div className="author-avatar">{review.author.charAt(0)}</div>
                <div>
                  <h4>{review.author}</h4>
                  <span>{review.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
