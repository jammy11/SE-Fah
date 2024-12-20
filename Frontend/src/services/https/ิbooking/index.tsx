import { BookingInterface } from "../../../interfaces/IBooking";

const apiUrl = "http://localhost:3036";

// Helper function for handling fetch requests
const fetchData = async (url: string, options: RequestInit) => {
    try {
        const response = await fetch(url, options);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return response.status === 204 ? true : await response.json();
    } catch (error) {
        console.error("Fetch error:", error);
        return false;
    }
};

async function GetBookings() {
    const requestOptions = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    };

    return await fetchData(`${apiUrl}/bookings`, requestOptions);
}

async function GetBookingById(id: number | undefined) {
    if (id === undefined) return false;

    const requestOptions = {
        method: "GET",
    };

    return await fetchData(`${apiUrl}/booking/${id}`, requestOptions);
}

async function CreateBooking(data: BookingInterface) {
    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    };

    return await fetchData(`${apiUrl}/bookings`, requestOptions);
}

async function UpdateBooking(data: BookingInterface) {
    const requestOptions = {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    };

    return await fetchData(`${apiUrl}/bookings`, requestOptions);
}

async function DeleteBookingByID(id: number | undefined) {
    if (id === undefined) return false;

    const requestOptions = {
        method: "DELETE",
    };

    return await fetchData(`${apiUrl}/bookings/${id}`, requestOptions);
}

export {
    GetBookings,
    GetBookingById,
    CreateBooking,
    UpdateBooking,
    DeleteBookingByID,
};
