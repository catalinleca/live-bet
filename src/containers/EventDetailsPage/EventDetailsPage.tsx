import * as React from 'react';
import {
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
import Grid from "@material-ui/core/Grid";
import {w} from "../../index";
import {messageTypes, sendMessage} from "../../websocket/websocket";
import EventElement from "../../components/EventElement/EventElement";
import EventTypeWidget from "../../components/EventTypeWidget/EventTypeWidget";
import {isObjectEmpty} from "../../utils/constants";
import _ from 'lodash';

const styles = (theme: Theme): StyleRules => ({
  root: {},
});

interface IIndexSignature {
  [key: string]: any;
}

interface IEventDetailsPageComponentProps {
  event: IIndexSignature
}

//from state
interface IEventDetailsPageProps extends IEventDetailsPageComponentProps {
  match?: any;
}

type EventDetailsPageType = IEventDetailsPageProps & WithStyles<keyof ReturnType<typeof styles>>;

class EventDetailsPage extends React.Component<EventDetailsPageType, {}> {
  public eventMarkets: Array<any> = []
  public marketOutcomes: IIndexSignature = {}
  public totalOutcomes: number = 0;

  public state : {
    event: IIndexSignature,
    eventMarkets: any,
    marketOutcomes: any,
  } = {
    event: {},
    eventMarkets: undefined,
    marketOutcomes: {}
  }

  public stateManagement = (data) => {
    if (data.type === 'EVENT_DATA') {
      const event = data.data;

      this.setState({event})
    }

    else if (data.type === 'MARKET_DATA') {
      const market = data.data

      // const currentMarketValue = this.eventMarkets[market.eventId];

      this.eventMarkets = {
        ...this.eventMarkets,
        [market.marketId]: market
      }

    }

    else if (data.type === 'OUTCOME_DATA') {
      const outcome = data.data;

      const currentOutcomeValue = this.marketOutcomes[outcome.marketId]

      this.marketOutcomes = {
        ...this.marketOutcomes,
        [outcome.marketId]: {
          ...currentOutcomeValue,
          [outcome.outcomeId]: outcome
        }
      }

    }
    else if (data.type === 'PRICE_CHANGE' || data.type === 'OUTCOME_STATUS') {
      const {
        event,
        eventMarkets,
        marketOutcomes
      } = this.state

      const changedOutcome = data.data;

      if (marketOutcomes[changedOutcome.marketId]) {
        console.log(`${data.type} changed: ${event.name} --> ${eventMarkets[changedOutcome.marketId].name} --> ${marketOutcomes[changedOutcome.marketId][changedOutcome.outcomeId].name}`)

        const oldOutcome = marketOutcomes[changedOutcome.marketId][changedOutcome.outcomeId]

        console.log('oldOutcome: ', oldOutcome)

        const newOutcome = _.cloneDeep(oldOutcome)

        newOutcome.price = {...changedOutcome.price}
        newOutcome.status = {...changedOutcome.status}

        console.log('newOutcome: ', newOutcome);

        const newMarketOutcomes = _.cloneDeep(marketOutcomes);

        newMarketOutcomes[changedOutcome.marketId][changedOutcome.outcomeId] = {...newOutcome}

        // console.log('oldState: ', marketOutcomes)
        // console.log('newState: ', newMarketOutcomes)

        this.setState({
          marketOutcomes: newMarketOutcomes
        })
      }


    }
    else if (data.type === 'MARKET_STATUS') {
      const {
        event,
        eventMarkets
      } = this.state;

      const changedMarket = data.data;

      console.log(`${data.type} changed: ${event.name} --> ${eventMarkets[changedMarket.marketId].name}`)

      const oldMarket = eventMarkets[changedMarket.marketId]

      console.log('oldMarket: ', oldMarket);

      const newMarket = _.cloneDeep(oldMarket);

      newMarket.status = {...changedMarket.status}

      console.log('newMarket: ', newMarket);

      const newEventMarkets = _.cloneDeep(eventMarkets);

      newEventMarkets[changedMarket.marketId] = {...newMarket}

      // console.log('old state eventMarkets: ', eventMarkets);
      // console.log('new state newEventMarkets: ', newEventMarkets)

      this.setState({
        eventMarkets: newEventMarkets
      })
    }
    else if (data.type === 'ERROR' && data.data.actionType === 'setMarkets') {
      this.setMarkets()
    }
    else if (data.type === 'ERROR' && data.data.actionType === 'setOutcomes') {
      this.setOutcomes()
    }
  }

  public setMarkets = () => {

    // const sortedMarkets = this.eventMarkets.sort((a, b) => a.displayOrder - b.displayOrder)

    this.setState({
      eventMarkets: this.eventMarkets
    })
  }

  public setOutcomes = () => {
    this.setState({
      marketOutcomes: this.marketOutcomes
    })
  }

  componentDidMount() {
    const {
      id: eventId
    } = this.props.match.params

    w.onmessage = data => this.stateManagement(JSON.parse(data.data))

    sendMessage(messageTypes.getEventType, {id: +eventId})
  }


  render() {
    const {
      event,
      eventMarkets,
      marketOutcomes
    } = this.state;

    return (
      <React.Fragment>
        <Grid
          container={true}
          direction='column'
        >
          {
            !isObjectEmpty(event) &&
            <Grid>
              <EventTypeWidget
                text={event.linkedEventTypeName || event.typeName}
              />
              <EventElement
                event={event}
                markets={eventMarkets}
                outcomes={marketOutcomes}
                setMarkets={this.setMarkets}
                setOutcomes={this.setOutcomes}
                isDetailPage={true}
              />
            </Grid>
          }
        </Grid>

      </React.Fragment>
    );
  }
}

export default compose<React.ComponentClass<IEventDetailsPageComponentProps>>(
  withStyles(styles),
)(EventDetailsPage);
