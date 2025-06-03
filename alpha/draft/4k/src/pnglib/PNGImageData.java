package pnglib;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.zip.InflaterInputStream;

public class PNGImageData {

  private final byte[] data;
  private final long width;
  private final long height;
  private final int colorType;

  public PNGImageData(final byte[] data,
      final long width, final long height, final int colorType) throws IOException {
    this.data = inflate(data);
    this.width = width;
    this.height = height;
    this.colorType = colorType;
  }

  @Override
  public String toString() {

    final int colorDepth;
    if (colorType == 2) {
      colorDepth = 3;
    } else if (colorType == 6) {
      colorDepth = 4;
    } else {
      throw new RuntimeException("colorType:" + colorType);
    }

    if (width * height * colorDepth + height != data.length) {
      throw new RuntimeException(String.format("%d != %d", width * height * colorDepth + height, data.length) );
    }

    final StringBuilder buf = new StringBuilder();
    PNGData.appendHexDump(buf, data);
    buf.append('(');
    buf.append(data.length);
    buf.append(',');
    buf.append(width);
    buf.append('x');
    buf.append(height);
    buf.append(',');
    buf.append(width * height * colorDepth);
    buf.append(',');
    buf.append(data.length - width * height * colorDepth);
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
