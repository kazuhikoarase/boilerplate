package ws.app;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

import javax.naming.InitialContext;
import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.sql.DataSource;

/**
 * CLBServlet
 * @author kazuhiko arase
 */
@SuppressWarnings("serial")
public class CLBServlet extends HttpServlet {

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

  @Override
  protected void doGet(
      final HttpServletRequest request,
      final HttpServletResponse response
  ) throws ServletException, IOException {

    final String dataGrp = "DFLT";
    final String dataId = request.getParameter("dataId");
    final String dataIdFrom = request.getParameter("dataIdFrom");
    final String dataIdTo = request.getParameter("dataIdTo");

    try {

      final Connection conn = dataSource.getConnection();

      try {

        final StringBuilder sql = new StringBuilder();
        sql.append("select JSON_DATA from CLB_DATA_TBL where DATA_GRP=?");

        if (dataId != null) {
          sql.append(" and DATA_ID=?");
        }
        if (dataIdFrom != null) {
          sql.append(" and DATA_ID>=?");
        }
        if (dataIdTo != null) {
          sql.append(" and DATA_ID<=?");
        }

        sql.append(" order by DATA_ID");

        final PreparedStatement stmt = conn.prepareStatement(sql.toString() );

        try {

          int paramCount = 1;
          stmt.setString(paramCount++, dataGrp);

          if (dataId != null) {
            stmt.setLong(paramCount++, Long.valueOf(dataId) );
          }
          if (dataIdFrom != null) {
            stmt.setLong(paramCount++, Long.valueOf(dataIdFrom) );
          }
          if (dataIdTo != null) {
            stmt.setLong(paramCount++, Long.valueOf(dataIdTo) );
          }

          final ResultSet rs = stmt.executeQuery();

          try {

            response.setHeader("Cache-Control", "no-cache");
            response.setHeader("Pragma", "no-cache");
            response.setIntHeader("Expires", 0);

            response.setContentType("application/json;charset=UTF-8");

            final PrintWriter out = response.getWriter();

            try {

              int count = 0;
              out.write('[');
              while(rs.next() ) {
                if (count > 0) {
                  out.write(',');
                }
                out.write(rs.getString(1) );
                count += 1;
              }
              out.write(']');

            } finally {
              out.close();
            }

          } finally {
            rs.close();
          }

        } finally {
          stmt.close();
        }

      } finally {
        conn.close();
      }

    } catch(RuntimeException e) {
      throw e;
    } catch(Exception e) {
      throw new ServletException(e);
    }

  }

}
