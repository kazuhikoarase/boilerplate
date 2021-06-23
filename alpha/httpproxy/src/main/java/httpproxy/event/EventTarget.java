package httpproxy.event;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * EventTarget
 * @author kazuhiko arase
 */
public class EventTarget {
  private final Map<String,List<EventListener>> map =
      new HashMap<String, List<EventListener>>();
  public EventTarget() {
  }
  protected List<EventListener> getListeners(final String type) {
    List<EventListener> listeners = map.get(type);
    if (listeners == null) {
      listeners = new ArrayList<EventListener>(1);
      map.put(type, listeners);
    }
    return listeners;
  }
  public EventTarget trigger(final String type, final Object detail)
  throws Exception {
    final EventObject e = new EventObject(type, this, detail);
    for (EventListener l : getListeners(type) ) {
      l.handle(e);
    }
    return this;
  }
  public EventTarget on(final String type, final EventListener l) {
    getListeners(type).add(l);
    return this;
  }
  public EventTarget off(final String type, final EventListener l) {
    getListeners(type).remove(l);
    return this;
  }
}
