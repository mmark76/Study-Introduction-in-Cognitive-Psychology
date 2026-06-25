import { type ChangeEvent, type FormEvent, useRef, useState } from "react";
import { studyDatabase } from "../../infrastructure/database/studyDatabase";
import { createId } from "../../shared/utils/id";
import {
  isPdfFile,
  MAX_LOCAL_PDF_SIZE,
  titleFromFileName,
  type LocalStudyFile,
} from "./localStudyFiles";
import { normalizeStudyMaterialTitle } from "./studyMaterials";

export function LocalPdfForm({
  files,
  onMessage,
}: {
  files: readonly LocalStudyFile[];
  onMessage: (message: string) => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [rightsConfirmed, setRightsConfirmed] = useState(false);
  const lock = useRef(false);

  function chooseFile(event: ChangeEvent<HTMLInputElement>) {
    const selected = event.target.files?.[0] ?? null;
    setFile(selected);
    if (selected && title.trim().length === 0) setTitle(titleFromFileName(selected.name));
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!file || lock.current) return;

    if (!isPdfFile(file)) {
      onMessage("Choose a PDF file.");
      return;
    }
    if (file.size > MAX_LOCAL_PDF_SIZE) {
      onMessage("The PDF is larger than 20 MB. Use a cloud link for larger files.");
      return;
    }
    if (!rightsConfirmed) {
      onMessage("Confirm that you have permission to use this file.");
      return;
    }
    if (files.some((item) => item.fileName === file.name && item.size === file.size)) {
      onMessage("This PDF has already been added.");
      return;
    }

    lock.current = true;
    try {
      const item: LocalStudyFile = {
        id: createId("pdf"),
        title: normalizeStudyMaterialTitle(title || titleFromFileName(file.name)),
        fileName: file.name,
        size: file.size,
        createdAt: new Date().toISOString(),
        data: file.slice(0, file.size, "application/pdf"),
      };
      await studyDatabase.studyFiles.add(item);
      setFile(null);
      setTitle("");
      setRightsConfirmed(false);
      const input = event.currentTarget.elements.namedItem("pdf-file") as HTMLInputElement | null;
      if (input) input.value = "";
      onMessage("The PDF was added to this device.");
    } catch {
      onMessage("The PDF could not be saved. Your browser may not have enough storage space.");
    } finally {
      lock.current = false;
    }
  }

  return (
    <form className="material-form" onSubmit={(event) => void submit(event)}>
      <label className="field-label">
        PDF from this device
        <input
          required
          accept="application/pdf,.pdf"
          name="pdf-file"
          type="file"
          onChange={chooseFile}
        />
      </label>
      <label className="field-label">
        Name
        <input
          required
          maxLength={160}
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="The file name will be used automatically"
        />
      </label>
      <label className="permission-check">
        <input
          checked={rightsConfirmed}
          type="checkbox"
          onChange={(event) => setRightsConfirmed(event.target.checked)}
        />
        <span>I have permission to use this PDF for my studies.</span>
      </label>
      <button className="button primary" type="submit">Add PDF from this device</button>
    </form>
  );
}
