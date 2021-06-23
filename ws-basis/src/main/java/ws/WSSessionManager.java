package ws;

import java.io.IOException;
import java.util.Collection;
import java.util.concurrent.ConcurrentHashMap;
import java.util.logging.Logger;

import javax.websocket.Session;

/**
 * WSSessionManager
 * @author kazuhiko arase
 */
public class WSSessionManager {

  private static WSSessionManager instance;

  public static WSSessionManager getInstance() {
    if (instance == null) {
      instance = new WSSessionManager();
    }
    return instance;
  }

  protected final Logger logger = Logger.getLogger(getClass().getName() );

  //protected final Map<String, Session> sessionMap = new HashMap<>();
  protected final ConcurrentHashMap<String, WSSessionHolder> sessionMap =
      new ConcurrentHashMap<>();

  private WSSessionManager() {
  }

  public void put(final String sid, final Session session) {
    logger.info("put:" + sid);
    sessionMap.put(sid, new WSSessionHolder(session) );
    dumpSessions();
  }

  public WSSessionHolder get(final String sid) {
    return sessionMap.get(sid);
  }

  public String[] getAllSids() {
    final Collection<String> sids = sessionMap.keySet();
    return sids.toArray(new String[sids.size()]);
  }

  public void remove(final String sid) {
    logger.info("remove:" + sid);
    sessionMap.remove(sid);
    dumpSessions();
  }

  public void sendText(final String sid, final String text) {
    try {
      final Session session = sessionMap.get(sid).getSession();
      synchronized(session) {
        session.getBasicRemote().sendText(text);
      }
    } catch (IOException e) {
      sessionMap.remove(sid);
      logger.info("session cleaned : " + sid);
      dumpSessions();
    }
  }

  public void dumpSessions() {

    final StringBuilder buf = new StringBuilder();
    buf.append("/-- sessions --\n");

    int num = 0;

    for (final WSSessionHolder sessionHolder : sessionMap.values() ) {

      buf.append("  #");
      buf.append(num);
      buf.append(": ");
      buf.append(sessionHolder);
      buf.append('\n');

      num += 1;
    }

    buf.append("--/");
    logger.info(buf.toString() );
  }
}
