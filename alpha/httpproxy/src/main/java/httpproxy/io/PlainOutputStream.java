package httpproxy.io;

import java.io.IOException;

/**
 * PlainOutputStream
 * @author kazuhiko arase
 */
public class PlainOutputStream implements ByteOutput {
  private final ByteOutput out;
  public PlainOutputStream(final ByteOutput out) {
    this.out = out;
  }
  public void print(final String line) throws IOException {
    for (byte b : line.getBytes(PlainConstants.US_ASCII) ) {
      write(b);
    }
  }
  public void println() throws IOException {
    write(PlainConstants.CR);
    write(PlainConstants.LF);
  }
  public void println(final String line) throws IOException {
    print(line);
    println();
  }
  @Override
  public void write(final int b) throws IOException {
    out.write(b);
  }
  @Override
  public void write(final byte[] buf, final int off, final int len) throws IOException {
    out.write(buf, off, len);
  }
  @Override
  public void flush() throws IOException {
    out.flush();
  }
  @Override
  public boolean isShutdown() throws IOException {
    return out.isShutdown();
  }
}
