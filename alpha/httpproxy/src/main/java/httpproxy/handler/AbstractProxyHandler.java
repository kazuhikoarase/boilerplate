package httpproxy.handler;

import httpproxy.core.Console;
import httpproxy.core.HttpHandler;

/**
 * AbstractProxyHandler
 * @author kazuhiko arase
 */
public abstract class AbstractProxyHandler implements HttpHandler {
  private String targetHost;
  private int targetPort;
  private boolean useProxy;
  protected AbstractProxyHandler() {
  }
  public String getTargetHost() {
    return targetHost;
  }
  public void setTargetHost(String targetHost) {
    this.targetHost = targetHost;
  }
  public int getTargetPort() {
    return targetPort;
  }
  public void setTargetPort(int targetPort) {
    this.targetPort = targetPort;
  }
  public boolean isUseProxy() {
    return useProxy;
  }
  public void setUseProxy(boolean useProxy) {
    this.useProxy = useProxy;
  }

  protected void logResult(final Console console, final long time, final int reqLen, final int resLen) {
    final StringBuilder buf = new StringBuilder();
    buf.append("done");
    buf.append("/req-in-bytes:");
    buf.append(reqLen);
    buf.append("/res-in-bytes:");
    buf.append(resLen);
    buf.append("/time-in-millis:");
    buf.append(time);
    console.log(buf.toString() );
  }
}
