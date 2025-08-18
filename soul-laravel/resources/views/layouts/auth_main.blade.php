<!DOCTYPE html>
<html>
   <head>
      <meta charset="utf-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, shrink-to-fit=no">
      <meta name="description" content="Elevate To Love">
      <meta name="author" content="">
      <title>@yield('title') - Blended Soul</title>
      <link rel="icon" type="image/png" href="{{ asset('images/logo.png') }}">
      <link href="https://fonts.googleapis.com/css?family=Nunito:400,600,700" rel="stylesheet">
      <link href="{{ asset('src/bootstrap/css/bootstrap.min.css') }}" rel="stylesheet">
      <link href="{{ asset('vendors/theme/css/dark/plugins.css') }}" rel="stylesheet">
      <link href="{{ asset('src/assets/css/dark/authentication/auth-boxed.css') }}" rel="stylesheet">
      <link href="{{ asset('src/assets/css/dark/elements/alert.css') }}" rel="stylesheet">
      @yield('page-css')
   </head>
   <body class="form dark">

    <div class="auth-container d-flex">
      <div class="container mx-auto align-self-center">
        <div class="row">
          @yield('content')
        </div>
      </div>
    </div>

    <script src="{{ asset('src/jquery/jquery-3.6.1.min.js') }}"></script>
    <script src="{{ asset('src/bootstrap/js/bootstrap.bundle.min.js') }}"></script>
    @yield('page-js')
   </body>
</html>