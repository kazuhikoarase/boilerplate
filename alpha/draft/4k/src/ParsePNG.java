import java.io.BufferedInputStream;
import java.io.ByteArrayOutputStream;
import java.io.FileInputStream;
import java.io.FilterInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.zip.CRC32;

public class ParsePNG {
  public static void main(final String[] args) throws Exception {
    
//    final String file = "img.png";
    final String file = "anim.png";
    final PNGInputStream in = new PNGInputStream(new BufferedInputStream(new FileInputStream(file) ) );

    try {

      final String sig = in.readString(8);
      if (!sig.equals(PNGConstants.PNG_SIGNATURE) ) {
        throw new IOException(sig);
      }

      while (true) {
        final int len = in.readInt();
        final String type = in.readString(4);

        final CRC32 crc32 = new CRC32();

        System.out.println("----");
        System.out.println(len);
        System.out.println(type);
        final byte[] data = in.readBytes(len);
        crc32.update(type.getBytes("ISO-8859-1") );
        crc32.update(data);
        System.out.printf("%08x %08x", in.readInt(), crc32.getValue() );
        System.out.println();
        if ("IEND".equals(type) ) {
          break;
        }
      }

    } finally {
      in.close();
    }
  }
}

interface PNGConstants {
  final String PNG_SIGNATURE = "\u0089PNG\r\n\u001a\n";
}

class PNGInputStream extends FilterInputStream {

  public PNGInputStream(final InputStream in) {
    super(in);
  }

  public byte readByte() throws IOException {
    final int b = super.read();
    if (b == -1) {
      throw new IOException();
    }
    return (byte)b;
  }

  public int readInt() throws IOException {
    int v = 0;
    for (int i = 0; i < 4; i += 1) {
      v = (v << 8) | (readByte() & 0xff);
    }
    return v;
  }

  public byte[] readBytes(final int len) throws IOException {
    final ByteArrayOutputStream bout = new ByteArrayOutputStream();
    try {
      for (int i = 0; i < len; i += 1) {
        bout.write(readByte() );
      }
    } finally {
      bout.close();
    }
    return bout.toByteArray();
  }

  public String readString(final int len) throws IOException {
    return new String(readBytes(len), "ISO-8859-1");
  }
}
