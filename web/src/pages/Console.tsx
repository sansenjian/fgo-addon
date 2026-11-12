import { Navigate } from '@tanstack/react-router';

// /console → /console/overview
export default function ConsoleRedirect() {
  return <Navigate to="/console/overview" replace />;
}
