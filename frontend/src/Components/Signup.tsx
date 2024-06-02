import {
    Button,
    Card,
    CardContent,
    Grid,
    TextField,
    Typography,
    useMediaQuery,
} from "@mui/material";
import WebFont from "webfontloader";
import instacontent from "../assets/instacontent.png";
import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useRecoilState } from "recoil";
import { userDetailsState } from "../Store/Atoms/atoms";

function Signup() {
    useEffect(() => {
        WebFont.load({
            google: {
                families: [
                    "Droid Sans",
                    "Chilanka",
                    "Amita",
                    "Arvo",
                    "Cagliostro",
                    "Bold",
                    "Baloo Tamma",
                    "Ultra",
                    "Rubik",
                    "Ubuntu",
                ],
            },
        });
    }, []);

    const isMdScreen = useMediaQuery("(min-width: 600px)");
    return (
        <>
            <link rel="preconnect" href="https://fonts.gstatic.com" />
            <link
                href="https://fonts.googleapis.com/css2?family=Hanalei+Fill&display=swap"
                rel="stylesheet"
            />

            <div>
                <Grid container>
                    {/* First Grid */}
                    <Grid
                        item
                        xs={12}
                        sm={6}
                        md={5}
                        sx={{ display: "flex", justifyContent: "center" }}
                    >
                        <SignupCard />
                    </Grid>

                    {isMdScreen && (
                        <Grid item xs={12} sm={6} md={7}>
                            <ImageCard />
                        </Grid>
                    )}
                </Grid>
            </div>
        </>
    );
}

function SignupCard() {
    const [name, setName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [address, setAddress] = React.useState("");
    const navigate = useNavigate();

    const [userDetails, setUserDetails] = useRecoilState(userDetailsState);
    return (
        <Card
            elevation={10}
            sx={{
                margin: "4vw",
                marginBottom: "1vw",
                marginTop: "1vw",
                marginRight: "10px",
                maxWidth: "70vw",
                maxHeight: "95vh",
                padding: 2,
            }}
        >
            <CardContent>
                <Typography
                    variant="h5"
                    gutterBottom
                    sx={{
                        fontFamily: "Rubik",
                        color: "#3b9ef5",
                        textShadow: "-1px 1px #7b9488",
                        alignContent: "center",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    Welcome to Todayq Content Offerings
                </Typography>
                <Typography
                    gutterBottom
                    sx={{
                        fontFamily: "Rubik",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    Get Started Now .. Sign Up Below
                </Typography>
                <TextField
                    fullWidth
                    label="Name"
                    margin="normal"
                    onChange={(event) => {
                        setName(event.target.value);
                    }}
                />
                <TextField
                    fullWidth
                    label="Email"
                    margin="normal"
                    onChange={(event) => {
                        setEmail(event.target.value);
                    }}
                />
                <TextField
                    fullWidth
                    label="Password"
                    type="password"
                    margin="normal"
                    onChange={(event) => {
                        setPassword(event.target.value);
                    }}
                />
                <TextField
                    fullWidth
                    label="Address"
                    multiline
                    rows={2}
                    margin="normal"
                    onChange={(event) => {
                        setAddress(event.target.value);
                    }}
                />
                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={async () => {
                        try {
                            const response = await axios.post(
                                "http://localhost:3000/user/signup",
                                {
                                    name,
                                    email,
                                    password,
                                    address,
                                }
                            );
                            const { token, user } = response.data;
                            if (response.status === 200) {
                                setUserDetails({
                                    _id: user._id,
                                    name: user.name,
                                    email: user.email,
                                    password: user.password,
                                    address: user.address,
                                    role: user.role,
                                    purchaseHistory: user.purchaseHistory,
                                });

                                localStorage.setItem("token", token);
                                localStorage.setItem("userEmail", user.email);
                                localStorage.setItem("role", user.role);
                                console.log(userDetails);
                                if (user.role === "admin") {
                                    navigate("/"); // Redirect to user dashboard
                                } else {
                                    navigate("/"); // Redirect to user dashboard for other roles
                                }
                            } else {
                                window.alert(
                                    "Sign up failed. Please try again."
                                );
                            }
                        } catch (error) {
                            console.error("Error response:", error);
                            window.alert(
                                "Sign up failed. Please check your network connection and try again."
                            );
                        }
                    }}
                >
                    Sign Up
                </Button>

                <b
                    style={{
                        width: "100%",
                        display: "block",
                        marginTop: "5px",
                    }}
                >
                    Already Registered ?{" "}
                </b>
                <Link to="/login">
                    <Button
                        variant="contained"
                        color="success"
                        sx={{ marginTop: 1 }}
                    >
                        Sign In
                    </Button>
                </Link>
            </CardContent>
        </Card>
    );
}

function ImageCard() {
    return (
        <div>
            <img
                src={instacontent}
                style={{
                    width: "56vw",
                    height: "650px",
                    borderRadius: "8px",
                    margin: "8px",
                    marginRight: "20px",
                }}
            />
        </div>
    );
}

export default Signup;
