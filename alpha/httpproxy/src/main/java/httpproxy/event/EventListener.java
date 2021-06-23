package httpproxy.event;

/**
 * EventListener
 * @author kazuhiko arase
 */
public interface EventListener {
  void handle(EventObject e) throws Exception;
}
