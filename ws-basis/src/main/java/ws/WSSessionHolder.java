package ws;

import java.text.SimpleDateFormat;
import java.util.Date;

import javax.websocket.Session;

/**
 * WSSessionHolder
 * @author kazuhiko arase
 */
public class WSSessionHolder {
  private final Session session;
  private final long startTime;
  private String data;
  public WSSessionHolder(final Session session) {
    this.session = session;
    this.startTime = System.currentTimeMillis();
  }
  public Session getSession() {
    return session;
  }
  public String getData() {
    return data;
  }
  public void setData(final String data) {
    this.data = data;
  }
  @Override
  public String toString() {
    return session.getId() + " - " + data + " - " +
        new SimpleDateFormat("yyyyMMdd HH:mm:ss").
        format(new Date(startTime) );
  }
}
