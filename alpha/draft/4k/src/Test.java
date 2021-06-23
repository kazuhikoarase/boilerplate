import java.awt.image.BufferedImage;
import java.io.File;
import java.io.FileOutputStream;
import java.io.OutputStream;

import javax.imageio.IIOImage;
import javax.imageio.ImageIO;
import javax.imageio.ImageWriteParam;
import javax.imageio.ImageWriter;
import javax.imageio.plugins.jpeg.JPEGImageWriteParam;
import javax.imageio.stream.ImageOutputStream;


public class Test{

  interface Op {
    String getSuffix();
    int getColor(int rgb, int shift);
  }

  protected void doImage(final BufferedImage src, final Op op)
  throws Exception {

    final int width = src.getWidth() * 2;
    final int height = src.getHeight() * 2;

    final BufferedImage dst = new BufferedImage(
        width, height, BufferedImage.TYPE_INT_RGB);
    for (int y = 0; y < height; y += 1) {
      for (int x = 0; x < width; x += 1) {
        final int rgb = src.getRGB(x / 2, y / 2);
        final int x4 = x % 3;
        if (x4 == 0) {
          dst.setRGB(x, y, op.getColor(rgb, 16) );
        } else if (x4 == 1) {
          dst.setRGB(x, y, op.getColor(rgb, 8) );
        } else if (x4 == 2) {
          dst.setRGB(x, y, op.getColor(rgb, 0) );
        }
      }
    }

    final ImageWriteParam param = new JPEGImageWriteParam(null);
    param.setProgressiveMode(JPEGImageWriteParam.MODE_DISABLED);
    param.setCompressionMode(JPEGImageWriteParam.MODE_EXPLICIT);
    param.setCompressionQuality(1);
    final String filename = name + op.getSuffix() + ext;
    final OutputStream out = new FileOutputStream(filename);
    final ImageOutputStream imageOut = ImageIO.createImageOutputStream(out);

    final ImageWriter writer = (ImageWriter)ImageIO.getImageWritersByFormatName("jpg").next();
    try {
      writer.setOutput(imageOut);
      writer.write(null, new IIOImage(dst, null, null), param);
    } finally {
      writer.dispose();
    }
    System.out.println(filename + " done");
  }

  private final String name = "1908f1_1920_1080";
  private final String ext = ".jpg";

  public void start() throws Exception {
    final BufferedImage src = ImageIO.read(new File(name + ext) );
    doImage(src, new Op() {
      @Override
      public int getColor(final int rgb, final int shift) {
        return ( (rgb >>> shift) & 0xff) << shift;
      }
      @Override
      public String getSuffix() {
        return "_4k_1";
      }
    });
    doImage(src, new Op() {
      @Override
      public int getColor(final int rgb, final int shift) {
        final int c = ( (rgb >>> shift) & 0xff) * 3;
        final int x = Math.min(255, c);
        final int y = (c - x) / 2;
        final int f = (y << 16) | (y << 8) | y; 
        return (x << shift) | f;
      }
      @Override
      public String getSuffix() {
        return "_4k_2";
      }
    });
  }

  public static void main(String[] args) throws Exception {
    new Test().start();
  }
}