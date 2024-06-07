import java.io.BufferedReader;
import java.io.File;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class EmojiMain {

  public static void main(final String[] args) throws Exception {
    new EmojiMain().start();
  }

  protected PrintWriter out;
  protected String category;
  protected int count;

  protected void start() throws Exception {
    final File dir = new File("out");
    if (!dir.exists() ) {
      dir.mkdirs();
    }
    out = new PrintWriter(new File(dir, "emoji.html"), "UTF-8");
    try {

      category = "";
      count = 0;

      out.print("<!doctype html>");
      out.print("<html>");
      out.print("<meta charset=\"UTF-8\">");
      out.print("<body>");

      parse();

      out.print("</body>");
      out.print("</html>");
    
    } finally {
      out.close();
    }
    System.out.println(count + " chars");
  }

  protected void parse() throws Exception {
    final BufferedReader in = new BufferedReader(
        new InputStreamReader(
            getClass().getResourceAsStream("emoji-sequences.txt"), "UTF-8") );
    try {
      int index;
      String line;
      while ( (line = in.readLine() ) != null) {
        index = line.indexOf('#');
        if (index != -1) {
          line = line.substring(0, index);
        }
        line = line.replaceAll("\\s+$", "");
        if (line.length() == 0) {
          continue;
        }
        final String[] items = line.split("\\s*;\\s*");
        if (items.length != 3) {
          throw new Exception(line);
        }
        index = items[0].indexOf("..");
        if (index != -1) {
          final int from =Integer.parseInt(items[0].substring(0, index), 16);
          final int to =Integer.parseInt(items[0].substring(index + 2), 16);
          for (int i = from; i <= to; i += 1) {
            doCodePoint(items, new Object[] {i});
          }
        } else {
          final List<Object> cpList = new ArrayList<>();
          for (String cp : items[0].split("\\s") ) {
            cpList.add(Integer.parseInt(cp, 16) );
          }
          doCodePoint(items, cpList.toArray() );
        }
      }
    } finally {
      in.close();
    }
  }

  protected void doCodePoint(
      final String[] items, final Object[] codePoints) throws Exception {
    System.out.println(Arrays.asList(codePoints) );
    final StringBuilder buf = new StringBuilder();
    for (Object obj : codePoints) {
      final int codePoint = ((Integer)obj).intValue();
      buf.append("<span title=\"" + Character.getName(codePoint) + "\">");
      buf.append(new String(Character.toChars(codePoint) ) );
      buf.append("</span>");
    }
    if (!category.equals(items[1]) ) {
      category = items[1];
      out.print("<h3>");
      out.print(category);
      out.print("</h3>");
    }
    out.print(buf);
    count += 1;
  }

}
