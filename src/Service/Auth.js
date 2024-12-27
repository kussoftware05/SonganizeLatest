import HttpClient from '@Utils/HttpClient';
import Storage from '@Utils/Storage';

async function register(data) {
  let endpoint = 'user/register';
  return HttpClient.post(endpoint, data);
}
async function updateprofile(data) {
  let endpoint = 'user';
  return HttpClient.put(endpoint, data);
}
async function updatePassword(data) {
  let endpoint = 'user/password';
  return HttpClient.put(endpoint, data);
}
async function login(data) {
  let endpoint = 'user/login';
  return HttpClient.post(endpoint, data);
}

async function guestLogin() {
  let endpoint = 'user/login-guest';
  return HttpClient.get(endpoint);
}

async function getOtp(data) {
  let endpoint = 'user/login-otp';
  return HttpClient.post(endpoint, data);
}

async function verifyOtp(data) {
  let endpoint = 'user/login-otp-check';
  return HttpClient.post(endpoint, data);
}

async function forgotPasswordEmailCheck(data) {
  let endpoint = 'user/forget-otp-request';
  return HttpClient.post(endpoint, data);
}

async function resetPassword(data) {
  let endpoint = 'user/forget-otp-check';
  return HttpClient.post(endpoint, data);
}

async function uploadPic(data) {
  let endpoint = 'user/upload';
  return HttpClient.FileUpload(endpoint, data);
}

async function getOrganizer() {
  let endpoint = 'admin/organizer-type';
  return HttpClient.get(endpoint);
}

async function getMusic() {
  let endpoint = 'admin/music-type';
  return HttpClient.get(endpoint);
}

async function getEvent() {
  let endpoint = 'admin/event-type';
  return HttpClient.get(endpoint);
}

async function getDrinks() {
  let endpoint = 'admin/favorite-drink';
  return HttpClient.get(endpoint);
}

async function addDrinks(data) {
  let endpoint = 'user/add-favoritedrink';
  return HttpClient.post(endpoint, data);
}

async function getStates() {
  let endpoint = 'state';
  return HttpClient.get(endpoint);
}

async function getCity(id) {
  let endpoint = 'city/' + id;
  return HttpClient.get(endpoint);
}

async function findUser(data) {
  let endpoint = 'user/find';
  return HttpClient.post(endpoint, data);
}

async function viewOrganizerProfile(id) {
  let endpoint = 'organizer/profile/' + id;
  return HttpClient.get(endpoint);
}

async function getActivity() {
  let endpoint = 'user/active';
  return HttpClient.get(endpoint);
}

async function followOrganizer(data) {
  let endpoint = 'organizer/follow';
  return HttpClient.post(endpoint, data);
}

async function getAccount() {
  return await Storage.get('account');
}

async function setAccount(data) {
  return await Storage.set('account', data);
}

async function getToken() {
  return await Storage.get('token');
}

async function setToken(data) {
  return await Storage.set('token', data);
}

async function logout() {
  return await Storage.set('account', null);
}
async function setWatchlist(data) {
  return await Storage.set('watchList', data);
}

async function getWatchList() {
  return await Storage.get('watchList');
}

export default {
  register,
  updateprofile,
  updatePassword,
  login,
  guestLogin,
  getOtp,
  verifyOtp,
  forgotPasswordEmailCheck,
  resetPassword,
  logout,
  getAccount,
  setAccount,
  getToken,
  setToken,
  setWatchlist,
  getWatchList,
  getOrganizer,
  getMusic,
  getEvent,
  getDrinks,
  addDrinks,
  getStates,
  getCity,
  findUser,
  viewOrganizerProfile,
  getActivity,
  uploadPic,
  followOrganizer,
};
