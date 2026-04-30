
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product'); 

dotenv.config();

mongoose.connect(process.env.URI)
  .then(() => console.log('MongoDB Connected for Seeding...'))
  .catch(err => console.error(err));

const importData = async () => {
  try {

    await Product.deleteMany(); 
    console.log('🗑️  Old products cleared...');

    console.log('⏳ Fetching products from DummyJSON...');
    const response = await fetch('https://dummyjson.com/products?limit=0');
    const data = await response.json();
    await Product.insertMany(data.products);
    
    console.log('✅ SUCCESS! all Products imported to MongoDB!');
    process.exit(); 
  } catch (error) {
    console.error('🚨 Error importing data:', error);
    process.exit(1); 
  }
};

importData();