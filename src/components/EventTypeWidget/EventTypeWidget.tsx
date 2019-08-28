import * as React from 'react';
import {
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

const styles = (theme: Theme): StyleRules => ({
  root: {},
  eventType: {
    height: '40px',
    margin: 'auto',
    backgroundColor: '#14B5FE',
    width: '100%',
    borderRadius: '5px',
    color: 'white'
  }
});

interface IEventTypeWidgetComponentProps {
  text: any;
}

//from state
interface IEventTypeWidgetProps extends IEventTypeWidgetComponentProps {
}

type EventTypeWidgetType = IEventTypeWidgetProps & WithStyles<keyof ReturnType<typeof styles>>;

const EventTypeWidget: React.FC<EventTypeWidgetType> = ({classes, text}) => {
  return (
    <Grid
      className={classes.eventType}
      container={true}
      alignItems='center'
      justify='center'
    >
      <Typography color='inherit' variant='body2'>
        {text}
      </Typography>
    </Grid>
  );
}

export default compose<React.ComponentClass<IEventTypeWidgetComponentProps>>(
  withStyles(styles),
)(EventTypeWidget);