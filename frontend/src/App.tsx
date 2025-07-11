import './App.css'
import { Routes, Route } from 'react-router-dom';
import Home from '@pages/Home';
import Shop from '@pages/Shop';
import BookDetails from '@pages/BookDetails';
import About from '@pages/About';
import Cart from '@pages/Cart';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/shop" element={<Shop />} />
      <Route path="/books/:id" element={<BookDetails />} />
      <Route path="/about" element={<About />} />
      <Route path="/cart" element={<Cart />} />
    </Routes>
  )
}

export default App
