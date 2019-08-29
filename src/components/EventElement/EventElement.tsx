import * as React from 'react';
import {
  Button,
  ExpansionPanel, ExpansionPanelDetails, ExpansionPanelSummary, Grid,
  Theme, Tooltip, Typography,
  withStyles,
  WithStyles,
} from '@material-ui/core';
import {
  StyleRules
} from '@material-ui/core/styles';
import {
  compose,
} from 'redux';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import MarketElement from "../MarketElement/MarketElement";
import {messageTypes, sendMessage} from "../../websocket/websocket";
import {Link} from "react-router-dom";
import {EVENT_DETAIL_PATH, isObjectEmpty} from "../../utils/constants";

const styles = (theme: Theme): StyleRules => ({
  root: {
    padding: 0
  }
});

interface IEventElementComponentProps {
  event?: any
  markets?: any
  outcomes?: any
  onClickEventHandler?: any;
  setMarkets?: any;
  setOutcomes?: any;
  isDetailPage?: boolean;
}

//from state
interface IEventElementProps extends IEventElementComponentProps {
}

type EventElementType = IEventElementProps & WithStyles<keyof ReturnType<typeof styles>>;

class EventElement extends React.Component<EventElementType, {}> {

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.markets !== undefined
  }

  render() {
    const {
      event,
      markets,
      outcomes,
      classes,
      setOutcomes,
      isDetailPage
    } = this.props;

    const getEventName = (competitors, scores) => {
      const team1 = {
        ...competitors.filter( competitor => competitor.position === 'home')[0],
        score: scores['home']
      }
      const team2 = {
        ...competitors.filter( competitor => competitor.position === 'away')[0],
        score: scores['away']
      }

      return (
        <Grid
          container={true}
          direction='row'
          alignItems='center'
          justify='space-between'
        >
          <Grid
            item={true}
            xs={5}
            container={true}
            direction='row'
            justify='space-between'
          >
            <Grid item={true} xs={11}>
              <Typography>{team1.name}</Typography>
            </Grid>
            <Grid item={true} xs={1}>
              <Typography>{team1.score}</Typography>
            </Grid>
          </Grid>
          <Grid item={true}>vs</Grid>
          <Grid
            item={true}
            xs={5}
            container={true}
            direction='row'
            justify='space-between'
          >
            <Grid item={true} xs={1}>
              <Typography>{team2.score}</Typography>
            </Grid>
            <Grid item={true} xs={11} style={{textAlign: 'right'}}>
              <Typography>{team2.name}</Typography>
            </Grid>
          </Grid>
        </Grid>
      )

    }

    const onClickEventHandler = ( ) => {
      !markets && event.markets.forEach( (marketId, index) => {
        sendMessage(messageTypes.getMarketType, {id: marketId})

        if (index === event.markets.length - 1) {
          sendMessage('setMarkets')
        }

      })

    }

    // console.log('render in EventElement')

    return (
      <React.Fragment>
        <Grid
          container={true}
          direction='row'
          alignItems='center'
        >
          {
            !isDetailPage &&
            <Grid
              item={true}
              xs={2}
            >
              <Link
                to={`${EVENT_DETAIL_PATH}/${event.eventId}`}
                style={{
                  textDecoration: 'none'
                }}
              >
                <Tooltip title='All Markets' aria-label='all-markets' placement='top'>
                  <Button
                    variant='outlined'
                  >
                    All
                  </Button>
                </Tooltip>
              </Link>
            </Grid>
          }
          <Grid
            item={true}
            xs={!isDetailPage ? 10 : 12}
          >
            <ExpansionPanel>
              <ExpansionPanelSummary
                expandIcon={<FontAwesomeIcon icon='chevron-down' size='xs'/>}
                aria-controls="panel1a-content"
                id="panel1a-header"
                onClick={onClickEventHandler}
              >
                {getEventName(event.competitors, event.scores)}
              </ExpansionPanelSummary>
              <ExpansionPanelDetails
                classes={{
                  root: classes.root
                }}
              >
                <Grid
                  container={true}
                  direction='column'
                  style={{
                    width: '100%'
                  }}
                >
                  {
                    markets && !isObjectEmpty(markets) &&
                      Object.values(markets).map( (market: any, key) => {
                        return (
                          <Grid
                            key={`${key}${market.marketId}`}
                          >
                            <MarketElement
                              marketKey={isDetailPage && key}
                              market={market}
                              event={event}
                              outcomes={outcomes[market.marketId]}
                              setOutcomes={setOutcomes}
                            />
                          </Grid>
                        )
                      })
                  }
                </Grid>
              </ExpansionPanelDetails>
            </ExpansionPanel>
          </Grid>
        </Grid>
      </React.Fragment>
    );
  }
}

export default compose<React.ComponentClass<IEventElementComponentProps>>(
  withStyles(styles),
)(EventElement);
