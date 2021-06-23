package httpproxy.event;

/**
 * EventObject
 * @author kazuhiko arase
 */
public class EventObject {
  private final String type;
  private final Object target;
  private final Object detail;
  private boolean defaultPrevented;
  public EventObject(final String type,
      final Object target, final Object detail) {
    this.type = type;
    this.target = target;
    this.detail = detail;
    this.defaultPrevented = false;
  }
  public String getType() {
    return type;
  }
  public Object getTarget() {
    return target;
  }
  public Object getDetail() {
    return detail;
  }
  public void preventDefault() {
    defaultPrevented = true;
  }
  public boolean isDefaultPrevented() {
    return defaultPrevented;
  }
  @Override
  public String toString() {
    final StringBuilder buf = new StringBuilder();
    buf.append(getClass().getSimpleName() );
    buf.append('(');
    buf.append("type=");
    buf.append(getType() );
    buf.append(",target=");
    buf.append(getTarget() );
    buf.append(",detail=");
    buf.append(getDetail() );
    buf.append(",defaultPrevented=");
    buf.append(isDefaultPrevented() );
    buf.append(')');
    return buf.toString();
  }
}
