package ws;

import javax.websocket.HandshakeResponse;
import javax.websocket.server.HandshakeRequest;
import javax.websocket.server.ServerEndpointConfig;

/**
 * WSConfigurator
 * @author kazuhiko arase
 */
public class WSConfigurator extends ServerEndpointConfig.Configurator {

  @Override
  public void modifyHandshake(
      final ServerEndpointConfig sec,
      final HandshakeRequest request,
      final HandshakeResponse response) {

  }
}
