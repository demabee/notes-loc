import { COLORS } from './COLORS';

export const BUTTONS = {
  primary: {
    backgroundColor: COLORS.primaryBlue,
    borderRadius: 10
  },
  secondary: {
    backgroundColor: COLORS.primaryOrange,
    borderRadius: 10
  },
  primaryDisabled: {
    backgroundColor: COLORS.lightBlue,
    borderRadius: 10
  },
  dark: {
    backgroundColor: COLORS.primaryBlack,
    borderRadius: 10
  },
  lightBlue: {
    backgroundColor: COLORS.lightBlue,
    borderRadius: 10
  },
  lightOrange: {
    backgroundColor: COLORS.lightOrange,
    borderRadius: 10
  }
};

export const BUTTON_TITLE = {
  primary: {
    fontSize: 14,
  },
  primaryDisabled: {
    color: 'white',
    fontSize: 14
  },
  dark: {
    fontSize: 14,
    color: COLORS.primaryBlack
  }
}