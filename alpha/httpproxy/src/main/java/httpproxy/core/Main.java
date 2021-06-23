package httpproxy.core;

import java.io.InputStream;
import java.util.logging.LogManager;

/**
 * Main
 * @author kazuhiko arase
 */
public class Main {
  private static final String LOGGING_FILE = "java.util.logging.config.file";
  public static void main(final String[] args) throws Exception {
    if (System.getProperty(LOGGING_FILE) == null) {
      final InputStream in =
          Main.class.getResourceAsStream("/logging.properties");
      if (in != null) {
        try {
          LogManager.getLogManager().readConfiguration(in);
        } finally {
          in.close();
        }
      }
    }
    new HttpProxy().start();
  }
}
