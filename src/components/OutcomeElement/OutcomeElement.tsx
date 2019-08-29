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
import Price from "../Price/Price";
import {w} from "../../index";
import _ from 'lodash';
import {isObjectEmpty} from "../../utils/constants";
import {messageTypes} from "../../websocket/websocket";

const styles = (theme: Theme): StyleRules => ({
  root: {}
});

interface IIndexSignature {
  [key: string]: any;
}

interface IOutcomeElementComponentProps {
  outcome: any
  market?: any
  event?: any
  updateSlip?: any
}

//from state
interface IOutcomeElementProps extends IOutcomeElementComponentProps {
}

type OutcomeElementType = IOutcomeElementProps & WithStyles<keyof ReturnType<typeof styles>>;

class OutcomeElement extends React.Component<OutcomeElementType, {}> {
  public state : {
    outcome: IIndexSignature
  } = {
    outcome: {}
  }

  public listener = (data) => {
    const {
      event,
      market,
      outcome
    } = this.props;

    // const {
      // outcome
    // } = this.state;

    if (data.type === 'PRICE_CHANGE' || data.type === 'OUTCOME_STATUS') {
      if (data.data.outcomeId === this.state.outcome.outcomeId) {
        console.log(`${data.type} change: ${event.name} -> ${market.name} -> ${outcome.name}`)
        console.log('oldOutcome: ', outcome)
        const newOutcome = _.cloneDeep(outcome);

        newOutcome.price = {...data.data.price}
        newOutcome.status =  {...data.data.status}

        console.log('newOutcome: ', newOutcome);

        this.setState({
          outcome: newOutcome
        })
      }
    }
  }

  componentDidMount() {
    const {
      outcome
    } = this.props;

    // w.addEventListener("message", e => this.listener(JSON.parse(e.data))); // logs all data to console
    w.send(JSON.stringify({type: messageTypes.subscribeType, keys: [`o.${outcome.outcomeId}`], clearSubscription: false}));
    //
    // this.setState({
    //   outcome: {...this.props.outcome}
    // })
  }

  componentWillUnmount(): void {
    w.send(JSON.stringify({ type: messageTypes.unsubscribeType, keys: [`o.${this.props.outcome.outcomeId}`] }));
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   return !(_.isEqual(nextState.outcome, this.state.outcome));
  // }

  shouldComponentUpdate(nextProps, nextState) {
    // console.log('should MarketElement update: ')
    // console.log('this.props: ', this.props)
    // console.log('nextProps: ', nextProps)

    return !(_.isEqual(nextProps, this.props))
  }

  render() {
    const {
      market,
      event: {
        name: eventName
      },
      updateSlip,
      outcome
    } = this.props;

    // console.log('render in OutcomeElement');

    return (
      <React.Fragment>
        {
          !isObjectEmpty(outcome) &&
          outcome.status.displayable
          ? <Grid
              container={true}
              direction='row'
              justify='space-between'
              alignItems='center'
            >
              <Grid>
                {outcome.name}
              </Grid>
              <Grid
                onClick={() => !outcome.status.suspended && updateSlip({eventName, market, outcome})}
              >
                <Price
                  disabled={outcome.status.suspended}
                  price={outcome.price}
                />
              </Grid>
            </Grid>
            : '-'
        }

      </React.Fragment>
    );
  }
}

export default compose<React.ComponentClass<IOutcomeElementComponentProps>>(
  withStyles(styles),
)(OutcomeElement);
