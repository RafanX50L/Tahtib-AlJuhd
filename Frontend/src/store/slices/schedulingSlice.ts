import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { SchedulingAPI } from '@/services/implementation/schedulingService';

type Slot = { time: string; duration: number; isBooked: boolean };

interface SchedulingState {
  dateISO: string;
  trainerId?: string;
  slots: Slot[];
  loading: boolean;
  error?: string;
  bookingStatus?: 'idle' | 'pending' | 'success' | 'error';
  calendlyLink?: string;
}

const initialState: SchedulingState = {
  dateISO: new Date().toISOString().slice(0, 10),
  slots: [],
  loading: false,
  bookingStatus: 'idle',
  calendlyLink: undefined,
};

export const fetchAvailability = createAsyncThunk(
  'scheduling/fetchAvailability',
  async ({ trainerId, dateISO }: { trainerId: string; dateISO: string }) => {
    return await SchedulingAPI.getAvailability(trainerId, dateISO);
  }
);

export const bookSlot = createAsyncThunk(
  'scheduling/bookSlot',
  async (payload: { trainerId: string; clientId: string; date: string; time: string; duration?: number }) => {
    return await SchedulingAPI.book(payload);
  }
);

const schedulingSlice = createSlice({
  name: 'scheduling',
  initialState,
  reducers: {
    setDate(state, action: PayloadAction<string>) {
      state.dateISO = action.payload;
    },
    setTrainer(state, action: PayloadAction<string | undefined>) {
      state.trainerId = action.payload;
    },
    setCalendlyLink(state, action: PayloadAction<string | undefined>) {
      state.calendlyLink = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchAvailability.pending, state => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(fetchAvailability.fulfilled, (state, action) => {
        state.loading = false;
        state.slots = action.payload.slots;
      })
      .addCase(fetchAvailability.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(bookSlot.pending, state => {
        state.bookingStatus = 'pending';
      })
      .addCase(bookSlot.fulfilled, state => {
        state.bookingStatus = 'success';
      })
      .addCase(bookSlot.rejected, (state, action) => {
        state.bookingStatus = 'error';
        state.error = action.error.message;
      });
  },
});

export const { setDate, setTrainer, setCalendlyLink } = schedulingSlice.actions;
export default schedulingSlice.reducer;


