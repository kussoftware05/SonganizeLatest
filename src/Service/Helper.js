import momentTimezone from 'moment-timezone';
import moment from 'moment';

const year = new Date().getFullYear();

const renderDate = (date, timeZone) => {
  let convertTime = momentTimezone.tz(date, timeZone);
  // return moment(convertTime).format('LT');
  if (year === new Date(convertTime).getFullYear()) {
    return moment(convertTime).format('MMMM Do');
  } else {
    return moment(convertTime).format('LL');
  }
};

const renderTime = (time, timeZone) => {
  //console.log('timeZone=>>>', timeZone);
  let convertTime = momentTimezone.tz(time, timeZone);
  return moment(new Date(convertTime)).format('LT');
  // return convertTime;
};

const checkDateTimeStatus = (
  startDate,
  startTime,
  endDate,
  endTime,
  timeZone,
) => {
  let convertDate = momentTimezone.tz(startDate, timeZone);

  let convertTime = momentTimezone.tz(startTime, timeZone);

  let convertEndDate = momentTimezone.tz(endDate, timeZone);

  let convertEndTime = momentTimezone.tz(endTime, timeZone);

  let dateFrom =
    moment(convertDate).format('L') +
    ' ' +
    moment(new Date(convertTime)).format('LTS');
  let dateTo =
    moment(convertEndDate).format('L') +
    ' ' +
    moment(new Date(convertEndTime)).format('LTS');
  let dateCheck = momentTimezone.tz(moment(new Date()).format(), timeZone);
  let newDateCheck =
    moment(dateCheck).format('MM/DD/YYYY') +
    ' ' +
    moment(dateCheck).format('LTS');

  if (
    new Date(newDateCheck) > new Date(dateFrom) &&
    new Date(newDateCheck) < new Date(dateTo)
  ) {
    return true;
  } else {
    return false;
  }
};

const ticketDateTimeStatus = (
  startDate,
  startTime,
  endDate,
  endTime,
  timeZone,
) => {
  let convertDate = momentTimezone.tz(startDate, timeZone);

  let convertTime = momentTimezone.tz(startTime, timeZone);

  let convertEndDate = momentTimezone.tz(endDate, timeZone);

  let convertEndTime = momentTimezone.tz(endTime, timeZone);

  let dateFrom =
    moment(convertDate).format('L') +
    ' ' +
    moment(new Date(convertTime)).format('LTS');
  let dateTo =
    moment(convertEndDate).format('L') +
    ' ' +
    moment(new Date(convertEndTime)).format('LTS');
  let dateCheck = momentTimezone.tz(moment(new Date()).format(), timeZone);
  let newDateCheck =
    moment(dateCheck).format('MM/DD/YYYY') +
    ' ' +
    moment(dateCheck).format('LTS');

  //console.log('dateFrom', moment(dateFrom).format('lll'));
  //console.log('newDateCheck', moment(newDateCheck).format('lll'));
  if (
    new Date(newDateCheck) > new Date(dateFrom) &&
    new Date(newDateCheck) < new Date(dateTo)
  ) {
    return 'live';
  } else if (
    new Date(newDateCheck) < new Date(dateFrom) &&
    new Date(newDateCheck) < new Date(dateTo)
  ) {
    return 'not_started';
  } else if (
    new Date(newDateCheck) > new Date(dateFrom) &&
    new Date(newDateCheck) > new Date(dateTo)
  ) {
    return 'expired';
  }
};

const eventCompleteCheck = (endDate, endTime, timeZone) => {
  let convertEndDate = momentTimezone.tz(endDate, timeZone);

  let convertEndTime = momentTimezone.tz(endTime, timeZone);

  let dateTo =
    moment(convertEndDate).format('L') +
    ' ' +
    moment(new Date(convertEndTime)).format('LTS');
  let dateCheck = momentTimezone.tz(moment(new Date()).format(), timeZone);
  let newDateCheck =
    moment(dateCheck).format('MM/DD/YYYY') +
    ' ' +
    moment(dateCheck).format('LTS');

  // console.log('dateFrom', moment(dateFrom).format('lll'));
  // console.log('newDateCheck', moment(newDateCheck).format('lll'));
  if (new Date(newDateCheck) > new Date(dateTo)) {
    return true;
  } else {
    return false;
  }
};

const renderFavDrinks = data => {
  if (!data) {
    return null;
  }
  if (Object.keys(data).length > 0 && data.length > 0) {
    return data.map((i, key) => {
      if (data.length == key + 1) {
        return i.name;
      } else {
        return i.name + ',';
      }
    });
  } else {
    return null;
  }
};

export default {
  renderTime,
  renderDate,
  checkDateTimeStatus,
  ticketDateTimeStatus,
  eventCompleteCheck,
  renderFavDrinks,
};
