import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // BrowserRouter를 직접 import
import NotFound from './pages/NotFound';
import App from './App';
import reportWebVitals from './reportWebVitals';
import Kakao from './api/Kakao.js';

// Router를 직접 import하여 사용
ReactDOM.render(
  <Router>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/callback/kakaotalk" element={<Kakao />} />
      <Route path="*" element={<NotFound />} /> {/* NotFound 페이지를 위한 Route */}
    </Routes>
  </Router>,
  document.getElementById('root')
);

// reportWebVitals 함수 호출
reportWebVitals();
