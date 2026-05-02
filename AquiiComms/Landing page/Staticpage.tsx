import React from 'react'
import { Product } from './types';
type StaticProps = {
  title: string;
  content: string; 
  image?: string; 
};


const StaticPage = ({ title, content, image }:StaticProps) => (
  <div style={{ alignItems:'center', textAlign:'center', maxWidth: '800px', margin: '0 auto', padding: '80px 20px', minHeight: '60vh' }}>
    <h1 style={{ marginBottom: '30px' }}>{title}</h1>
    <p style={{ lineHeight: '1.8', color: '#555' }}>{content}</p>
    <img style={{ width:'60vw', height:'80vh' }} src={image} alt="delivery image" />
  </div>
);

export default StaticPage;