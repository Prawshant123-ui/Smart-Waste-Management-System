import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { register as registerApi, login as loginApi } from "../../api/auth.js";
import { useAuth } from "../../context/AuthContext.jsx";
import { roleHome } from "../../lib/format.js";
import Button from "../../components/ui/Button.jsx";
import Input from "../../components/ui/Input.jsx";

export default function Register() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const { login } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      await registerApi(data);
      const res = await loginApi({ email: data.email, password: data.password });
      login({ token: res.token, user: res.user });
      toast.success("Account created!");
      navigate(roleHome(res.user.role), { replace: true });
    } catch (err) {
      toast.error(err.message || "Registration failed");
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
          <span className="text-xl font-bold text-ink">CleanCity</span>
        </Link>

        <div className="rounded-2xl border border-line bg-surface p-8 shadow-card">
          <h1 className="text-2xl font-bold text-ink">Join CleanCity</h1>
          <p className="mt-1 text-sm text-body">
            Report waste issues in your community.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
            <Input
              label="Full name"
              placeholder="Jane Doe"
              {...register("name", { required: "Name is required" })}
              error={errors.name?.message}
            />
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              {...register("email", { required: "Email is required" })}
              error={errors.email?.message}
            />
            <Input
              label="Phone"
              placeholder="+1 555 123 4567"
              {...register("phone", { required: "Phone is required" })}
              error={errors.phone?.message}
            />
            <Input
              label="Password"
              type="password"
              placeholder="At least 8 characters"
              {...register("password", {
                required: "Password is required",
                minLength: { value: 8, message: "Minimum 8 characters" },
              })}
              error={errors.password?.message}
            />
            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating account…" : "Create account"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-body">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
