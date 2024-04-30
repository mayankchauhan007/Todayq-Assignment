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
import food from "../assets/foods.jpg";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { User, userDetailsState, userState } from "../Store/Atoms/atoms";
import React from "react";
import axios from "axios";

function Signin() {
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

    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");

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
                        <SignInCard
                            email={email}
                            setEmail={setEmail}
                            password={password}
                            setPassword={setPassword}
                        />
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

function SignInCard({ email, setEmail, password, setPassword }) {
    const [userDetails, setUserDetails] = useRecoilState(userDetailsState);
    const navigate = useNavigate();
    return (
        <Card
            elevation={10}
            sx={{
                margin: "1vw",
                marginBottom: "1vw",
                marginTop: "1vw",
                maxWidth: "70vw",
                maxHeight: "70vh",

                marginRight: "10px",
                padding: 2,
                display: "flex",
                justifyContent: "center",
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
                    Welcome to Insta Food
                </Typography>
                <Typography
                    gutterBottom
                    sx={{
                        fontFamily: "Droid Sans",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    Sign In Below
                </Typography>
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
                <br></br>
                <br />
                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={async () => {
                        try {
                            const response = await axios.post(
                                "http://localhost:3000/user/login",
                                {
                                    email,
                                    password,
                                }
                            );
                            console.log(response.data);
                            console.log("this is the response");
                            if (response.status === 200) {
                                const { token, user } = response.data;
                                localStorage.setItem("token", token);

                                setUserDetails({
                                    _id: user._id,
                                    name: user.name,
                                    email: user.email,
                                    password: user.password,
                                    address: user.address,
                                    role: user.role,
                                });
                                console.log(userDetails);
                                localStorage.setItem("userEmail", user.email);
                                localStorage.setItem("role", user.role);
                                if (user.role === "admin") {
                                    navigate("/admin-dashboard"); // Redirect to admin dashboard if user is an admin
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
                                "Something went wrong ."
                            );
                        }
                    }}
                >
                    Sign In
                </Button>
                <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ fontFamily: "Droid Sans", marginTop: 2 }}
                >
                    Don't have an Account ?
                </Typography>
                <Link to="/signup">
                    <Button variant="contained" color="success">
                        Sign Up
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
                src={food}
                style={{
                    width: "56vw",
                    height: "600px",
                    borderRadius: "8px",
                    margin: "8px",
                    marginRight: "20px",
                }}
            />
        </div>
    );
}

export default Signin;
