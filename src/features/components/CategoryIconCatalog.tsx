// src/features/components/CategoryIconCatalog.tsx

import type { ReactElement } from "react";

import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import AttachMoneyOutlinedIcon from "@mui/icons-material/AttachMoneyOutlined";
import BusinessCenterOutlinedIcon from "@mui/icons-material/BusinessCenterOutlined";
import CardGiftcardOutlinedIcon from "@mui/icons-material/CardGiftcardOutlined";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import CoffeeOutlinedIcon from "@mui/icons-material/CoffeeOutlined";
import CommuteOutlinedIcon from "@mui/icons-material/CommuteOutlined";
import DirectionsCarOutlinedIcon from "@mui/icons-material/DirectionsCarOutlined";
import FlightTakeoffOutlinedIcon from "@mui/icons-material/FlightTakeoffOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import LocalGroceryStoreOutlinedIcon from "@mui/icons-material/LocalGroceryStoreOutlined";
import LocalHospitalOutlinedIcon from "@mui/icons-material/LocalHospitalOutlined";
import MovieOutlinedIcon from "@mui/icons-material/MovieOutlined";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import PetsOutlinedIcon from "@mui/icons-material/PetsOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import RestaurantOutlinedIcon from "@mui/icons-material/RestaurantOutlined";
import SavingsOutlinedIcon from "@mui/icons-material/SavingsOutlined";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import SubscriptionsOutlinedIcon from "@mui/icons-material/SubscriptionsOutlined";
import WaterDropOutlinedIcon from "@mui/icons-material/WaterDropOutlined";

export type CategoryIconOption = {
    value: string;
    label: string;
    icon: ReactElement;
};

export const CATEGORY_ICON_OPTIONS: readonly CategoryIconOption[] = [
    {
        value: "salary",
        label: "Salario",
        icon: <PaymentsOutlinedIcon fontSize="small" />,
    },
    {
        value: "income",
        label: "Ingreso general",
        icon: <AttachMoneyOutlinedIcon fontSize="small" />,
    },
    {
        value: "business",
        label: "Negocio",
        icon: <BusinessCenterOutlinedIcon fontSize="small" />,
    },
    {
        value: "wallet",
        label: "Cartera / efectivo",
        icon: <AccountBalanceWalletOutlinedIcon fontSize="small" />,
    },
    {
        value: "savings",
        label: "Ahorro",
        icon: <SavingsOutlinedIcon fontSize="small" />,
    },
    {
        value: "home",
        label: "Hogar",
        icon: <HomeOutlinedIcon fontSize="small" />,
    },
    {
        value: "utilities",
        label: "Servicios",
        icon: <WaterDropOutlinedIcon fontSize="small" />,
    },
    {
        value: "groceries",
        label: "Supermercado",
        icon: <LocalGroceryStoreOutlinedIcon fontSize="small" />,
    },
    {
        value: "dining",
        label: "Restaurantes",
        icon: <RestaurantOutlinedIcon fontSize="small" />,
    },
    {
        value: "coffee",
        label: "Café",
        icon: <CoffeeOutlinedIcon fontSize="small" />,
    },
    {
        value: "transport",
        label: "Transporte",
        icon: <CommuteOutlinedIcon fontSize="small" />,
    },
    {
        value: "car",
        label: "Auto",
        icon: <DirectionsCarOutlinedIcon fontSize="small" />,
    },
    {
        value: "health",
        label: "Salud",
        icon: <LocalHospitalOutlinedIcon fontSize="small" />,
    },
    {
        value: "education",
        label: "Educación",
        icon: <SchoolOutlinedIcon fontSize="small" />,
    },
    {
        value: "shopping",
        label: "Compras",
        icon: <ShoppingBagOutlinedIcon fontSize="small" />,
    },
    {
        value: "subscriptions",
        label: "Suscripciones",
        icon: <SubscriptionsOutlinedIcon fontSize="small" />,
    },
    {
        value: "entertainment",
        label: "Entretenimiento",
        icon: <MovieOutlinedIcon fontSize="small" />,
    },
    {
        value: "travel",
        label: "Viajes",
        icon: <FlightTakeoffOutlinedIcon fontSize="small" />,
    },
    {
        value: "gifts",
        label: "Regalos",
        icon: <CardGiftcardOutlinedIcon fontSize="small" />,
    },
    {
        value: "pets",
        label: "Mascotas",
        icon: <PetsOutlinedIcon fontSize="small" />,
    },
    {
        value: "bills",
        label: "Recibos / facturas",
        icon: <ReceiptLongOutlinedIcon fontSize="small" />,
    },
    {
        value: "other",
        label: "Otra",
        icon: <CategoryOutlinedIcon fontSize="small" />,
    },
] as const;

export function getCategoryIconOptionByValue(
    value: string | null | undefined
): CategoryIconOption | null {
    if (!value) {
        return null;
    }

    return CATEGORY_ICON_OPTIONS.find((option) => option.value === value) ?? null;
}