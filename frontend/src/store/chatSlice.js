import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../api/client.js';

// Асинхронные действия
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

// Слайс чата
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
        messages: [...state.messages, action.payload], // Создаем новый массив
      };
    },
    addChannel(state, action) {
      return {
        ...state,
        channels: [...state.channels, action.payload], // Создаем новый массив
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
        const updatedChannels = [...state.channels]; // Создаем новый массив
        updatedChannels[index] = action.payload;
        return {
          ...state,
          channels: updatedChannels, // Обновляем каналы с новым массивом
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
      // Добавление подписок через сокеты в редакс
      .addCase('chat/socket/newMessage', (state, action) => ({
        // Добавление нового сообщения через сокет
        ...state,
        messages: [...state.messages, action.payload],
      }))
      .addCase('chat/socket/newChannel', (state, action) => ({
        // Добавление нового канала через сокет
        ...state,
        channels: [...state.channels, action.payload],
      }))
      .addCase('chat/socket/removeChannel', (state, action) => ({
        // Удаление канала через сокет
        ...state,
        channels: state.channels.filter((channel) => channel.id !== action.payload.id),
        messages: state.messages.filter((msg) => msg.channelId !== action.payload.id),
      }))
      .addCase('chat/socket/renameChannel', (state, action) => {
        const index = state.channels.findIndex((channel) => channel.id === action.payload.id);
        if (index !== -1) {
          const updatedChannels = [...state.channels]; // Создаем новый массив
          updatedChannels[index] = action.payload;
          return {
            ...state,
            channels: updatedChannels, // Обновляем каналы с новым массивом
          };
        }
        return state;
      });
  },
});

export const { addMessage, addChannel, removeChannel, renameChannel } = chatSlice.actions;
export default chatSlice.reducer;
