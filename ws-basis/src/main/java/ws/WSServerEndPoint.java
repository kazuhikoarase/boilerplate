package ws;

import java.io.FileInputStream;
import java.io.InputStreamReader;
import java.io.Reader;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.naming.InitialContext;
import javax.script.Invocable;
import javax.script.ScriptEngine;
import javax.script.ScriptEngineManager;
import javax.sql.DataSource;
import javax.websocket.CloseReason;
import javax.websocket.Endpoint;
import javax.websocket.EndpointConfig;
import javax.websocket.MessageHandler;
import javax.websocket.Session;

/**
 * WSServerEndPoint
 * @author kazuhiko arase
 */
public class WSServerEndPoint extends Endpoint {

  protected static final Logger logger = Logger.getLogger("EndPoint");

  protected static final WSSessionManager sessionManager =
      WSSessionManager.getInstance();

  private static final DataSource dataSource;

  static {
    try {
      final InitialContext initCtx = new InitialContext();
      dataSource = (DataSource)initCtx.lookup("java:comp/env/jdbc/APP_DS");
      dataSource.getConnection().close();
      logger.info("connect check ok.");
    } catch(RuntimeException e) {
      throw e;
    } catch(Exception e) {
      throw new RuntimeException(e);
    }
  }

  private ScriptEngine se;

  public WSServerEndPoint() {
    logger.info("instantiated.");
  }

  @Override
  public void onOpen(final Session session, final EndpointConfig config) {

    logger.info("onOpen");
    sessionManager.put(session.getId(), session);

    loadScript(config);

    se.put("session", session);

    session.addMessageHandler(new MessageHandler.Whole<String>() {
      @Override
      public void onMessage(final String message) {
        invoke("onMessage", message);
      }
    });
  }

  @Override
  public void onClose(final Session session, final CloseReason closeReason) {

    logger.info("onClose");
    sessionManager.remove(session.getId() );

  }

  @Override
  public void onError(final Session session, final Throwable throwable) {
    logger.log(Level.SEVERE, "onError", throwable);
  }

  protected void loadScript(final EndpointConfig config) {

    final ScriptEngineManager sem = new ScriptEngineManager();

    se = sem.getEngineByName("javascript");

    // statics
    se.put("sessionManager", sessionManager);
    se.put("dataSource", dataSource);

    try {
      final String scriptPath =
          (String)config.getUserProperties().get("scriptPath");
      final Reader in = new InputStreamReader(
          new FileInputStream(scriptPath), "UTF-8");
      try {
        se.put(ScriptEngine.FILENAME, scriptPath);
        se.eval(in);
      } finally {
        in.close();
      }
    } catch(RuntimeException e) {
      throw e;
    } catch(Exception e) {
      throw new RuntimeException(e);
    }
  }

  protected Object invoke(final String name, final Object ...args) {
    try {
      return ((Invocable)se).invokeFunction(name, args);
    } catch(RuntimeException e) {
      throw e;
    } catch(Exception e) {
      throw new RuntimeException(e);
    }
  }

}
