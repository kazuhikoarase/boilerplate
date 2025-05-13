package pnglib;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.zip.InflaterInputStream;

public class PNGImageData {

  private final byte[] data;
  private final long[] size;

  public PNGImageData(final byte[] data, final long[] size) throws IOException {
    this.data = inflate(data);
    this.size = size;
  }

  private static final String HEX = "0123456789abcdef";

  @Override
  public String toString() {
    final long width = size[0];
    final long height = size[1];
    final StringBuilder buf = new StringBuilder();
    final int len = Math.min(16, data.length);
    for (int i = 0; i < len; i += 1) {
      buf.append(HEX.charAt((data[i] >>> 4) & 0xf) );
      buf.append(HEX.charAt(data[i] & 0xf) );
      buf.append(' ');
/*
      int b = data[i] & 0xff;
      if (0x20 < b && b <= 0x7e) {
        buf.append( (char)b);
      } else {
        buf.append('.');
      }
      */
    }
    buf.append('(');
    buf.append(data.length);
    buf.append(',');
    buf.append(width);
    buf.append('x');
    buf.append(height);
    buf.append(',');
    buf.append(width * height * 4);
    buf.append(',');
    buf.append(data.length - width * height * 4);
    buf.append(')');
    return buf.toString();
  }

  protected static byte[] inflate(final byte[] data) {
    try {
      final ByteArrayOutputStream bout = new ByteArrayOutputStream();
      try {
        final InflaterInputStream in = new InflaterInputStream(new ByteArrayInputStream(data) );
        try {
          int b;
          while ( (b = in.read() ) != -1) {
            bout.write(b);
          }
        } finally {
          in.close();
        }
      } finally {
        bout.close();
      }
      return bout.toByteArray();
    } catch(IOException e) {
      throw new RuntimeException(e);
    }
  }
}
