import java.io.File;
import java.io.InputStream;
import java.io.PrintWriter;
import java.util.function.IntConsumer;
import java.util.stream.IntStream;

import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.xpath.XPath;
import javax.xml.xpath.XPathConstants;
import javax.xml.xpath.XPathFactory;

import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;

import com.sun.org.apache.xerces.internal.util.DOMInputSource;

public class TestMain {
  public static void main(final String[] args) throws Exception {
    new TestMain().start();
  }

  protected Document loadXml(final String path) throws Exception {
    final InputStream in = getClass().getResourceAsStream(path);
    try {
      final DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
  //    factory.setFeature("http://apache.org/xml/features/nonvalidating/load-dtd-grammar", false);
      factory.setFeature("http://apache.org/xml/features/nonvalidating/load-external-dtd", false);
      return factory.newDocumentBuilder().parse(in);
    } finally {
      in.close();
    }
  }

  protected PrintWriter out;
//  protected String category;
  protected int count;

  protected void start() throws Exception {
    final File dir = new File("out");
    if (!dir.exists() ) {
      dir.mkdirs();
    }
    out = new PrintWriter(new File(dir, "emoji-test.html"), "UTF-8");
    try {

  //    category = "";
      count = 0;

      out.print("<!doctype html>");
      out.print("<html>");
      out.print("<head>");
      out.print("<meta charset=\"UTF-8\" />");
      out.print("<style>BODY {font-size: 24pt;} .cp { display: inline-block; }</style>");
      out.print("</head>");
      out.print("<body>");

      load();

      out.print("</body>");
      out.print("</html>");
    
    } finally {
      out.close();
    }
    System.out.println(count + " chars");
  }

  protected void load() throws Exception {
    final String path = "cldr-common/common/annotations/en.xml";
    final Document doc = loadXml(path);
    final XPath xp = XPathFactory.newInstance().newXPath();
    // text to speech
    final NodeList anots = (NodeList)xp.evaluate("//annotations/annotation[@type='tts']",
        doc, XPathConstants.NODESET);
    for (int i = 0; i < anots.getLength(); i += 1) {
      Element e = (Element)anots.item(i);
      final String cp = e.getAttribute("cp");
      final String comment = e.getTextContent();

      final int ccnt;
      final IntStream in = cp.codePoints();
      try {
        final int[] intCp = { 0 };
        in.forEach(new IntConsumer() {
          @Override
          public void accept(final int value) {
            intCp[0] += 1;
          }
        });
        ccnt = intCp[0];
      } finally {
        in.close();
      }

      final int cnt = cp.codePointCount(0, cp.length() );

      if (cnt != ccnt) {
        throw new Exception(cnt + " != " + ccnt);
      }

      if (cnt == 0) {
        throw new Exception("cnt:" + cnt);
      } else if (cnt == 1) {
        printCp(cp, comment);
      } else {
        //System.err.println(cp + "/cnt:" + cnt);
        //throw new Exception("cnt:" + cnt);
      }
    }

    out.print("<hr/>");

    String lastGroup = "";

    for (int i = 0; i < 0x10000; i += 1) {
      final String c = new String(new char[] {(char)i});
      final int cp = c.codePointAt(0);
      final String comment = Character.getName(cp);
      if (comment == null) {
        continue;
      }
      /*
      final String[] names = comment.split("\\s+");
      final String group = names[0];
      if (!lastGroup.equals(group) ) {
        out.print("<h4>");
        out.print(group);
        out.print("</h4>");
        lastGroup = group;
      }
      */
      printCp(c, comment);
    }
  }

  protected void printCp(final String cp, final String comment
      ) throws Exception {
    out.print("<span class=\"cp\" title=\"");
    out.print(comment);
    out.print("\">");
    out.print(cp);
    out.print("</span>");
  }
}
