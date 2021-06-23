package httpproxy.io;

import java.io.IOException;

/**
 * ByteInput
 * @author kazuhiko arase
 */
public interface ByteInput {
  int read() throws IOException;
  int read(byte[] buf) throws IOException;
  int read(byte[] buf, int off, int len) throws IOException;
  int available() throws IOException;
}
