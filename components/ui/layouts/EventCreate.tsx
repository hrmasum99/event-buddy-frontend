"use client";
import { useState } from "react";
import { Button } from "../button";
import EventModal from "./modals/EventModal";

export default function CreateEvent() {
  const [openCreate, setOpenCreate] = useState(false);

  return (
    <div className="p-6">
      <Button
        className="bg-[#4157FE] text-white hover:bg-[#7B8BFF]"
        onClick={() => setOpenCreate(true)}
      >
        Create Event
      </Button>

      <EventModal
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        mode="create"
      />
    </div>
  );
}
