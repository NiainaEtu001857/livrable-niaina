import axios from "axios";
import { API_URL } from "../Api";

export const getWizard = async () => {
  const token = localStorage.getItem("token");

  const res = await axios.get(`${API_URL}/wizard`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};