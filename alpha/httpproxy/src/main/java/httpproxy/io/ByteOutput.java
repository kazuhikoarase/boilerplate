package httpproxy.io;

import java.io.IOException;

/**
 * ByteOutput
 * @author kazuhiko arase
 */
public interface ByteOutput {
  void write(int b) throws IOException;
  void write(byte[] buf, int off, int len) throws IOException;
  void flush() throws IOException;
  boolean isShutdown() throws IOException;
}
