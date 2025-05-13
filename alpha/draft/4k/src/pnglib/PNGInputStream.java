package pnglib;

import java.io.ByteArrayOutputStream;
import java.io.EOFException;
import java.io.FilterInputStream;
import java.io.IOException;
import java.io.InputStream;


public class PNGInputStream extends FilterInputStream {

  public PNGInputStream(final InputStream in) {
    super(in);
  }

  public int readU1() throws IOException {
    final int b = super.read();
    if (b == -1) {
      throw new EOFException();
    }
    return b;
  }

  public int readU2() throws IOException {
    return (readU1() << 8) | readU1();
  }

  public long readU4() throws IOException {
    return ( ((long)readU2() ) << 16) | readU2();
  }

  public byte[] readBytes(final long len) throws IOException {
    final ByteArrayOutputStream bout = new ByteArrayOutputStream();
    try {
      for (long i = 0; i < len; i += 1) {
        bout.write(readU1() );
      }
    } finally {
      bout.close();
    }
    return bout.toByteArray();
  }

  public String readString(final long len) throws IOException {
    return new String(readBytes(len), PNGConstants.LATIN_1);
  }
}
