
import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.regex.Pattern;

import org.apache.tools.ant.BuildException;
import org.apache.tools.ant.DirectoryScanner;
import org.apache.tools.ant.Project;
import org.apache.tools.ant.Task;
import org.apache.tools.ant.taskdefs.Tar;
import org.apache.tools.ant.taskdefs.Tar.TarFileSet;
import org.apache.tools.ant.types.FileSet;

/**
 * TarDeployTask
 */
public class TarDeployTask extends Task {

  private File destFile = null;

  private String infoFile = ".deploy-info";

  private String encoding = "UTF-8";

  private boolean verbose = false;

  private List<FileSet> filesets = new ArrayList<FileSet>();

  public File getDestFile() {
    return destFile;
  }

  public void setDestFile(File destFile) {
    this.destFile = destFile;
  }

  public String getInfoFile() {
    return infoFile;
  }

  public void setInfoFile(String infoFile) {
    this.infoFile = infoFile;
  }

  public String getEncoding() {
    return encoding;
  }

  public void setEncoding(String encoding) {
    this.encoding = encoding;
  }

  public boolean isVerbose() {
    return verbose;
  }

  public void setVerbose(boolean verbose) {
    this.verbose = verbose;
  }

  public void addFileset(FileSet fileset) {
    filesets.add(fileset);
  }

  @Override
  public void execute() throws BuildException {

    if (getDestFile() == null) {
      throw new BuildException("destFile attribute must be set!");
    }

    try {

      final Map<File, List<String[]>> infoMap = new HashMap<File, List<String[]>>();
      final List<TarfileInfo> tarfileList = new ArrayList<TarfileInfo>();

      for (final FileSet fs : filesets) {
        final DirectoryScanner ds = fs.getDirectoryScanner(getProject() );
        for (final String includedFile : ds.getIncludedFiles() ) {
          final File file = new File(ds.getBasedir(), includedFile);
          if (file.getName().equals(getInfoFile() ) ) {
            continue;
          }
          final File infoFile = findInfoFile(file);
          if (infoFile == null) {
            log("skipping " + file + " (" + getInfoFile() + " not found)", Project.MSG_WARN);
            continue;
          }
          if (!infoMap.containsKey(infoFile) ) {
            infoMap.put(infoFile, readInfo(infoFile) );
          }
          boolean matches = false;
          for (String[] info : infoMap.get(infoFile) ) {
            if (patternMatches(info[0], file.getName() ) ) {
              final String p1 = infoFile.getParentFile().getCanonicalPath();
              final String p2 = file.getParentFile().getCanonicalPath();
              final String fullpath = buildPath(info[4], p2.substring(p1.length() ), file.getName() );
              final TarfileInfo tarfile = new TarfileInfo();
              tarfile.setFile(file);
              tarfile.setInfo(info);
              tarfile.setFullpath(fullpath);
              tarfileList.add(tarfile);
              matches = true;
              break;
            }
          }
          if (!matches) {
            log("skipping " + file + " (no pattern matches in " + infoFile.getCanonicalPath() + ")", Project.MSG_WARN);
          }
        }
      }

      final Map<String,TarfileInfo> tarMap = new HashMap<String, TarDeployTask.TarfileInfo>();
      boolean duplecated = false;
      for (final TarfileInfo tarfile : tarfileList) {
        if (tarMap.containsKey(tarfile.getFullpath() ) ) {
          log("duplicated fullpath:" + tarfile.getFullpath(), Project.MSG_ERR);
          log(" " + tarMap.get(tarfile.getFullpath() ).getFile().getAbsolutePath(), Project.MSG_ERR);
          log(" " + tarfile.getFile().getAbsolutePath(), Project.MSG_ERR);
          duplecated = true;
        } else {
          tarMap.put(tarfile.getFullpath(), tarfile);
        }
      }
      if (duplecated) {
        throw new BuildException("duplicated");
      }

      Collections.sort(tarfileList, new Comparator<TarfileInfo>() {
        @Override
        public int compare(final TarfileInfo o1, final TarfileInfo o2) {
          return o1.getFullpath().compareTo(o2.getFullpath() );
        }
      });

      final Tar tar = (Tar)getProject().createTask("tar");
      for (final TarfileInfo tarfile : tarfileList) {
        final File file = tarfile.getFile();
        final String[] info = tarfile.getInfo();
        final String fullpath = tarfile.getFullpath();
        final TarFileSet tfs = tar.createTarFileSet();
        tfs.setDir(file.getParentFile() );
        tfs.setUserName(info[1]);
        tfs.setGroup(info[2]);
        tfs.setFileMode(info[3]);
        tfs.setFullpath(fullpath);
        tfs.setPreserveLeadingSlashes(fullpath.startsWith("/") );
        tfs.createInclude().setName(file.getName() );
        if (isVerbose() ) {
          log("Adding tarfile: " + info[1] + " " + info[2] + " " + info[3] + " " + fullpath +
              " from " + file.getCanonicalPath() );
        }
      }
      tar.setDestFile(getDestFile() );

      tar.perform();

    } catch(IOException e) {
      throw new BuildException(e);
    }
  }

