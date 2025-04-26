import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import AIContentGenerator from './components/AIContentGenerator';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/ai-generate" element={<AIContentGenerator />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
