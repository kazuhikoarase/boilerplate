package pnglib;

import java.io.IOException;

public class PNGData {

  private final byte[] data;

  public PNGData(final byte[] data) throws IOException {
    this.data = data;
  }

  @Override
  public String toString() {
    final StringBuilder buf = new StringBuilder();
    appendHexDump(buf, data);
    buf.append('(');
    buf.append(data.length);
    buf.append(')');
    return buf.toString();
  }

  private static final String HEX = "0123456789abcdef";
  protected static void appendHexDump(final StringBuilder buf, final byte[] data) {
    final int len = Math.min(16, data.length);
    for (int i = 0; i < len; i += 1) {
      buf.append(HEX.charAt((data[i] >>> 4) & 0xf) );
      buf.append(HEX.charAt(data[i] & 0xf) );
      buf.append(' ');
    }
    if (data.length > len) {
      buf.append("...");
    }
  }
}
