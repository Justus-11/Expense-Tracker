import { useParams } from "react-router-dom";
import { ResetPassword } from "./AuthPages";

// This page is loaded when the user clicks the link in their email:
// /reset-password/:token
const ResetPasswordPage = ({ darkMode }) => {
  const { token } = useParams();

  if (!token) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}>
        <p className="text-sm opacity-60">Invalid reset link.</p>
      </div>
    );
  }

  return <ResetPassword darkMode={darkMode} token={token} />;
};

export default ResetPasswordPage;