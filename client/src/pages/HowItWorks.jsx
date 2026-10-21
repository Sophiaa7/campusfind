const steps = [
  {
    title: "Report",
    text: "Submit a lost or found report with the category, place, and a clear description.",
  },
  {
    title: "Search and match",
    text: "CampusFind compares reports by category, location, and description, then shows possible matches.",
  },
  {
    title: "Verify",
    text: "The owner proves it is theirs with the private detail that is never shown on the public page.",
  },
  {
    title: "Recover",
    text: "After a match, arrange a safe handover. Campus security can hold the item if needed.",
  },
];

export default function HowItWorks() {
  return (
    <section className="wrap">
      <h1>How it works</h1>
      <p className="muted">Report, match, verify, and recover items safely.</p>
      {steps.map((step, index) => (
        <article className="snapshot" key={step.title}>
          <b>
            {index + 1}. {step.title}
          </b>
          <p>{step.text}</p>
        </article>
      ))}
      <p>
        <strong>REPORT → SEARCH → MATCH → VERIFY → RECOVER</strong>
      </p>
    </section>
  );
}