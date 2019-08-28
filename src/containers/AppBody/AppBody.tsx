import * as React from 'react';
import {
  Button,
  Grid,
  withStyles,
} from '@material-ui/core';
import {
  compose,
} from 'redux';
import {Switch, Route, Redirect} from 'react-router-dom';
import Home from "../Home/Home";
import {EVENT_DETAIL_PATH, HOME_PATH, isObjectEmpty} from "../../utils/constants";
import EventDetailsPage from "../EventDetailsPage/EventDetailsPage";
import BetSlip from "../BetSlip/BetSlip";
import _ from 'lodash';


const styles = () => ({
  root: {}
});

interface IIndexSignature {
  [key: string]: any;
}

interface plm {
  [key: string]: {
    [key: string]: {
      [key: string]: any
    }
  }
}

export const AppBodyContext = React.createContext({} as any)

class AppBody extends React.Component {
  public state : {
    betSlipOutcomes: IIndexSignature,
    initialBet: number,
    isDecimal: boolean
  } = {
    betSlipOutcomes: {},
    initialBet: 10,
    isDecimal: true
  }

  public updateSlip = ({event, market, outcome}) => {

    const {
      betSlipOutcomes
    } = this.state;

    let newBetSlip: IIndexSignature = {
      ...betSlipOutcomes
    }

    newBetSlip[event.name] = {
      ...betSlipOutcomes[event.name],
      [market.name]: outcome
    }

    this.setState({
      betSlipOutcomes: newBetSlip
    })

  }

  public removeItem = (eventName, marketName) => {

    const newState = _.cloneDeep(this.state.betSlipOutcomes);

    delete newState[eventName][marketName]

    isObjectEmpty(newState[eventName]) && delete newState[eventName]

    this.setState({
      betSlipOutcomes: newState
    })
  }

  public setInitialBet = (e) => {
    this.setState({initialBet: e.target.value})
  }

  public setIsDecimal = (value: Boolean) => this.setState({isDecimal: value})


  render() {
  const {
      betSlipOutcomes,
      initialBet,
      isDecimal
    } = this.state;

    const togglePriceButton = (
      <Grid
        style={{
          margin: '0 auto',
          padding: '8px'
        }}
      >
        <Button
          variant='contained'
          color='primary'
          onClick={() => this.setIsDecimal(!this.state.isDecimal)}
        >
          {
            isDecimal ? 'Decimal' : 'Fractional'
          }
        </Button>
      </Grid>
    )

    return (
      <React.Fragment>
        <AppBodyContext.Provider
          value={{
            updateSlip: this.updateSlip,
            isDecimal: this.state.isDecimal,
          }}
        >
          {togglePriceButton}
          <Grid
            container={true}
            direction='row'
            alignItems='flex-start'
            justify='space-around'
          >
            <Grid
              item={true}
              xs={7}
            >
              <Switch>
                <Redirect from={`/`} to={`${HOME_PATH}`} exact={true}/>
                <Route path={`${HOME_PATH}`} component={Home}/>
                <Route path={`${EVENT_DETAIL_PATH}/:id`} component={EventDetailsPage}/>
              </Switch>
            </Grid>
            <Grid
              item={true}
              xs={4}
            >
              <BetSlip
                betSlipOutcomes={betSlipOutcomes}
                removeItem={this.removeItem}
                initialBet={initialBet}
                setInitialBet={this.setInitialBet}
              />
            </Grid>
          </Grid>
        </AppBodyContext.Provider>
      </React.Fragment>
    );
  }
}

export default compose(
  withStyles(styles),
)(AppBody);
