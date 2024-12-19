import { RideInterface } from "../../../interfaces/IRide";

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

async function GetRides() {
    const requestOptions = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    };

    return await fetchData(`${apiUrl}/rides`, requestOptions);
}

async function GetRideById(id: number | undefined) {
    if (id === undefined) return false;

    const requestOptions = {
        method: "GET",
    };

    return await fetchData(`${apiUrl}/ride/${id}`, requestOptions);
}

async function CreateRide(data: RideInterface) {
    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    };

    return await fetchData(`${apiUrl}/rides`, requestOptions);
}

// services/https/ride/index.ts

async function UpdateRide(data: RideInterface) {
    const apiUrl = "http://localhost:3036";  // Update with your actual API URL
  
    const requestOptions = {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    };
  
    try {
      const response = await fetch(`${apiUrl}/rides`, requestOptions);
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      return response.status === 204 ? true : await response.json();
    } catch (error) {
      console.error("Fetch error:", error);
      return false;
    }
  }
  


async function DeleteRideByID(id: number | undefined) {
    if (id === undefined) return false;

    const requestOptions = {
        method: "DELETE",
    };

    return await fetchData(`${apiUrl}/rides/${id}`, requestOptions);
}

async function DeleteRideByName(name: string | undefined) {
    if (name === undefined) return false;

    const requestOptions = {
        method: "DELETE",
    };

    return await fetchData(`${apiUrl}/rides/${name}`, requestOptions);
}

export { GetRides, GetRideById, CreateRide, UpdateRide, DeleteRideByID, DeleteRideByName };
