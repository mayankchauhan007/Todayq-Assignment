import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import Signup from "./Components/Signup";
import Signin from "./Components/Signin";
import Home from "./Components/Home";
import BuyItem from "./Components/BuyItem";
import { useRecoilValue } from "recoil";
import { userDetailsState } from "./Store/Atoms/atoms";
import AdminDashboard from "./Components/AdminDashboard";
import { AddFood } from "./Components/AddFood";
import { UpdateFood } from "./Components/UpdateFood";
import Navbar from "./Components/Appbar";
import Unauthorized from "./Components/Unauthorized";
function App() {
    const userDetails = useRecoilValue(userDetailsState);
    const role = userDetails.role;
    // console.log(userDetails);
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/login" element={<Signin />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/" element={<Home />} />

                {/* Route for Admin Dashboard */}
                {role === 'admin' ? (
                    <Route path="/admin-dashboard" element={<AdminDashboard />} />
                ) : (
                    <Route path="/admin-dashboard" element={<Unauthorized />} />
                )}

                {/* Route for adding food (admin only) */}
                {role === 'admin' ? (
                    <Route path="/admin-dashboard/addFood" element={<AddFood />} />
                ) : (
                    <Route path="/admin-dashboard/addFood" element={<Unauthorized />} />
                )}

                {/* Route for updating food (admin only) */}
                {role === 'admin' ? (
                    <Route path="/admin-dashboard/updateFood/:foodId" element={<UpdateFood />} />
                ) : (
                    <Route path="/admin-dashboard/updateFood/:foodId" element={<Unauthorized />} />
                )}

                {/* Route for buying items */}
                {role === 'user' ? (
                    <Route path="/buy/:foodId/:quantity" element={<BuyItem />} />
                ) : (
                    <Route path="/buy/:foodId/:quantity" element={<Unauthorized />} />
                )}

                {/* Route for unauthorized access */}
                <Route path="/unauthorized" element={<Unauthorized />} />
            </Routes>
        </Router>
    );
}

export default App;
