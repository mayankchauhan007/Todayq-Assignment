import { Button } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { userDetailsState } from "../Store/Atoms/atoms";

const Unauthorized = () => {
    const [userDetails, setUserDetails] = useRecoilState(userDetailsState);
    const navigate = useNavigate();
    return (
        <div>
            <h1>Unauthorized Access</h1>
            <p>You are not authorized to view this page.</p>
            <Link to="/login">
                <Button
                    color="primary"
                    onClick={() => {
                        localStorage.clear();
                        console.log("logout pressed");
                        setUserDetails({
                            _id: "",
                            name: "",
                            email: "",
                            password: "",
                            address: "",
                            role: "",
                        });
                        navigate("/");
                    }}
                >
                    Login
                </Button>
            </Link>
            <br />
            <Link to="/">Return to Home</Link>
        </div>
    );
};

export default Unauthorized;
