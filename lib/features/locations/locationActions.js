import { createAsyncThunk } from "@reduxjs/toolkit";
import { getCookie } from "../../../app/helpers/storage";
import axios from "axios";

const fetchAllLocations = createAsyncThunk(
  "locations/fetchAllLocations",
  async (_, { rejectWithValue }) => {
    const token = getCookie("token") || window?.sessionStorage.getItem("token");
    try {
      const { data } = await axios.get(
        "https://yardmanager-be.vercel.app/api/locations/all",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// Fetch locations by page
const fetchLocationsByPage = createAsyncThunk(
  "locations/fetchLocationsByPage",
  async (body, { rejectWithValue }) => {
    const token = getCookie("token") || window?.sessionStorage.getItem("token");
    let params;

    if (body.search) {
      params = `search=${body.search}`;
    } else if (body.page && body.limit) {
      params = `page=${body.page}&limit=${body.limit}`;
    }
    try {
      const { data } = await axios.get(
        `https://yardmanager-be.vercel.app/api/locations/paginate?${params}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// ADd location api
const addLocation = createAsyncThunk(
  "locations/addLocation",
  async (body, { rejectWithValue }) => {
    const token = getCookie("token") || window?.sessionStorage.getItem("token");
    try {
      const { data } = await axios.post(
        "https://yardmanager-be.vercel.app/api/locations/new",
        body,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// Delete location
const deleteLocation = createAsyncThunk(
  "locations/deleteLocation",
  async (id, { rejectWithValue }) => {
    const token = getCookie("token") || window?.sessionStorage.getItem("token");
    try {
      const { data } = await axios.delete(
        `https://yardmanager-be.vercel.app/api/locations/s/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// Update location api
const updateLocation = createAsyncThunk(
  "locations/updateLocation",
  async (body, { rejectWithValue }) => {
    const token = getCookie("token") || window?.sessionStorage.getItem("token");
    try {
      const { data } = await axios.put(
        `https://yardmanager-be.vercel.app/api/locations/s/${body.id}`,
        body.formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
// Search location by name
const searchLocationByName = createAsyncThunk(
  "locations/searchLocationByName",
  async (searchValue, { rejectWithValue }) => {
    const token = getCookie("token") || window?.sessionStorage.getItem("token");
    try {
      const { data } = await axios.get(
        `https://yardmanager-be.vercel.app/api/locations/search?name=${searchValue}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
export {
  fetchAllLocations,
  addLocation,
  deleteLocation,
  updateLocation,
  fetchLocationsByPage,
  searchLocationByName,
};
