package httpproxy.core;

import java.io.EOFException;
import java.io.IOException;
import java.net.Socket;
import java.net.SocketException;
import java.net.URL;
import java.util.Map;
import java.util.regex.Pattern;

import httpproxy.handler.AbstractProxyHandler;
import httpproxy.handler.ConnectorHandler;
import httpproxy.handler.ProxyHandler;
import httpproxy.io.PlainStream;

/**
 * HttpSession
 * @author kazuhiko arase
 */
public class HttpSession implements Runnable {

  private static final String DIRECT = "DIRECT";
  private static final Pattern STR_PAT = Pattern.compile("\\u0020");

  private final HttpContext context;
  private final Socket cltSocket;

  private Console console;
  private PlainStream cltStream;
  private HttpHeader requestHeader;
  private String method;
  private String path;
  private String version;

  public HttpSession(final HttpContext context, final Socket cltSocket) {
    this.context = context;
    this.cltSocket = cltSocket;
  }

  protected Map<?, ?> createProxyInfo(final Console console,
      final String host, final int port) {
    return Util.map("console", console,
        "host", host, "port", Integer.valueOf(port) );
  }

  protected void doSession() throws Exception {
    try {

      cltStream = context.createStream(cltSocket);

      try {
        requestHeader = HttpHeader.readFrom(cltStream.in);
      } catch(SocketException e) {
        return;
      }

      if (requestHeader.getStartLine().length() == 0) {
        Console.global.debug("no startline");
        return;
      }

      final Map<?,?> detail = Util.map("requestHeader", requestHeader);

      context.getEventTarget().trigger("beginsession", detail);

      final Object enableLog = detail.get("enableLog");
      console = Boolean.TRUE.equals(enableLog)? Console.global : Console.nullOut;

      console.log(requestHeader.getStartLine() );
      console.log(requestHeader.getHeadersAsString() );

      final String[] reqTokens = STR_PAT.split(requestHeader.getStartLine() );
      if (reqTokens.length != 3) {
        throw new IOException("bad req start line:" +requestHeader.getStartLine() );
      }

      method = reqTokens[0];
      path = reqTokens[1];
      version = reqTokens[2];

      requestHeader.setAttribute("method", method);
      requestHeader.setAttribute("path", path);
      requestHeader.setAttribute("version", version);

      if (path.startsWith("/") ) {

        final Map<?,?> requestInfo = Util.map(
            "requestHeader", requestHeader,
            "cltStream", cltStream);
        context.getEventTarget().trigger("service", requestInfo);
        if (!Boolean.TRUE.equals(requestInfo.get("consumed") ) ) {
          sendError(404, "Not Found");
        }

      } else {
        doProxySession();
      }

    } finally {
      cltSocket.close();
    }
  }

  protected void sendError(
      final int status, final String message) throws Exception {
    cltStream.out.println("HTTP/1.1 " + status + " " + message);
    cltStream.out.println();
    cltStream.out.flush();
  }

  protected void doProxySession() throws Exception {

    if (method.equalsIgnoreCase("CONNECT") ) {

      // CONNECT

      int index = path.indexOf(':');
      if (index == -1) {
        console.error("bad request:" + path);
        sendError(400, "Bad Request");
        return;
      }
      final String host = path.substring(0, index);
      final int port = Integer.parseInt(path.substring(index + 1) );
      final Map<?,?> proxyInfo = createProxyInfo(console, host, port);
      context.getEventTarget().trigger("getproxy", proxyInfo);
      final String proxy = (String)proxyInfo.get("proxy");

      if (DIRECT.equalsIgnoreCase(proxy) ) {

        final ConnectorHandler handler = new ConnectorHandler();
        handler.setTargetHost(host);
        handler.setTargetPort(port);
        handler.setUseProxy(false);
        handler.handle(context, console, cltStream, requestHeader);

      } else if (proxy != null) {

        final ConnectorHandler handler = new ConnectorHandler();
        setTarget(handler, proxy);
        handler.setUseProxy(true);
        handler.handle(context, console, cltStream, requestHeader);

      } else {
        console.error("forbidden:" + host);
        sendError(403, "Forbidden");
      }

    } else {

      // HEAD, GET, POST, ...

      final URL url = new URL(path);
      final Map<?,?> proxyInfo = createProxyInfo(console,
          url.getHost(), url.getPort() );
      context.getEventTarget().trigger("getproxy", proxyInfo);
      final String proxy = (String)proxyInfo.get("proxy");

      if (DIRECT.equalsIgnoreCase(proxy) ) {

        // rewrite start line.
        requestHeader.setStartLine(method + " " +
            url.getFile() + " " + version);
        final ProxyHandler handler = new ProxyHandler();
        handler.setTargetHost(url.getHost() );
        handler.setTargetPort(url.getPort() != -1? url.getPort(): 80);
        handler.setUseProxy(false);
        handler.handle(context, console, cltStream, requestHeader);

      } else if (proxy != null) {

        final ProxyHandler handler = new ProxyHandler();
        setTarget(handler, proxy);
        handler.setUseProxy(true);
        handler.handle(context, console, cltStream, requestHeader);

      } else {
        console.error("forbidden:" + url.getHost() );
        sendError(403, "Forbidden");
      }
    }
  }

  protected void setTarget(
      final AbstractProxyHandler handler, final String proxy) {
    final int index = proxy.indexOf(':');
    final String host = index != -1? proxy.substring(0, index) : proxy;
    final int port = index != -1?
        Integer.parseInt(proxy.substring(index + 1) ) : 8080;
    handler.setTargetHost(host);
    handler.setTargetPort(port);
  }

  @Override
  public void run() {
    try {
      doSession();
    } catch(RuntimeException e) {
      throw e;
    } catch(SocketException e) {
      Console.global.debug(e);
    } catch(EOFException e) {
      Console.global.debug(e);
    } catch(Exception e) {
      throw new RuntimeException(e);
    }
  }
}
