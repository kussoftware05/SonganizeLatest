import {createSlice, createAction} from '@reduxjs/toolkit';
import {
  getCheckUsers,
  getSendInvitation,
  inviteExistingGroup,
  inviteNewGroup,
} from '../services/invitefriendAction';

const initialState = {
  group_name: null,
  loadingStart: false,
  error: null,
  success: false,
  status: null,
  results: [],
  records: [],
  shareLists: [],
};
// friend list
const friendSlice = createSlice({
  name: 'inviteFriend',
  initialState,
  reducers: {},
  extraReducers: builder => {
    // invite friend checks
    builder.addCase(getCheckUsers.pending, state => {
      state.status = 'pending';
    });
    builder.addCase(getCheckUsers.fulfilled, (state, action) => {
      state.status = 'success';
      state.results = action.payload;
    });
    builder.addCase(getCheckUsers.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.payload;
    });
    // invite friend  groups
    builder.addCase(getSendInvitation.pending, state => {
      state.status = 'pending';
    });
    builder.addCase(getSendInvitation.fulfilled, (state, action) => {
      state.status = 'success';
      state.results = action.payload;
    });
    builder.addCase(getSendInvitation.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.payload;
    });
    // invite friend existing groups
    builder.addCase(inviteExistingGroup.pending, state => {
      state.status = 'pending';
    });
    builder.addCase(inviteExistingGroup.fulfilled, (state, action) => {
      state.status = 'success';
      state.results = action.payload;
    });
    builder.addCase(inviteExistingGroup.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.payload;
    });
    // invite friend new groups
    builder.addCase(inviteNewGroup.pending, state => {
      state.status = 'pending';
    });
    builder.addCase(inviteNewGroup.fulfilled, (state, action) => {
      state.status = 'success';
      state.results = action.payload;
    });
    builder.addCase(inviteNewGroup.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.payload;
    });
  },
});

export default friendSlice.reducer;
