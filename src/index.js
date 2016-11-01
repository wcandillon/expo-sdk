export * from './Exponent';

import * as Exponent from './Exponent';
export default Exponent;

if (global) {
  global.__exponent = Exponent;
}
