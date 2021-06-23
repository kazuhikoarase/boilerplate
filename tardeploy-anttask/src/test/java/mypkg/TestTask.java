package mypkg;

import java.io.File;
import java.util.ArrayList;
import java.util.List;

import org.apache.tools.ant.BuildException;
import org.apache.tools.ant.DirectoryScanner;
import org.apache.tools.ant.Task;
import org.apache.tools.ant.taskdefs.Tar;
import org.apache.tools.ant.taskdefs.Tar.TarFileSet;
import org.apache.tools.ant.types.FileSet;

public class TestTask  extends Task {

  private List<FileSet> filesets = new ArrayList<FileSet>();

  public void addFileset(FileSet fileset) {
    filesets.add(fileset);
  }

  @Override
  public void execute() throws BuildException {
System.out.println("base:" + getProject().getBaseDir() );
    for (FileSet fs : filesets) {
      DirectoryScanner ds = fs.getDirectoryScanner(getProject() );
      for (String includedFile : ds.getIncludedFiles() ) {
        File file = new File(ds.getBasedir(), includedFile);
        System.out.println(file);
      }
    }
    super.execute();

    File destFile = new File(getProject().getBaseDir(), "test.tar");
    if (destFile.exists() ) {
      if (!destFile.delete() ) {
        throw new RuntimeException("can't delete");
      }
      
    }

    Tar tar = (Tar)getProject().createTask("tar");
    tar.setDestFile(destFile);
    {
      TarFileSet tfs = tar.createTarFileSet();
      tfs.setDir(getProject().getBaseDir() );
      tfs.setUserName("user1");
      tfs.setGroup("users");
      tfs.setFileMode("640");
      tfs.setFullpath("/a/b/c/test1.xml");
      tfs.setPreserveLeadingSlashes(true);
      tfs.setIncludes("build.gradle");
    }
    {
     TarFileSet tfs = tar.createTarFileSet();
      tfs.setDir(getProject().getBaseDir() );
      tfs.setUserName("user2");
      tfs.setGroup("users");
      tfs.setFileMode("600");
      tfs.setFullpath("/a/b/test2.xml");
      tfs.setPreserveLeadingSlashes(true);
      tfs.setIncludes("build.xml");
    }

    tar.perform();

  }

  
}
