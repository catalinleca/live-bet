import * as React from 'react';
import {
  Grid,
  Theme,
  withStyles,
  WithStyles,
} from '@material-ui/core';
import {
  StyleRules
} from '@material-ui/core/styles';
import {
  compose,
} from 'redux';
import {messageTypes, sendMessage} from "../../websocket/websocket";
import EventElement from "../../components/EventElement/EventElement";
import {w} from "../../index";
import EventTypeWidget from "../../components/EventTypeWidget/EventTypeWidget";
import {isObjectEmpty} from "../../utils/constants";
import _ from 'lodash';

const styles = (theme: Theme): StyleRules => ({
  root: {},
  eventType: {
    height: '40px',
    margin: 'auto',
    backgroundColor: '#0077AD',
    width: '100%',
    borderRadius: '5px',
    color: 'white'
  }
});

interface IIndexSignature {
  [key: string]: any;
}

interface IHomeComponentProps {
  liveUpdateOutcome?: any
  liveUpdateMarket?: any
}

//from state
interface IHomeProps extends IHomeComponentProps {
}

type HomeType = IHomeProps & WithStyles<keyof ReturnType<typeof styles>>;

class Home extends React.Component<HomeType, {}> {
  public events: any = [];
  public markets: IIndexSignature = {};
  public outcomes: IIndexSignature = {};
  public state = {
    categories: {},
    eventNameMap: {},
    markets: {},
    outcomes: {}
  }

  public stateManagement = (data) => {
    if (data.type === 'LIVE_EVENTS_DATA') {
      const events = data.data;

      const eventNameMap = events.reduce( (acc, currentValue: any) => {
        return {
          ...acc,
          [currentValue.eventId]: currentValue.name
        }
      })


      const categories = events.reduce( (acc, currentValue) => {
        if (currentValue.linkedEventTypeName) {
          return {
            ...acc,
            [currentValue.linkedEventTypeName]: {
              ...acc[currentValue.linkedEventTypeName],
              [currentValue.eventId]: {...currentValue}
            }
          }
        } else {
          return {
            ...acc,
            [currentValue.typeName]: {
              ...acc[currentValue.typeName],
              [currentValue.eventId]: {...currentValue}
            }
          }
        }
      }, {})


      this.setState({
        categories: categories,
        eventNameMap
      })
    }
    else if (data.type === 'MARKET_DATA') {
      const market = data.data

      this.markets = {
        ...this.markets,
        [market.eventId]: {
          [market.marketId]: market
        }
      }

    }
    else if (data.type === 'OUTCOME_DATA') {
      const outcome = data.data;

      const currentOutcomeValue = this.outcomes[outcome.marketId]

      this.outcomes = {
        ...this.outcomes,
        [outcome.marketId]:{
          ...currentOutcomeValue,
          [outcome.outcomeId]: outcome
        }
      }

    }
    else if (data.type === 'MARKET_STATUS') {
      const {
        markets,
        eventNameMap
      } = this.state;

      const changedMarket = data.data;

      console.log(`${data.type} changed: ${markets[changedMarket.eventId][changedMarket.marketId].name}`)

      const oldMarket = markets[changedMarket.eventId][changedMarket.marketId]

      console.log('oldMarket: ', oldMarket);

      const newMarket = _.cloneDeep(oldMarket);

      newMarket.status = {...changedMarket.status}

      console.log('newMarket: ', newMarket);

      const newMarkets = _.cloneDeep(markets);

      newMarkets[changedMarket.marketId] = {...newMarket}

      // console.log('old state: ', markets);
      // console.log('new state: ', newMarkets)

      /** liveUpdateMarket */

      const eventName = eventNameMap[changedMarket.eventId];

      const updateMarket = _.cloneDeep(newMarket);
      console.log('updateMarket: ', updateMarket)


      this.props.liveUpdateMarket(eventName, updateMarket)

      console.log('Will change in 5 seconds. Copy market name below')
      console.log(markets[changedMarket.eventId][changedMarket.marketId].name)

      setTimeout( () => {
        this.setState({
          markets: newMarkets
        })
        console.log('changed')
      }, 5000)
    }
    else  if (data.type === 'PRICE_CHANGE' || data.type === 'OUTCOME_STATUS') {
      const {
        outcomes,
        markets,
        eventNameMap
      } = this.state;

      const changedOutcome = data.data;

      // console.log('---changedOutcome: ', changedOutcome);


      if (outcomes[changedOutcome.marketId]) {
        console.log(`${data.type} changed: ${markets[changedOutcome.eventId][changedOutcome.marketId].name} --> ${outcomes[changedOutcome.marketId][changedOutcome.outcomeId].name}`)

        const oldOutcome = outcomes[changedOutcome.marketId][changedOutcome.outcomeId]

        console.log('oldOutcome: ', oldOutcome);

        const newOutcome = _.cloneDeep(oldOutcome);

        newOutcome.price = {...changedOutcome.price}
        newOutcome.status = {...changedOutcome.status}

        console.log('newOutcome: ', newOutcome);

        const newOutcomes = _.cloneDeep(outcomes);

        newOutcomes[changedOutcome.marketId][changedOutcome.outcomeId] = {...newOutcome}

        // console.log('old state: ', outcomes)
        // console.log('new state: ', newOutcomes)

        /** updateLiveSlip */
        const eventName = eventNameMap[changedOutcome.eventId]
        const market = markets[changedOutcome.eventId][changedOutcome.marketId]

        const updateOutcome = _.cloneDeep(newOutcome)

        this.props.liveUpdateOutcome(eventName, market, updateOutcome)

        console.log('Will change in 5 seconds. Copy market name below')
        console.log(markets[changedOutcome.eventId][changedOutcome.marketId].name)

        setTimeout( () => {
          this.setState({
            outcomes: newOutcomes
          })
          console.log('changed')
        }, 5000)

      }
    }
    else if (data.type === 'ERROR' && data.data.actionType === 'setMarkets') {
      this.setMarkets()
    }
    else if (data.type === 'ERROR' && data.data.actionType === 'setOutcomes') {
      this.setOutcomes()
    }
  }

