import { useRecoilState } from "recoil";
import { foodsState } from "../Store/Atoms/atoms";
import Navbar from "./Appbar";
import axios from "axios";
import {
    Button,
    Card,
    CardContent,
    CardMedia,
    Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import React from "react";

function AdminDashboard() {
    const [foods, setFoods] = useRecoilState(foodsState);
    const navigate = useNavigate();

    React.useEffect(() => {}, []);

    const init = async () => {
        const response = await axios.get("http://localhost:3000/foods/");
        console.log(response.data);
        setFoods(response.data);
    };

    React.useEffect(() => {
        init();
    }, []);

    const deleteFood = async (_id: string) => {
        try {
            console.log(_id);
            const response = await axios.delete(
                "http://localhost:3000/foods/" + _id,
                {
                    headers: {
                        authorization: localStorage.getItem("token"),
                    },
                }
            );
            console.log("Food deleted :", response.data); // Refresh cart items after adding
            init();
        } catch (error) {
            console.error("Error deleting food:", error);
        }
    };

    return (
        <div style={{display:'flex', justifyContent:'center',flexDirection:'column',alignItems:'center'}}>
            <br />
            <Button
                variant="contained"
                color='success'
                onClick={() => navigate("/admin-dashboard/addFood")}
            >
                Add new food
            </Button>
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
                            sx={{ height: "30vh", width: "100%" }}
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
                            <Button
                                variant="contained"
                                onClick={() =>
                                    navigate(
                                        "/admin-dashboard/updateFood/" +
                                            food._id
                                    )
                                }
                            >
                                Update
                            </Button>
                            <Button
                                sx={{ marginLeft: 2 }}
                                variant="contained"
                                onClick={() => deleteFood(food._id)}
                            >
                                Delete Food
                            </Button>
                            <br />
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}

export default AdminDashboard;
