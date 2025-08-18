<!DOCTYPE html>
<html>

<head>
    <title>Verify ElevateToLove Account</title>
</head>

<body>
    <table>
        <tr>
            <td>
                <h4>Welcome to Elevate To Love!</h4>
            </td>
        </tr>
        <tr>
            <td>
                <p>We received your request to become a Elevate To Love member.</p>
                <p>
                    Please enter the code below to verify your email address and activate your new Elevate To Love
                    account.
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
                <div>The ElevateToLove Team</div>
                <div>susandrury.com</div>
            </td>
        </tr>
    </table>
</body>

</html>