import * as React from 'react';
import {
  Divider,
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
import EventTypeWidget from "../EventTypeWidget/EventTypeWidget";
import OutcomeElement from "../OutcomeElement/OutcomeElement";

const styles = (theme: Theme): StyleRules => ({
  root: {}
});

interface ICorrectScoreOutcomesComponentProps {
  outcomes?: any;
  market?: any
  event?: any
  updateSlip?: any
}

//from state
interface ICorrectScoreOutcomesProps extends ICorrectScoreOutcomesComponentProps {
}

type CorrectScoreOutcomesType = ICorrectScoreOutcomesProps & WithStyles<keyof ReturnType<typeof styles>>;

const CorrectScoreOutcomes: React.FC<CorrectScoreOutcomesType> = ({classes, outcomes, market, event, updateSlip}) => {
  const outcomesByType = Object.values(outcomes).reduce( (acc, currentValue: any) => {
    return {
      ...acc,
      [currentValue.type]: acc[currentValue.type] ? [...acc[currentValue.type], currentValue] : [currentValue]
    }
  }, {})

  return (
    <Grid
      container={true}
      direction='row'
      alignItems='flex-start'
    >
      {
        outcomesByType &&
          Object.keys(outcomesByType).map ( (key, index) => {
            return (
              <Grid
                key={`${key}${index}`}
                container={true}
                item={true}
                direction='column'
                xs={4}
                style={{
                  padding: '8px'
                }}
              >
                <Grid
                  style={{
                    paddingBottom: '4px'
                  }}
                >
                  <EventTypeWidget
                    text={key}
                  />
                </Grid>
                {
                  outcomesByType[key].map( (outcome, index) => {
                    return (
                      <Grid
                        key={`${key}${index}${outcome.outcomeId}`}
                      >
                        <OutcomeElement
                          outcome={outcome}
                          market={market}
                          event={event}
                          updateSlip={updateSlip}
                        />
                        <Divider/>
                      </Grid>
                    )
                  })
                }
              </Grid>
            )
          })
      }
    </Grid>
  );
}

export default compose<React.ComponentClass<ICorrectScoreOutcomesComponentProps>>(
  withStyles(styles),
)(CorrectScoreOutcomes);
