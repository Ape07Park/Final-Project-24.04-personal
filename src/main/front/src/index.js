import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route } from 'react-router-dom'; // BrowserRouter를 사용

import NotFound from './pages/NotFound';
import App from './App';
import reportWebVitals from './reportWebVitals';
import Kakao from './api/kakao.js';

const root = document.getElementById('root');

const router = (
  <BrowserRouter> {/* BrowserRouter로 감싸기 */}
    <Routes>
      <Route path="*" element={<App />} />
      <Route path="/callback/kakaotalk" element={<Kakao />} />
      <Route path="/home/*" element={<App />} />
      <Route path="/user/signup/*" element={<App />} /> {/* App 컴포넌트를 /signup 경로에도 렌더링 */}
      <Route path="/user/signin/*" element={<App />} /> {/* App 컴포넌트를 /signin 경로에도 렌더링 */}
      <Route path="/user/UserInfo/*" element={<App />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
);

ReactDOM.render(router, root);
reportWebVitals();
