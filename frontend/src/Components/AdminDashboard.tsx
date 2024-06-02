import { useRecoilState } from "recoil";
import { contentsState } from "../Store/Atoms/atoms";
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
    const [contents, setContents] = useRecoilState(contentsState);
    const navigate = useNavigate();

    React.useEffect(() => {}, []);

    const init = async () => {
        const response = await axios.get("http://localhost:3000/contents/");
        console.log(response.data);
        setContents(response.data);
    };

    React.useEffect(() => {
        init();
    }, []);

    const deleteContent = async (_id: string) => {
        try {
            console.log(_id);
            const response = await axios.delete(
                "http://localhost:3000/contents/" + _id,
                {
                    headers: {
                        authorization: localStorage.getItem("token"),
                    },
                }
            );
            console.log("Content deleted :", response.data); // Refresh cart items after adding
            init();
        } catch (error) {
            console.error("Error deleting content:", error);
        }
    };

    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
                alignItems: "center",
            }}
        >
            <br />
            <Button
                variant="contained"
                color="success"
                onClick={() => navigate("/admin-dashboard/addContent")}
            >
                Add new content
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
                {contents.map((content) => (
                    <Card key={content._id} sx={{ width: 300 }}>
                        <CardMedia
                            component="img"
                            sx={{ height: "30vh", width: "100%" }}
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
                            <Button
                                variant="contained"
                                onClick={() =>
                                    navigate(
                                        "/admin-dashboard/updateContent/" +
                                            content._id
                                    )
                                }
                            >
                                Update
                            </Button>
                            <Button
                                sx={{ marginLeft: 2 }}
                                variant="contained"
                                onClick={() => deleteContent(content._id)}
                            >
                                Delete Content
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
