import * as React from 'react';
import {
  Divider, ExpansionPanel, ExpansionPanelDetails, ExpansionPanelSummary,
  Grid,
  Theme, Typography,
  withStyles,
  WithStyles,
} from '@material-ui/core';
import {
  StyleRules
} from '@material-ui/core/styles';
import {
  compose,
} from 'redux';
import {w} from "../../index";
import {messageTypes, sendMessage} from "../../websocket/websocket";
import _ from 'lodash';
import OutcomeElement from "../OutcomeElement/OutcomeElement";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {AppBodyContext} from "../../containers/AppBody/AppBody";
import {isObjectEmpty} from "../../utils/constants";

const styles = (theme: Theme): StyleRules => ({
  root: {
    padding: 0
  },
  header: {
    padding: '8px',
    paddingLeft: '20px',
    color: 'white',
    backgroundColor: '#0077AD'
  },
  outcomeElement: {
    padding: '8px',
    paddingLeft: '16px',
    paddingRight: '16px',
  },
  panelSummary: {
    backgroundColor: '#0077AD',
    border: '2px solid white',
    borderRadius: '10px',
  }
});

interface IIndexSignature {
  [key: string]: any;
}

interface IMarketElementComponentProps {
  market: any
  event?: any
  outcomes: any,
  setOutcomes?: any;
  marketKey?: any;
}

//from state
interface IMarketElementProps extends IMarketElementComponentProps {
}

type MarketElementType = IMarketElementProps & WithStyles<keyof ReturnType<typeof styles>>;

class MarketElement extends React.Component<MarketElementType, {}> {
  public state : {
    market: IIndexSignature
  } = {
    market: {}
  }



  // shouldComponentUpdate(nextProps, nextState) {
  //   return (nextProps.outcomes !== undefined && !isArrayEqual(nextProps.outcomes, this.props.outcomes))|| !(_.isEqual(nextState.market, this.state.market))
  // }

  shouldComponentUpdate(nextProps, nextState) {
    // console.log('should MarketElement update: ')
    // console.log('this.props: ', this.props)
    // console.log('nextProps: ', nextProps)
    // console.log(nextProps.outcomes !== undefined && !_.isEqual(this.props.outcomes, nextProps.outcomes))
    // return (nextProps.outcomes !== undefined && !_.isEqual(this.props.outcomes, nextProps.outcomes)) && (_.isEqual(this.props.market, nextProps.market))

    if (nextProps.outcomes !== undefined) {
      if (!_.isEqual(this.props.outcomes, nextProps.outcomes)) {
        return true
      }
    } else if (!_.isEqual(this.props.market.status, nextProps.market.status)) {
      return true
    }
    // console.log('this.props: ', this.props)
    // console.log('nextProps: ', nextProps)
    return false
  }

  public onClickMarketHandler = () => {
    const {
      market,
      outcomes,
    } = this.props

    !outcomes && market.outcomes && market.outcomes.forEach( (outcomeId, index) => {
      sendMessage(messageTypes.getOutcomeType, {id: outcomeId})

      if (index === market.outcomes.length - 1) {
        sendMessage('setOutcomes')
      }

    })
  }

  public listener = (data) => {
    const {
      event
    } = this.props;

    const {
      market
    } = this.state
    if (data.type === 'MARKET_STATUS') {
      if (data.data.marketId === this.state.market.marketId) {
        console.log(`MARKET_STATUS change: ${event.name} -> ${market.name}`)

        console.log('oldMarket: ', market)
        const newMarket = _.cloneDeep(market);

        newMarket.status =  {...data.data.status}

        console.log('newMarket: ', newMarket);

        this.setState({
          market: newMarket
        })
      }
    }
  }

  componentDidMount() {
    this.props.marketKey < 10 && this.onClickMarketHandler()
    //
    // w.addEventListener("message", e => this.listener(JSON.parse(e.data))); // logs all data to console
    //
    w.send(JSON.stringify({type: messageTypes.subscribeType, keys: [`m.${this.props.market.marketId}`], clearSubscription: false}));
    //
    // this.setState({
    //   market: {...this.props.market}
    // })

  }

  componentWillUnmount(): void {
    w.send(JSON.stringify({ type: messageTypes.unsubscribeType, keys: [`m.${this.props.market.marketId}`] }));
  }

  render() {
    const {
      outcomes,
      classes,
      marketKey,
      event,
      market
    } = this.props

    // console.log('render in MarketElement');

    return (
      <React.Fragment>
        {
          !isObjectEmpty(market) &&
          <ExpansionPanel
            defaultExpanded={marketKey < 10}
            disabled={!market.status.displayable || market.status.suspended}
          >
            <ExpansionPanelSummary
              expandIcon={<FontAwesomeIcon icon='chevron-down' size='xs'/>}
              aria-controls="panel1a-content"
              id="panel1a-header"
              className={classes.panelSummary}
              onClick={this.onClickMarketHandler}
            >
              <Grid
                className={classes.header}
              >
                <Typography variant='h6'>
                  {
                    market.status.displayable && !market.status.suspended
                      ? market.name
                      : !market.status.displayable
                        ? '-'
                        : 'Susp'
                  }
                </Typography>
              </Grid>
            </ExpansionPanelSummary>
            {
              market.status.displayable && !market.status.suspended &&
              <ExpansionPanelDetails
                classes={{
                  root: classes.root
                }}
              >
                <Grid
                  container={true}
                  direction='column'
                >
                  <AppBodyContext.Consumer>
                    { ({updateSlip}) =>

                      outcomes && !isObjectEmpty(outcomes) ?
                        Object.values(outcomes).map( (outcome: any, index) => {
                            return (
                              <Grid
                                key={`${outcome.outcomeId}${index}`}
                              >
                                <Grid
                                  className={classes.outcomeElement}
                                >
                                  <OutcomeElement
                                    outcome={outcome}
                                    market={market}
                                    event={event}
                                    updateSlip={updateSlip}
                                  />
                                </Grid>
                                <Divider/>
                              </Grid>
                            )
                          })
                        : ''
                    }
                  </AppBodyContext.Consumer>
                </Grid>
              </ExpansionPanelDetails>
            }

          </ExpansionPanel>
        }

      </React.Fragment>
    );
  }
}

export default compose<React.ComponentClass<IMarketElementComponentProps>>(
  withStyles(styles),
)(MarketElement);
