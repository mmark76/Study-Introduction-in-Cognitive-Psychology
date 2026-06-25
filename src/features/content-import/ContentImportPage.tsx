import { type ChangeEvent, useState } from "react";
import { studyDatabase } from "../../infrastructure/database/studyDatabase";
import { FlashcardForm } from "./FlashcardForm";
import {
  IMPORTED_FLASHCARDS_SETTING_KEY,
  IMPORTED_UNITS_SETTING_KEY,
} from "./importedContent";
import {
  parseFlashcardsSpreadsheet,
  parseUnitsSpreadsheet,
} from "./spreadsheetImport";
import { UnitForm } from "./UnitForm";
import { useStudyContent } from "./useStudyContent";

async function readFile(file: File): Promise<string> {
  return file.text();
}

export function ContentImportPage() {
  const { units, flashcards, importedUnits, importedFlashcards } = useStudyContent();
  const [message, setMessage] = useState("");

  async function importUnits(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const spreadsheetUnits = parseUnitsSpreadsheet(await readFile(file));
      const byNumber = new Map(importedUnits.map((unit) => [unit.number, unit]));
      for (const unit of spreadsheetUnits) byNumber.set(unit.number, unit);
      const nextUnits = [...byNumber.values()].sort((first, second) => first.number - second.number);
      await studyDatabase.settings.put({ key: IMPORTED_UNITS_SETTING_KEY, value: nextUnits });
      setMessage(`${spreadsheetUnits.length} unit${spreadsheetUnits.length === 1 ? "" : "s"} added or updated successfully.`);
    } catch {
      setMessage("We could not read the units file. Download a fresh template and keep the column headings unchanged.");
    } finally {
      event.target.value = "";
    }
  }

  async function importFlashcards(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const spreadsheetFlashcards = parseFlashcardsSpreadsheet(await readFile(file), units);
      const byId = new Map(importedFlashcards.map((card) => [card.id, card]));
      for (const card of spreadsheetFlashcards) byId.set(card.id, card);
      const nextFlashcards = [...byId.values()];
      await studyDatabase.settings.put({ key: IMPORTED_FLASHCARDS_SETTING_KEY, value: nextFlashcards });
      setMessage(`${spreadsheetFlashcards.length} flashcard${spreadsheetFlashcards.length === 1 ? "" : "s"} added or updated successfully.`);
    } catch {
      setMessage("We could not read the flashcards file. Make sure its unit numbers match units already added to the app.");
    } finally {
      event.target.value = "";
    }
  }

  async function clearImportedContent() {
    if (!window.confirm("Remove all units and flashcards that you added?")) return;
    await studyDatabase.transaction("rw", studyDatabase.settings, async () => {
      await studyDatabase.settings.delete(IMPORTED_UNITS_SETTING_KEY);
      await studyDatabase.settings.delete(IMPORTED_FLASHCARDS_SETTING_KEY);
    });
    setMessage("Your added study content was removed.");
  }

  return (
    <div className="stack-lg">
      <header className="page-heading">
        <p className="eyebrow">Your content</p>
        <h2>Add study content</h2>
        <p>Create units and flashcards directly in the app, or add many at once with familiar spreadsheet files.</p>
      </header>

      <section className="stats-grid" aria-label="Your added content">
        <article className="stat-card"><strong>{importedUnits.length}</strong><span>Units added</span></article>
        <article className="stat-card"><strong>{importedFlashcards.length}</strong><span>Flashcards added</span></article>
      </section>

      <section className="content-panel">
        <h3>Add one unit</h3>
        <p>Complete the fields below. Numbering is handled automatically.</p>
        <UnitForm existingUnits={units} importedUnits={importedUnits} onMessage={setMessage} />
      </section>

      <section className="content-panel">
        <h3>Add one flashcard</h3>
        <p>Choose its unit, then enter the question and answer.</p>
        <FlashcardForm
          units={units}
          existingFlashcards={flashcards}
          importedFlashcards={importedFlashcards}
          onMessage={setMessage}
        />
      </section>

      <section className="content-panel">
        <h3>Add many items at once</h3>
        <ol className="friendly-steps">
          <li>Download the spreadsheet you need.</li>
          <li>Open it in Excel, Numbers, or Google Sheets and replace the examples.</li>
          <li>Save it, then choose the completed file below.</li>
        </ol>
        <div className="template-grid">
          <div className="template-card">
            <h4>Units</h4>
            <a className="button secondary" download="units-template.csv" href={`${import.meta.env.BASE_URL}templates/units-spreadsheet.csv`}>Download units spreadsheet</a>
            <label className="button primary file-button">Choose completed units file<input accept=".csv,text/csv" type="file" onChange={(event) => void importUnits(event)} /></label>
          </div>
          <div className="template-card">
            <h4>Flashcards</h4>
            <a className="button secondary" download="flashcards-template.csv" href={`${import.meta.env.BASE_URL}templates/flashcards-spreadsheet.csv`}>Download flashcards spreadsheet</a>
            <label className="button primary file-button">Choose completed flashcards file<input accept=".csv,text/csv" type="file" onChange={(event) => void importFlashcards(event)} /></label>
          </div>
        </div>
      </section>

      <section className="content-panel">
        <h3>Manage your content</h3>
        <button className="button danger" onClick={() => void clearImportedContent()}>Remove all content I added</button>
      </section>

      <p className="inline-message status-banner" role="status" aria-live="polite">{message}</p>
    </div>
  );
}
