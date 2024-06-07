
import java.awt.AlphaComposite;
import java.awt.BasicStroke;
import java.awt.Color;
import java.awt.Font;
import java.awt.FontMetrics;
import java.awt.Graphics2D;
import java.awt.RenderingHints;
import java.awt.font.FontRenderContext;
import java.awt.font.LineBreakMeasurer;
import java.awt.font.TextAttribute;
import java.awt.font.TextLayout;
import java.awt.geom.AffineTransform;
import java.awt.geom.Line2D;
import java.awt.geom.Rectangle2D;
import java.awt.image.BufferedImage;
import java.io.BufferedReader;
import java.io.File;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.text.AttributedString;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.imageio.ImageIO;

public class SetListMain {

  public static void main(final String[] args) throws Exception {
    new SetListMain().start();
  }

  protected final float marginTop = 80;
  protected final float marginBottom = 40;
  protected final float indexMarginLeft = 70;
  protected final float marginLeft = 20;
  protected final float marginRight = 20;

  protected final float paraVGap = 10;
  protected final float vGap = 2;
  protected final float hGap = 6;

  protected final int unit = 80;
  protected final int numSections = 3;
  protected final int width = unit * 16;
  protected final int height = unit * 9 * numSections;

  protected final float titleFontSize = 24;
  protected final float indexFontSize = 21;
  protected final float bodyFontSize = 30;

  protected final String title = "＜アーティスト名＞ 2024/01/01 セットリスト";

  protected BufferedImage image;
  protected Graphics2D g;
  protected Font titleFont;
  protected Font indexFont;
  protected Font bodyFont;
  protected float x;
  protected float y;
  protected int imageIndex;

  protected void start() throws Exception {

    final Font baseFont;
    final InputStream in = getClass().getResourceAsStream("ipaexg.ttf");
    try {
      baseFont = Font.createFont(Font.TRUETYPE_FONT, in);
    } finally {
      in.close();
    }

    final FontRenderContext frc = new FontRenderContext(null, true, true);

    titleFont = baseFont.deriveFont( (float)titleFontSize);
    indexFont = baseFont.deriveFont( (float)indexFontSize);
    bodyFont = baseFont.deriveFont( (float)bodyFontSize);

    final List<List<TextLayout>> layoutList = new ArrayList<>();

    for (String s : loadList() ) {

      final AttributedString string = new AttributedString(s);
      string.addAttribute(TextAttribute.FONT, bodyFont);

      final List<TextLayout> paragraph = new ArrayList<>();
      final LineBreakMeasurer lbm =
          new LineBreakMeasurer(string.getIterator(), frc);
      while (lbm.getPosition() < s.length() ) {
        final TextLayout layout =
            lbm.nextLayout(width - indexMarginLeft - marginRight);
        paragraph.add(layout);
      }
      layoutList.add(paragraph);
    }

    imageIndex = 0;

    int setIndex = 0;

    beginImage();

    for (int i = 0; i < layoutList.size(); i += 1) {
      final List<TextLayout> paragraph = layoutList.get(i);
      for (int j = 0; j < paragraph.size(); j += 1) {
        final TextLayout layout = paragraph.get(j);

        if (y + layout.getAscent() + layout.getDescent() >
            height - marginBottom) {
          endImage();
          beginImage();
        }

        if (j == 0) {
          setIndex += 1;
          final String index = "" + setIndex;
          g.setFont(indexFont);
          float ix = indexMarginLeft - hGap -
              (float)g.getFontMetrics().getStringBounds(index, null).getWidth();
          float iy = y + layout.getAscent() /*- igap*/;
          g.drawString(index, ix, iy);
        }

        y += layout.getAscent();
        g.fill(layout.getOutline( new AffineTransform(1, 0, 0, 1, x, y) ) );
        y += layout.getDescent();

        if (j == paragraph.size() - 1) {
          // last
          y += paraVGap;
        } else {
          y += vGap;
        }
      }

    }

    endImage();
  }

  protected void beginImage() throws Exception {

    image = new BufferedImage(
        width, height, BufferedImage.TYPE_INT_RGB);

    g = (Graphics2D)image.createGraphics();

    g.setRenderingHint(RenderingHints.KEY_ANTIALIASING,
        RenderingHints.VALUE_ANTIALIAS_ON);
    g.setRenderingHint(RenderingHints.KEY_TEXT_ANTIALIASING,
        RenderingHints.VALUE_TEXT_ANTIALIAS_ON);

    g.setComposite(AlphaComposite.getInstance(AlphaComposite.SRC_OVER) );
    g.setPaint(new Color(0xffffff) );
    g.fill(new Rectangle2D.Float(0, 0, width, height) );

    drawGuides(image, g, numSections);

    g.setPaint(new Color(0x00ffff) );
    g.draw(new Line2D.Float(0, marginTop, width, marginTop) );
    g.draw(new Line2D.Float(0, height - marginBottom,
        width, height - marginBottom) );
    g.draw(new Line2D.Float(marginLeft, 0, marginLeft, height) );
    g.draw(new Line2D.Float(width - marginRight, 0,
        width - marginRight, height) );
    g.draw(new Line2D.Float(indexMarginLeft, 0, indexMarginLeft, height) );

    g.setPaint(new Color(0x0000ff) );
    x = indexMarginLeft;
    y = marginTop;
    imageIndex += 1;

    g.setFont(titleFont);
    float x = width - marginRight -
        (float)g.getFontMetrics().getStringBounds(title, null).getWidth();
    float y = marginTop - g.getFontMetrics().getDescent() - paraVGap;
    g.drawString(title, x, y);
  }

  protected void endImage() throws Exception {
    g.dispose();

    final File dir = new File("out");
    if (!dir.exists() ) {
      dir.mkdirs();
    }
    ImageIO.write(image, "jpg", new File(dir, "test" + imageIndex + ".jpg") );
  }

  protected static void drawGuides(
      final BufferedImage image,
      final Graphics2D g,
      final int numSections) throws Exception {

    final float width = image.getWidth();
    final float height = image.getHeight();
    final float lineWidth = 1;

    g.setPaint(new Color(0x00ffff) );
    g.setStroke(new BasicStroke(lineWidth) );

    //bounds
    g.draw(new Rectangle2D.Float(lineWidth / 2, lineWidth / 2,
        width - lineWidth, height - lineWidth) );

    for (int i = 0; i < numSections; i += 1) {
        // cross
        g.draw(new Line2D.Float(0, height / numSections * i,
            width, height / numSections * (i + 1) ) );
        g.draw(new Line2D.Float(width, height / numSections * i,
            0, height / numSections * (i + 1) ) );
        // hr
        if (i > 0) {
          g.draw(new Line2D.Float(0, height / numSections * i,
              width, height / numSections * i) );
        }
    }
  }


  protected List<String> loadList() throws Exception {
    final List<String> list = new ArrayList<>();
    final BufferedReader in = new BufferedReader(
        new InputStreamReader(
            getClass().getResourceAsStream("list.txt"), "UTF-8") );
    try {

        String line;

        // skip header.
        if (in.readLine() == null) {
          throw new NullPointerException("no header");
        }

        while ( (line = in.readLine() ) != null) {
          line = line.trim();
          if (line.length() == 0) {
            continue;
          } else if (line.startsWith("#") ) {
            continue;
          } else {
            String[] items = line.split("\t");
            if (items.length != 2) {
              throw new Exception(line);
            }
            list.add(items[0] + " / " + items[1]);
          }
        }
    } finally {
      in.close();
    }
    return list;
  }
}
