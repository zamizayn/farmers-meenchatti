import React, { useEffect, useState, useRef } from 'react';
import { db } from '../firebase';
import { collection, doc, onSnapshot, updateDoc, deleteDoc, addDoc, query, orderBy } from 'firebase/firestore';
import { Plus, Trash2, Users, Armchair } from 'lucide-react';

interface Table {
    id: string;
    name: string;
    x: number;
    y: number;
    capacity: number;
    reservationId?: string | null;
}

interface IncomingReservation {
    id: string;
    name: string;
    guests: number;
    time: string;
}

const AdminTableMap: React.FC = () => {
    const [tables, setTables] = useState<Table[]>([]);
    const [reservations, setReservations] = useState<IncomingReservation[]>([]);

    // Dragging State for Tables (Positioning)
    const [draggingTableId, setDraggingTableId] = useState<string | null>(null);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const mapRef = useRef<HTMLDivElement>(null);

    // Initial Load
    useEffect(() => {
        const unsubTables = onSnapshot(collection(db, 'tables'), (snap) => {
            setTables(snap.docs.map(d => ({ id: d.id, ...d.data() } as Table)));
        });

        const qRes = query(collection(db, 'reservations'), orderBy('time', 'asc'));
        const unsubRes = onSnapshot(qRes, (snap) => {
            // Filter for those NOT assigned to a table (logic simplified for demo)
            const data = snap.docs
                .filter(d => d.data().status === 'confirmed')
                .map(d => ({
                    id: d.id,
                    name: d.data().name,
                    guests: Number(d.data().guests),
                    time: d.data().time
                }));
            setReservations(data);
        });

        return () => { unsubTables(); unsubRes(); };
    }, []);

    // --- Table Positioning Logic (Mouse Events) ---
    const handleTableMouseDown = (e: React.MouseEvent, table: Table) => {
        if (!mapRef.current) return;
        // Prevent interfering with other interactions
        if ((e.target as HTMLElement).closest('button')) return;

        const mapRect = mapRef.current.getBoundingClientRect();
        setDraggingTableId(table.id);
        setDragOffset({
            x: e.clientX - mapRect.left - table.x,
            y: e.clientY - mapRect.top - table.y
        });
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (draggingTableId && mapRef.current) {
            const mapRect = mapRef.current.getBoundingClientRect();
            const newX = e.clientX - mapRect.left - dragOffset.x;
            const newY = e.clientY - mapRect.top - dragOffset.y;

            // Optimistic Update (Local State)
            setTables(prev => prev.map(t =>
                t.id === draggingTableId ? { ...t, x: newX, y: newY } : t
            ));
        }
    };

    const handleMouseUp = async () => {
        if (draggingTableId) {
            // Persist new position to Firestore
            const table = tables.find(t => t.id === draggingTableId);
            if (table) {
                try {
                    await updateDoc(doc(db, 'tables', draggingTableId), { x: table.x, y: table.y });
                } catch (error) {
                    console.error("Error saving table pos", error);
                }
            }
            setDraggingTableId(null);
        }
    };

    // --- Reservation Drag & Drop Logic (HTML5 DnD) ---
    const handleDragStart = (e: React.DragEvent, res: IncomingReservation) => {
        e.dataTransfer.setData("reservationId", res.id);
        e.dataTransfer.setData("reservationName", res.name);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault(); // Necessary to allow dropping
    };

    const handleDropOnTable = async (e: React.DragEvent, tableId: string) => {
        e.preventDefault();
        const resId = e.dataTransfer.getData("reservationId");
        const resName = e.dataTransfer.getData("reservationName");

        if (resId) {
            try {
                await updateDoc(doc(db, 'tables', tableId), { reservationId: resId });
                // Optional: Show success toast
            } catch (error) {
                console.error("Error assigning table", error);
            }
        }
    };

    // --- Actions ---
    const addTable = async () => {
        const newTable = {
            name: `Table ${tables.length + 1}`,
            x: 50 + (tables.length * 20) % 500,
            y: 50 + (tables.length * 20) % 300,
            capacity: 4,
            reservationId: null
        };
        await addDoc(collection(db, 'tables'), newTable);
    };

    const removeTable = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent drag start
        if (confirm('Remove this table?')) {
            await deleteDoc(doc(db, 'tables', id));
        }
    };

    const clearTable = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (confirm('Clear this table?')) {
            await updateDoc(doc(db, 'tables', id), { reservationId: null });
        }
    };

    return (
        <div className="flex h-full" onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}>
            {/* Sidebar: Reservations List */}
            <div className="w-80 bg-white border-r border-slate-200 p-6 overflow-y-auto z-10 shadow-xl flex flex-col">
                <h2 className="text-xl font-bold text-slate-900 mb-2">Reservations</h2>
                <p className="text-xs text-slate-500 mb-6 font-medium">Drag confirmed guests to tables.</p>

                <div className="space-y-3 flex-1 overflow-y-auto pr-2">
                    {reservations.map(res => (
                        <div
                            key={res.id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, res)}
                            className="p-4 bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-all cursor-grab active:cursor-grabbing group"
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-bold text-slate-800">{res.name}</p>
                                    <div className="flex items-center gap-1.5 mt-1">
                                        <Users size={12} className="text-slate-400" />
                                        <p className="text-xs text-slate-500 font-medium">{res.guests} Guests</p>
                                    </div>
                                </div>
                                <span className="bg-slate-100 text-slate-500 text-[10px] font-bold px-2 py-1 rounded-md">{res.time}</span>
                            </div>
                        </div>
                    ))}
                    {reservations.length === 0 && (
                        <div className="text-center py-10 border-2 border-dashed border-slate-100 rounded-xl">
                            <p className="text-slate-400 text-sm font-medium">No confirmed list</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Map Area */}
            <div
                ref={mapRef}
                className="flex-1 bg-slate-50 relative overflow-hidden bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:20px_20px]"
            >
                <div className="absolute top-6 left-6 z-10">
                    <button
                        onClick={addTable}
                        className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 text-sm shadow-lg hover:shadow-sky-600/30 transition-all"
                    >
                        <Plus size={16} /> Add Table
                    </button>
                </div>

                {/* Render Tables */}
                {tables.map(table => (
                    <div
                        key={table.id}
                        onMouseDown={(e) => handleTableMouseDown(e, table)}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDropOnTable(e, table.id)}
                        className={`absolute w-32 h-32 rounded-full flex flex-col items-center justify-center border-2 transition-all shadow-xl cursor-move group
                            ${table.reservationId
                                ? 'bg-red-50 border-red-200 ring-4 ring-red-100'
                                : 'bg-white border-slate-200 hover:border-sky-300'
                            }
                            ${draggingTableId === table.id ? 'z-50 scale-105 shadow-2xl' : 'z-0'}
                        `}
                        style={{
                            left: table.x,
                            top: table.y,
                            userSelect: 'none'
                        }}
                    >
                        {table.reservationId ? (
                            <div className="flex flex-col items-center animate-in zoom-in duration-300">
                                <Users size={20} className="text-red-500 mb-1" />
                                <span className="font-bold text-red-700 text-xs">Occupied</span>
                                <button
                                    onClick={(e) => clearTable(table.id, e)}
                                    className="text-[10px] text-red-400 underline mt-1 hover:text-red-600"
                                >
                                    Clear
                                </button>
                            </div>
                        ) : (
                            <>
                                <Armchair size={24} className="text-slate-300 mb-1" />
                                <span className="font-bold text-slate-700 text-sm">{table.name}</span>
                                <span className="text-[10px] text-slate-400 font-bold uppercase">{table.capacity} Seats</span>
                            </>
                        )}

                        <button
                            onClick={(e) => removeTable(table.id, e)}
                            className="absolute -top-1 -right-1 bg-white text-slate-400 hover:text-red-500 p-1.5 rounded-full shadow-sm border border-slate-200 opacity-0 group-hover:opacity-100 transition-all scale-90 hover:scale-100"
                            title="Remove Table"
                        >
                            <Trash2 size={12} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminTableMap;
