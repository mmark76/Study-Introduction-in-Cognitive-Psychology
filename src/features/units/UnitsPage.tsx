import { studyConfig } from "../../app/studyConfig";
import { units } from "../../data/units";

export function UnitsPage() {
  return (
    <div className="stack-lg">
      <header className="page-heading">
        <p className="eyebrow">Structured content</p>
        <h2>{studyConfig.unitsLabel}</h2>
        <p>Στόχοι, σύνοψη και βασικοί όροι για κάθε ενότητα.</p>
      </header>
      {units.length === 0 ? (
        <section className="empty-state"><h3>Δεν υπάρχουν ακόμη ενότητες</h3><p>Το πρότυπο ξεκινά σκόπιμα κενό.</p></section>
      ) : (
        <div className="card-grid">
          {units.map((unit) => (
            <article className="content-panel" key={unit.id}>
              <p className="eyebrow">{studyConfig.unitLabel} {unit.number}</p>
              <h3>{unit.title}</h3>
              <h4>Στόχοι</h4>
              <ul>{unit.objectives.map((item) => <li key={item}>{item}</li>)}</ul>
              <h4>Σύνοψη</h4>
              <ul>{unit.summary.map((item) => <li key={item}>{item}</li>)}</ul>
              <div className="tag-row">{unit.keyTerms.map((term) => <span className="tag" key={term}>{term}</span>)}</div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
