package ws;

import javax.servlet.ServletContext;
import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import javax.websocket.DeploymentException;
import javax.websocket.server.ServerContainer;
import javax.websocket.server.ServerEndpointConfig;

/**
 * WSServletContextListener
 * @author kazuhiko arase
 */
public class WSServletContextListener implements ServletContextListener {

  @Override
  public void contextInitialized(final ServletContextEvent sce) {

    final ServletContext servletContext = sce.getServletContext();

    final ServerContainer serverContainer =
        (ServerContainer)servletContext.
        getAttribute("javax.websocket.server.ServerContainer");

    try {
     
      final ServerEndpointConfig sec = ServerEndpointConfig.Builder.
          create(WSServerEndPoint.class, "/ws-ep").
          configurator(new WSConfigurator() ).
          build();

      sec.getUserProperties().put("scriptPath",
          servletContext.getRealPath("/WEB-INF/js/endpoint.js") );

      serverContainer.addEndpoint(sec);

    } catch(DeploymentException e) {
      throw new RuntimeException(e);
    }
  }

  @Override
  public void contextDestroyed(final ServletContextEvent sce) {

  }

}
