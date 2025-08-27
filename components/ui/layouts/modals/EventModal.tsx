"use client";

import { useEffect, useState } from "react";
import {
  useCreateEventMutation,
  useUpdateEventMutation,
  useUploadEventImageMutation,
} from "@/redux/services/eventApi";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CalendarIcon,
  ClockIcon,
  UploadCloud,
  MapPinIcon,
  UsersIcon,
  TagIcon,
  ImageIcon,
  X,
  Loader2,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { useToast } from "../../ToastContext";

interface EventData {
  id?: string | number;
  title?: string;
  date?: string;
  location?: string;
  totalSeats?: number;
  tags?: string;
  description?: string;
  imageUrl?: string;
}

interface EventModalProps {
  open: boolean;
  onClose: () => void;
  mode: "create" | "edit";
  eventData?: EventData | null;
}

export default function EventModal({
  open,
  onClose,
  mode,
  eventData,
}: EventModalProps) {
  const isEdit = mode === "edit";

  // RTK Query mutations
  const [createEvent, { isLoading: isCreating }] = useCreateEventMutation();
  const [updateEvent, { isLoading: isUpdating }] = useUpdateEventMutation();
  const [uploadEventImage, { isLoading: isUploading }] =
    useUploadEventImageMutation();
  const { showToast } = useToast();

  const isSubmitting = isCreating || isUpdating || isUploading;

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    time: "",
    description: "",
    location: "",
    capacity: "",
    tags: "",
    imageFile: null as File | null,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imagePreview, setImagePreview] = useState<string>("");

  // Pre-fill form when editing
  useEffect(() => {
    if (isEdit && eventData) {
      const eventDate = new Date(eventData.date || "");
      const dateStr = eventDate.toISOString().split("T")[0];
      const timeStr = eventDate.toTimeString().slice(0, 5); // HH:MM format

      setFormData({
        title: eventData.title || "",
        date: dateStr,
        time: timeStr,
        description: eventData.description || "",
        location: eventData.location || "",
        capacity: eventData.totalSeats?.toString() || "",
        tags: eventData.tags || "",
        imageFile: null,
      });

      if (eventData.imageUrl) {
        setImagePreview(eventData.imageUrl);
      }
    } else {
      // Reset form for create mode
      setFormData({
        title: "",
        date: "",
        time: "",
        description: "",
        location: "",
        capacity: "",
        tags: "",
        imageFile: null,
      });
      setImagePreview("");
    }
    setErrors({});
  }, [isEdit, eventData, open]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.date) {
      newErrors.date = "Date is required";
    } else {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        newErrors.date = "Date cannot be in the past";
      }
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!formData.location.trim()) {
      newErrors.location = "Location is required";
    }

    if (!formData.capacity) {
      newErrors.capacity = "Capacity is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          image: "File size must be less than 5MB",
        }));
        return;
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        setErrors((prev) => ({
          ...prev,
          image: "Please select a valid image file",
        }));
        return;
      }

      setFormData((prev) => ({
        ...prev,
        imageFile: file,
      }));

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      // Clear image error
      setErrors((prev) => ({
        ...prev,
        image: "",
      }));
    }
  };

  const removeImage = () => {
    setFormData((prev) => ({
      ...prev,
      imageFile: null,
    }));
    setImagePreview(isEdit && eventData?.imageUrl ? eventData.imageUrl : "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      // Combine date and time properly
      let datetime;
      if (formData.time) {
        datetime = new Date(`${formData.date}T${formData.time}`).toISOString();
      } else {
        datetime = new Date(formData.date).toISOString();
      }

      const eventPayload = {
        title: formData.title.trim(),
        date: datetime,
        description: formData.description.trim(),
        location: formData.location.trim(),
        totalSeats: parseInt(formData.capacity),
        tags: formData.tags.trim(),
      };

      let result;

      if (isEdit && eventData?.id) {
        result = await updateEvent({
          id: eventData.id,
          data: eventPayload,
        }).unwrap();

        if (formData.imageFile && result.data?.id) {
          await uploadEventImage({
            eventId: result.data.id,
            imageFile: formData.imageFile,
          }).unwrap();
        }
      } else {
        result = await createEvent(eventPayload).unwrap();

        if (formData.imageFile && result.data?.id) {
          await uploadEventImage({
            eventId: result.data.id,
            imageFile: formData.imageFile,
          }).unwrap();
        }
      }

      onClose();

      showToast({
        type: "success",
        title: isEdit ? "Event Updated" : "Event Created",
        message: `The event "${formData.title}" has been ${
          isEdit ? "updated" : "created"
        } successfully.`,
      });
    } catch (error: any) {
      console.error("Error saving event:", error);

      let errorMessage = `Failed to ${
        isEdit ? "update" : "create"
      } the event. Please try again.`;

      if (error?.data?.message) {
        errorMessage = error.data.message;
      }

      showToast({
        type: "error",
        title: isEdit ? "Update Failed" : "Creation Failed",
        message: errorMessage,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto border-0 shadow-2xl">
        <DialogHeader className="mb-6 pb-4 border-b">
          <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-[#4157FE] to-[#7B8BFF] bg-clip-text text-transparent flex items-center gap-3">
            {isEdit ? (
              <>
                <CalendarIcon className="w-8 h-8 text-[#4157FE]" />
                Edit Event
              </>
            ) : (
              <>
                <CalendarIcon className="w-8 h-8 text-[#4157FE]" />
                Create New Event
              </>
            )}
          </DialogTitle>
          <p className="text-gray-600 mt-2">
            {isEdit
              ? "Update your event details below"
              : "Fill in the details to create an amazing event"}
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label
              htmlFor="title"
              className="text-sm font-semibold text-gray-700 flex items-center gap-2"
            >
              <span className="w-2 h-2 bg-[#4157FE] rounded-full"></span>
              Event Title *
            </Label>
            <Input
              id="title"
              placeholder="Enter an engaging event title..."
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              className={`h-12 text-lg border-2 transition-all duration-200 focus:border-[#4157FE] focus:shadow-lg ${
                errors.title ? "border-red-500" : "border-gray-200"
              }`}
              required
            />
            {errors.title && (
              <p className="text-red-500 text-sm">{errors.title}</p>
            )}
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-[#4157FE]" />
                Date *
              </Label>
              <div className="relative">
                <Input
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange("date", e.target.value)}
                  className={`h-12 border-2 transition-all duration-200 focus:border-[#4157FE] focus:shadow-lg ${
                    errors.date ? "border-red-500" : "border-gray-200"
                  }`}
                  required
                />
              </div>
              {errors.date && (
                <p className="text-red-500 text-sm">{errors.date}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <ClockIcon className="w-4 h-4 text-[#4157FE]" />
                Time
              </Label>
              <Input
                type="time"
                value={formData.time}
                onChange={(e) => handleInputChange("time", e.target.value)}
                className="h-12 border-2 border-gray-200 transition-all duration-200 focus:border-[#4157FE] focus:shadow-lg"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <span className="w-2 h-2 bg-[#4157FE] rounded-full"></span>
              Description *
            </Label>
            <Textarea
              placeholder="Describe your event in detail..."
              rows={4}
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              className={`border-2 transition-all duration-200 focus:border-[#4157FE] focus:shadow-lg resize-none ${
                errors.description ? "border-red-500" : "border-gray-200"
              }`}
              required
            />
            {errors.description && (
              <p className="text-red-500 text-sm">{errors.description}</p>
            )}
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <MapPinIcon className="w-4 h-4 text-[#4157FE]" />
              Event Location *
            </Label>
            <Input
              placeholder="Enter venue or location..."
              value={formData.location}
              onChange={(e) => handleInputChange("location", e.target.value)}
              className={`h-12 border-2 transition-all duration-200 focus:border-[#4157FE] focus:shadow-lg ${
                errors.location ? "border-red-500" : "border-gray-200"
              }`}
              required
            />
            {errors.location && (
              <p className="text-red-500 text-sm">{errors.location}</p>
            )}
          </div>

          {/* Capacity and Tags */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <UsersIcon className="w-4 h-4 text-[#4157FE]" />
                Capacity *
              </Label>
              <Select
                value={formData.capacity}
                onValueChange={(value) => handleInputChange("capacity", value)}
              >
                <SelectTrigger
                  className={`h-12 border-2 transition-all duration-200 focus:border-[#4157FE] ${
                    errors.capacity ? "border-red-500" : "border-gray-200"
                  }`}
                >
                  <SelectValue placeholder="Select capacity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10 People</SelectItem>
                  <SelectItem value="20">20 People</SelectItem>
                  <SelectItem value="50">50 People</SelectItem>
                  <SelectItem value="100">100 People</SelectItem>
                  <SelectItem value="150">150 People</SelectItem>
                  <SelectItem value="200">200 People</SelectItem>
                  <SelectItem value="500">500 People</SelectItem>
                </SelectContent>
              </Select>
              {errors.capacity && (
                <p className="text-red-500 text-sm">{errors.capacity}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <TagIcon className="w-4 h-4 text-[#4157FE]" />
                Tags
              </Label>
              <Input
                placeholder="e.g. conference, networking, workshop"
                value={formData.tags}
                onChange={(e) => handleInputChange("tags", e.target.value)}
                className="h-12 border-2 border-gray-200 transition-all duration-200 focus:border-[#4157FE] focus:shadow-lg"
              />
            </div>
          </div>

          {/* Image Upload */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-[#4157FE]" />
              Event Image
            </Label>

            {imagePreview ? (
              <div className="relative">
                <div className="relative overflow-hidden rounded-lg border-2 border-gray-200">
                  <img
                    src={imagePreview}
                    alt="Event preview"
                    className="w-full h-48 object-cover"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {formData.imageFile
                    ? `New image: ${formData.imageFile.name}`
                    : "Current image"}
                </p>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg hover:border-[#4157FE] transition-colors duration-200">
                <label htmlFor="image-upload" className="cursor-pointer">
                  <div className="flex flex-col items-center justify-center p-8 text-center">
                    <div className="w-16 h-16 bg-[#4157FE] bg-opacity-10 rounded-full flex items-center justify-center mb-4">
                      <UploadCloud className="w-8 h-8 text-[#4157FE]" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-700 mb-2">
                      Upload Event Image
                    </h4>
                    <p className="text-gray-500 mb-1">
                      Drag and drop your image here, or{" "}
                      <span className="text-[#4157FE] underline">browse</span>
                    </p>
                    <p className="text-xs text-gray-400">
                      Max. 5MB • JPG, PNG, GIF
                    </p>
                  </div>
                </label>
              </div>
            )}

            <input
              id="image-upload"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            {errors.image && (
              <p className="text-red-500 text-sm">{errors.image}</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end items-center gap-4 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="h-12 px-6 border-2 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="h-12 px-8 bg-gradient-to-r from-[#4157FE] to-[#7B8BFF] hover:from-[#7B8BFF] hover:to-[#4157FE] text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {isEdit ? "Updating..." : "Creating..."}
                </>
              ) : (
                <>{isEdit ? "Update Event" : "Create Event"}</>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
