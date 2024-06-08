package slst;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class SetList {

  private final Map<String,String> headers;
  private final List<String> list;

  private SetList(
      final Map<String,String> headers, final List<String> list) {
    this.headers = headers;
    this.list = list;
  }

  public String getHeader(final String name) {
    return headers.get(name);
  }

  public int getItemCount() {
    return list.size();
  }

  public String getItemAt(final int index) {
    return list.get(index);
  }

  public static SetList load(final InputStream ins) throws Exception {

    final Map<String,String> headers = new HashMap<>();
    final List<String> list = new ArrayList<>();

    final BufferedReader in = new BufferedReader(
        new InputStreamReader(ins, "UTF-8") );

    String line;

    // skip header.
    final String header = in.readLine();
    if (!header.startsWith("SLST ") ) {
      throw new Exception("no header");
    }

    while ( (line = in.readLine() ) != null) {
      line = line.trim();
      if (line.length() == 0) {
        break;
      }
      int index = line.indexOf(':');
      final String key = line.substring(0, index).trim().toLowerCase();
      final String value = line.substring(index + 1).trim();
      headers.put(key, value);
    }

    int lineCount = 0;
    while ( (line = in.readLine() ) != null) {
      lineCount += 1;
      if (lineCount == 1) {
        // skip header.
        System.err.println("skip header:" + line);
        continue;
      }

      line = line.trim();
      if (line.length() == 0) {
        continue;
      }
      final String[] items = line.split("\t");
      if (items.length != 2) {
        throw new Exception(line);
      }
      list.add(items[0] + " / " + items[1]);
    }

    return new SetList(headers, list);
  }
}
