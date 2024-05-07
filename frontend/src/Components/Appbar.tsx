import { useEffect, useState } from "react";
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
    Divider,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import { foodsState, userDetailsState, userState } from "../Store/Atoms/atoms";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useRecoilState, useRecoilValue } from "recoil";
import { jwtDecode } from "jwt-decode";

function Navbar() {
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);
    const [cartItems, setCartItems] = useState([]);
    const [cartPopoverOpen, setCartPopoverOpen] = useState(false);
    const [userDetails, setUserDetails] = useRecoilState(userDetailsState);
    const foods = useRecoilValue(foodsState);
    const email = localStorage.getItem("userEmail");
    const [filtered, setFiltered] = useState([]);

    const [boughtItems, setBoughtItems] = useState([]);
    const [filteredFoods, setFilteredFoods] = useState([]);

    const open = Boolean(anchorEl);
    const id = open ? "profile-popover" : undefined;
    const cartPopoverId = "cart-popover";

    const [profilePopoverOpen, setProfilePopoverOpen] = useState(false);
    const profilePopoverId = "profile-popover";

    const handleProfileClick = async () => {
        setProfilePopoverOpen(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(
            "http://localhost:3000/payment/order/" + userDetails._id,
            {
                headers: {
                    authorization: token,
                },
            }
        );
        console.log("boughtItems");
        console.log(response.data);
        setBoughtItems(response.data);
    };

    
    useEffect(() => {
        const token = localStorage.getItem("token"); // Assuming token is stored in localStorage

        const fetchDataFromApi = async () => {
            try {
                const decodedToken = jwtDecode(token);
                console.log("Decoded Token:", decodedToken);
                const response = await axios.get(
                    `http://localhost:3000/user/me/${decodedToken.email}`
                );
                setUserDetails(response.data);
            } catch (error) {
                console.error("Error fetching user data:", error);
                // Handle error as needed
            }
        };
        if (token) {
            fetchDataFromApi();
        } else {
            console.error("Token not found in localStorage");
        }
    }, [setUserDetails]);

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
            const token = localStorage.getItem("token");
            console.log(userDetails._id);
            const response = await axios.get(
                `http://localhost:3000/cart/${userDetails._id}`,
                { headers: { Authorization: token } } // Pass the Authorization header directly
            );
            console.log(response.data);
            console.log("fetch cart response");
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

            // console.log(filtered);
            // console.log("filtered foods ");
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
                            onClick={() => {
                                if(userDetails.role === 'user'){
                                    navigate("/");
                                }
                                else if( userDetails.role === 'admin') {
                                    navigate("/admin-dashboard")
                                }
                                
                            }}
                        >
                            <HomeIcon />
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
                                            ...userDetails,
                                            _id: "",
                                            name: "",
                                            email: "",
                                            password: "",
                                            address: "",
                                            role: "",
                                        });
                                        navigate("/");
                                    }}
                                >
                                    Logout
                                </Button>

                                {userDetails.role === "user" && (
                                    <>
                                        <IconButton
                                            aria-describedby={id}
                                            onClick={handleMenuClick}
                                            color="inherit"
                                        >
                                            <Avatar src="https://t4.ftcdn.net/jpg/04/83/90/95/360_F_483909569_OI4LKNeFgHwvvVju60fejLd9gj43dIcd.jpg" />
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
                                                <ListItem
                                                    onClick={handleProfileClick}
                                                    button
                                                >
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
                                            onClose={() =>
                                                setCartPopoverOpen(false)
                                            }
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
                                                {filteredFoods.map(
                                                    (food, index) => (
                                                        <ListItem key={index}>
                                                            <ListItemText
                                                                primary={`Food Name: ${food.name}`}
                                                                secondary={` Price: Rs. ${food.price}, Quantity: ${food.quantity}`}
                                                            />
                                                            <Button
                                                                variant="contained"
                                                                color="secondary"
                                                                onClick={async () => {
                                                                    try {
                                                                        const token =
                                                                            localStorage.getItem(
                                                                                "token"
                                                                            );
                                                                        await axios.delete(
                                                                            `http://localhost:3000/cart/${userDetails._id}/${food._id}`,
                                                                            {
                                                                                headers:
                                                                                    {
                                                                                        Authorization:
                                                                                            token,
                                                                                    },
                                                                            }
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
                                                                sx={{
                                                                    marginLeft: 2,
                                                                }}
                                                                component={Link}
                                                                to={`/buy/${food._id}/${food.quantity}`}
                                                                variant="contained"
                                                                color="primary"
                                                                onClick={
                                                                    handleClose
                                                                }
                                                            >
                                                                Buy Item
                                                            </Button>
                                                        </ListItem>
                                                    )
                                                )}
                                            </List>
                                        </Popover>
                                        <Popover
                                            id={profilePopoverId}
                                            open={profilePopoverOpen}
                                            anchorEl={anchorEl}
                                            onClose={() =>
                                                setProfilePopoverOpen(false)
                                            }
                                            anchorOrigin={{
                                                vertical: "bottom",
                                                horizontal: "right",
                                            }}
                                            transformOrigin={{
                                                vertical: "top",
                                                horizontal: "right",
                                            }}
                                        >
                                            <List
                                                style={{
                                                    padding: "16px",
                                                    maxWidth: "300px",
                                                }}
                                            >
                                                <ListItem>
                                                    <ListItemText
                                                        primary="Name"
                                                        secondary={
                                                            userDetails.name
                                                        }
                                                        primaryTypographyProps={{
                                                            style: {
                                                                fontWeight:
                                                                    "bold",
                                                            },
                                                        }}
                                                    />
                                                </ListItem>
                                                <Divider />
                                                <ListItem>
                                                    <ListItemText
                                                        primary="Email"
                                                        secondary={
                                                            userDetails.email
                                                        }
                                                        primaryTypographyProps={{
                                                            style: {
                                                                fontWeight:
                                                                    "bold",
                                                            },
                                                        }}
                                                    />
                                                </ListItem>
                                                <Divider />
                                                <ListItem>
                                                    <ListItemText
                                                        primary="Address"
                                                        secondary={
                                                            userDetails.address
                                                        }
                                                        primaryTypographyProps={{
                                                            style: {
                                                                fontWeight:
                                                                    "bold",
                                                            },
                                                        }}
                                                    />
                                                </ListItem>
                                                <Divider />
                                                <ListItem>
                                                    <ListItemText
                                                        primary="Purchase History"
                                                        primaryTypographyProps={{
                                                            style: {
                                                                fontWeight:
                                                                    "bold",
                                                            },
                                                        }}
                                                    />
                                                </ListItem>
                                                {boughtItems.map(
                                                    (order, index) => (
                                                        <ListItem
                                                            key={index}
                                                            style={{
                                                                marginTop:
                                                                    "8px",
                                                            }}
                                                        >
                                                            <List
                                                                style={{
                                                                    marginLeft:
                                                                        "16px",
                                                                }}
                                                            >
                                                                {order.items.map(
                                                                    (
                                                                        item,
                                                                        i
                                                                    ) => (
                                                                        <ListItem
                                                                            key={
                                                                                i
                                                                            }
                                                                        >
                                                                            <ListItemText
                                                                                primary={`Food Name: ${item.foodId.name}`}
                                                                                secondary={`Amount: ${item.amount}`}
                                                                                primaryTypographyProps={{
                                                                                    style: {
                                                                                        fontWeight:
                                                                                            "bold",
                                                                                        display:
                                                                                            "block",
                                                                                    },
                                                                                }}
                                                                            />
                                                                            <ListItemText
                                                                                primary={`Quantity: ${item.quantity}`}
                                                                            />
                                                                            {/* Add more food details as needed */}
                                                                            {i !==
                                                                                order
                                                                                    .items
                                                                                    .length -
                                                                                    1 && (
                                                                                <Divider />
                                                                            )}
                                                                        </ListItem>
                                                                    )
                                                                )}
                                                            </List>
                                                        </ListItem>
                                                    )
                                                )}
                                            </List>
                                        </Popover>
                                    </>
                                )}
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
