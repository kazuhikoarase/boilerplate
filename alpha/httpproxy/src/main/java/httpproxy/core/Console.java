package httpproxy.core;

import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * Console
 * @author kazuhiko arase
 */
public interface Console {

  void log(String msg);
  void error(String msg);
  void debug(String msg);
  void debug(Throwable t);

  Console global = new Console() {
    private final Logger logger = Logger.getLogger("httpproxy");
    @Override
    public void log(final String msg) {
      logger.log(Level.INFO, msg);
    }
    @Override
    public void error(final String msg) {
      logger.log(Level.SEVERE, msg);
    }
    @Override
    public void debug(final String msg) {
      logger.log(Level.FINEST, msg);
    }
    @Override
    public void debug(final Throwable t) {
      logger.log(Level.FINEST, t.getMessage(), t);
    }
  };

  Console nullOut = new Console() {
    @Override
    public void log(String msg) {}
    @Override
    public void error(String msg) {}
    @Override
    public void debug(String msg) {}
    @Override
    public void debug(Throwable t) {}
  };
}
