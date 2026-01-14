import { ArrowRight } from "lucide-react";
import { Link } from "react-router";

function SignupOption() {
  return (
    <p className="mt-8 text-center text-sm text-gray-400">
      Not a member?{" "}
      <Link
        to="/signup"
        className="font-medium text-emerald-400 hover:text-emerald-300"
      >
        Sign up now <ArrowRight className="inline h-4 w-4" />
      </Link>
    </p>
  );
}

export default SignupOption;
