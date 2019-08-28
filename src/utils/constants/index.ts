import _ from 'lodash';

export const HOME_PATH = '/home'
export const EVENT_DETAIL_PATH = '/eventDetails'

export const isObjectEmpty = (obj) => {
  return Object.entries(obj).length === 0 && obj.constructor === Object
}

export const isArrayEqual = (x,y) => {
  return _(x).differenceWith(y, _.isEqual).isEmpty();
}
