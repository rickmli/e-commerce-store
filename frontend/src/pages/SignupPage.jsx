import { useState } from "react";
import { Link } from "react-router";
import { UserPlus, Mail, Lock, User, ArrowRight, Loader } from "lucide-react";
import { motion } from "framer-motion";
import SignupInput from "../components/SignupInput";
// import { useUserStore } from "../stores/useUserStore";

const SignupPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // const { signup, loading } = useUserStore();
  const loading = false;

  const handleSubmit = (e) => {
    e.preventDefault();
    // signup(formData);
    console.log(formData);
  };

  const handleChange = (e, fieldName) =>
    setFormData({ ...formData, [fieldName]: e.target.value });

  return (
    <div className="flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <motion.div
        className="sm:mx-auto sm:w-full sm:max-w-md"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="mt-6 text-center text-3xl font-extrabold text-emerald-400">
          Create your account
        </h2>
      </motion.div>

      <motion.div
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className="bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <SignupInput
              value={formData.name}
              onChange={handleChange}
              id="name"
              type="text"
              label="Full name"
              placeholder="John Doe"
            >
              <User className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </SignupInput>

            <SignupInput
              value={formData.email}
              onChange={handleChange}
              id="email"
              type="email"
              label="Email address"
              placeholder="you@example.com"
            >
              <Mail className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </SignupInput>

            <SignupInput
              value={formData.password}
              onChange={handleChange}
              id="password"
              type="password"
              label="Password"
              placeholder="••••••••"
            >
              <Lock className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </SignupInput>

            <SignupInput
              value={formData.confirmPassword}
              onChange={handleChange}
              id="confirmPassword"
              type="password"
              label="Confirm Password"
              placeholder="••••••••"
            >
              <Lock className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </SignupInput>

            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent 
							rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600
							 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2
							  focus:ring-emerald-500 transition duration-150 ease-in-out disabled:opacity-50"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader
                    className="mr-2 h-5 w-5 animate-spin"
                    aria-hidden="true"
                  />
                  Loading...
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-5 w-5" aria-hidden="true" />
                  Sign up
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-400">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-emerald-400 hover:text-emerald-300"
            >
              Login here <ArrowRight className="inline h-4 w-4" />
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};
export default SignupPage;
