export const MAX_LOCAL_PDF_SIZE = 20 * 1024 * 1024;

export interface LocalStudyFile {
  id: string;
  title: string;
  fileName: string;
  size: number;
  createdAt: string;
  data: Blob;
}

export function isPdfFile(file: File): boolean {
  return file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function titleFromFileName(fileName: string): string {
  return fileName.replace(/\.pdf$/i, "").replace(/[-_]+/g, " ").trim() || "Study PDF";
}

export function openLocalPdf(file: LocalStudyFile): void {
  const url = URL.createObjectURL(file.data);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.target = "_blank";
  anchor.rel = "noopener noreferrer";
  anchor.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
}
