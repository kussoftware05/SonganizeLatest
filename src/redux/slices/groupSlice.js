import {createSlice, createAction} from '@reduxjs/toolkit';
import {
  getGroupLists,
  createGroup,
  updateGroup,
  getGroup,
  deleteGroup,
  deleteGroupMember,
  getGroupShare,
  getGroupMemberLists,
  deleteGroupPendingMember,
  getGroups,
} from '../services/groupAction';

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
// group list
const groupSlice = createSlice({
  name: 'group',
  initialState,
  reducers: {},
  extraReducers: builder => {
    // group lists
    builder.addCase(getGroupLists.pending, state => {
      state.status = 'pending';
    });
    builder.addCase(getGroupLists.fulfilled, (state, action) => {
      state.status = 'success';
      state.results = action.payload.res_data;
    });
    builder.addCase(getGroupLists.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.payload;
    });
    //group create
    builder.addCase(createGroup.pending, state => {
      state.status = 'pending';
    });
    builder.addCase(createGroup.fulfilled, (state, action) => {
      state.status = 'success';
      state.results.push(action.payload);
    });
    builder.addCase(createGroup.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.payload;
    });
    //get single group
    builder.addCase(getGroup.pending, state => {
      state.status = 'pending';
    });
    builder.addCase(getGroup.fulfilled, (state, action) => {
      state.status = 'success';
      state.group_name = action.group_name;
    });
    builder.addCase(getGroup.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.payload;
    });
    //get all groups
    builder.addCase(getGroups.pending, state => {
      state.status = 'pending';
    });
    builder.addCase(getGroups.fulfilled, (state, action) => {
      state.status = 'success';
      state.group_name = action.group_name;
    });
    builder.addCase(getGroups.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.payload;
    });
    //update group
    builder.addCase(updateGroup.pending, state => {
      state.status = 'pending';
    });
    builder.addCase(updateGroup.fulfilled, (state, action) => {
      state.status = 'success';
      state.results = state.results.map(ele =>
        ele.id === action.payload.id ? action.payload : ele,
      );
    });
    builder.addCase(updateGroup.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.payload;
    });
    //delete group
    builder.addCase(deleteGroup.pending, state => {
      state.status = 'pending';
    });
    builder.addCase(deleteGroup.fulfilled, (state, action) => {
      state.status = 'success';
      state.results = state.results.filter(res => res.id !== action.payload);
    });
    builder.addCase(deleteGroup.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.payload;
    });
    //delete member group
    builder.addCase(deleteGroupMember.pending, state => {
      state.status = 'pending';
    });
    builder.addCase(deleteGroupMember.fulfilled, (state, action) => {
      state.status = 'success';
      state.records = state.records.filter(res => res.id !== action.payload);
    });
    builder.addCase(deleteGroupMember.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.payload;
    });
    //delete pending member group
    builder.addCase(deleteGroupPendingMember.pending, state => {
      state.status = 'pending';
    });
    builder.addCase(deleteGroupPendingMember.fulfilled, (state, action) => {
      state.status = 'success';
      state.records = state.records.filter(res => res.id !== action.payload);
    });
    builder.addCase(deleteGroupPendingMember.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.payload;
    });
    // group share lists
    builder.addCase(getGroupShare.pending, state => {
      state.status = 'pending';
    });
    builder.addCase(getGroupShare.fulfilled, (state, action) => {
      state.status = 'success';
      state.shareLists = action.payload.res_data;
    });
    builder.addCase(getGroupShare.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.payload;
    });
    // get group member lists
    builder.addCase(getGroupMemberLists.pending, state => {
      state.status = 'pending';
    });
    builder.addCase(getGroupMemberLists.fulfilled, (state, action) => {
      state.status = 'success';
      state.results = action.payload.res_data;
    });
    builder.addCase(getGroupMemberLists.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.payload;
    });
  },
});

export default groupSlice.reducer;
