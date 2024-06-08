package slst;

import java.awt.font.TextLayout;

public interface PageRenderer {
  void begin(SetList setList) throws Exception;
  void end() throws Exception;
  void render(int textIndex, float x, float y,
      TextLayout layout) throws Exception;
}
