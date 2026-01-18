export default function PDFViewer({ pdf }) {
  return (
    <iframe
      src={pdf}
      className="w-full h-screen rounded-lg border"
      title="Study Note"
    />
  );
}
