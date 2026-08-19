import DecisionCard from "../components/decisions/DecisionCard";
import DecisionHistory from "../components/decisions/DecisionHistory";
import DecisionTimeline from "../components/decisions/DecisionTimeline";

const Decisions = () => {
  return (
    <>
      <DecisionCard
        title="Release moved to October"
        owner="Rahul"
        status="Approved"
        date="12 Aug 2026"
        onView={() => {}}
      />

      <br />

      <DecisionHistory />

      <br />

      <DecisionTimeline />
    </>
  );
};

export default Decisions;