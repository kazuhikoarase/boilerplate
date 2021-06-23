
import org.junit.Assert;
import org.junit.Test;

public class TarDeployTaskTest {

  @Test
  public void splitInfo() throws Exception {
    String[] info = TarDeployTask.splitInfo("a:b:c:d");
    Assert.assertEquals(4, info.length);
    Assert.assertEquals("a", info[0]);
    Assert.assertEquals("d", info[3]);
  }

  @Test
  public void patternMatches() throws Exception {
    Assert.assertTrue(TarDeployTask.patternMatches("a", "a") );
    Assert.assertFalse(TarDeployTask.patternMatches("a", "b") );
    Assert.assertTrue(TarDeployTask.patternMatches("*.txt", "test.txt") );
    Assert.assertTrue(TarDeployTask.patternMatches("*.txt", "test2.txt") );
    Assert.assertTrue(TarDeployTask.patternMatches("test?.txt", "test2.txt") );
    Assert.assertFalse(TarDeployTask.patternMatches("test?.txt", "test2xtxt") );
    Assert.assertFalse(TarDeployTask.patternMatches("test?a.txt", "test2.txt") );
    Assert.assertFalse(TarDeployTask.patternMatches("*.txt", "testtxt") );
  }

  @Test
  public void buildPath() throws Exception {
    Assert.assertEquals("a", TarDeployTask.buildPath("a") );
    Assert.assertEquals("/a", TarDeployTask.buildPath("/a") );
    Assert.assertEquals("/a/b", TarDeployTask.buildPath("/a", "/b/") );
    Assert.assertEquals("/a/b/c.txt", TarDeployTask.buildPath("/a", "/b/", "c.txt") );
    Assert.assertEquals("a/b/c.txt", TarDeployTask.buildPath("a", "/b/", "c.txt") );
  }
}
