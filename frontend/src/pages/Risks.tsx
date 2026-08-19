import RiskCard from "../components/risks/RiskCard";
import RiskDashboard from "../components/risks/RiskDashboard";

const Risks = () => {
  return (
    <>
      <RiskDashboard />

      <br />

      <RiskCard
        title="Project deadline may slip"
        severity="High"
        owner="Project Manager"
      />

      <RiskCard
        title="Testing resources unavailable"
        severity="Medium"
        owner="QA Lead"
      />
    </>
  );
};

export default Risks;