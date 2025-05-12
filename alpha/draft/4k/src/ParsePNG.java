import java.io.BufferedInputStream;
import java.io.ByteArrayInputStream;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.zip.CRC32;

import pnglib.PNGConstants;
import pnglib.PNGInputStream;

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

      new ParsePNG().parse(in);

    } finally {
      in.close();
    }
  }

  public void parse(final PNGInputStream in) throws Exception {
    while (true) {

      final long len = in.readU4();
      final String type = in.readString(4);

      System.out.printf("%s(%d)", type, len);
      System.out.println();

      final byte[] data = in.readBytes(len);

      final CRC32 crc32 = new CRC32();
      crc32.update(type.getBytes(PNGConstants.US_ASCII) );
      crc32.update(data);
      final long crcLocal = crc32.getValue();

      final long crc = in.readU4();
      if (crcLocal != crc) {
        throw new IOException(String.format("%08x %08x", crc, crcLocal) );
      }

      if (PNGConstants.IHDR.equals(type) ) {

        /*
         * Width 4 bytes
         * Height  4 bytes
         * Bit depth 1 byte
         * Color type  1 byte
         * Compression method  1 byte
         * Filter method 1 byte
         * Interlace method  1 byte
         */

        final PNGInputStream subIn = new PNGInputStream(new ByteArrayInputStream(data) );
        try {

          final long width = subIn.readU4();
          final long height = subIn.readU4();
          final int bit_depth = subIn.readU1();
          final int color_type = subIn.readU1();
          final int compression_method = subIn.readU1();
          final int filter_method = subIn.readU1();
          final int interlace_method = subIn.readU1();

          System.out.println(String.format("  width              : %d", width) );
          System.out.println(String.format("  height             : %d", height) );
          System.out.println(String.format("  bit_depth          : %d", bit_depth) );
          System.out.println(String.format("  color_type         : %d", color_type) );
          System.out.println(String.format("  compression_method : %d", compression_method) );
          System.out.println(String.format("  filter_method      : %d", filter_method) );
          System.out.println(String.format("  interlace_method   : %d", interlace_method) );

        } finally {
          subIn.close();
        }
      } else if (PNGConstants.fcTL.equals(type) ) {

        /*
         * sequence_number  4 bytes
         * width 4 bytes
         * height  4 bytes
         * x_offset  4 bytes
         * y_offset  4 bytes
         * delay_num 2 bytes
         * delay_den 2 bytes
         * dispose_op  1 byte
         * blend_op  1 byte
         */

        final PNGInputStream subIn = new PNGInputStream(new ByteArrayInputStream(data) );
        try {

          final long sequence_number = subIn.readU4();
          final long width = subIn.readU4();
          final long height = subIn.readU4();
          final long x_offset = subIn.readU4();
          final long y_offset = subIn.readU4();
          final int delay_num = subIn.readU2();
          final int delay_den = subIn.readU2();
          final int dispose_op = subIn.readU1();
          final int blend_op = subIn.readU1();

          System.out.println(String.format("  sequence_number : %d", sequence_number) );
          System.out.println(String.format("  width           : %d", width) );
          System.out.println(String.format("  height          : %d", height) );
          System.out.println(String.format("  x_offset        : %d", x_offset) );
          System.out.println(String.format("  y_offset        : %d", y_offset) );
          System.out.println(String.format("  delay_num       : %d", delay_num) );
          System.out.println(String.format("  delay_den       : %d", delay_den) );
          System.out.println(String.format("  dispose_op      : %d", dispose_op) );
          System.out.println(String.format("  blend_op        : %d", blend_op) );

        } finally {
          subIn.close();
        }
      } else if (PNGConstants.IDAT.equals(type) ) {
        final PNGInputStream subIn = new PNGInputStream(new ByteArrayInputStream(data) );
        try {
          System.out.println(String.format("             " +
              " - %02x %02x %02x %02x %02x %02x %02x %02x",
              subIn.readU1(), subIn.readU1(), subIn.readU1(), subIn.readU1(),
              subIn.readU1(), subIn.readU1(), subIn.readU1(), subIn.readU1() ) );
        } finally {
          subIn.close();
        }
      } else if (PNGConstants.fdAT.equals(type) ) {
        final PNGInputStream subIn = new PNGInputStream(new ByteArrayInputStream(data) );
        try {
          System.out.println(String.format("  %02x %02x %02x %02x" +
              " - %02x %02x %02x %02x %02x %02x %02x %02x",
              subIn.readU1(), subIn.readU1(), subIn.readU1(), subIn.readU1(),
              subIn.readU1(), subIn.readU1(), subIn.readU1(), subIn.readU1(),
              subIn.readU1(), subIn.readU1(), subIn.readU1(), subIn.readU1() ) );
        } finally {
          subIn.close();
        }
      } else if (PNGConstants.IEND.equals(type) ) {
        break;
      }
    }
  }

}
