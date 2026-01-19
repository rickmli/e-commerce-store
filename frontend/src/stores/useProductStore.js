import { create } from "zustand";
import axios from "../libs/axios";
import { toast } from "react-hot-toast";

export const useProductStore = create((set, get) => ({
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

  fetchAllProducts: async () => {
    set({ loading: true });
    try {
      const res = await axios.get("/products");
      set({ products: res.data });
      // toast.success("Product retrieved successfully");
    } catch (error) {
      toast.error(error.response.data.message || "An error occurred");
    } finally {
      set({ loading: false });
    }
  },

  deleteProduct: async (id) => {
    set({ loading: true });
    try {
      const res = await axios.delete(`/products/${id}`);
      set((prevState) => ({
        products: prevState.products.filter((product) => product._id !== id),
      }));
      console.log(get("products"));
      toast.success("Product deleted successfully");
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message || "An error occurred");
    } finally {
      set({ loading: false });
    }
  },

  toggleFeaturedProduct: async (id) => {
    set({ loading: true });
    try {
      const res = await axios.patch(`/products/${id}`);
      set((prevState) => ({
        products: prevState.products.map((product) =>
          product._id !== id
            ? product
            : { ...product, isFeatured: res.data.isFeatured }
        ),
      }));
      console.log(get("products"));
      toast.success("Featurality toggled successfully");
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message || "An error occurred");
    } finally {
      set({ loading: false });
    }
  },
}));
