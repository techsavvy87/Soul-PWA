@extends('layouts.main')
@section('title', 'Create Deck')

@section('page-css')
<link href="{{ asset('src/assets/css/dark/apps/add.css') }}" rel="stylesheet" type="text/css" />
<style>
@media (max-width: 767px) {
    .mobile-hide {
        display: none;
    }
}

.imagePreview {
    width: 100%;
    height: 338px;
    background-position: center center;
    background-color: #1b2e4b;
    background-size: cover;
    background-repeat: no-repeat;
    display: inline-block;
    box-shadow: 0px -3px 6px 2px rgba(0, 0, 0, 0.2);
    border-radius: 6px;
}

.imgUp {
    margin-left: 3.2rem;
    margin-right: 3.2rem;
}

.upload-label {
    display: block;
    box-shadow: 0px 4px 6px 2px rgba(0, 0, 0, 0.2);
    margin-top: -6px;
    border-radius: 0px !important;
}

.uploadFile {
    width: 0px;
    height: 0px;
    overflow: hidden;
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
            <h5 class="pt-2 pb-2">New Store Item</h5>
            <form action="{{ route('create-store') }}" method="post" enctype="multipart/form-data" id="create_form">
                @csrf
                <div class="row">
                    <div class="col-xl-3">
                        <div class="invoice-actions">
                            <div class="invoice-action-currency">
                                <div class="form-group mb-0">
                                    <label>Cover Image</label>
                                    <div class="invoice-logo imgUp">
                                        <div class="imagePreview"></div>
                                        <label class="btn btn-primary upload-label">
                                            Upload<input type="file" class="uploadFile img" name="store_img">
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-xl-9">
                        <div class="invoice-content">
                            <div class="invoice-detail-body">
                                <div class="row mb-4">
                                    <div class="col-md-4">
                                        <div class="form-group">
                                            <label for="title" style="margin-bottom: 2px">Title*</label>
                                            <input type="text" class="form-control form-control-sm" name="title"
                                                id="title">
                                        </div>
                                    </div>
                                </div>
                                <div class="row mb-4">
                                    <div class="col-md-12">
                                        <div class="form-group">
                                            <label for="description" style="margin-bottom: 2px">Description</label>
                                            <textarea class="form-control" id="description" name="description"
                                                placeholder="Write the description here..."
                                                style="height: 120px;"></textarea>
                                        </div>
                                    </div>
                                </div>
                                <div class="row mb-4">
                                    <div class="col-md-3">
                                        <div class="form-group">
                                            <label for="price" style="margin-bottom: 2px">Price*</label>
                                            <input type="number" class="form-control form-control-sm" name="price"
                                                id="price" step="1" min="0">
                                        </div>
                                    </div>
                                </div>
                                <div class="row mb-3">
                                    <div class="form-group">
                                        <label style="margin-bottom: 2px">Type</label>
                                    </div>
                                    <div class="col-md-5">
                                        <div class="form-check form-check-primary form-check-inline">
                                            <input class="form-check-input" type="radio" name="type" id="product_option"
                                                value="product" checked>
                                            <label class="form-check-label" for="product_option">
                                                Product
                                            </label>
                                        </div>
                                        <div class="form-check form-check-primary form-check-inline">
                                            <input class="form-check-input" type="radio" name="type" id="service_option"
                                                value="service">
                                            <label class="form-check-label" for="service_option">
                                                Service
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div class="d-flex flex-row-reverse">
                                    <div>
                                        <a href="{{ route('list-store') }}" class="btn btn-outline-secondary">Cancel</a>
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
$(document).ready(function() {
    $('.uploadFile').change(function() {
        var maxSizeInBytes = 1024 * 1024 * 2; //2M

        var uploadFile = $(this);
        var files = !!this.files ? this.files : [];
        if (!files.length || !window.FileReader) return;

        if (this.files[0].size > maxSizeInBytes) {
            Swal.fire({
                icon: 'error',
                title: 'The size of image should be smaller than 2M.',
                width: '420px',
                customClass: {
                    icon: 'swal-alert-icon',
                    title: 'swal-alert-title'
                }
            })
            return;
        }
        if (/^image/.test(files[0].type)) {
            var reader = new FileReader();
            reader.readAsDataURL(files[0]);

            reader.onloadend = function() {
                uploadFile.closest(".imgUp").find('.imagePreview').css("background-image", "url(" +
                    this.result + ")");
            }
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Uploaded file must be image.',
                width: '420px',
                customClass: {
                    icon: 'swal-alert-icon',
                    title: 'swal-alert-title'
                }
            })
            return;
        }
    });
})

function save() {
    const image = $('.uploadFile')[0].files[0];
    const title = $('#title').val();
    const description = $('#description').val();
    let price = $('#price').val();
    const type = $('input[name="type"]:checked').val();

    if (type === 'service') {
        price = 100;
        $('#price').val(price);
    }
    if (!image || title === '' || description === '' || price === '' || !type) {
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