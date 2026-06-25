import { type FormEvent, useMemo, useRef, useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { studyDatabase } from "../../infrastructure/database/studyDatabase";
import { createId } from "../../shared/utils/id";
import { builtInStudyMaterials, normalizeStudyMaterialTitle, normalizeStudyMaterialUrl, parseStoredStudyMaterials, STUDY_MATERIALS_SETTING_KEY } from "./studyMaterials";

export function StudyMaterialsPage() {
  const setting = useLiveQuery(() => studyDatabase.settings.get(STUDY_MATERIALS_SETTING_KEY), []);
  const customMaterials = useMemo(() => parseStoredStudyMaterials(setting?.value), [setting?.value]);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [message, setMessage] = useState("");
  const lock = useRef(false);

  async function addMaterial(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (lock.current) return;
    lock.current = true;
    setMessage("");
    try {
      const item = { id: createId("material"), title: normalizeStudyMaterialTitle(title), url: normalizeStudyMaterialUrl(url) };
      const existing = [...builtInStudyMaterials, ...customMaterials];
      if (existing.some((material) => material.url === item.url)) throw new Error("Duplicate");
      await studyDatabase.settings.put({ key: STUDY_MATERIALS_SETTING_KEY, value: [...customMaterials, item] });
      setTitle(""); setUrl(""); setMessage("Το υλικό προστέθηκε.");
    } catch {
      setMessage("Συμπλήρωσε μοναδικό όνομα και έγκυρο link HTTP ή HTTPS.");
    } finally {
      lock.current = false;
    }
  }

  async function removeMaterial(id: string) {
    await studyDatabase.settings.put({ key: STUDY_MATERIALS_SETTING_KEY, value: customMaterials.filter((item) => item.id !== id) });
    setMessage("Το υλικό διαγράφηκε.");
  }

  const materials = [...builtInStudyMaterials, ...customMaterials];
  return (
    <div className="stack-lg">
      <header className="page-heading"><p className="eyebrow">External resources</p><h2>Υλικό μελέτης</h2><p>Πρόσθεσε συνδέσμους προς βιβλία, σημειώσεις ή άλλες πηγές.</p></header>
      <section className="content-panel">
        <h3>Σύνδεσμοι</h3>
        {materials.length === 0 ? <p>Δεν υπάρχουν ακόμη σύνδεσμοι.</p> : <ul className="material-link-list">{materials.map((material) => <li className="material-link-row" key={material.id}><a className="text-link" href={material.url} target="_blank" rel="noopener noreferrer">{material.title} ↗</a>{customMaterials.some((item) => item.id === material.id) ? <button className="button danger compact" onClick={() => void removeMaterial(material.id)}>Διαγραφή</button> : null}</li>)}</ul>}
      </section>
      <section className="content-panel">
        <h3>Προσθήκη νέου υλικού</h3>
        <form className="material-form" onSubmit={(event) => void addMaterial(event)}>
          <label className="field-label">Όνομα<input required maxLength={160} type="text" value={title} onChange={(event) => setTitle(event.target.value)} /></label>
          <label className="field-label">Link<input required type="url" value={url} onChange={(event) => setUrl(event.target.value)} placeholder="https://..." /></label>
          <button className="button primary" type="submit">Προσθήκη link</button>
        </form>
        <p className="inline-message" role="status">{message}</p>
      </section>
    </div>
  );
}
