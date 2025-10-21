@extends('layouts.main')
@section('title', 'About Setting')

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
    height: 140px;
    background-position: center center;
    background-color: #1b2e4b;
    background-size: cover;
    background-repeat: no-repeat;
    display: inline-block;
    box-shadow: 0px -3px 6px 2px rgba(0, 0, 0, 0.2);
    border-radius: 6px;
}

.imgUp {
    margin-left: 1.5rem;
    margin-right: 1.5rem;
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

.invoice-actions {
    padding: 12px 0px !important;
}
</style>
@endsection

@section('content')
<div class="row invoice layout-top-spacing layout-spacing">
    <div class="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
        <div class="doc-container">
            <h5 class="pt-2 pb-2">About Detail</h5>
            @include('layouts.alerts')
            <form action="{{ route('save-about') }}" method="post" enctype="multipart/form-data" id="save_form">
                @csrf
                <div class="row">
                    <div class="col-xl-3">
                        <div class="invoice-actions">
                            <div class="invoice-action-currency">
                                <div class="form-group mb-0">
                                    <label>Cover Image</label>
                                    <div class="invoice-logo imgUp">
                                        <div class="imagePreview" @if (!empty($aboutInfo['cover_img']))
                                            style="background-image:url({{asset('storage/about/' . $aboutInfo['cover_img'])}})"
                                            @endif></div>
                                        <label class="btn btn-primary upload-label">
                                            Upload Image<input type="file" class="uploadFile img" name="cover_img">
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
                                    <div class="col-md-6">
                                        <div class="form-group">
                                            <label for="title" style="margin-bottom: 2px">Title*</label>
                                            <input type="text" class="form-control form-control-sm" name="title"
                                                id="title" value="{{ $aboutInfo['title'] }}">
                                        </div>
                                    </div>
                                </div>
                                <div class="row mb-4">
                                    <div class="col-md-12">
                                        <div class="form-group">
                                            <label for="description" style="margin-bottom: 2px">Description*</label>
                                            <textarea class="form-control" id="description" name="description"
                                                placeholder="Write the description here..." style="height: 180px;"
                                                value="{{ $aboutInfo['description'] }}">{{ $aboutInfo['description'] }}</textarea>
                                        </div>
                                    </div>
                                </div>
                                <div class="d-flex flex-row-reverse">
                                    <div>
                                        <a href="{{ route('fetch-about') }}"
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
<script src="https://cdn.tiny.cloud/1/1okcindws6nfj21mgjbkioz8h4pk8dywvqhvquwztzmoy1ci/tinymce/8/tinymce.min.js"
    referrerpolicy="origin" crossorigin="anonymous">
</script>
<script>
tinymce.init({
    selector: 'textarea',
    plugins: [
        'anchor', 'autolink', 'charmap', 'codesample', 'emoticons', 'link', 'lists', 'media',
        'searchreplace', 'table', 'visualblocks', 'wordcount',
    ],
    toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography uploadcare | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat',
    uploadcare_public_key: '1114b17e8b338420f727',
});
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
    const title = $('#title').val();
    const description = tinymce.get('description').getContent();

    if (!title || !description) {
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

    $('#save_form').submit();
}
</script>
@endsection