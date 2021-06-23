package httpproxy.handler;

import java.net.Socket;
import java.net.SocketException;
import java.net.SocketTimeoutException;
import java.util.concurrent.Callable;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.util.concurrent.ThreadFactory;

import javax.net.SocketFactory;

import httpproxy.core.Console;
import httpproxy.core.HttpContext;
import httpproxy.core.HttpHeader;
import httpproxy.io.PlainStream;

/**
 * ConnectorHandler
 * @author kazuhiko arase
 */
public class ConnectorHandler extends AbstractProxyHandler {

  @Override
  public void handle(
      final HttpContext context,
      final Console console,
      final PlainStream cltStream,
      final HttpHeader requestHeader) throws Exception {

    final long startTime = System.currentTimeMillis();

    final Socket svrSocket = SocketFactory.getDefault().
        createSocket(getTargetHost(), getTargetPort() );

    try {

      final PlainStream svrStream = context.createStream(svrSocket);

      if (isUseProxy() ) {

        svrStream.out.println(requestHeader.getStartLine() );
        for (final String key : requestHeader.getHeaderNames() ) {
          for (final String value : requestHeader.getHeaderValues(key) ) {
            svrStream.out.println(key + ": " + value);
          }
        }
        svrStream.out.println();
        svrStream.out.flush();
      }

      if (svrStream.socket.isInputShutdown() ) {
        console.log("server shutdown.");
        return;
      }

      final HttpHeader responseHeader;
      if (isUseProxy() ) {
        responseHeader = HttpHeader.readFrom(svrStream.in);
      } else{
        responseHeader = new HttpHeader();
        responseHeader.setStartLine("HTTP/1.1 200 Connection established");
      }

      console.log(responseHeader.getStartLine() );
      if (responseHeader.getHeaderNames().iterator().hasNext() ) {
        console.log(responseHeader.getHeadersAsString() );
      }

      cltStream.out.println(responseHeader.getStartLine() );
      for (final String key : responseHeader.getHeaderNames() ) {
        for (final String value : responseHeader.getHeaderValues(key) ) {
          cltStream.out.println(key + ": " + value);
        }
      }
      cltStream.out.println();
      cltStream.out.flush();

      final int soTimeout = 30000;
      cltStream.socket.setSoTimeout(soTimeout);
      svrStream.socket.setSoTimeout(soTimeout);

      final Future<Integer> reqCon = connect(cltStream, svrStream);
      final Future<Integer> resCon = connect(svrStream, cltStream);

      final int reqLen = reqCon.get().intValue();
      final int resLen = resCon.get().intValue();

      final long time = System.currentTimeMillis() - startTime;

      logResult(console, time, reqLen, resLen);

    } finally {
      svrSocket.close();
    }
  }

  private static int connId = 1;
  private static final ExecutorService connectorService =
      Executors.newCachedThreadPool(new ThreadFactory() {
        @Override
        public Thread newThread(final Runnable r) {
          final Thread t = new Thread(r);
          t.setName("connector-" + connId++);
          return t;
        }
      });

  protected Future<Integer> connect(final PlainStream inStream, final PlainStream outStream) {

    return connectorService.submit(new Callable<Integer>() {

      @Override
      public Integer call() throws Exception {

        final byte[] buf = new byte[8192];
        int readLen = 0;

        try {

          while (true) {

            final int avl = Math.min(buf.length, inStream.in.available() );
            final int len = avl > 0? inStream.in.read(buf, 0, avl) : inStream.in.read(buf);
            if (len == -1) {
              break;
            }
            outStream.out.write(buf, 0, len);
            outStream.out.flush();
            readLen += len;
          }

        } catch(SocketTimeoutException e) {
          // ignore
        } catch(SocketException e) {
          // ignore
        }

        return Integer.valueOf(readLen);
      }
    });
  }
}
