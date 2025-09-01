<!DOCTYPE html>
<html>

<head>
    <title>Reset Password for Blended Soul Account</title>
</head>

<body>
    <table>
        <tr>
            <td>
                <h4>Welcome to Blended Soul!</h4>
            </td>
        </tr>
        <tr>
            <td>
                <p>We received your request to reset password.</p>
                <p>
                    Please enter the code below to verify your email address and reset your password.
                </p>
            </td>
        </tr>
        <tr>
            <td>
                <center>
                    <span style="font-size: 16px; font-weight: bold">{{$mailData['verification_number']}}</span>
                </center>
            </td>
        </tr>
        <tr>
            <td>
                <div>The Blended Soul Team</div>
                <div>paul@paulwagner.com</div>
            </td>
        </tr>
    </table>
</body>

</html>