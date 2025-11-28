import { useEffect, useState } from "react";
import { getContactos, updateContacto } from "../../config/api";
import { toastSuccess } from "../../interfaces/toast";

interface ModalProps {
  open: boolean;
  title: string;
  children: React.ReactNode;
  onConfirm: () => void;
  onClose: () => void;
}

function Modal({ open, title, children, onConfirm, onClose }: ModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-xl max-w-sm w-full">
        <h2 className="text-xl font-bold mb-3">{title}</h2>

        <div className="mb-4">{children}</div>

        <div className="flex gap-3">
          <button
            onClick={onConfirm}
            className="flex-1 bg-green-600 text-white py-2 rounded"
          >
            Sí
          </button>

          <button
            onClick={onClose}
            className="flex-1 bg-gray-500 text-white py-2 rounded"
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
}


export default function ContactosPanel() {
  const [contactos, setContactos] = useState<any[]>([]);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [filter, setFilter] = useState<"todos" | "pendientes" | "respondidos">("todos");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getContactos();
      setContactos(data);
    };
    fetchData();
  }, []);

  const handleUpdate = async (id: number, respondido: boolean) => {
    try {
      await updateContacto(id, { respondido });
      toastSuccess("Contacto actualizado correctamente ✅");
      setExpandedId(null);
      setModalOpen(false);
      setSelectedId(null);
      const data = await getContactos();
      setContactos(data);
    } catch (error) {
      console.error(error);
    }
  };

  const filteredContactos = contactos.filter((c) => {
    if (filter === "pendientes") return !c.respondido;
    if (filter === "respondidos") return c.respondido;
    return true;
  });

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg border-2 border-green-600">
      <h2 className="text-2xl font-bold text-green-700 mb-6">📩 Contactos</h2>

      <div className="flex gap-3 mb-4">
        <button
          onClick={() => setFilter("todos")}
          className={`px-4 py-2 rounded ${filter === "todos" ? "bg-green-600 text-white" : "bg-gray-200"}`}
        >
          Todos
        </button>
        <button
          onClick={() => setFilter("pendientes")}
          className={`px-4 py-2 rounded ${filter === "pendientes" ? "bg-green-600 text-white" : "bg-gray-200"}`}
        >
          Pendientes
        </button>
        <button
          onClick={() => setFilter("respondidos")}
          className={`px-4 py-2 rounded ${filter === "respondidos" ? "bg-green-600 text-white" : "bg-gray-200"}`}
        >
          Respondidos
        </button>
      </div>

      <ul className="divide-y">
        {filteredContactos.map((c) => (
          <li key={c.id} className="py-2">
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={() => setExpandedId(expandedId === c.id ? null : c.id)}
            >
              <span>
                <strong>{c.nombre}</strong> ({c.email})
              </span>
              <span>{c.respondido ? "✅ Respondido" : "⏳ Pendiente"}</span>
            </div>

            {expandedId === c.id && (
              <div className="mt-3 p-3 border rounded bg-gray-50">
                <p><strong>Mensaje:</strong> {c.mensaje}</p>
                <div className="flex gap-3 mt-3">
                  <button
                    onClick={() => {
                      setSelectedId(c.id);
                      setModalOpen(true);
                    }}
                    className="bg-green-600 text-white px-4 py-2 rounded"
                  >
                    Marcar como respondido
                  </button>
                  <button
                    onClick={() => handleUpdate(c.id, false)}
                    className="bg-yellow-600 text-white px-4 py-2 rounded"
                  >
                    Guardar sin responder
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>

      <Modal
        open={modalOpen}
        title="Confirmar acción"
        onConfirm={() => selectedId && handleUpdate(selectedId, true)}
        onClose={() => setModalOpen(false)}
      >
        <p>¿Estás seguro de marcar este contacto como respondido?</p>
      </Modal>
    </div>
  );
}