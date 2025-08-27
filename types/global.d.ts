interface ApiSuccessResponse<TData> {
  success: boolean;
  message: string;
  data: TData;
  errors: null;
}

interface ApiErrorResponse {
  success: boolean;
  message: string;
  data: null;
  errors: {
    field: string;
    error: string;
  }[];
}

interface RtkQueryError {
  status: number;
  data: ApiErrorResponse;
}

interface IPaginationData<TData> {
  meta: {
    total_items: number;
    total_pages: number;
    current_page: number;
    items_per_page: number;
  };
  success: boolean;
  message: string;
  data: TData[];
}

type IAuth = {
  user: IUser;
  access_token: string;
};

type IUser = {
  id: number;
  email: string;
  fullname: string;
  role?: string;
};

type IEvent = {
  id: number;
  title: string;
  description: string;
  date: string;
  location: string;
  totalSeats: number;
  tags: string;
  imageUrl: string;
  imagePublicId: string;
};

type IBooking = {
  id: number;
  seatsBooked: number;
  userId?: number;
  eventId?: number;
  event: IEvent;
};

type ISeatInfo = {
  eventId: number;
  totalSeats: number;
  bookedSeats: number;
  availableSeats: number;
};
