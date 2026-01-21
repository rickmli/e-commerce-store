import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router";

import { useUserStore } from "./stores/useUserStore";

import HomePage from "./pages/HomePage";
import SignupPage from "./pages/SignupPage";
import SigninPage from "./pages/SigninPage";
import NotFoundPage from "./pages/NotFoundPage";

import Layout from "./components/Layout";
import LoadingSpinner from "./ui/LoadingSpinner";
import AdminPage from "./pages/AdminPage";
import CategoryPage from "./pages/CategoryPage";
import CartPage from "./pages/CartPage";
import { useCartStore } from "./stores/useCartStore";
import PurchaseSuccessPage from "./pages/PurchaseSuccessPage";
import PurchaseCancelPage from "./pages/PurchaseCancelPage";

function App() {
  const { user, checkAuth, checkingAuth } = useUserStore();
  const { getCartItems } = useCartStore();
  const [authChecked, setAuthChecked] = useState(false);
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    const initAuth = async () => {
      await checkAuth();
      setAuthChecked(true); // Fix admin dashboard refresh: Added state flag to force re-render after auth check, ensuring user role is properly evaluated for route guards.
    };
    initAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (!user) return;

    getCartItems();
  }, [user, getCartItems]);

  if (checkingAuth || !authChecked) return <LoadingSpinner />;

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/signup"
          element={!user ? <SignupPage /> : <Navigate to="/" />}
        />
        <Route
          path="/signin"
          element={!user ? <SigninPage /> : <Navigate to="/" />}
        />
        <Route
          path="/cart"
          element={user ? <CartPage /> : <Navigate to="/" />}
          // element={<CartPage />}
        />
        <Route path="/category/:category" element={<CategoryPage />} />
        <Route
          path="/admin-dashboard"
          element={isAdmin ? <AdminPage /> : <Navigate to="/" />}
        />
        <Route
          path="/purchase-success"
          element={user ? <PurchaseSuccessPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/purchase-cancel"
          element={user ? <PurchaseCancelPage /> : <Navigate to="/login" />}
        />
        <Route path="/*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;
