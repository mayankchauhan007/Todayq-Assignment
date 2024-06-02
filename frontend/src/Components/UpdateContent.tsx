import {
    Card,
    CardContent,
    Typography,
    TextField,
    Button,
} from "@mui/material";
import axios from "axios";
import React from "react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export const UpdateContent = () => {
    const { contentId } = useParams();
    const [contentName, setContentName] = useState("");
    const [category, setCategory] = useState("");
    const [description, setDescription] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [price, setPrice] = useState(0);
    const navigate = useNavigate();

    // Fetch content details using contentId and populate the form fields
    const fetchContentDetails = async () => {
        try {
            const response = await axios.get(
                `http://localhost:3000/contents/${contentId}`
            );
            const contentData = response.data;
            setContentName(contentData.name);
            setCategory(contentData.category);
            setDescription(contentData.description);
            setImageUrl(contentData.imageUrl);
            setPrice(contentData.price);
        } catch (error) {
            console.error("Error fetching content details:", error);
        }
    };

    // useEffect to fetch content details when the component mounts
    React.useEffect(() => {
        fetchContentDetails();
    }, []);

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
                        Update Content Item
                    </Typography>

                    <TextField
                        fullWidth
                        label="Content Name"
                        margin="normal"
                        value={contentName}
                        onChange={(event) => {
                            setContentName(event.target.value);
                        }}
                    />
                    <TextField
                        fullWidth
                        label="Category"
                        margin="normal"
                        value={category}
                        onChange={(event) => {
                            setCategory(event.target.value);
                        }}
                    />
                    <TextField
                        fullWidth
                        label="Description"
                        margin="normal"
                        value={description}
                        onChange={(event) => {
                            setDescription(event.target.value);
                        }}
                    />
                    <TextField
                        fullWidth
                        label="Image Url"
                        margin="normal"
                        value={imageUrl}
                        onChange={(event) => {
                            setImageUrl(event.target.value);
                        }}
                    />
                    <TextField
                        fullWidth
                        label="Price"
                        margin="normal"
                        value={price}
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
                                const token = localStorage.getItem("token");
                                const response = await axios.put(
                                    `http://localhost:3000/contents/${contentId}`,
                                    {
                                        name: contentName,
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
                                    window.alert(
                                        "Content updated successfully"
                                    );
                                    navigate("/admin-dashboard");
                                } else {
                                    window.alert(
                                        "Update failed. Please try again."
                                    );
                                }
                            } catch (error) {
                                console.error("Error response:", error);
                                window.alert(error);
                            }
                        }}
                    >
                        Update Content
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
};
