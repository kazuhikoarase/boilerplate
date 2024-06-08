package slst;

import java.awt.AlphaComposite;
import java.awt.BasicStroke;
import java.awt.Color;
import java.awt.Font;
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
import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.text.AttributedString;
import java.util.ArrayList;
import java.util.List;

import javax.imageio.IIOImage;
import javax.imageio.ImageIO;
import javax.imageio.ImageWriteParam;
import javax.imageio.ImageWriter;
import javax.imageio.plugins.jpeg.JPEGImageWriteParam;
import javax.imageio.stream.ImageOutputStream;

public class Main {

  public static void main(final String[] args) throws Exception {
    new Main().start();
  }

  private int unit = 80;
  private int numSections = 3;
  private int width = unit * 16;
  private int height = unit * 9 * numSections;

  private float marginTop = 120;
  private float marginBottom = 40;
  private float marginLeft = 40;
  private float marginRight = 40;
  private float indexMarginLeft = 110;

  private float paraVGap = 12;
  private float vGap = 4;
  private float hGap = 8;

  private float titleFontSize = 32;
  private float indexFontSize = 28;
  private float bodyFontSize = 36;

  private Color textColor = new Color(0x000000);

  private Font titleFont;
  private Font indexFont;
  private Font bodyFont;

  private BufferedImage image;
  private Graphics2D g;
  private int imageCount;
  
  protected void start() throws Exception {

    final SetList setList;
    final InputStream in = getClass().getResourceAsStream("/list.txt");
    try {
      setList = SetList.load(in);
    } finally {
      in.close();
    }

    final List<List<TextLayout>> layoutList = parse(setList);
    render(setList, layoutList);
  }

  protected List<List<TextLayout>> parse(
      final SetList setList) throws Exception {

    final Font baseFont;
    final InputStream in = getClass().getResourceAsStream("/ipaexg.ttf");
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
    for (int i = 0; i < setList.getItemCount(); i += 1) {
      final String item = setList.getItemAt(i);
      final AttributedString string =
          new AttributedString(item);
      string.addAttribute(TextAttribute.FONT, bodyFont);
      final List<TextLayout> paragraph = new ArrayList<>();
      final LineBreakMeasurer lbm =
          new LineBreakMeasurer(string.getIterator(), frc);
      while (lbm.getPosition() < item.length() ) {
        final TextLayout layout =
            lbm.nextLayout(width - indexMarginLeft - marginRight);
        paragraph.add(layout);
      }
      layoutList.add(paragraph);
    }
    return layoutList;
  }

  protected void render(final SetList setList,
      final List<List<TextLayout>> layoutList) throws Exception {

    imageCount = 0;

    render(setList, layoutList, new PageRenderer() {
      @Override
      public void begin(final SetList setList) throws Exception {
        imageCount += 1;
      }
      @Override
      public void end() throws Exception {
      }
      @Override
      public void render(final int textIndex,
          final float x, final float y,
          final TextLayout layout) throws Exception {
      }
    });

    final int[] setIndex = { 0 };
    final int[] imageIndex = { 0 };

    render(setList, layoutList, new PageRenderer() {
      @Override
      public void begin(final SetList setList) throws Exception {
        final String title = setList.getHeader("title");
        final String page = imageCount > 1?
            (imageIndex[0] + 1) + "/" + imageCount : null;
        beginImage(setList, title, page);
        imageIndex[0] += 1;
      }
      @Override
      public void end() throws Exception {
        endImage("setlist_" + imageIndex[0] + ".jpg");
      }
      @Override
      public void render(final int textIndex,
          final float x, final float y,
          final TextLayout layout) throws Exception {
        if (textIndex == 0) {
          setIndex[0] += 1;
          final String index = "" + setIndex[0];
          g.setFont(indexFont);
          final Rectangle2D bounds =
              g.getFontMetrics().getStringBounds(index, null);
          float ix = indexMarginLeft - hGap - (float)bounds.getWidth();
          float iy = y;
          g.drawString(index, ix, iy);
        }
        g.fill(layout.getOutline( new AffineTransform(1, 0, 0, 1, x, y) ) );
      }
    });
  }

  protected void render(final SetList setList,
      final List<List<TextLayout>> layoutList,
      final PageRenderer renderer) throws Exception {

    float x;
    float y;

    x = indexMarginLeft;
    y = marginTop + paraVGap;
    renderer.begin(setList);

    for (int i = 0; i < layoutList.size(); i += 1) {
      final List<TextLayout> paragraph = layoutList.get(i);
      for (int p = 0; p < paragraph.size(); p += 1) {
        final TextLayout layout = paragraph.get(p);

        if (y + layout.getAscent() + layout.getDescent() >
            height - marginBottom) {

          renderer.end();

          x = indexMarginLeft;
          y = marginTop + paraVGap;
          renderer.begin(setList);
        }

        y += layout.getAscent();
        renderer.render(p, x, y, layout);
        y += layout.getDescent();

        if (p == paragraph.size() - 1) {
          // last
          y += paraVGap;
        } else {
          y += vGap;
        }
      }
    }

    renderer.end();
  }

  protected void beginImage(final SetList setList,
      final String leftTitle, final String rightTitle) throws Exception {

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

    if ("true".equals(setList.getHeader("show-guides") ) ) {
      drawGuides();
    }

    g.setPaint(textColor);

    if (leftTitle != null) {
      drawLeftTitle(leftTitle);
    }
    if (rightTitle != null) {
      drawRightTitle(rightTitle);
    }
  }

  protected void drawLeftTitle(final String text) throws Exception {
    g.setFont(titleFont);
    float x = marginLeft;
    float y = marginTop - g.getFontMetrics().getDescent() - paraVGap;
    g.drawString(text, x, y);
  }

  protected void drawRightTitle(final String text) throws Exception {
    g.setFont(titleFont);
    float x = width - marginRight -
        (float)g.getFontMetrics().getStringBounds(text, null).getWidth();
    float y = marginTop - g.getFontMetrics().getDescent() - paraVGap;
    g.drawString(text, x, y);
  }

  protected void endImage(final String filename) throws Exception {

    g.dispose();

    final File dir = new File("out");
    if (!dir.exists() ) {
      dir.mkdirs();
    }

    final ImageOutputStream out =
        ImageIO.createImageOutputStream(new FileOutputStream(
            new File(dir, filename) ) );

    try {

      final ImageWriteParam param = new JPEGImageWriteParam(null);
      param.setProgressiveMode(JPEGImageWriteParam.MODE_DISABLED);
      param.setCompressionMode(JPEGImageWriteParam.MODE_EXPLICIT);
      param.setCompressionQuality(1);

      final ImageWriter writer =
          (ImageWriter)ImageIO.getImageWritersByFormatName("jpg").next();
      try {
        writer.setOutput(out);
        writer.write(null, new IIOImage(image, null, null), param);
      } finally {
        writer.dispose();
      }

    } finally {
      out.close();
    }
  }

  protected void drawGuides() throws Exception {

    final float width = image.getWidth();
    final float height = image.getHeight();
    final float lineWidth = 1;

    g.setPaint(new Color(0x00ffff) );
    g.setStroke(new BasicStroke(lineWidth) );

    g.draw(new Line2D.Float(0, marginTop, width, marginTop) );
    g.draw(new Line2D.Float(0, height - marginBottom,
        width, height - marginBottom) );
    g.draw(new Line2D.Float(marginLeft, 0, marginLeft, height) );
    g.draw(new Line2D.Float(width - marginRight, 0,
        width - marginRight, height) );
    g.draw(new Line2D.Float(indexMarginLeft, 0, indexMarginLeft, height) );

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
}
