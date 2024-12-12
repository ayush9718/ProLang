exports.otpTemplate = (otp) => {
    
    return `<!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>OTP Verification Email</title>
        <style>
            body {
                background-color: #f4f4f7;
                font-family: 'Helvetica Neue', Arial, sans-serif;
                font-size: 16px;
                color: #333333;
                margin: 0;
                padding: 0;
                -webkit-font-smoothing: antialiased;
            }
    
            .container {
                max-width: 600px;
                margin: 40px auto;
                padding: 20px;
                background-color: #ffffff;
                border-radius: 8px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
                text-align: center;
            }
    
            .logo {
                max-width: 180px;
                margin: 20px auto;
            }
    
            .message-title {
                font-size: 24px;
                font-weight: bold;
                color: #333333;
                margin-top: 10px;
            }
    
            .body-content {
                font-size: 16px;
                color: #555555;
                line-height: 1.6;
                margin: 20px 0;
            }
    
            .otp-code {
                font-size: 32px;
                font-weight: bold;
                color: #4CAF50;
                margin: 20px 0;
            }
    
            .cta {
                display: inline-block;
                padding: 12px 24px;
                background-color: #FFD60A;
                color: #000000;
                text-decoration: none;
                border-radius: 5px;
                font-weight: bold;
                margin-top: 20px;
            }
    
            .footer {
                font-size: 14px;
                color: #888888;
                margin-top: 30px;
            }
    
            .footer a {
                color: #FFD60A;
                text-decoration: none;
            }
        </style>
    </head>
    
    <body>
        <div class="container">
        
            <div class="message-title">Verify Your Account</div>
            <div class="body-content">
                <p>Dear User,</p>
                <p>Thank you for joining ProLang! To complete your registration, please use the OTP (One-Time Password) below to verify your account.</p>
                <div class="otp-code">${otp}</div>
                <p>This OTP is valid for <strong>5 minutes</strong>. If you did not request this verification, please ignore this email.</p>
            </div>
            <a class="cta" href="">Go to ProLang</a>
            <div class="footer">
                If you have any questions, please contact us at 
                <a href="mailto:ayushknowu@gmail.com">info@ProLang.com</a>.
                <br>ProLang Team
            </div>
        </div>
    </body>
    </html>`;
};

