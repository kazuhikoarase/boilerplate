using System;
using System.Windows.Forms;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.Runtime.InteropServices;

namespace ClipImage {

    /// <summary>
    /// ClipImage の概要の説明です。
    /// </summary>
    class ClipImage {

        const int EXIT_SUCCESS = 0;
        const int EXIT_FAILURE = 1;

        /// <summary>
        /// アプリケーションのメイン エントリ ポイントです。
        /// </summary>
        [STAThread]
        static int Main(string[] args) {

            string filename = (args.Length > 0)? args[0] : DateTime.Now.ToString("yyyyMMddHHmmss") + ".jpg";
            string fileFormat = (args.Length > 1)? args[1] : "jpeg";

            // クリップボードからデータを取得。
            IDataObject data = Clipboard.GetDataObject();

            if (data == null) {
                // データが null
                return EXIT_FAILURE;
            }

            string[] formats = data.GetFormats();

            foreach (string format in formats) {
                
                Bitmap bitmap = null;

                if (format.Equals("System.Drawing.Bitmap") ) {
                    // Bitmapの場合
                    bitmap = (Bitmap)data.GetData(typeof(System.Drawing.Bitmap) );
                } else if (format.Equals("JFIF") || format.Equals("PNG") ) {
                    // JFIFまたはPNGの場合、メモリストリームから読み取り
                    bitmap = new Bitmap( (Stream)data.GetData(format) );
                }

                if (bitmap != null) {

                    if (fileFormat.Equals("jpeg") ) {

                        // JPEG形式で保存

                        ImageCodecInfo codec = null;
                        foreach (ImageCodecInfo imageEncoder in ImageCodecInfo.GetImageEncoders() ) {
                            if (imageEncoder.MimeType.Equals("image/jpeg") ) {
                                codec = imageEncoder;
                            }
                        }

                        EncoderParameters encoderParams = new EncoderParameters(1);
                        encoderParams.Param[0] = new EncoderParameter(Encoder.Quality, 100L);
                        
                        bitmap.Save(filename, codec, encoderParams);

                        return EXIT_SUCCESS;
                    } else if (fileFormat.Equals("png") ) {

                        // PNG形式で保存

                        bitmap.Save(filename, ImageFormat.Png);

                        return EXIT_SUCCESS;

                    }

                }
            }


            return EXIT_FAILURE;
        }




    }


}
