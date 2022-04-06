import Private from "../../components/auth/Private";
import UserDashboard from "../../components/profile/UserDashboard";

const UserIndex = () => {
  return (
    <Private>
      <UserDashboard />
    </Private>
  );
};

export default UserIndex;
