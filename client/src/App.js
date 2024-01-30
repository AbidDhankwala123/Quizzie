import { useState } from 'react';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import NotFound from './pages/NotFound/NotFound';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PlayQuiz from './pages/PlayQuiz/PlayQuiz';

function App() {
  const [logoutMessage, setLogoutMessage] = useState("");

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login logoutMessage={logoutMessage} setLogoutMessage={setLogoutMessage} />} />
          <Route path="/home" element={<Home setLogoutMessage={setLogoutMessage} />} />
          <Route path="/playQuiz/:playQuizId" element={<PlayQuiz />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
