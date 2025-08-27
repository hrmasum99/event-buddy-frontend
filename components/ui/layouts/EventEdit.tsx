"use client";
import { useState } from "react";
import { Button } from "../button";
import EventModal from "./modals/EventModal";

export default function EditEvent() {
  const [openEdit, setOpenEdit] = useState(false);

  return (
    <div className="p-6">
      <Button
        className="bg-[#4157FE] text-white hover:bg-[#7B8BFF]"
        onClick={() => setOpenEdit(true)}
      >
        Open Edit Modal
      </Button>

      <EventModal
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        mode="edit"
      />
    </div>
  );
}