  componentDidMount() {
    w.onmessage = data => this.stateManagement(JSON.parse(data.data))


    sendMessage(messageTypes.getLiveEventsType, {primaryMarkets: true})
  }

  public setMarkets = () => {
    this.setState({
      markets: this.markets
    })
  }

  public setOutcomes = () => {
    this.setState({
      outcomes: this.outcomes
    })
  }

  public getAllEventOutcomes = (event) => {
    const {
      outcomes
    } = this.state

    return {[event.markets[0]]: outcomes[event.markets[0]]};
  }


  render() {
    const {
      markets,
      categories
    } = this.state;

    return (
      <React.Fragment>
        <Grid
          container={true}
          justify='flex-start'
          direction='column'
        >
            {
              categories && !isObjectEmpty(categories) &&
                Object.keys(categories).map( (key, index) => {
                  const category = categories[key];
                  return (
                    <Grid
                      key={`${key}${index}`}
                      container={true}
                      direction='column'
                    >
                      <EventTypeWidget
                        text={key}
                      />
                      {
                        category && !isObjectEmpty(category) &&
                        Object.values(category).map((event: any, index) => {
                          return (
                            <Grid key={`${index}${key}${event.eventId}`}>
                              <EventElement
                                event={event}
                                markets={markets[event.eventId]}
                                outcomes={this.getAllEventOutcomes(event)}
                                setMarkets={this.setMarkets}
                                setOutcomes={this.setOutcomes}
                              />
                            </Grid>
                          )
                        })
                      }
                    </Grid>
                  )
                })
            }
        </Grid>

      </React.Fragment>
    );
  }
}

export default compose<React.ComponentClass<IHomeComponentProps>>(
  withStyles(styles),
)(Home);
