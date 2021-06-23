using System;
using System.Windows.Forms;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.Runtime.InteropServices;

namespace Capwin {

    internal class CaptureUtils {

        private CaptureUtils() {
        }

        public static Bitmap CaptureForegroundWindow(bool mouseCursor) {
            

            IntPtr activeWindow = Win32.GetForegroundWindow();
            Win32.RECT activeRect;
            Win32.GetWindowRect(activeWindow, out activeRect);

            IntPtr desktopWindow = Win32.GetDesktopWindow();
            Win32.RECT desktopRect;
            Win32.GetWindowRect(desktopWindow, out desktopRect);

            Win32.RECT rect;
            rect.left = Math.Max(activeRect.left, desktopRect.left);
            rect.top = Math.Max(activeRect.top, desktopRect.top);
            rect.right = Math.Min(activeRect.right, desktopRect.right);
            rect.bottom = Math.Min(activeRect.bottom, desktopRect.bottom);
            

            int width = rect.right - rect.left;
            int height = rect.bottom - rect.top;

            if (!(width > 0 && height > 0) ) {
                return null;
            }

            Bitmap capture = null;

            IntPtr hdc = Win32.GetDC(desktopWindow);
            IntPtr hdcMem = Win32.CreateCompatibleDC(hdc);

            IntPtr hBitmap = Win32.CreateCompatibleBitmap(hdc, width, height);

            if (hBitmap != IntPtr.Zero) {

                Win32.SelectObject(hdcMem, hBitmap);

                Win32.BitBlt(hdcMem, 0, 0, width, height,
                    hdc, rect.left, rect.top, Win32.SRCCOPY);

                if (mouseCursor) {

                    Win32.CURSORINFO cursorinfo;
                    cursorinfo.cbSize = Marshal.SizeOf(typeof(Win32.CURSORINFO) );
                    Win32.GetCursorInfo(out cursorinfo);

                    if ( (cursorinfo.flags & Win32.CURSOR_SHOWING) != 0) {

                        Win32.ICONINFO iconinfo;
                        Win32.GetIconInfo(cursorinfo.hCursor, out iconinfo);

                        Win32.DrawIcon(hdcMem,
                            cursorinfo.ptScreenPos.x - iconinfo.xHotspot - rect.left,
                            cursorinfo.ptScreenPos.y - iconinfo.yHotspot - rect.top,
                            cursorinfo.hCursor);
                    }
                }

                capture = Bitmap.FromHbitmap(hBitmap);

                Win32.DeleteDC(hBitmap);
            }

            Win32.DeleteDC(hdcMem);
            Win32.ReleaseDC(desktopWindow, hdc);        

            return capture;
        }    
    }

}