  protected static class TarfileInfo {
    private File file;
    private String[] info;
    private String fullpath;
    public TarfileInfo() {
    }
    public File getFile() {
      return file;
    }
    public void setFile(File file) {
      this.file = file;
    }
    public String[] getInfo() {
      return info;
    }
    public void setInfo(String[] info) {
      this.info = info;
    }
    public String getFullpath() {
      return fullpath;
    }
    public void setFullpath(String fullpath) {
      this.fullpath = fullpath;
    }
  }

  protected File findInfoFile(final File file) {
    for (File dir = file.getParentFile(); dir != null; dir = dir.getParentFile() ) {
      final File infoFile = new File(dir, getInfoFile() );
      if (infoFile.exists() ) {
        return infoFile;
      }
    }
    return null;
  }

  protected List<String[]> readInfo(final File file) throws BuildException {
    try {
      final BufferedReader in = new BufferedReader(new InputStreamReader(new FileInputStream(file), getEncoding() ) );
      try {
        final List<String[]> list = new ArrayList<String[]>();
        String line;
        int lineNo = 0;
        while ( (line = in.readLine() ) != null) {
          lineNo += 1;
          line = line.trim();
          if (line.length() == 0 || line.startsWith("#") ) {
            // skip blank line, comment line.
            continue;
          }
          final String[] info = splitInfo(line);
          if (info.length != 5) {
            throw new BuildException("Illegal format " + line + " at " + file.getCanonicalPath() + " line " + lineNo); 
          }
          list.add(info);
        }
        return list;
      } finally {
        in.close();
      }
    } catch(RuntimeException e) {
      throw e;
    } catch(Exception e) {
      throw new BuildException(e);
    }
  }

  protected static String buildPath(final String... paths) {
    final StringBuilder buf = new StringBuilder();
    for (int i = 0; i < paths.length; i += 1) {
      final String path = paths[i].replace('\\', '/');
      int start = 0;
      int end = path.length();
      while (i > 0 && start < path.length() && path.charAt(start) == '/') {
        start += 1;
      }
      while (end - 1 >= 0 && path.charAt(end - 1) == '/') {
        end -= 1;
      }
      if (start < end) {
        if (i > 0) {
          buf.append('/');
        }
        buf.append(path.substring(start, end) );
      }
    }
    return buf.toString();
  }

  protected static String[] splitInfo(final String info) {
    return info.split(":");
  }

  private static final ConcurrentHashMap<String, Pattern> patternCache = new ConcurrentHashMap<String, Pattern>();

  protected static boolean patternMatches(final String pattern, final String s) {
    if (!patternCache.containsKey(pattern) ) {
      final StringBuilder buf = new StringBuilder();
      buf.append("^");
      for (int i = 0; i < pattern.length(); i += 1) {
        final String c = pattern.substring(i, i + 1);
        if ("?".equals(c) ) {
          buf.append(".");
        } else if ("*".equals(c) ) {
          buf.append(".*");
        } else {
          buf.append(Pattern.quote(c) );
        }
      }
      buf.append("$");
      patternCache.putIfAbsent(pattern, Pattern.compile(buf.toString() ) );
    }
    return patternCache.get(pattern).matcher(s).matches();
  }
}
