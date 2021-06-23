package httpproxy.core;

import java.io.IOException;
import java.text.DecimalFormat;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.ThreadFactory;
import java.util.concurrent.TimeUnit;

import httpproxy.io.ByteInput;
import httpproxy.io.ByteOutput;

/**
 * NetworkEmulator
 * @author kazuhiko arase
 */
public class NetworkEmulator {
  protected static final Console console = Console.global;
  private static final long FEED_INTERVAL_IN_MILLIS = 50L;
  private final Object lock = new Object();
  private ExecutorService es;
  private boolean alive;
  private long bps = 0;
  private long bufInBits = 0;
  public NetworkEmulator() {
  }
  public long getBps() {
    return bps;
  }
  public void setBps(long bps) {
    final DecimalFormat fmt = new DecimalFormat("###,###,###,###,##0");
    console.log("network speed:" + fmt.format(bps / 8) +
        "[bytes per second] (" +
        fmt.format(bps / 1024 / 1024) + "Mbps)");
    this.bps = bps;
  }
  public void start() {
    alive = true;
    es = Executors.newSingleThreadExecutor(new ThreadFactory() {
      @Override
      public Thread newThread(final Runnable r) {
        final Thread t = new Thread(r);
        t.setName("network-feeder");
        return t;
      }
    });
    es.execute(new Runnable() {
      @Override
      public void run() {
        try {
          doTimer();
        } catch(RuntimeException e) {
          throw e;
        } catch(Exception e) {
          throw new RuntimeException(e);
        }
      }
    });
    console.log("network emulator started.");
  }
  public void stop() {
    try {
      alive = false;
      es.shutdown();
      es.awaitTermination(1, TimeUnit.DAYS);
    } catch(RuntimeException e) {
      throw e;
    } catch(Exception e) {
      throw new RuntimeException(e);
    }
  }
  protected void doTimer() throws Exception {
    long lastTime = System.currentTimeMillis();
    while (alive) {
      synchronized(lock) {
        final long time = System.currentTimeMillis();
        final long feed = bps * (time - lastTime) / 1000;
        bufInBits = feed;
        lastTime = time;
        lock.notifyAll();
      }
      Thread.sleep(FEED_INTERVAL_IN_MILLIS);
    }
  }
  protected void consume(final int len) {
    final int lenInBits = len * 8;
    synchronized(lock) {
      try {
        while (bufInBits < lenInBits) {
          lock.wait();
        }
      } catch(InterruptedException e) {
        throw new RuntimeException(e);
      }
      bufInBits -= lenInBits;
    }
  }
  public ByteInput wrap(final ByteInput in) {
    return new ByteInput() {
      @Override
      public int read() throws IOException {
        consume(1);
        return in.read();
      }
      @Override
      public int read(final byte[] buf, final int off, final int len) throws IOException {
        final int readLen = in.read(buf, off, len);
        consume(readLen);
        return readLen;
      }
      @Override
      public int read(final byte[] buf) throws IOException {
        final int readLen = in.read(buf);
        consume(readLen);
        return readLen;
      }
      @Override
      public int available() throws IOException {
        return in.available();
      }
    };
  }
  public ByteOutput wrap(final ByteOutput out) {
    return new ByteOutput() {
      @Override
      public void write(final int b) throws IOException {
        consume(1);
        out.write(b);
      }
      @Override
      public void write(final byte[] buf, final int off, final int len) throws IOException {
        consume(len);
        out.write(buf, off, len); 
      }
      @Override
      public void flush() throws IOException {
        out.flush();
      }
      @Override
      public boolean isShutdown() throws IOException {
        return out.isShutdown();
      }
    };
  }
}
