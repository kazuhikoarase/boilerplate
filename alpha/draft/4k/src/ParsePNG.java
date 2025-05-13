import java.io.BufferedInputStream;
import java.io.ByteArrayInputStream;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.zip.CRC32;

import pnglib.PNGConstants;
import pnglib.PNGData;
import pnglib.PNGInputStream;

/**
 * ParsePNG
 * @see https://www.w3.org/TR/png-3/
 */
public class ParsePNG {

  public static void main(final String[] args) throws Exception {

//    final String file = "img.png";
    final String file = "anim.png";

    final PNGInputStream in = new PNGInputStream(new BufferedInputStream(new FileInputStream(file) ) );

    try {

      final String signature = in.readString(8);
      if (!signature.equals(PNGConstants.PNG_SIGNATURE) ) {
        throw new IOException(signature);
      }

      new ParsePNG().parse(in);

    } finally {
      in.close();
    }
  }

  public void parse(final PNGInputStream in) throws Exception {

    final long[] size = {0, 0};

    while (true) {

      final long len = in.readU4();
      final String type = in.readString(4);

      System.out.printf("%s(%d)", type, len);
      System.out.println();

      final byte[] data = in.readBytes(len);

      final CRC32 crc32 = new CRC32();
      crc32.update(type.getBytes(PNGConstants.LATIN_1) );
      crc32.update(data);
      final long crcLocal = crc32.getValue();

      final long crc = in.readU4();
      if (crcLocal != crc) {
        throw new IOException(String.format("%08x %08x", crc, crcLocal) );
      }

      if (PNGConstants.IHDR.equals(type) ) {

        final PNGInputStream subIn = new PNGInputStream(new ByteArrayInputStream(data) );
        try {

          /*
           * Width 4 bytes
           * Height  4 bytes
           * Bit depth 1 byte
           * Color type  1 byte
           * Compression method  1 byte
           * Filter method 1 byte
           * Interlace method  1 byte
           */
          final Map<String,Object> chunk = new LinkedHashMap<>();
          chunk.put("width", size[0] = subIn.readU4() );
          chunk.put("height", size[1] = subIn.readU4() );
          chunk.put("bit_depth", subIn.readU1() );
          chunk.put("color_type", subIn.readU1() );
          chunk.put("compression_method", subIn.readU1() );
          chunk.put("filter_method", subIn.readU1() );
          chunk.put("interlace_method", subIn.readU1() );

          System.out.println(chunk);

        } finally {
          subIn.close();
        }
      } else if (PNGConstants.acTL.equals(type) ) {

        final PNGInputStream subIn = new PNGInputStream(new ByteArrayInputStream(data) );
        try {

          /*
           * num_frames  4 bytes
           * num_plays 4 bytes
           */
          final Map<String,Object> chunk = new LinkedHashMap<>();
          chunk.put("num_frames", subIn.readU4() );
          chunk.put("num_plays", subIn.readU4() );

          System.out.println(chunk);

        } finally {
          subIn.close();
        }
      } else if (PNGConstants.fcTL.equals(type) ) {

        final PNGInputStream subIn = new PNGInputStream(new ByteArrayInputStream(data) );
        try {

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
          final Map<String,Object> chunk = new LinkedHashMap<>();
          chunk.put("sequence_number", subIn.readU4() );
          chunk.put("width", size[0] = subIn.readU4() );
          chunk.put("height", size[1] = subIn.readU4() );
          chunk.put("x_offset", subIn.readU4() );
          chunk.put("y_offset", subIn.readU4() );
          chunk.put("delay_num", subIn.readU2() );
          chunk.put("delay_den", subIn.readU2() );
          chunk.put("dispose_op", subIn.readU1() );
          chunk.put("blend_op", subIn.readU1() );

          System.out.println(chunk);

        } finally {
          subIn.close();
        }
      } else if (PNGConstants.IDAT.equals(type) ) {
        final PNGInputStream subIn = new PNGInputStream(new ByteArrayInputStream(data) );
        try {
          final Map<String,Object> chunk = new LinkedHashMap<>();
          chunk.put("data", new PNGData(subIn.readBytes(len), size) );
          System.out.println(chunk);
        } finally {
          subIn.close();
        }
      } else if (PNGConstants.fdAT.equals(type) ) {
        final PNGInputStream subIn = new PNGInputStream(new ByteArrayInputStream(data) );
        try {
          final Map<String,Object> chunk = new LinkedHashMap<>();
          chunk.put("sequence_number", subIn.readU4() );
          chunk.put("data", new PNGData(subIn.readBytes(len - 4), size) );
          System.out.println(chunk);
        } finally {
          subIn.close();
        }
      } else if (PNGConstants.tEXt.equals(type) ) {

        final PNGInputStream subIn = new PNGInputStream(new ByteArrayInputStream(data) );
        try {

          final String[] kt = subIn.readString(len).split("\u0000");

          final Map<String,Object> chunk = new LinkedHashMap<>();
          chunk.put("keyword", kt[0]);
          chunk.put("text", kt[1]);
          System.out.println(chunk);

        } finally {
          subIn.close();
        }
      } else if (PNGConstants.IEND.equals(type) ) {
        break;
      }
    }
  }

  

}
