@extends('layouts.main')
@section('title', 'conceptData.TV Setting')

@section('page-css')
<link href="{{ asset('src/assets/css/dark/apps/add.css') }}" rel="stylesheet" type="text/css" />
<style>
@media (max-width: 767px) {
    .mobile-hide {
        display: none;
    }
}

.swal-alert-icon .swal2-icon {
    font-size: 3em;
    /* Custom icon size */
    width: 60px;
    height: 60px;
}

.swal-alert-title {
    font-size: 20px;
    /* Custom title font size */
    font-weight: bold;
}

.invoice-actions {
    padding: 12px 0px !important;
}
</style>
@endsection

@section('content')
<div class="row invoice layout-top-spacing layout-spacing">
    <div class="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
        <div class="doc-container">
            <h5 class="pt-2 pb-2">What is Blended Soul?</h5>
            @include('layouts.alerts')
            <form action="{{ route('save-concept') }}" method="post" id="save_form">
                @csrf
                <div class="row">
                    <div class="col-xl-12">
                        <div class="invoice-content">
                            <div class="invoice-detail-body">
                                <div class="row mb-4">
                                    <div class="col-md-12">
                                        <div class="form-group">
                                            <label for="description" style="margin-bottom: 2px">Description*</label>
                                            <textarea class="form-control" id="description" name="description"
                                                placeholder="Describe Blended Soul here..." style="height: 180px;"
                                                value="{{ $conceptData['description'] }}">{{ $conceptData['description'] }}</textarea>
                                        </div>
                                    </div>
                                </div>
                                <div class="d-flex flex-row-reverse">
                                    <div>
                                        <a href="{{ route('fetch-creative') }}"
                                            class="btn btn-outline-secondary">Cancel</a>
                                        <a href="javascript:save();" class="btn btn-primary">Save</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    </div>
</div>
@endsection

@section('page-js')
<script>
function save() {
    const description = $('#description').val();

    if (!description) {
        Swal.fire({
            icon: 'error',
            title: 'The description field should not be empty.',
            width: '420px',
            customClass: {
                icon: 'swal-alert-icon',
                title: 'swal-alert-title'
            }
        })
        return;
    }

    $('#save_form').submit();
}
</script>
@endsection