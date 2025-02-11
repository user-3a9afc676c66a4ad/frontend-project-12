import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../api/client.js';

export const fetchChatData = createAsyncThunk('chat/fetchData', async () => {
  const token = localStorage.getItem('token');

  try {
    const channelsResponse = await apiClient.get('/api/v1/channels', { headers: { Authorization: `Bearer ${token}` } });

    const messagesResponse = await apiClient.get('/api/v1/messages', { headers: { Authorization: `Bearer ${token}` } });

    return {
      channels: channelsResponse.data,
      messages: messagesResponse.data,
    };
  } catch (err) {
    throw new Error(`Failed to fetch chat data: ${err.message}`);
  }
});

export const sendMessage = createAsyncThunk('chat/sendMessage', async ({ channelId, body, username }) => {
  const token = localStorage.getItem('token');
  const response = await apiClient.post('/api/v1/messages', { body, channelId, username }, { headers: { Authorization: `Bearer ${token}` } });

  return response.data;
});

export const addNewChannel = createAsyncThunk('chat/addChannel', async (name) => {
  const token = localStorage.getItem('token');
  const response = await apiClient.post('/api/v1/channels', { name }, { headers: { Authorization: `Bearer ${token}` } });

  return response.data;
});

export const removeExistingChannel = createAsyncThunk('chat/removeChannel', async (channelId) => {
  const token = localStorage.getItem('token');
  const response = await apiClient.delete(`/api/v1/channels/${channelId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return response.data;
});

export const renameExistingChannel = createAsyncThunk('chat/renameChannel', async ({ id, name }) => {
  const token = localStorage.getItem('token');
  const response = await apiClient.patch(`/api/v1/channels/${id}`, { name }, { headers: { Authorization: `Bearer ${token}` } });

  return response.data;
});

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    channels: [],
    messages: [],
    username: '',
    status: 'idle',
    error: null,
  },
  reducers: {
    addMessage(state, action) {
      return {
        ...state,
        messages: [...state.messages, action.payload],
      };
    },
    addChannel(state, action) {
      return {
        ...state,
        channels: [...state.channels, action.payload],
      };
    },
    removeChannel(state, action) {
      return {
        ...state,
        channels: state.channels.filter((channel) => channel.id !== action.payload.id),
        messages: state.messages.filter((msg) => msg.channelId !== action.payload.id),
      };
    },
    renameChannel(state, action) {
      const index = state.channels.findIndex((channel) => channel.id === action.payload.id);
      if (index !== -1) {
        const updatedChannels = [...state.channels];
        updatedChannels[index] = action.payload;
        return {
          ...state,
          channels: updatedChannels,
        };
      }
      return state;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChatData.pending, (state) => ({
        ...state,
        status: 'loading',
      }))
      .addCase(fetchChatData.fulfilled, (state, action) => ({
        ...state,
        status: 'succeeded',
        channels: action.payload.channels,
        messages: action.payload.messages,
      }))
      .addCase(fetchChatData.rejected, (state, action) => ({
        ...state,
        status: 'failed',
        error: action.error.message,
      }))
      .addCase('chat/socket/newMessage', (state, action) => ({
        ...state,
        messages: [...state.messages, action.payload],
      }))
      .addCase('chat/socket/newChannel', (state, action) => ({
        ...state,
        channels: [...state.channels, action.payload],
      }))
      .addCase('chat/socket/removeChannel', (state, action) => ({
        ...state,
        channels: state.channels.filter((channel) => channel.id !== action.payload.id),
        messages: state.messages.filter((msg) => msg.channelId !== action.payload.id),
      }))
      .addCase('chat/socket/renameChannel', (state, action) => {
        const index = state.channels.findIndex((channel) => channel.id === action.payload.id);
        if (index !== -1) {
          const updatedChannels = [...state.channels];
          updatedChannels[index] = action.payload;
          return {
            ...state,
            channels: updatedChannels,
          };
        }
        return state;
      });
  },
});

export const {
  // prettier-ignore
  addMessage,
  addChannel,
  removeChannel,
  renameChannel,
} = chatSlice.actions;
export default chatSlice.reducer;
