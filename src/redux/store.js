import { configureStore } from '@reduxjs/toolkit'
import authSlice, { logout } from './slices/authSlice'
import groupSlice from './slices/groupSlice'
import songanizeSlice from './slices/songanizeSlice'
import profileSlice from './slices/profileSlice'
import setlistSlice from './slices/setlistSlice'
import friendSlice from './slices/invitefriendSlice';

export const store = configureStore({
    reducer: {
        auth: authSlice,
        authRegister : authSlice,
        group: groupSlice,
        songanize : songanizeSlice,
        updateSongs : songanizeSlice,
        songsHiddens : songanizeSlice,
        searchSongs : songanizeSlice,
        deleteSongs: songanizeSlice,
        songanizeLists: songanizeSlice,
        profile : profileSlice,
        setlist : setlistSlice,
        inviteFriend: friendSlice
    },
})