@extends('layouts.main')
@section('title', 'Create Deck')

@section('page-css')
<link href="{{ asset('src/assets/css/dark/apps/add.css') }}" rel="stylesheet" type="text/css" />
<style>
@media (max-width: 767px) {
    .mobile-hide {
        display: none;
    }

    .select2-container {
        width: 100% !important;
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

.select2-container--default .select2-selection--multiple {
    box-shadow: none;
    border-color: #1b2e4b !important;
    color: #22c7d5;
    background-color: #1b2e4b;
    padding: 7px 16px;
    font-size: 13px;
    border-radius: 6px;
}

/* Options inside dropdown */
.select2-container--default .select2-results__option {
    padding: 5px 12px;
    color: #009688;
    background-color: #1b2e4b;
}

/* Hover/selected option */
.select2-container--default .select2-results__option--highlighted {
    background-color: #1e90ff;
    color: #fff;
}

.select2-container .select2-results__options {
    max-height: 200px;
    overflow-y: auto;
}

.select2-container--default .select2-selection--multiple .select2-selection__choice {
    color: #ffffff;
    background-color: #1e90ff;
    border: 1px solid #104e8b;
}

.select2-container--default .select2-selection__choice__remove {
    color: red !important;
    /* text color of the × */
    font-weight: bold;
    /* make it bold if you want */
}
</style>
@endsection

@section('content')
<div class="row invoice layout-top-spacing layout-spacing">
    <div class="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
        @include('layouts.alerts')
        <div class="doc-container">
            <h5 class="pt-2 pb-2">New Deck Card</h5>
            <form action="{{ route('create-card') }}" method="post" enctype="multipart/form-data" id="create_form">
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
                                            Upload<input type="file" class="uploadFile img" name="card_img">
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
                                    <div class="col-md-2">
                                        <div class="form-group">
                                            <label for="number" style="margin-bottom: 2px">Number*</label>
                                            <input class="form-control form-control-sm" name="number" id="number">
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
                                    <div class="col-md-4">
                                        <div class="form-group">
                                            <label for="category" style="margin-bottom: 2px">Category*</label>
                                            <select name="category" class="form-select form-control-sm" id="category">
                                                <option value="" selected hidden>Choose Category</option>
                                                @foreach($decks as $deck)
                                                <option value="{{ $deck->id }}">{{ $deck->cname }}</option>
                                                @endforeach
                                            </select>
                                        </div>
                                    </div>
                                    <div class="col-md-4">
                                        <div class="form-group">
                                            <label for="emotion" style="margin-bottom: 2px">Emotion</label>
                                            <select class="emotion-select2 form-select form-control-sm"
                                                name="emotions[]" multiple="multiple" id="emotion">
                                                @foreach($emotions as $emotion)
                                                <option value="{{ $emotion->id }}">{{ $emotion->name }}</option>
                                                @endforeach
                                            </select>
                                        </div>
                                    </div>
                                    <div class="col-md-4">
                                        <div class="form-group">
                                            <label for="guidance" style="margin-bottom: 2px">Guidance</label>
                                            <select class="guidance-select2 form-select form-control-sm"
                                                name="guidances[]" multiple="multiple" id="guidance">
                                                @foreach($guidances as $guidance)
                                                <option value="{{ $guidance->id }}">{{ $guidance->name }}</option>
                                                @endforeach
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div class="row mb-3">
                                    <div class="form-group">
                                        <label style="margin-bottom: 2px">Status</label>
                                    </div>
                                    <div class="col-md-5">
                                        <div class="form-check form-check-primary form-check-inline">
                                            <input class="form-check-input" type="radio" name="status"
                                                id="publish_option" value="published">
                                            <label class="form-check-label" for="publish_option">
                                                Publish
                                            </label>
                                        </div>
                                        <div class="form-check form-check-primary form-check-inline">
                                            <input class="form-check-input" type="radio" name="status" id="draft_option"
                                                value="draft" checked>
                                            <label class="form-check-label" for="draft_option">
                                                Save as Draft
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div class="d-flex flex-row-reverse">
                                    <div>
                                        <a href="{{ route('list-card') }}" class="btn btn-outline-secondary">Cancel</a>
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
    // Select2 initialization.
    $('.emotion-select2').select2();
    $('.guidance-select2').select2();
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
    const category = $('#category').val();
    const description = $('#description').val();
    const emotion = $('#emotion').val();
    const guidance = $('#guidance').val();

    if (title === '' || category === '' || description === '') {
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