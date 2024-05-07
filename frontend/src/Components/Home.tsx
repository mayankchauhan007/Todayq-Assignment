import { useRecoilState } from "recoil";
import {
    UserDetails,
    foodsState,
    userDetailsState,
} from "../Store/Atoms/atoms";
import React, { useState } from "react";
import axios from "axios";

import {
    Button,
    Card,
    CardContent,
    CardMedia,
    FormControl,
    MenuItem,
    Select,
    Typography,
    Paper,
} from "@mui/material";
import Carousel from "react-material-ui-carousel";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

function Home() {
    const [foods, setFoods] = useRecoilState(foodsState);
    const [userDetails, setUserDetails] =
        useRecoilState<UserDetails>(userDetailsState);
    type Quantities = Record<string, number>;
    const [initialQuantities, setInitialQuantities] = useState<Quantities>({});
    const navigate = useNavigate();

    const handleQuantityChange = (event, foodId) => {
        const selectedValue = event.target.value; // Get the selected value from the event
        setInitialQuantities({ ...initialQuantities, [foodId]: selectedValue }); // Update quantity state for the specific food item
    };

    const init = async () => {
        const response = await axios.get("http://localhost:3000/foods/");
        console.log(response.data);
        setFoods(response.data);
        foodLength = foods.length;

        try {
            const response = await axios.get(
                `http://localhost:3000/user/me/${localStorage.getItem(
                    "userEmail"
                )}`
            ); // Adjust the API endpoint as per your backend setup
            setUserDetails(response.data);
            console.log(userDetails);
        } catch (error) {
            console.error("Error fetching user details:", error);
        }
    };

    const changeInitialQuantity = () => {
        const quantities = Object.fromEntries(
            foods.map((food) => [food._id, 1])
        );
        setInitialQuantities(quantities);
    };

    React.useEffect(() => {
        init();
    }, []);

    React.useEffect(() => {
        changeInitialQuantity();
    }, [foods]);

    const handleAddToCart = async (foodId: string) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                window.alert("Please login to continue");
            } else {
                const decodedToken = jwtDecode(token);
                const role = decodedToken.role;
                if (role !== "user") {
                    window.alert("Please login to continue");
                } else {
                    const response = await axios.post(
                        "http://localhost:3000/cart/",
                        {
                            userId: userDetails._id,
                            foodId,
                            quantity: initialQuantities[foodId],
                        },
                        {
                            headers: {
                                authorization: token,
                            },
                        }
                    );

                    console.log("Added to cart:", response.data);
                    window.alert("Food Successfully added to cart ");
                }
            }
            // Refresh cart items after adding
        } catch (error) {
            console.error("Error adding to cart:", error);
        }
    };

    return (
        <div>
            <br />
            <Carousel
                autoPlay={true}
                animation="slide"
                interval={2000}
                sx={{ maxWidth: 1200, margin: "auto" }}
            >
                {foods.slice(0, 5).map((food) => (
                    <Paper
                        key={food._id}
                        style={{
                            position: "relative",
                            width: "100%",
                            paddingBottom: "48%",
                            overflow: "hidden", // Ensure the image doesn't overflow the Paper component
                        }}
                        onClick={() => {
                            const token = localStorage.getItem("token");
                            if (!token) {
                                window.alert("Please login to continue");
                            } else {
                                navigate("/buy/" + food._id + "/" + 1);
                            }
                        }}
                    >
                        <img
                            src={food.imageUrl}
                            alt={food.name}
                            style={{
                                position: "absolute",
                                top: "50%",
                                left: "50%",
                                transform: "translate(-50%, -50%)", // Center the image horizontally and vertically
                                minWidth: "100%", // Ensure the image covers the entire space
                                minHeight: "100%", // Ensure the image covers the entire space
                                objectFit: "cover",
                            }}
                        />
                        <div
                            style={{
                                position: "absolute",
                                bottom: 0,
                                left: 0,
                                width: "100%",
                                background: "rgba(0, 0, 0, 0.5)",
                                color: "#fff",
                                padding: "50px",
                                textAlign: "center",
                            }}
                        >
                            <Typography
                                variant="h6"
                                style={{
                                    fontSize: "4rem",
                                    fontWeight: "bold",
                                }}
                            >
                                {food.name}
                            </Typography>
                            <Typography
                                variant="body1"
                                style={{ fontSize: "1rem" }}
                            >
                                {food.description}
                            </Typography>
                            <Typography
                                variant="body1"
                                style={{ fontSize: "1rem" }}
                            >
                                {"Price: " + food.price}
                            </Typography>
                        </div>
                    </Paper>
                ))}
            </Carousel>

            <br />
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    flexWrap: "wrap",
                    gap: "16px",
                }}
            >
                {foods.map((food) => (
                    <Card key={food._id} sx={{ width: 300 }}>
                        <CardMedia
                            component="img"
                            sx={{ height: "25vh", width: "100%" }}
                            image={food.imageUrl}
                            alt={food.name}
                        />
                        <CardContent>
                            <Typography
                                gutterBottom
                                variant="h5"
                                component="div"
                            >
                                {food.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {food.category}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {food.description}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Price: Rs {food.price}
                            </Typography>
                            <br />
                            <Button
                                variant="contained"
                                onClick={() => handleAddToCart(food._id)}
                            >
                                Add to Cart
                            </Button>

                            <FormControl sx={{ marginLeft: 4 }}>
                                <Select
                                    labelId={`quantity-label-${food._id}`}
                                    id={`quantity-select-${food._id}`}
                                    value={initialQuantities[food._id] || 1} // Use quantity state for the specific food item
                                    onChange={(event) =>
                                        handleQuantityChange(event, food._id)
                                    } // Pass food ID to handleQuantityChange
                                >
                                    <MenuItem value={1}>1</MenuItem>
                                    <MenuItem value={2}>2</MenuItem>
                                    <MenuItem value={3}>3</MenuItem>
                                    <MenuItem value={4}>4</MenuItem>
                                    {/* Add more options as needed */}
                                </Select>
                            </FormControl>
                            <br />
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}

export default Home;
