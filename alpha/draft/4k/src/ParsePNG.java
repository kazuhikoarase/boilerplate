import java.io.BufferedInputStream;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.zip.CRC32;

import pnglib.PNGConstants;
import pnglib.PNGData;
import pnglib.PNGImageData;
import pnglib.PNGInputStream;

/**
 * ParsePNG
 * @see https://www.w3.org/TR/png-3/
 */
public class ParsePNG {

  public static void main(final String[] args) throws Exception {
/*
 * 
PNG image type  Color type
Greyscale 0
Truecolor 2
Indexed-color 3
Greyscale with alpha  4
Truecolor with alpha  6

IHDR(13)
{width=720, height=1612, bit_depth=8, color_type=2, compression_method=0, filter_method=0, interlace_method=0}

IHDR(13)
{width=480, height=400, bit_depth=8, color_type=6, compression_method=0, filter_method=0, interlace_method=0}
 */
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

    long width = 0;
    long height = 0;
    int colorType = 0;

    ByteArrayOutputStream idat = null;

    while (true) {

      final long len = in.readU4();
      final String type = in.readString(4);
      final byte[] data = in.readBytes(len);

      final CRC32 crc32 = new CRC32();
      crc32.update(type.getBytes(PNGConstants.LATIN_1) );
      crc32.update(data);
      final long crcLocal = crc32.getValue();

      final long crc = in.readU4();
      if (crcLocal != crc) {
        throw new RuntimeException(crc + " != " + crcLocal);
      }

      if (PNGConstants.IDAT.equals(type) ) {
        if (idat == null) {
          idat = new ByteArrayOutputStream();
        }
        idat.write(data);
      } else {
        if (idat != null) {
          idat.close();
          final Map<String,Object> chunk = new LinkedHashMap<>();
          chunk.put("data", new PNGImageData(idat.toByteArray(), width, height, colorType) );
          System.out.println(chunk);
          idat = null;
        }
      }

      System.out.printf("%s(%d)", type, len);
      System.out.println();

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
          chunk.put("width", width = subIn.readU4() );
          chunk.put("height", height = subIn.readU4() );
          chunk.put("bit_depth", verify(8, subIn.readU1() ) );
          chunk.put("color_type", colorType = subIn.readU1() );
          chunk.put("compression_method", verify(0, subIn.readU1() ) );
          chunk.put("filter_method", verify(0, subIn.readU1() ) );
          chunk.put("interlace_method", verify(0, subIn.readU1() ) );

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

          /*
           * Valid values for dispose_op are:
           * 0 APNG_DISPOSE_OP_NONE
           * 1 APNG_DISPOSE_OP_BACKGROUND
           * 2 APNG_DISPOSE_OP_PREVIOUS
           *
           * Valid values for blend_op are:
           * 0 APNG_BLEND_OP_SOURCE
           * 1 APNG_BLEND_OP_OVER
           */

          final Map<String,Object> chunk = new LinkedHashMap<>();
          chunk.put("sequence_number", subIn.readU4() );
          chunk.put("width", width = subIn.readU4() );
          chunk.put("height", height = subIn.readU4() );
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
        /*
      } else if (PNGConstants.IDAT.equals(type) ) {
        final PNGInputStream subIn = new PNGInputStream(new ByteArrayInputStream(data) );
        try {
          final Map<String,Object> chunk = new LinkedHashMap<>();
          chunk.put("data", new PNGData(subIn.readBytes(len) ) );
          System.out.println(chunk);
        } finally {
          subIn.close();
        }
        */
      } else if (PNGConstants.fdAT.equals(type) ) {
        final PNGInputStream subIn = new PNGInputStream(new ByteArrayInputStream(data) );
        try {
          final Map<String,Object> chunk = new LinkedHashMap<>();
          chunk.put("sequence_number", subIn.readU4() );
          chunk.put("data", new PNGImageData(subIn.readBytes(len - 4), width, height, colorType) );
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
      } else if (PNGConstants.IDAT.equals(type) ) {
        // nothing.
      } else {
        final Map<String,Object> chunk = new LinkedHashMap<>();
        chunk.put("data", new PNGData(data) );
        System.out.println(chunk);
      }
    }
  }

  protected static <T> T verify(final T expected, final T actual) {
    if (!expected.equals(actual) ) {
      throw new RuntimeException(expected + " != " + actual);
    }
    return actual;
  }
}
