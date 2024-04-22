import { useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { Food, foodsState } from "../Store/Atoms/atoms";
import {
    Button,
    Card,
    CardContent,
    CardMedia,
    Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import axios from "axios";
export default function BuyItem() {
    const { foodId } = useParams<{ foodId: string }>();
    const { quantity: quantityParam } = useParams<{
        quantity: string | undefined;
    }>();

    const [selectedFood, setSelectedFood] = React.useState<Food>();


    const initialQuantity = 0;

    const [quantity, setQuantity] = useState<number>(
        parseInt(quantityParam || initialQuantity.toString(), 10)
    );

    const handleIncrement = () => {
        setQuantity((prevQuantity) => prevQuantity + 1);
    };

    const handleDecrement = () => {
        if (quantity > 1) {
            setQuantity((prevQuantity) => prevQuantity - 1);
        }
    };

    const getFoodItem = async () =>{
        const response = await axios.get("http://localhost:3000/foods/"+foodId);
        console.log(response.data);
        setSelectedFood(response.data);
    }

    useEffect(() => {
      getFoodItem();
    }, [])
    

    if (!selectedFood) {
        return <div>Food not found</div>;
    }
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
            <Card key={selectedFood._id} sx={{ width: 600 }}>
                <h1 style={{ textAlign: 'center' }}>Buy Item</h1>
                <CardMedia
                    component="img"
                    sx={{
                        height: '50vh',
                        width: '50vh',
                        margin: '0 auto', // Center the image horizontally
                    }}
                    image={selectedFood.imageUrl}
                    alt={selectedFood.name}
                />
                <CardContent style={{ textAlign: 'center' }}>
                    <Typography gutterBottom variant="h5" component="div">
                        {selectedFood.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {selectedFood.category}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {selectedFood.description}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Price: ${selectedFood.price}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Quantity:
                        <button
                            style={{
                                fontSize: '14px',
                                padding: '5px 10px',
                                margin: '0 5px',
                                border: '1px solid #ccc',
                                backgroundColor: '#fff',
                                cursor: 'pointer',
                                color: 'red',
                            }}
                            onClick={handleDecrement}
                        >
                            -
                        </button>
                        {quantity}
                        <button
                            style={{
                                fontSize: '14px',
                                padding: '5px 10px',
                                margin: '0 5px',
                                border: '1px solid #ccc',
                                backgroundColor: '#fff',
                                cursor: 'pointer',
                                color: 'green',
                            }}
                            onClick={handleIncrement}
                        >
                            +
                        </button>
                    </Typography>
                    <br />
                    <Button variant="contained">Buy Now</Button>
                </CardContent>
            </Card>
        </div>
    );
}


