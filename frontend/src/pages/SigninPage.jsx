import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, UserPlus } from "lucide-react";
import AuthFormInput from "../components/AuthFormInput";
import SignupOption from "../ui/SignupOption";
import FormSubmitButton from "../components/FormSubmitButton";
import { useUserStore } from "../stores/useUserStore";

const SigninPage = () => {
  const [formData, setFormData] = useState({
    email: "admin@usc.edu",
    password: "123123",
  });

  const { signin, loading } = useUserStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    signin(formData.email, formData.password);
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
            <AuthFormInput
              value={formData.email}
              onChange={handleChange}
              id="email"
              type="email"
              label="Email address"
              placeholder="you@example.com"
            >
              <Mail className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </AuthFormInput>

            <AuthFormInput
              value={formData.password}
              onChange={handleChange}
              id="password"
              type="password"
              label="Password"
              placeholder="••••••••"
            >
              <Lock className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </AuthFormInput>

            <FormSubmitButton isLoading={loading}>
              <UserPlus className="mr-2 h-5 w-5" aria-hidden="true" />
              Log In
            </FormSubmitButton>
          </form>

          <SignupOption />
        </div>
      </motion.div>
    </div>
  );
};
export default SigninPage;
