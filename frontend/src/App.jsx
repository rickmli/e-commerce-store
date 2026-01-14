import { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router";

import { useUserStore } from "./stores/useUserStore";

import HomePage from "./pages/HomePage";
import SignupPage from "./pages/SignUpPage";
import SigninPage from "./pages/SigninPage";
import NotFoundPage from "./pages/NotFoundPage";

import Layout from "./components/Layout";
import LoadingSpinner from "./ui/LoadingSpinner";

function App() {
  const { user, checkAuth, checkingAuth } = useUserStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (checkingAuth) return <LoadingSpinner />;

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
        <Route path="/*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;
