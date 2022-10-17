import './App.css';
import ParentComponent from './ParentComponent';
import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Routes>
      <Route path="/tejas" element={<ParentComponent id="tejas"/>}/>
      <Route path="/pinky" element={<ParentComponent id="pinky"/>}/>
    </Routes>
  );
}

export default App;
