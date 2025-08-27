// lib/getEventById.ts
export async function getEventById(id: string): Promise<IEvent | null> {
  try {
    if (!id || id === "undefined" || id === "null" || id.trim() === "") {
      console.error("Invalid ID provided:", id);
      return null;
    }

    const apiBaseUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL || process.env.API_BASE_URL;

    if (!apiBaseUrl) {
      console.error("API Base URL not configured");
      return null;
    }

    const url = `${apiBaseUrl}/events/${encodeURIComponent(id)}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Error:", {
        status: response.status,
        statusText: response.statusText,
        body: errorText,
      });
      return null;
    }

    const responseData = await response.json();

    // Handle the API response structure: { success: true, data: {...} }
    const event = responseData.data || responseData;

    if (!event) {
      console.error("No event data found in response");
      return null;
    }

    // Ensure the event has an id
    if (!event.id && !event._id) {
      console.error("Event missing ID field:", event);
      return null;
    }

    // Normalize the id field if needed
    if (!event.id && event._id) {
      event.id = event._id;
    }

    return event;
  } catch (error) {
    console.error("Error fetching event:", error);
    return null;
  }
}
