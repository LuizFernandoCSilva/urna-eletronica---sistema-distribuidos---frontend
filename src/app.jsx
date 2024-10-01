import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Votar from "./pages/votacao";
import Resultado from "./pages/results"; 

function App(){
  return(
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/vote" element={<Votar />} />
        <Route path="/results" element={< Resultado/>}/>
      </Routes>
    </Router>
  )
}

export default App;
