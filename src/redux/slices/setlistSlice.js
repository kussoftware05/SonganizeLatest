import {createSlice, createAction} from '@reduxjs/toolkit';
import {
  createSetlist,
  getsetLists,
  getSingleSetlist,
  songShareAction,
  getAddedSongLists,
  deleteSetlistSongsAction,
  getEventSongsListAction,
  getSearchSetListAction,
} from '../services/setlistAction';

const initialState = {
  setlist_name: null,
  loadingStart: false,
  error: null,
  success: false,
  status: null,
  results: [],
  records: {},
  shareLists: [],
  groupNames: [],
  songResults: [],
};
// setlist list
const setlistSlice = createSlice({
  name: 'setlist',
  initialState,
  reducers: {},
  extraReducers: builder => {
    //setlist create
    builder.addCase(createSetlist.pending, state => {
      state.status = 'pending';
    });
    builder.addCase(createSetlist.fulfilled, (state, action) => {
      state.status = 'success';

      state.records = action.payload;
    });
    builder.addCase(createSetlist.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.payload;
    });
    //get single setlist
    builder.addCase(getSingleSetlist.pending, state => {
      state.status = 'pending';
    });
    builder.addCase(getSingleSetlist.fulfilled, (state, action) => {
      state.status = 'success';

      state.records = action.payload;
      state.groupNames = action.payload.group_names;
    });
    builder.addCase(getSingleSetlist.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.payload;
    });
    //song share
    builder.addCase(songShareAction.pending, state => {
      state.status = 'pending';
    });
    builder.addCase(songShareAction.fulfilled, (state, action) => {
      state.status = 'success';
      state.records = action.payload;
    });
    builder.addCase(songShareAction.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.payload;
    });
    // added songlists lists
    builder.addCase(getAddedSongLists.pending, state => {
      state.status = 'pending';
    });
    builder.addCase(getAddedSongLists.fulfilled, (state, action) => {
      state.status = 'success';
      state.songResults = action.payload.res_data;
    });
    builder.addCase(getAddedSongLists.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.payload;
    });
    // delete setlist songs
    builder.addCase(deleteSetlistSongsAction.pending, state => {
      state.status = 'pending';
    });
    builder.addCase(deleteSetlistSongsAction.fulfilled, (state, action) => {
      //console.log('fulfilled');
      state.status = 'success';
      state.songResults = action.payload;
    });
    builder.addCase(deleteSetlistSongsAction.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.payload;
    });
    // event setlist songs list
    builder.addCase(getEventSongsListAction.pending, state => {
      state.status = 'pending';
    });
    builder.addCase(getEventSongsListAction.fulfilled, (state, action) => {
      state.status = 'success';
      state.songResults = action.payload;
    });
    builder.addCase(getEventSongsListAction.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.payload;
    });
  },
});

export default setlistSlice.reducer;

export const selectRecords = state => state.setlist.records;
export const selectGroupNames = state => state.setlist.groupNames;
export const selectSongLists = state => state.setlist.songResults;
