import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import Signup from "./Components/Signup";
import Signin from "./Components/Signin";
import Home from "./Components/Home";
import BuyItem from "./Components/BuyItem";
function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Signin />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/" element={<Home />} />
                <Route path="/buy/:foodId/:quantity" element={<BuyItem />} />
            </Routes>
        </Router>
    );
}

export default App;
