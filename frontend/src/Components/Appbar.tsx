import React, { useEffect, useState } from "react";
import {
    Box,
    Toolbar,
    IconButton,
    Typography,
    Button,
    AppBar,
    Avatar,
    Popover,
    List,
    ListItem,
    ListItemText,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Food, User } from "../Store/Atoms/atoms";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Navbar({ email, name, userDetails, setUserDetails, foods }) {
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);
    const [cartItems, setCartItems] = useState([]);
    const [cartPopoverOpen, setCartPopoverOpen] = useState(false);
    const [filtered, setFiltered] = useState([]);

    const [filteredFoods, setFilteredFoods] = useState([]);

    const open = Boolean(anchorEl);
    const id = open ? "profile-popover" : undefined;
    const cartPopoverId = "cart-popover";

    const handleMenuClick = async (event) => {
        setAnchorEl(event.currentTarget);
        await fetchCartItems();
    };

    const handleClose = () => {
        setAnchorEl(null);
        setCartPopoverOpen(false); // Close cart items popover when closing main popover
    };

    const handleCartClick = async () => {
        setCartPopoverOpen(true);
        await fetchCartItems(); // Fetch cart items when opening cart popover
    };

    const fetchCartItems = async () => {
        try {
            const response = await axios.get(
                "http://localhost:3000/cart/" + userDetails._id
            );
            const items = response.data.items;
            setCartItems(items);

            const filtered = foods.filter((food) =>
                items.some((item) => item.foodId === food._id)
            );

            setFiltered(filtered);

            const filteredWithQuantity = filtered.map((food) => ({
                ...food,
                quantity: items.find((item) => item.foodId === food._id)
                    .quantity,
            }));

            setFilteredFoods(filteredWithQuantity);

            console.log(filtered);
            console.log("filtered foods ");
        } catch (error) {
            console.error("Error fetching cart items:", error);
        }
    };

    useEffect(() => {
        if (open) {
            console.log(cartItems);
        }
    }, [open]);

    return (
        <>
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="static">
                    <Toolbar>
                        <IconButton
                            size="large"
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            sx={{ mr: 2 }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography
                            variant="h6"
                            component="div"
                            sx={{ flexGrow: 1 }}
                        >
                            InstaFood
                        </Typography>
                        {email ? (
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                }}
                            >
                                <Button
                                    color="inherit"
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
                                    }}
                                >
                                    Logout
                                </Button>
                                <IconButton
                                    aria-describedby={id}
                                    onClick={handleMenuClick}
                                    color="inherit"
                                >
                                    <Avatar
                                        alt={name}
                                        src="https://t4.ftcdn.net/jpg/04/83/90/95/360_F_483909569_OI4LKNeFgHwvvVju60fejLd9gj43dIcd.jpg"
                                    />
                                </IconButton>
                                <Popover
                                    id={id}
                                    open={open}
                                    anchorEl={anchorEl}
                                    onClose={handleClose}
                                    anchorOrigin={{
                                        vertical: "bottom",
                                        horizontal: "right",
                                    }}
                                    transformOrigin={{
                                        vertical: "top",
                                        horizontal: "right",
                                    }}
                                >
                                    <List>
                                        <ListItem button>
                                            <ListItemText primary="My Profile" />
                                        </ListItem>
                                        <ListItem
                                            button
                                            onClick={handleCartClick}
                                        >
                                            <ListItemText primary="My Cart" />
                                        </ListItem>
                                    </List>
                                </Popover>
                                <Popover
                                    id={cartPopoverId}
                                    open={cartPopoverOpen}
                                    anchorEl={anchorEl}
                                    onClose={() => setCartPopoverOpen(false)}
                                    anchorOrigin={{
                                        vertical: "bottom",
                                        horizontal: "right",
                                    }}
                                    transformOrigin={{
                                        vertical: "top",
                                        horizontal: "right",
                                    }}
                                >
                                    <List>
                                        {filteredFoods.map((food, index) => (
                                            <ListItem key={index}>
                                                <ListItemText
                                                    primary={`Name: ${food.name}`}
                                                    secondary={`Description: ${food.description}, Price: $${food.price}, Quantity: ${food.quantity}`}
                                                />
                                                <Button
                                                    variant="contained"
                                                    color="secondary"
                                                    onClick={async () => {
                                                        try {
                                                            await axios.delete(
                                                                `http://localhost:3000/cart/${userDetails._id}/${food._id}`
                                                            );
                                                            // Refresh cart items after deleting
                                                            await fetchCartItems();
                                                            console.log(
                                                                "Item deleted successfully"
                                                            );
                                                        } catch (error) {
                                                            console.error(
                                                                "Error deleting item:",
                                                                error
                                                            );
                                                        }
                                                    }}
                                                >
                                                    Delete
                                                </Button>
                                                <Button
                                                    component={Link}
                                                    to={`/buy/${food._id}/${food.quantity}`}
                                                    variant="contained"
                                                    color="primary"
                                                >
                                                    Proceed to Buy
                                                </Button>
                                            </ListItem>
                                        ))}
                                    </List>
                                </Popover>
                            </div>
                        ) : (
                            <p>Please log in to continue.</p>
                        )}
                        {!email && (
                            <div>
                                <Button
                                    color="inherit"
                                    onClick={() => {
                                        navigate("/login");
                                    }}
                                >
                                    Login
                                </Button>
                                <Button
                                    color="inherit"
                                    onClick={() => {
                                        navigate("/signup");
                                    }}
                                >
                                    Sign Up
                                </Button>
                            </div>
                        )}
                    </Toolbar>
                </AppBar>
            </Box>
        </>
    );
}

export default Navbar;
