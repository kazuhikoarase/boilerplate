using System;
using System.Windows.Forms;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.Runtime.InteropServices;

namespace Capwin {

    internal class Win32 {

        private Win32() {
        }
        
        public const int SRCCOPY = 0xCC0020;

        public const uint CF_BITMAP = 2;

        public const int CURSOR_SHOWING = 0x00000001;

        [StructLayout(LayoutKind.Sequential/*, Pack=4*/)]
        public struct ICONINFO {
            public Int32 fIcon;
            public Int32 xHotspot;
            public Int32 yHotspot;
            public IntPtr hbmMask;
            public IntPtr hbmColor;
        }

        [StructLayout(LayoutKind.Sequential)]
            public struct RECT {
            public Int32 left;
            public Int32 top;
            public Int32 right;
            public Int32 bottom;
        }	

        [StructLayout(LayoutKind.Sequential)]
            public struct POINT { 
            public Int32 x; 
            public Int32 y; 
        }

        [StructLayout(LayoutKind.Sequential)]
            public struct CURSORINFO {
            public Int32 cbSize; // Marshal.SizeOf(typeof(CURSORINFO))
            public Int32 flags;
            public IntPtr hCursor;
            public POINT ptScreenPos;
        }

        [DllImport("user32.dll")]
        public static extern IntPtr GetForegroundWindow();

        [DllImport("user32.dll")]
        public static extern IntPtr GetDesktopWindow();

        [DllImport("user32.dll")]
        public static extern int GetWindowRect(IntPtr hWnd, out RECT rect);
        
        [DllImport("user32.dll")]
        public static extern IntPtr GetDC(IntPtr hWnd);

        [DllImport("user32.dll")]
        public static extern int ReleaseDC(IntPtr hWnd, IntPtr hdc);
        
        [DllImport("gdi32.dll")]
        public static extern IntPtr CreateCompatibleDC(IntPtr hdc);
        
        [DllImport("gdi32.dll")]
        public static extern IntPtr CreateCompatibleBitmap(IntPtr hdc, int width, int height);
        
        [DllImport("gdi32.dll")]
        public static extern IntPtr SelectObject(IntPtr hdc, IntPtr hObject);

        [DllImport("gdi32.dll")]
        public static extern int DeleteDC(IntPtr hdc);
        
        [DllImport("gdi32.dll")]
        public static extern int BitBlt(IntPtr hDestDC, int x, int y, int width, int height,
            IntPtr hSrcDC, int srcX, int srcY, int rop);
/*
        [DllImport("user32.dll")]
        public static extern int OpenClipboard(IntPtr hWnd);
        
        [DllImport("user32.dll")]
        public static extern int EmptyClipboard();
        
        [DllImport("user32.dll")]
        public static extern IntPtr SetClipboardData(uint format, IntPtr hMem);

        [DllImport("user32.dll")]
        public static extern int CloseClipboard();
*/
        
        [DllImport("user32.dll")]
        public static extern int DrawIcon(IntPtr hDC,
            int x,
            int y,
            IntPtr hIcon);

        [DllImport("user32.dll")]
        public static extern bool GetCursorInfo(out CURSORINFO cursorinfo);

        [DllImport("user32.dll")]
        public static extern int GetCursorPos(out POINT point);

        [DllImport("user32.dll")]
        public static extern int GetIconInfo(
            IntPtr hIcon,
            out ICONINFO iconinfo
        );


    }
}
