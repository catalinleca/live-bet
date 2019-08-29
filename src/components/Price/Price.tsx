import * as React from 'react';
import {
  Button,
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
import {AppBodyContext} from "../../containers/AppBody/AppBody";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

const styles = (theme: Theme): StyleRules => ({
  root: {},
  buttonStyle: {
    width: '40px'
  }
});

interface IPriceComponentProps {
  price: any,
  disabled?: boolean
  increased?: any;
}

//from state
interface IPriceProps extends IPriceComponentProps {
}

type PriceType = IPriceProps & WithStyles<keyof ReturnType<typeof styles>>;

const Price: React.FC<PriceType> = ({price, classes, disabled, increased}) => {
  return (
    <Grid>
      <AppBodyContext.Consumer>
        {({isDecimal}) => (
          <Button
            variant='outlined'
            className={classes.buttonStyle}
            disabled={disabled}
          >

            {
              !disabled
                ? isDecimal
                ? (+price.decimal).toFixed(2)
                : `${price.den}/${price.num}`
                : 'Susp'
            }
            {
              !disabled && increased !== undefined &&
                <FontAwesomeIcon
                  icon={increased ? 'arrow-down' : 'arrow-up'}
                  size='xs'
                  style={{marginLeft: '4px'}}
                />
            }
          </Button>
        )}
      </AppBodyContext.Consumer>
    </Grid>
  );
}

export default compose<React.ComponentClass<IPriceComponentProps>>(
  withStyles(styles),
)(Price);