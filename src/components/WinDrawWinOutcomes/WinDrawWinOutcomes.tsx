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
import OutcomeElement from "../OutcomeElement/OutcomeElement";

const styles = (theme: Theme): StyleRules => ({
  root: {},
  miniContainer: {
    border: '1px solid grey',
    borderRadius: '6px',
    padding: '4px',
    margin: '2px',
  }
});

interface IWinDrawWinOutcomesComponentProps {
  outcomes?: any;
  market?: any;
  event?: any;
  updateSlip?: any
}

//from state
interface IWinDrawWinOutcomesProps extends IWinDrawWinOutcomesComponentProps {
}

type WinDrawWinOutcomesType = IWinDrawWinOutcomesProps & WithStyles<keyof ReturnType<typeof styles>>;

const WinDrawWinOutcomes: React.FC<WinDrawWinOutcomesType> = ({classes, outcomes, market, event, updateSlip}) => {
  return (
    <Grid
      container={true}
      direction='row'
      alignItems='center'
      justify='space-between'
    >
      {
        outcomes.map( (outcome, index) =>
          <Grid
            item={true}
            key={`${outcome.outcomeId}${index}`}
            xs={4}
          >
            <Grid
             className={classes.miniContainer}
            >
              <OutcomeElement
                outcome={outcome}
                market={market}
                event={event}
                updateSlip={updateSlip}
              />
            </Grid>
          </Grid>
        )
      }
    </Grid>
  );
}

export default compose<React.ComponentClass<IWinDrawWinOutcomesComponentProps>>(
  withStyles(styles),
)(WinDrawWinOutcomes);