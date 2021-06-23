using System;
using System.Drawing;
using System.Collections;
using System.ComponentModel;
using System.Windows.Forms;
using System.Data;


namespace Capwin {

    /// <summary>
    /// MainForm
    /// </summary>
    public class MainForm : System.Windows.Forms.Form {

        private const decimal MINUTE_IN_NANOS = 10000000;

        private System.Windows.Forms.Button startButton;
        private System.Windows.Forms.NumericUpDown captureTime;
        private System.Windows.Forms.Timer captureTimer;
        private System.Windows.Forms.CheckBox mouseCursorCheck;
        private System.ComponentModel.IContainer components;

        private decimal lastCaptureTime;
        private long beginCountDate;

        public MainForm() {
            //
            // Windows フォーム デザイナ サポートに必要です。
            //
            InitializeComponent();

            //
            // TODO: InitializeComponent 呼び出しの後に、コンストラクタ コードを追加してください。
            //
        }

        /// <summary>
        /// 使用されているリソースに後処理を実行します。
        /// </summary>
        protected override void Dispose( bool disposing ) {
            if( disposing ) {
                if (components != null) {
                    components.Dispose();
                }
            }
            base.Dispose( disposing );
        }

        #region Windows フォーム デザイナで生成されたコード 
        /// <summary>
        /// デザイナ サポートに必要なメソッドです。このメソッドの内容を
        /// コード エディタで変更しないでください。
        /// </summary>
        private void InitializeComponent() {
            this.components = new System.ComponentModel.Container();
            System.Resources.ResourceManager resources = new System.Resources.ResourceManager(typeof(MainForm));
            this.startButton = new System.Windows.Forms.Button();
            this.captureTime = new System.Windows.Forms.NumericUpDown();
            this.captureTimer = new System.Windows.Forms.Timer(this.components);
            this.mouseCursorCheck = new System.Windows.Forms.CheckBox();
            ((System.ComponentModel.ISupportInitialize)(this.captureTime)).BeginInit();
            this.SuspendLayout();
            // 
            // startButton
            // 
            this.startButton.Location = new System.Drawing.Point(64, 8);
            this.startButton.Name = "startButton";
            this.startButton.Size = new System.Drawing.Size(96, 24);
            this.startButton.TabIndex = 0;
            this.startButton.Text = "秒後にキャプチャ";
            this.startButton.Click += new System.EventHandler(this.startButton_Click);
            // 
            // captureTime
            // 
            this.captureTime.Location = new System.Drawing.Point(16, 8);
            this.captureTime.Maximum = new System.Decimal(new int[] {
                                                                        120,
                                                                        0,
                                                                        0,
                                                                        0});
            this.captureTime.Minimum = new System.Decimal(new int[] {
                                                                        1,
                                                                        0,
                                                                        0,
                                                                        0});
            this.captureTime.Name = "captureTime";
            this.captureTime.Size = new System.Drawing.Size(40, 19);
            this.captureTime.TabIndex = 2;
            this.captureTime.TextAlign = System.Windows.Forms.HorizontalAlignment.Right;
            this.captureTime.Value = new System.Decimal(new int[] {
                                                                      5,
                                                                      0,
                                                                      0,
                                                                      0});
            // 
            // captureTimer
            // 
            this.captureTimer.Tick += new System.EventHandler(this.captureTimer_Tick);
            // 
            // mouseCursorCheck
            // 
            this.mouseCursorCheck.Checked = true;
            this.mouseCursorCheck.CheckState = System.Windows.Forms.CheckState.Checked;
            this.mouseCursorCheck.Location = new System.Drawing.Point(16, 40);
            this.mouseCursorCheck.Name = "mouseCursorCheck";
            this.mouseCursorCheck.Size = new System.Drawing.Size(152, 16);
            this.mouseCursorCheck.TabIndex = 3;
            this.mouseCursorCheck.Text = "マウスカーソルもキャプチャ";
            // 
            // MainForm
            // 
            this.AutoScaleBaseSize = new System.Drawing.Size(5, 12);
            this.ClientSize = new System.Drawing.Size(178, 64);
            this.Controls.Add(this.mouseCursorCheck);
            this.Controls.Add(this.captureTime);
            this.Controls.Add(this.startButton);
            this.FormBorderStyle = System.Windows.Forms.FormBorderStyle.FixedDialog;
            this.Icon = ((System.Drawing.Icon)(resources.GetObject("$this.Icon")));
            this.MaximizeBox = false;
            this.Name = "MainForm";
            this.Text = "Capwin";
            this.TopMost = true;
            ((System.ComponentModel.ISupportInitialize)(this.captureTime)).EndInit();
            this.ResumeLayout(false);

        }
        #endregion

        /// <summary>
        /// アプリケーションのメイン エントリ ポイントです。
        /// </summary>
        [STAThread]
        static void Main() {
            Application.Run(new MainForm());
        }

        private void startButton_Click(object sender, System.EventArgs e) {

            uiEnabled(false);
            this.WindowState = FormWindowState.Minimized;

            lastCaptureTime = captureTime.Value;
            beginCountDate = DateTime.Now.Ticks;

            captureTimer.Enabled = true;
        }
        
        private void uiEnabled(bool enable) {
            captureTime.Enabled = enable;
            startButton.Enabled = enable;
            mouseCursorCheck.Enabled = enable;
        }

        private void capture() {

            try {

                Bitmap capture = CaptureUtils.CaptureForegroundWindow(mouseCursorCheck.Checked);

                Clipboard.SetDataObject(capture, true);

                this.WindowState = FormWindowState.Normal;

            } finally {
                uiEnabled(true);
            }
        }


        private void captureTimer_Tick(object sender, System.EventArgs e) {

            decimal time = (DateTime.Now.Ticks - beginCountDate) / MINUTE_IN_NANOS;

            if (time >= lastCaptureTime) {
            
                captureTimer.Enabled = false;
                captureTime.Value = lastCaptureTime;

                capture();

            } else {
                captureTime.Value = Math.Max(1, lastCaptureTime - time);
            }
        }
    }

}
