import { Link } from "react-router-dom";
import Button from "../components/ui/Button.jsx";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="text-center">
        <div className="text-7xl font-extrabold text-primary">404</div>
        <h1 className="mt-2 text-2xl font-bold text-ink">Page not found</h1>
        <p className="mt-1 text-body">This page doesn't exist or was moved.</p>
        <Button as={Link} to="/" className="mt-6">Back home</Button>
      </div>
    </div>
  );
}
