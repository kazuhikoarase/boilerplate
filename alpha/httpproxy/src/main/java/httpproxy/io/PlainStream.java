package httpproxy.io;

import java.net.Socket;

/**
 * PlainStream
 * @author kazuhiko arase
 */
public class PlainStream {
  public final Socket socket;
  public final PlainInputStream in;
  public final PlainOutputStream out;
  public PlainStream(final Socket socket, final ByteInput in, final ByteOutput out) {
    this.socket = socket;
    this.in = new PlainInputStream(in);
    this.out = new PlainOutputStream(out);
  }
}
