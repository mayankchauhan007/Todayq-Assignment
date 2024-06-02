import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import Signup from "./Components/Signup";
import Signin from "./Components/Signin";
import Home from "./Components/Home";
import BuyItem from "./Components/BuyItem";
import { useRecoilValue } from "recoil";
import { userDetailsState } from "./Store/Atoms/atoms";
import AdminDashboard from "./Components/AdminDashboard";
import { AddContent } from "./Components/AddContent";
import { UpdateContent } from "./Components/UpdateContent";
import Navbar from "./Components/Appbar";
import Unauthorized from "./Components/Unauthorized";
import Footer from "./Components/Footer";
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
                {role === "admin" ? (
                    <Route
                        path="/admin-dashboard"
                        element={<AdminDashboard />}
                    />
                ) : (
                    <Route path="/admin-dashboard" element={<Unauthorized />} />
                )}

                {/* Route for adding content (admin only) */}
                {role === "admin" ? (
                    <Route
                        path="/admin-dashboard/addContent"
                        element={<AddContent />}
                    />
                ) : (
                    <Route
                        path="/admin-dashboard/addContent"
                        element={<Unauthorized />}
                    />
                )}

                {/* Route for updating content (admin only) */}
                {role === "admin" ? (
                    <Route
                        path="/admin-dashboard/updateContent/:contentId"
                        element={<UpdateContent />}
                    />
                ) : (
                    <Route
                        path="/admin-dashboard/updateContent/:contentId"
                        element={<Unauthorized />}
                    />
                )}

                {/* Route for buying items */}
                {role === "user" ? (
                    <Route
                        path="/buy/:contentId/:quantity"
                        element={<BuyItem />}
                    />
                ) : (
                    <Route
                        path="/buy/:contentId/:quantity"
                        element={<Unauthorized />}
                    />
                )}

                {/* Route for unauthorized access */}
                <Route path="/unauthorized" element={<Unauthorized />} />
            </Routes>
            <Footer />
        </Router>
    );
}

export default App;
