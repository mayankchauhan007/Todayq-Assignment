import { atom } from "recoil";

export interface Content {
    _id: string;
    name: string;
    category: string;
    description: string;
    imageUrl: string;
    price: number;
}

export interface UserDetails {
    _id: string;
    name: string;
    email: string;
    password: string;
    address: string;
    role: string;
    purchaseHistory: string[];
}

export interface User {
    isLoading: boolean;
    userEmail: string | null;
    name: string | null;
}

export const userDetailsState = atom<UserDetails>({
    key: "userDetailsState",
    default: {
        _id: "",
        name: "",
        email: "",
        password: "",
        address: "",
        role: "",
        purchaseHistory: [],
    },
});

export const userState = atom<User>({
    key: "userState",
    default: {
        isLoading: true,
        userEmail: null,
        name: null,
    },
});

export const contentsState = atom<Content[]>({
    key: "contentsState",
    default: [],
});
