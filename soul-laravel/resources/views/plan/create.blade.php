@extends('layouts.main')
@section('title', 'Create Price')

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
</style>
@endsection

@section('content')
<div class="row invoice layout-top-spacing layout-spacing">
    <div class="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
        @include('layouts.alerts')
        <div class="doc-container">
            <h5 class="pt-2 pb-2">New Plan</h5>
            <form action="{{ route('store-plan') }}" method="post" id="create_form">
                @csrf
                <div class="row">
                    <div class="col-xl-10 offset-xl-1">
                        <div class="invoice-content">
                            <div class="invoice-detail-body">
                                <div class="row mb-3">
                                    <div class="col-md-4">
                                        <div class="form-group">
                                            <label for="product_name">Product Name*</label>
                                            <input type="text" name="product_name" id="product_name"
                                                class="form-control" required>
                                        </div>
                                    </div>
                                </div>
                                <div class="row mb-3">
                                    <div class="col-md-12">
                                        <div class="form-group">
                                            <div class="form-group">
                                                <label for="product_description">Product Description</label>
                                                <textarea name="product_description" id="product_description"
                                                    class="form-control"></textarea>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="row mb-3">
                                    <div class="col-md-3">
                                        <div class="form-group">
                                            <div class="form-group">
                                                <label for="plan_name">Plan Name*</label>
                                                <input type="text" name="plan_name" id="plan_name" class="form-control"
                                                    required>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-3">
                                        <div class="form-group">
                                            <label for="price">Price*</label>
                                            <div class="input-group">
                                                <span class="input-group-text">$</span>
                                                <input type="text" class="form-control" name="price" id="price"
                                                    placeholder="e.x. 1,234.00" inputmode="numeric" pattern="[0-9]*"
                                                    oninput="this.value = this.value.replace(/[^0-9.]/g, '').replace(/^0+(\d)/, '$1');">
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-3">
                                        <div class="form-group">
                                            <!-- <label for="interval_unit">Interval Unit*</label>
                                            <select name="interval_unit" id="interval_unit" class="form-control"
                                                required>
                                                <option value="MONTH">Monthly</option>
                                                <option value="ANNUAL">Annual</option>
                                            </select> -->
                                            <label style="margin-bottom: 2px">Type</label>
                                            <div class="row">
                                                <div class="form-check form-check-primary form-check-inline col-md-4">
                                                    <input class="form-check-input" type="radio" name="type"
                                                        id="monthly_option" value="MONTH" checked>
                                                    <label class="form-check-label" for="monthly_option">
                                                        Monthly
                                                    </label>
                                                </div>
                                                <div class="form-check form-check-primary form-check-inline col-md-4">
                                                    <input class="form-check-input" type="radio" name="type"
                                                        id="annual_option" value="YEAR">
                                                    <label class="form-check-label" for="annual_option">
                                                        Annual
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-3">
                                        <div class="form-group">
                                            <label for="interval_count">Interval Count*</label>
                                            <input type="text" class="form-control" name="interval_count"
                                                id="interval_count" inputmode="numeric" pattern="[0-9]*"
                                                oninput="this.value = this.value.replace(/[^0-9.]/g, '').replace(/^0+(\d)/, '$1');">
                                        </div>
                                    </div>
                                </div>
                                <div class="d-flex flex-row-reverse">
                                    <div>
                                        <a href="" class="btn btn-outline-secondary">Cancel</a>
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
<script src="{{ asset('vendors/autonumeric/autoNumeric.js') }}" type=text/javascript></script>
<script>
$(document).ready(function() {
    // $('#price').autoNumeric('init');
});

function save() {
    const title = $('#title').val();
    const price = $('#price').val();

    if (title === '' || price === '') {
        Swal.fire({
            icon: 'error',
            title: 'The required fields should not be empty.',
            width: '420px',
            customClass: {
                icon: 'swal-alert-icon',
                title: 'swal-alert-title'
            }
        })
        return;
    }

    $('#create_form').submit();
}
</script>
@endsection