package httpproxy.io;

import java.io.EOFException;
import java.io.IOException;

/**
 * IOUtil
 * @author kazuhiko arase
 */
public class IOUtil {

  private IOUtil() {
  }

  public static int copyFully(final ByteInput in, final ByteOutput out, final int length) throws IOException {
    final byte[] buf = new byte[8192];
    int len;
    int readLen = 0;
    while (readLen < length) {
      len = in.read(buf, 0, Math.min(buf.length, length - readLen) );
      if (len == -1) {
        throw new EOFException("unexpected end of file.");
      }
      out.write(buf, 0, len);
      readLen += len;
    }
    return readLen;
  }

  public static int copyFully(final ByteInput in, final ByteOutput out) throws IOException {
    final byte[] buf = new byte[8192];
    int len;
    int readLen = 0;
    while (true) {
      len = in.read(buf);
      if (len == -1) {
        break;
      }
      out.write(buf, 0, len);
      readLen += len;
    }
    return readLen;
  }
}
