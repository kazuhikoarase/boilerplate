package ws.app.admin;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.Statement;

import javax.naming.InitialContext;
import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.sql.DataSource;

/**
 * AdminServlet
 * @author kazuhiko arase
 */
@SuppressWarnings("serial")
public class AdminServlet extends HttpServlet {

  private DataSource dataSource;

  @Override
  public void init(ServletConfig config) throws ServletException {
    super.init(config);
    try {
      dataSource = (DataSource)new InitialContext().
          lookup("java:comp/env/jdbc/APP_DS");
    } catch(RuntimeException e) {
      throw e;
    } catch(Exception e) {
      throw new ServletException(e);
    }
  }

  protected String[] readSqls() throws IOException {
    final BufferedReader in = new BufferedReader(new InputStreamReader(
        getClass().getResourceAsStream("initialize.sql"), "UTF-8") );
    try {
      final StringBuilder buf = new StringBuilder();
      String line;
      while ( (line = in.readLine() ) != null) {
        buf.append(line);
        buf.append('\n');
      }
      return buf.toString().split(";");
    } finally {
      in.close();
    }
  }

  @Override
  protected void doGet(
      final HttpServletRequest request,
      final HttpServletResponse response
  ) throws ServletException, IOException {

    response.setHeader("Cache-Control", "no-cache");
    response.setHeader("Pragma", "no-cache");
    response.setIntHeader("Expires", 0);

    response.setContentType("text/html;charset=UTF-8");

    final PrintWriter out = response.getWriter();

    try {

      out.write("<!doctype html>");
      out.write("<html>");
      out.write("<body>");

      try {
        final Connection conn = dataSource.getConnection();
        try {

          for (String sql : readSqls() ) {

            sql = sql.trim();
            if (sql.length() == 0) {
              continue;
            }

            final Statement stmt = conn.createStatement();
            try {
              out.write(sql);
              out.write("<br/>");
              final int updateCount = stmt.executeUpdate(sql);
              out.write(updateCount + " rows updated");
              out.write("<br/>");
            } finally {
              stmt.close();
            }
          }

        } finally {
          conn.close();
        }
      } catch(RuntimeException e) {
        throw e;
      } catch(Exception e) {
        throw new ServletException(e);
      }

      out.write("</body>");
      out.write("</html>");

    } finally {
      out.close();
    }
  }
}
