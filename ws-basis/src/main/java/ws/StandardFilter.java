package ws;

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * StandardFilter
 * @author kazuhiko arase
 */
public class StandardFilter implements Filter {

  @Override
  public void init(final FilterConfig config) throws ServletException {
  }

  @Override
  public void destroy() {
  }

  @Override
  public void doFilter(
      final ServletRequest req,
      final ServletResponse res,
      final FilterChain chain) throws IOException, ServletException {

    final HttpServletRequest request = (HttpServletRequest)req;
    final HttpServletResponse response = (HttpServletResponse)res;

    if ("http".equals(request.getScheme() ) ) {
      response.setHeader("Cache-Control", "no-cache");
      response.setHeader("Pragma", "no-cache");
      response.setIntHeader("Expires", 0);
    }

    chain.doFilter(req, res);
  }

}
