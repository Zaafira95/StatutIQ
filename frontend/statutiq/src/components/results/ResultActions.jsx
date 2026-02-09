export default function ResultActions() {
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-end">
      <button className="border px-5 py-3 rounded hover:bg-gray-50">
        Télécharger le rapport PDF
      </button>

      <button className="bg-primary text-white px-6 py-3 rounded hover:opacity-90">
        Prendre RDV avec un expert
      </button>
    </div>
  );
}
