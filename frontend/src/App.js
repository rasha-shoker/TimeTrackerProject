import './App.css';
import { Routes, Route } from "react-router-dom";

import Categories from "./components/Categories";
import TimeEntries from "./components/TimeEntries";
import Summary from "./components/Summary";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Categories />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/time-entries" element={<TimeEntries />} />
        <Route path="/summary" element={<Summary />} />
      </Routes>
    </>
  );
}

export default App;
