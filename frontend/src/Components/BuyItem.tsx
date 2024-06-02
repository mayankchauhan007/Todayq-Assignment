import { useNavigate, useParams } from "react-router-dom";
import { Content, userDetailsState } from "../Store/Atoms/atoms";
import {
    Button,
    Card,
    CardContent,
    CardMedia,
    Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRecoilValue } from "recoil";
import { jwtDecode } from "jwt-decode";
export default function BuyItem() {
    const { contentId } = useParams<{ contentId: string }>();
    const { quantity: quantityParam } = useParams<{
        quantity: string | undefined;
    }>();

    const navigate = useNavigate();
    const userDetails = useRecoilValue(userDetailsState);

    const [selectedContent, setSelectedContent] = React.useState<Content>();

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

    const getContentItem = async () => {
        const response = await axios.get(
            "http://localhost:3000/contents/" + contentId
        );
        console.log(response.data);
        setSelectedContent(response.data);
    };

    useEffect(() => {
        const razorpayScript = document.createElement("script");
        razorpayScript.src = "https://checkout.razorpay.com/v1/checkout.js";
        razorpayScript.async = true;

        document.body.appendChild(razorpayScript);

        return () => {
            document.body.removeChild(razorpayScript);
        };
    }, []);

    useEffect(() => {
        getContentItem();
    }, [contentId]);

    if (!selectedContent) {
        return <div>Content not found</div>;
    }
    const paymentHandler = async () => {
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
                        "http://localhost:3000/payment/order/",
                        {
                            amount: Number(
                                selectedContent.price * quantity * 100
                            ),
                            currency: "INR",
                            receipt: "somethisngf1",
                        },
                        {
                            headers: {
                                authorization: token,
                            },
                        }
                    );

                    console.log(response.data);
                    const order = response.data;
                    console.log("order");
                    console.log(order);
                    const options = {
                        key: "rzp_test_Kqzx3o2RzIs61V", // Enter the Key ID generated from the Dashboard
                        amount: order.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
                        currency: "INR",
                        name: "Todayq",
                        description: "Test Transaction using Razorpay",
                        image: "https://example.com/your_logo",
                        order_id: order.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
                        handler: async function (response) {
                            const body = {
                                paymentId: response.razorpay_payment_id,
                                orderId: order.id,
                                razorpaySign: response.razorpay_signature,
                                userId: userDetails._id,
                                contentId,
                                quantity,
                                amount: order.amount / 100,
                            };
                            const verificationResponse = await axios.post(
                                "http://localhost:3000/payment/order/verification",
                                body,
                                {
                                    headers: {
                                        authorization: token,
                                    },
                                }
                            );
                            if (verificationResponse.data.msg === "success") {
                                window.alert("Payment Success");
                                navigate("/");
                            }
                        },
                        prefill: {
                            name: "Mayank Kumar",
                            email: "mayank@example.com",
                            contact: "8433231040",
                        },
                        notes: {
                            address: "Razorpay Corporate Office",
                        },
                        theme: {
                            color: "#0E0F13",
                        },
                    };
                    const razor = new window.Razorpay(options);

                    razor.open();

                    console.log(response.data);
                    console.log(window);
                }
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "100vh",
            }}
        >
            <Card key={selectedContent._id} sx={{ width: 600 }}>
                <h1 style={{ textAlign: "center" }}>Buy Item</h1>
                <CardMedia
                    component="img"
                    sx={{
                        height: "50vh",
                        width: "50vh",
                        margin: "0 auto", // Center the image horizontally
                    }}
                    image={selectedContent.imageUrl}
                    alt={selectedContent.name}
                />
                <CardContent style={{ textAlign: "center" }}>
                    <Typography gutterBottom variant="h5" component="div">
                        {selectedContent.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {selectedContent.category}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {selectedContent.description}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Price: Rs {selectedContent.price}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Quantity:
                        <button
                            style={{
                                fontSize: "14px",
                                padding: "5px 10px",
                                margin: "0 5px",
                                border: "1px solid #ccc",
                                backgroundColor: "#fff",
                                cursor: "pointer",
                                color: "red",
                            }}
                            onClick={handleDecrement}
                        >
                            -
                        </button>
                        {quantity}
                        <button
                            style={{
                                fontSize: "14px",
                                padding: "5px 10px",
                                margin: "0 5px",
                                border: "1px solid #ccc",
                                backgroundColor: "#fff",
                                cursor: "pointer",
                                color: "green",
                            }}
                            onClick={handleIncrement}
                        >
                            +
                        </button>
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Deliver to Address : {userDetails.address}
                    </Typography>
                    <br />
                    <Button variant="contained" onClick={paymentHandler}>
                        Proceed to Pay {selectedContent.price * quantity}
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
