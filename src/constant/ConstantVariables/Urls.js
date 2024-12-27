//const baseUrl = 'https://songanize.com/app_service/szapi.php/';
const baseUrl = 'https://songanize.com/app_service/level3_szapi.php/';
//const baseUrl = 'https://songanize.com/app_service/test.php/';

//export const login = baseUrl + '/login';
export const apiUrl = baseUrl;

// export const login = baseUrl+ '?action=check_user_login';

export const register = baseUrl;

export const groupList = baseUrl+ '?action=get_group_list';

export const groupShare = baseUrl+ '?action=get_groups';

export const createGroup = baseUrl;

export const getGroup = baseUrl+ '?action=get_single_group';

export const updateGroupUrl = baseUrl;

export const deleteGroup = baseUrl+ '?action=delete_group';

export const deleteGroupMember = baseUrl+ '?action=delete_group_member';

export const songanizeList = baseUrl+ '?action=get_songs';

export const getSonganize = baseUrl+ '?action=get_single_song';

export const getHiddenSonganize = baseUrl+ '?action=get_hidden_songs';

export const getSearchSongsList = baseUrl+ '?action=search_song';

export const updateSonganizeUrl = baseUrl;

export const uploadDocsFileUrl = baseUrl;

export const groupShareUrl = baseUrl;

export const getProileUrl = baseUrl+ '?action=get_user_profile';

export const updateProfileUrl = baseUrl;

export const deleteSonganize = baseUrl+ '?action=delete_song';

export const setList = baseUrl+ '?action=get_set_list';

export const addedSongListUrl = baseUrl+ '?action=get_setlist_songs';

export const getSingleList = baseUrl+ '?action=get_single_set_list';

export const downloadSongFileUrl = baseUrl+ '?action=file_download';

export const createSetList = baseUrl;

export const checkUsersUrl = baseUrl;

export const songShareUrl = baseUrl;
