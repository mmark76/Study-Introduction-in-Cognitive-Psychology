import { studyConfig } from "../../app/studyConfig";
import { units } from "../../data/units";

export function UnitsPage() {
  return (
    <div className="stack-lg">
      <header className="page-heading">
        <p className="eyebrow">Structured content</p>
        <h2>{studyConfig.unitsLabel}</h2>
        <p>Objectives, summaries, and key terms for each unit.</p>
      </header>
      {units.length === 0 ? (
        <section className="empty-state"><h3>There are no units yet</h3><p>The template intentionally starts empty.</p></section>
      ) : (
        <div className="card-grid">
          {units.map((unit) => (
            <article className="content-panel" key={unit.id}>
              <p className="eyebrow">{studyConfig.unitLabel} {unit.number}</p>
              <h3>{unit.title}</h3>
              <h4>Objectives</h4>
              <ul>{unit.objectives.map((item) => <li key={item}>{item}</li>)}</ul>
              <h4>Summary</h4>
              <ul>{unit.summary.map((item) => <li key={item}>{item}</li>)}</ul>
              <div className="tag-row">{unit.keyTerms.map((term) => <span className="tag" key={term}>{term}</span>)}</div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
