export interface WelcomeEmailData {
  userName: string;
  loginUrl: string;
}

export const getWelcomeEmailTemplate = (data: WelcomeEmailData): string => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8"/>
        <style>
          body { font-family: 'Inter', sans-serif; background-color: #EAEFEF; color: #25343F; padding: 20px; }
          .card { background-color: #ffffff; padding: 30px; border-radius: 8px; max-width: 600px; margin: 0 auto; }
          .button { background-color: #FF9B51; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="card">
          <h2>Welcome to SELLORA, ${data.userName}!</h2>
          <p>We are excited to have you on board. SELLORA brings you modern, premium commerce experiences.</p>
          <br/>
          <a href="${data.loginUrl}" class="button">Log In to Your Account</a>
        </div>
      </body>
    </html>
  `;
};
