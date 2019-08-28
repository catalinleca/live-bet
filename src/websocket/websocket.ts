import {w} from '../index'

export enum messageTypes {
  subscribeType = 'subscribe',
  unsubscribeType = 'unsubscribe',
  getEventType = 'getEvent',
  getMarketType = 'getMarket',
  getOutcomeType = 'getOutcome',
  getLiveEventsType = 'getLiveEvents'
}

export const optionsTypes: string[] = Object.keys(messageTypes).map( value => {
  return messageTypes[value]
})


export const sendMessage = (type, options?: any) => {
  w.send(JSON.stringify({
    type,
    ...options
  }))
}


