import { useRecoilState } from "recoil";
import {
    UserDetails,
    contentsState,
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
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

function Home() {
    const [contents, setContents] = useRecoilState(contentsState);
    const [userDetails, setUserDetails] =
        useRecoilState<UserDetails>(userDetailsState);
    type Quantities = Record<string, number>;
    const [initialQuantities, setInitialQuantities] = useState<Quantities>({});
    const navigate = useNavigate();

    const handleQuantityChange = (event, contentId) => {
        const selectedValue = event.target.value; // Get the selected value from the event
        setInitialQuantities({
            ...initialQuantities,
            [contentId]: selectedValue,
        }); // Update quantity state for the specific content item
    };

    const init = async () => {
        const response = await axios.get("http://localhost:3000/contents/");
        console.log(response.data);
        setContents(response.data);

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
            contents.map((content) => [content._id, 1])
        );
        setInitialQuantities(quantities);
    };

    React.useEffect(() => {
        init();
    }, []);

    React.useEffect(() => {
        changeInitialQuantity();
    }, [contents]);

    const handleAddToCart = async (contentId: string) => {
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
                            contentId,
                            quantity: initialQuantities[contentId],
                        },
                        {
                            headers: {
                                authorization: token,
                            },
                        }
                    );

                    console.log("Added to cart:", response.data);
                    window.alert("Content Successfully added to cart ");
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
            <br />
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    flexWrap: "wrap",
                    gap: "16px",
                }}
            >
                {contents.map((content) => (
                    <Card key={content._id} sx={{ width: 300 }}>
                        <CardMedia
                            component="img"
                            sx={{ height: "25vh", width: "100%" }}
                            image={content.imageUrl}
                            alt={content.name}
                        />
                        <CardContent>
                            <Typography
                                gutterBottom
                                variant="h5"
                                component="div"
                            >
                                {content.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {content.category}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {content.description}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Price: Rs {content.price}
                            </Typography>
                            <br />
                            <Button
                                variant="contained"
                                onClick={() => handleAddToCart(content._id)}
                            >
                                Add to Cart
                            </Button>

                            <FormControl sx={{ marginLeft: 4 }}>
                                <Select
                                    labelId={`quantity-label-${content._id}`}
                                    id={`quantity-select-${content._id}`}
                                    value={initialQuantities[content._id] || 1} // Use quantity state for the specific content item
                                    onChange={(event) =>
                                        handleQuantityChange(event, content._id)
                                    } // Pass content ID to handleQuantityChange
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
