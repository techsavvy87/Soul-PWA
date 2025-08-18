@extends('layouts.auth_main')
@section('title', 'Login')

@section('content')
<div class="col-xxl-4 col-xl-5 col-lg-5 col-md-8 col-12 d-flex flex-column align-self-center mx-auto">
    <div class="text-center user-info">
        <img src="{{ asset('images/logo.png') }}" alt="avatar">
    </div>
    <div class="card mt-3 mb-3">
        <div class="card-body">
            <form action="{{ route('login-post') }}" method="post">
                @csrf
                <div class="row">
                    <div class="col-md-12 mb-3">
                        <h2>Sign In</h2>
                        <p>Enter your email and password to login</p>
                    </div>
                    <div class="col-md-12">
                        <div class="mb-3">
                            <label class="form-label">Email</label>
                            <input type="email" class="form-control" name="email" required>
                        </div>
                    </div>
                    <div class="col-12">
                        <div class="mb-4">
                            <label class="form-label">Password</label>
                            <input type="password" class="form-control" name="password" required>
                        </div>
                    </div>


                    <div class="col-12">
                        <div class="mb-3">
                            <div class="form-check form-check-primary form-check-inline">
                                <input class="form-check-input me-3" type="checkbox" id="remember_me"
                                    name="remember_me">
                                <label class="form-check-label" for="form-check-default">
                                    Remember me
                                </label>
                            </div>
                        </div>
                    </div>
                    <div class="col-12">
                        <div class="mb-4">
                            <button class="btn btn-secondary w-100" type="submit">SIGN IN</button>
                        </div>
                    </div>
                    <div class="col-12">
                        <div class="text-center">
                            <p class="mb-0">Forgot password? <a href="javascript:void(0);"
                                    class="text-warning">Reset</a></p>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    </div>
</div>
@endsection