import { create } from "zustand";
import axios from "../libs/axios";
import { toast } from "react-hot-toast";

export const useProductStore = create((set) => ({
  products: [],
  loading: false,
  setProducts: (products) => set({ products }),

  createProduct: async ({ name, description, price, category, image }) => {
    set({ loading: true });

    try {
      const res = await axios.post("/products", {
        name,
        description,
        price,
        category,
        image,
      });
      set((prevState) => ({
        products: [...prevState.products, res.data],
      }));
      toast.success("Product created successfully");
    } catch (error) {
      toast.error(error.response.data.message || "An error occurred");
    } finally {
      set({ loading: false });
    }
  },
}));
