import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { login as loginApi } from "../../api/auth.js";
import { useAuth } from "../../context/AuthContext.jsx";
import { roleHome } from "../../lib/format.js";
import Button from "../../components/ui/Button.jsx";
import Input from "../../components/ui/Input.jsx";

export default function Login() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const onSubmit = async (data) => {
    try {
      const res = await loginApi(data);
      login({ token: res.token, user: res.user });
      toast.success(`Welcome, ${res.user.name}`);
      const from = location.state?.from?.pathname;
      navigate(from || roleHome(res.user.role), { replace: true });
    } catch (err) {
      toast.error(err.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Link to="/" className="mb-6 flex items-center justify-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white font-bold">
            C
          </div>
          <span className="text-xl font-bold text-ink">SafaCity</span>
        </Link>

        <div className="rounded-2xl border border-line bg-surface p-8 shadow-card">
          <h1 className="text-2xl font-bold text-ink">Welcome back</h1>
          <p className="mt-1 text-sm text-body">
            Sign in to continue to your dashboard.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              {...register("email", { required: "Email is required" })}
              error={errors.email?.message}
            />
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              {...register("password", { required: "Password is required" })}
              error={errors.password?.message}
            />
            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Signing in…" : "Sign in"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-body">
            New to SafaCity?{" "}
            <Link to="/register" className="font-semibold text-primary hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
