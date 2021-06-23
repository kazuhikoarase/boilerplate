package httpproxy.core;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Map.Entry;

import javax.swing.JOptionPane;
import javax.swing.SwingUtilities;

/**
 * Util
 * @author kazuhiko arase
 */
public class Util {

  private Util() {
  }

  public static final Map<Object,Object> map(final Object... o) {
    final Map<Object,Object> map = new LinkedHashMap<Object, Object>();
    for (int i = 0; i < o.length; i += 2) {
      map.put(o[i], o[i + 1]);
    }
    return map;
  }

  public static Map<Object,Object> extend(final Map<Object,Object> base, final Map<Object,Object> opts) {
    if (opts != null) {
      for (final Entry<Object,Object> e : opts.entrySet() ) {
        base.put(e.getKey(), e.getValue() );
      }
    }
    return base;
  }

  private static final String TITLE = "httpproxy";

  public static void alert(final String message, final Map<Object,Object> opts) throws Exception {
    extend(map("title", TITLE), opts);
    SwingUtilities.invokeAndWait(new Runnable() {
      @Override
      public void run() {
        JOptionPane.showMessageDialog(null, message, (String)opts.get("title"),
            JOptionPane.INFORMATION_MESSAGE, null);
      }
    });
  }

  public static boolean confirm(final String message, final Map<Object,Object> opts) throws Exception {
    extend(map("title", TITLE), opts);
    final int[] ret = { 0 };
    SwingUtilities.invokeAndWait(new Runnable() {
      @Override
      public void run() {
        ret[0] = JOptionPane.showConfirmDialog(null, message, (String)opts.get("title"),
            JOptionPane.YES_NO_OPTION, JOptionPane.QUESTION_MESSAGE, null);
      }
    });
    return ret[0] == JOptionPane.YES_OPTION;
  }

  public static String input(final String message, final Map<Object,Object> opts) throws Exception {
    extend(map("title", TITLE, "initialValue", ""), opts);
    final String[] input = { null };
    SwingUtilities.invokeAndWait(new Runnable() {
      @Override
      public void run() {
        final Object ret = JOptionPane.showInputDialog(null, message,
            (String)opts.get("title"), JOptionPane.QUESTION_MESSAGE, null,
            (Object[])opts.get("options"), opts.get("initialValue") );
        input[0] = ret == null? null : String.valueOf(ret);
      }
    });
    return input[0];
  }
}
