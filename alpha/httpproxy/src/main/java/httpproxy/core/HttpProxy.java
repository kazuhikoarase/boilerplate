package httpproxy.core;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.Reader;
import java.net.ServerSocket;
import java.net.Socket;
import java.net.SocketException;
import java.net.URL;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.ThreadFactory;

import javax.net.ServerSocketFactory;
import javax.script.ScriptEngine;
import javax.script.ScriptEngineManager;

import httpproxy.event.EventTarget;
import httpproxy.io.ByteInput;
import httpproxy.io.ByteOutput;
import httpproxy.io.PlainStream;

/**
 * HttpProxy
 * @author kazuhiko arase
 */
public class HttpProxy {

  protected static final Console console = Console.global;

  private ServerSocket serverSocket;
  private ExecutorService es;
  private EventTarget eventTarget;
  private NetworkEmulator netEmu;

  public HttpProxy() {
  }

  public void start() throws Exception {

    console.log("starting httpproxy...");

    eventTarget = new EventTarget();

    // load script config
    final Map<?,?> config = loadConfig();

    final int port = ((Number)config.get("port") ).intValue();
    serverSocket = ServerSocketFactory.getDefault().createServerSocket(port);
    console.log("server started at port " + port);

    // emulate slow network.
    final boolean enableNetEmu =
        ((Boolean)config.get("enableNetEmu") ).booleanValue();
    if (enableNetEmu) {
      netEmu = new NetworkEmulator();
      netEmu.setBps(( (Number)config.get("bps") ).longValue() );
      netEmu.start();
    }

    final int[] id = { 1 };
    es = Executors.newCachedThreadPool(new ThreadFactory() {
      @Override
      public Thread newThread(final Runnable r) {
        final Thread t = new Thread(r);
        t.setName("proxy-session-" + id[0]++);
        return t;
      }
    });

    try {
      while (true) {
        es.execute(new HttpSession(createContext(), serverSocket.accept() ) );
      }
    } catch(SocketException e) {
      // ignore.
    }
  }

  protected HttpContext createContext() {
    return new HttpContext() {

      @Override
      public EventTarget getEventTarget() {
        return eventTarget;
      }

      @Override
      public PlainStream createStream(final Socket socket) throws IOException {
        ByteInput in = new ByteInput() {
          private final InputStream in =
              new BufferedInputStream(socket.getInputStream() );
          @Override
          public int read() throws IOException {
            return in.read();
          }
          @Override
          public int read(byte[] buf, int off, int len) throws IOException {
            return in.read(buf, off, len);
          }
          @Override
          public int read(byte[] buf) throws IOException {
            return in.read(buf);
          }
          @Override
          public int available() throws IOException {
            return in.available();
          }
         };
        ByteOutput out = new ByteOutput() {
          private final OutputStream out =
              new BufferedOutputStream(socket.getOutputStream() );
          @Override
          public void write(final int b) throws IOException {
            out.write(b);
          }
          @Override
          public void write(final byte[] buf, final int off, final int len) throws IOException {
            out.write(buf, off, len);
          }
          @Override
          public void flush() throws IOException {
            out.flush();
          }
          @Override
          public boolean isShutdown() throws IOException {
            return socket.isOutputShutdown();
          }
        };
        if (netEmu != null) {
          in = netEmu.wrap(in);
          out = netEmu.wrap(out);
        }
        return new PlainStream(socket, in, out);
      }
    };
  }
  protected Map<?,?> loadConfig() throws Exception {
    final ScriptEngine se = new ScriptEngineManager().getEngineByName("javascript");
    final Map<?,?> config = new LinkedHashMap<Object, Object>();
    se.put("$console", console);
    se.put("$eventTarget", eventTarget);
    se.put("$config", config);
    eval(se, "config.js");
    eval(se, "/httpproxy.config.js");
    return config;
  }
  protected Object eval(final ScriptEngine se,
      final String scriptPath) throws Exception {
    URL url = getClass().getResource(scriptPath);
    if (url == null) {
      url = getClass().getClassLoader().getResource(scriptPath);
    }
    if (url == null) {
      url = ClassLoader.getSystemResource(scriptPath);
    }
    if (url == null) {
      return null;
    }
    final Reader reader = new InputStreamReader(url.openStream(), "UTF-8");
    try {
      console.log("eval:" + url);
      se.put(ScriptEngine.FILENAME, url.toString() );
      return se.eval(reader);
    } finally {
      reader.close();
    }
  }
}
