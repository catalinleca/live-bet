import * as React from 'react';
import {
  Divider,
  Grid, Paper, TextField,
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
import BetSlipItem from "../../components/BetSlipItem/BetSlipItem";
import EventTypeWidget from "../../components/EventTypeWidget/EventTypeWidget";
import {isObjectEmpty} from "../../utils/constants";

const styles = (theme: Theme): StyleRules => ({
  root: {},
  betSlipTitle: {
    backgroundColor: 'teal',
    color: 'white'
  },
  betSlipContainer: {
    border: '2px solid teal',
    borderRadius: '5px'
  },
  paperContainer: {
    position: 'fixed'
  },
  outcomesContainer: {
    maxHeight: '500px',
    overflow: 'auto'
  },
  dividerStyle: {
    backgroundColor: 'teal',
    height: '4px'
  },
  addBets: {
    margin: '8px 0'
  }

});

interface IBetSlipComponentProps {
  betSlipOutcomes?: any;
  removeItem?: any;
  initialBet?: any;
  setInitialBet?: any;
}

//from state
interface IBetSlipProps extends IBetSlipComponentProps {
}

type BetSlipType = IBetSlipProps & WithStyles<keyof ReturnType<typeof styles>>;

class BetSlip extends React.Component<BetSlipType, {}> {
  render() {
    const {
      classes,
      betSlipOutcomes,
      removeItem,
      initialBet,
      setInitialBet
    } = this.props;


    const allOutcomes: Array<any> = [];
    Object.values(betSlipOutcomes).forEach( (marketName, index) => {
      Object.values(marketName).forEach( (outcome: any, index) => {
        allOutcomes.push(parseFloat(outcome.price.decimal))
      })
    })

    const totalShare = allOutcomes.reduce( (acc, currentValue) => acc * currentValue, 1)

    return (
      <React.Fragment>
        <Paper
          className={classes.paperContainer}
        >
          <Grid
            container={true}
            direction='column'
            className={classes.betSlipContainer}
          >
            <Grid
              container={true}
              justify='center'
              className={classes.betSlipTitle}
            >
              <Typography>
                Your bet slip
              </Typography>
              <Divider/>
            </Grid>
            <Grid
              className={classes.outcomesContainer}
            >
            {
              !isObjectEmpty(betSlipOutcomes)
                ? Object.keys(betSlipOutcomes).map( (eventName: any, index) => {
                  const market = betSlipOutcomes[eventName];
                  return !isObjectEmpty(market)
                    && (
                    <Grid
                      key={`${index}${eventName}${market.marketId}`}
                    >
                      <EventTypeWidget
                        text={eventName}
                      />
                      {
                        Object.keys(market).map( (marketName: any, index) => {
                          const outcome = market[marketName];
                          return (
                            <Grid
                              key={`${index}${marketName}${outcome.outcomeId}`}
                            >
                              <BetSlipItem
                                eventName={eventName}
                                marketName={marketName}
                                outcome={outcome}
                                removeItem={removeItem}
                              />
                            </Grid>
                          )
                        })
                      }
                    </Grid>
                  )
                })
                : (
                  <Grid
                    container={true}
                    justify='center'
                    className={classes.addBets}
                  >
                    <Typography variant='caption' color='textSecondary'>
                      Add Bets
                    </Typography>
                  </Grid>
                )
            }
            </Grid>

          <Divider
            className={classes.dividerStyle}
          />
          <Grid
            container={true}
            alignItems='center'
            justify='space-between'
            spacing={2}
            style={{
              padding: '8px'
            }}
          >
            <Grid
              item={true}
              xs={12}
              md={6}
            >
              <TextField
                id='initial-bet'
                label='Initial Bet'
                value={initialBet}
                type='number'
                onChange={setInitialBet}
              />
            </Grid>
            <Grid
              item={true}
              xs={12}
              md={6}
            >
              <Typography>Total Share is: {totalShare.toFixed(2)}</Typography>
            </Grid>
            <Grid
              item={true}
              xs={12}
            >
              <Typography>Total Prize is: {(initialBet * totalShare).toFixed(2)}</Typography>
            </Grid>
          </Grid>
          </Grid>

        </Paper>
      </React.Fragment>
    );
  }
}

export default compose<React.ComponentClass<IBetSlipComponentProps>>(
  withStyles(styles),
)(BetSlip);
