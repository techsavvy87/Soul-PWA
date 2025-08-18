@extends('layouts.main')
@section('title', 'Dashboard')

@section('page-css')
<link href="{{ asset('src/assets/css/dark/dashboard/dash_1.css') }}" rel="stylesheet" type="text/css" />
@endsection

@section('content')
<div class="row layout-top-spacing">
    <div>
        This is the admin dashboard page
    </div>
</div>
@endsection

@section('page-js')
<script src="{{ asset('src/assets/js/dashboard/dash_1.js') }}"></script>
@endsection