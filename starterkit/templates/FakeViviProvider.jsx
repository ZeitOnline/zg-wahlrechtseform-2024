import PropTypes from 'prop-types';
import {createContext} from 'react';

/**
 * Provides fake Vivi settings,
 * e.g. if article is behind a paywall
 */
export const ViviContext = createContext({paywall: false, pagetype: 'article'});

/**
 * Provides a fake Vivi context provider
 * so Page components can see if they’re behind a paywall, for example
 */
function FakeViviProvider({
  paywall = false,
  pagetype = 'article',
  children,
  app = {},
}) {
  const contextValue = {
    paywall,
    pagetype,
    app,
  };

  return (
    <ViviContext.Provider value={contextValue}>{children}</ViviContext.Provider>
  );
}

FakeViviProvider.propTypes = {
  /** is article behind paywall? */
  paywall: PropTypes.bool,
  /** is article or cp or custom? */
  pagetype: PropTypes.string,
  /** app that is being rendered */
  app: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
};

export default FakeViviProvider;
