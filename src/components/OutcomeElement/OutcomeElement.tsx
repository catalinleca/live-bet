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
    increased: any
  } = {
    increased: undefined
  }

  componentDidMount() {
    const {
      outcome
    } = this.props;

    w.send(JSON.stringify({type: messageTypes.subscribeType, keys: [`o.${outcome.outcomeId}`], clearSubscription: false}));
  }

  componentWillUnmount(): void {
    w.send(JSON.stringify({ type: messageTypes.unsubscribeType, keys: [`o.${this.props.outcome.outcomeId}`] }));
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !(_.isEqual(nextProps, this.props)) || this.state.increased !== nextState.increased
  }

  componentDidUpdate(nextProps) {
    const oldValue = parseFloat(this.props.outcome.price.decimal)
    const newValue = parseFloat(nextProps.outcome.price.decimal)

    oldValue !== newValue &&
      this.setState({
        increased: newValue > oldValue
      })
  }

  render() {
    const {
      market,
      event: {
        name: eventName
      },
      updateSlip,
      outcome,
    } = this.props;

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
              wrap='nowrap'
            >
              <Grid>
                {outcome.name}
              </Grid>
              <Grid
                onClick={() => !outcome.status.suspended && updateSlip({eventName, market, outcome})}
              >
                <Price
                  disabled={outcome.status.suspended}
                  increased={this.state.increased}
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
