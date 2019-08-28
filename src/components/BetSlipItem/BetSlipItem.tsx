import * as React from 'react';
import {
  Divider,
  Grid, IconButton,
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
import Price from "../Price/Price";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

const styles = (theme: Theme): StyleRules => ({
  root: {}
});

interface IBetSlipItemComponentProps {
  marketName?: any;
  eventName?: any;
  outcome?: any;
  removeItem?: any;
}

//from state
interface IBetSlipItemProps extends IBetSlipItemComponentProps {
}

type BetSlipItemType = IBetSlipItemProps & WithStyles<keyof ReturnType<typeof styles>>;

const BetSlipItem: React.FC<BetSlipItemType> = ({classes, eventName, removeItem, marketName, outcome}) => {

  return (
    <React.Fragment>
      {
        marketName &&
        <Grid
          container={true}
          direction='column'
        >
          <Grid
            item={true}
          >
            <Grid
              container={true}
              direction='row'
              alignItems='center'

            >
              <Grid
                container={true}
                item={true}
                direction='row'
                justify='space-between'
                alignItems='center'
                spacing={1}
                style={{
                  padding: '8px'
                }}
                xs={11}
              >
                <Grid
                  item={true}
                  xs={12}
                >
                  {marketName}
                </Grid>
                <Grid
                  item={true}
                  md={6}
                  xs={12}
                >
                  {outcome.name}
                </Grid>
                <Grid
                  item={true}
                  xs={12}
                  md={6}
                >
                  <Price
                    price={outcome.price}
                  />
                </Grid>
              </Grid>
              <Grid
                item={true}
                xs={1}
              >
                <IconButton
                  onClick={() => removeItem(eventName, marketName)}
                >
                  <FontAwesomeIcon icon='times' size='xs'/>
                </IconButton>
              </Grid>
            </Grid>
          </Grid>
          <Divider/>
        </Grid>
      }
    </React.Fragment>
  );
}

export default compose<React.ComponentClass<IBetSlipItemComponentProps>>(
  withStyles(styles),
)(BetSlipItem);
