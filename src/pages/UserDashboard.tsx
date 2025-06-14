
import { useAuth } from "@/contexts/AuthContext";

const UserDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white rounded-lg shadow p-8 animate-fade-in">
      <h1 className="text-2xl font-semibold mb-2 text-center">Welcome to POSPine</h1>
      <div className="flex items-center gap-3 justify-center mb-4">
        <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
          {user?.name?.charAt(0).toUpperCase() || "U"}
        </div>
        <div>
          <p className="font-medium text-lg">{user?.name}</p>
          <p className="text-sm text-gray-500">{user?.role}</p>
        </div>
      </div>
      <div className="mt-4 text-gray-700 text-center">
        <p>
          Your account is set up for restaurant use. Please wait for staff to take your order.<br/>
          For assistance, contact a staff member!
        </p>
      </div>
    </div>
  );
};

export default UserDashboard;
