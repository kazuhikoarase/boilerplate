package httpproxy.core;

import httpproxy.io.PlainStream;

/**
 * HttpHandler
 * @author kazuhiko arase
 */
public interface HttpHandler {
  void handle(HttpContext context, Console console,
      PlainStream cltStream, HttpHeader requestHeader) throws Exception;
}
