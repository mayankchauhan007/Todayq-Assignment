import {
    Card,
    CardContent,
    Typography,
    TextField,
    Button,
} from "@mui/material";
import axios from "axios";
import { useState } from "react";

export const AddFood = () => {
    const [foodName, setFoodName] = useState("");
    const [category, setCategory] = useState("");
    const [description, setDescription] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [price, setPrice] = useState(0);
    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "100vh",
            }}
        >
            <Card
                elevation={10}
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "40%",
                    minHeight: "200px", // Adjust height as needed
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
                        Add New Food Item
                    </Typography>

                    <TextField
                        fullWidth
                        label="Food Name"
                        margin="normal"
                        onChange={(event) => {
                            setFoodName(event.target.value);
                        }}
                    />
                    <TextField
                        fullWidth
                        label="Category"
                        margin="normal"
                        onChange={(event) => {
                            setCategory(event.target.value);
                        }}
                    />
                    <TextField
                        fullWidth
                        label="Description"
                        margin="normal"
                        onChange={(event) => {
                            setDescription(event.target.value);
                        }}
                    />
                    <TextField
                        fullWidth
                        label="Image Url"
                        margin="normal"
                        onChange={(event) => {
                            setImageUrl(event.target.value);
                        }}
                    />
                    <TextField
                        fullWidth
                        label="Price"
                        margin="normal"
                        onChange={(event) => {
                            setPrice(parseInt(event.target.value));
                        }}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={async () => {
                            try {
                                const token  = localStorage.getItem('token');
                                const response = await axios.post(
                                    "http://localhost:3000/foods/",
                                    {
                                        name: foodName,
                                        category,
                                        description,
                                        price,
                                        imageUrl,
                                        
                                    },
                                    {
                                        headers: {
                                            authorization: token,
                                        },
                                    }
                                );

                                if (response.status === 200) {
                                    console.log(response.data);
                                    window.alert("Food added successfully");
                                } else {
                                    window.alert(
                                        "Sign up failed. Please try again."
                                    );
                                }
                            } catch (error) {
                                console.error("Error response:", error);
                                window.alert(error);
                            }
                        }}
                    >
                        Add Food
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
};
