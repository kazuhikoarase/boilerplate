package httpproxy.core;

import java.io.IOException;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import httpproxy.io.PlainInputStream;

/**
 * HttpHeader
 * @author kazuhiko arase
 */
public class HttpHeader {
  private static final String[] EMPTY_VALUES = new String[0];
  private static final String START_LINE = "startLine";
  private static final String HEADERS = "headers";
  private Map<String, Object> attrs =
      new LinkedHashMap<String, Object>();
  public HttpHeader() {
  }
  @Override
  public String toString() {
    return attrs.toString();
  }
  public void setAttribute(final String name, final Object value) {
    attrs.put(name, value);
  }
  public Object getAttribute(final String name) {
    return attrs.get(name);
  }
  public String getStartLine() {
    return (String)getAttribute(START_LINE);
  }
  public void setStartLine(String startLine) {
    setAttribute(START_LINE, startLine);
  }
  protected static class Key {
    private final String key;
    private final String lcKey;
    private Key(final String key) {
      this.key = key.intern();
      this.lcKey = key.toLowerCase().intern();
    }
    public String getOriginalKey() {
      return key;
    }
    @Override
    public int hashCode() {
      return lcKey.hashCode();
    }
    @Override
    public boolean equals(final Object obj) {
      if (obj == null) {
        return false;
      } else if (obj instanceof Key) {
        return ((Key)obj).lcKey.equals(lcKey);
      }
      throw new IllegalArgumentException(obj.toString() );
    }
    @Override
    public String toString() {
      return key;
    }
    public static Key valueOf(String key) {
      return new Key(key);
    }
  }
  protected Map<Key, List<String>> getHeaders() {
    @SuppressWarnings("unchecked")
    Map<Key, List<String>> headers =
      (Map<Key, List<String>>)getAttribute(HEADERS);
    if (headers == null) {
      headers = new LinkedHashMap<Key, List<String>>();
      setAttribute(HEADERS, headers);
    }
    return headers;
  }
  public Iterable<String> getHeaderNames() {
    final List<String> keys = new ArrayList<String>();
    for (Key key : getHeaders().keySet() ) {
      keys.add(key.getOriginalKey() );
    }
    return keys;
  }
  public String[] getHeaderValues(final String name) {
    final List<String> values = getHeaders().get(Key.valueOf(name) );
    return values != null?
        values.toArray(new String[values.size()]) : EMPTY_VALUES;
  }
  public String getHeader(final String name) {
    final String[] values = getHeaderValues(name);
    return values.length > 0? values[0] : null;
  }
  public void addHeader(final String name, final String value) {
    final Key key = Key.valueOf(name);
    List<String> values = getHeaders().get(key);
    if (values == null) {
      values = new ArrayList<String>(1);
      getHeaders().put(key, values);
    }
    values.add(value);
  }
  public void removeHeader(final String name) {
    getHeaders().remove(Key.valueOf(name) );
  }
  public String getHeadersAsString() {
    return getHeaders().toString();
  }
  public void setHeader(final String name, final String value) {
    removeHeader(name);
    addHeader(name, value);
  }
  public static HttpHeader readFrom(PlainInputStream in)
  throws IOException {
    final HttpHeader header = new HttpHeader();
    header.setStartLine(in.readLine() );
    while (true) {
      final String line = in.readLine();
      if (line.length() == 0) {
        break;
      }
      final int index = line.indexOf(':');
      if (index == -1) {
        throw new IOException("unexpected header:" + line);
      }
      final String k = line.substring(0, index).trim();
      final String v = line.substring(index + 1).trim();
      header.addHeader(k, v);
    }
    return header;
  }
}
