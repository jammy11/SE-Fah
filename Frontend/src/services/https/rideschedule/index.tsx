import { RideScheduleInterface } from "../../../../interfaces/IRideSchedule";

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

async function GetRideSchedules() {
    const requestOptions = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    };

    return await fetchData(`${apiUrl}/rideschedules`, requestOptions);
}

async function GetRideScheduleById(id: number | undefined) {
    if (id === undefined) return false;

    const requestOptions = {
        method: "GET",
    };

    return await fetchData(`${apiUrl}/rideschedule/${id}`, requestOptions);
}

async function CreateRideSchedule(data: RideScheduleInterface) {
    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    };

    return await fetchData(`${apiUrl}/rideschedules`, requestOptions);
}

async function UpdateRideSchedule(data: RideScheduleInterface) {
    const requestOptions = {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    };

    return await fetchData(`${apiUrl}/rideschedules`, requestOptions);
}

async function DeleteRideScheduleByID(id: number | undefined) {
    if (id === undefined) return false;

    const requestOptions = {
        method: "DELETE",
    };

    return await fetchData(`${apiUrl}/rideschedules/${id}`, requestOptions);
}

export {
    GetRideSchedules,
    GetRideScheduleById,
    CreateRideSchedule,
    UpdateRideSchedule,
    DeleteRideScheduleByID,
};
