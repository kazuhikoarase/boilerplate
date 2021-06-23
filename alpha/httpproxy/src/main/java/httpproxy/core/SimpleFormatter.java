package httpproxy.core;

import java.io.PrintWriter;
import java.io.StringWriter;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.logging.Formatter;
import java.util.logging.LogRecord;

/**
 * SimpleFormatter
 * @author kazuhiko arase
 */
public class SimpleFormatter extends Formatter{

  private static final String SEPARATOR = " - ";
  private static final String EOL = "\r\n";

  @Override
  public String format(final LogRecord record) {
    final StringBuilder buf = new StringBuilder();
    buf.append(new SimpleDateFormat("yyyy/MM/dd HH:mm:ss:SSS").
        format(new Date(record.getMillis() ) ) );
    buf.append(SEPARATOR);
    buf.append(record.getLevel() );
    buf.append(SEPARATOR);
//    buf.append(record.getThreadID() );
    buf.append(Thread.currentThread().getName() );
    buf.append(SEPARATOR);
    buf.append(record.getLoggerName() );
    buf.append(SEPARATOR);
    buf.append(record.getMessage() );
    buf.append(EOL);
    if(record.getThrown() != null) {
      final StringWriter sw = new StringWriter();
      final PrintWriter pw = new PrintWriter(sw);
      try {
        record.getThrown().printStackTrace(pw);
      } finally {
        pw.close();
      }
      buf.append(" - ");
      buf.append(sw.toString() );
    }
    return buf.toString();
  }
}
