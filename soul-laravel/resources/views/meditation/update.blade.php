@extends('layouts.main')
@section('title', 'Update meditation')

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
    height: 180px;
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
            <h5 class="pt-2 pb-2">Edit Meditation</h5>
            <form action="{{ route('update-meditation') }}" method="post" enctype="multipart/form-data"
                id="update_form">
                @csrf
                <input type="hidden" name="id" value="{{ $meditation->id }}">
                <div class="row">
                    <div class="col-xl-3">
                        <div class="invoice-actions">
                            <div class="invoice-action-currency">
                                <div class="form-group mb-0">
                                    <label>Cover Image</label>
                                    <div class="invoice-logo imgUp">
                                        <div class="imagePreview" @if (!empty($meditation->cover_img))
                                            style="background-image:url({{asset('storage/meditations/' . $meditation->cover_img)}})"
                                            @endif></div>
                                        <label class="btn btn-primary upload-label">
                                            Upload<input type="file" class="uploadFile img" name="cover_img">
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
                                                id="title" value="{{ $meditation->title }}">
                                        </div>
                                    </div>
                                </div>
                                <div class="row mb-4">
                                    <div class="col-md-12">
                                        <div class="form-group">
                                            <label for="description" style="margin-bottom: 2px">Description</label>
                                            <textarea class="form-control" id="description" name="description"
                                                placeholder="Write the description here..." style="height: 120px;"
                                                value="{{ $meditation->description }}">{{ $meditation->description }}</textarea>
                                        </div>
                                    </div>
                                </div>
                                <div class="row mb-4">
                                    <div class="col-md-3">
                                        <div class="form-group">
                                            <label for="type" style="margin-bottom: 2px">Type*</label>
                                            <select name="type" class="form-select form-control-sm" id="type"
                                                value="{{ $meditation->type }}">
                                                <option value="" selected hidden>Choose Type</option>
                                                <option value="Audio" @if ($meditation->type === "Audio") selected
                                                    @endif>Audio</option>
                                                <option value="Video" @if ($meditation->type === "Video") selected
                                                    @endif>Video</option>
                                                <option value="Text" @if ($meditation->type === "Text") selected
                                                    @endif>Text</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="col-md-9" id="type_box" @if ($meditation->type === "Text")
                                        style="display: none;" @endif>
                                        <div class="form-group">
                                            <label for="media_src" style="margin-bottom: 2px">Media Source</label>
                                            <div style="display: flex; align-items: center; gap: 10px">
                                                <span
                                                    id="media_original_file">{{ $meditation->media_original_name }}</span>
                                                <input class="form-control form-control-sm" type="file" id="media_src"
                                                    name="media_src" style="max-width: 240px">
                                            </div>
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
                                                id="publish_option" value="published" @if ($meditation->status ===
                                            'published') checked @endif>
                                            <label class="form-check-label" for="publish_option">
                                                Publish
                                            </label>
                                        </div>
                                        <div class="form-check form-check-primary form-check-inline">
                                            <input class="form-check-input" type="radio" name="status" id="draft_option"
                                                value="draft" @if ($meditation->status === 'draft') checked @endif>
                                            <label class="form-check-label" for="draft_option">
                                                Save as Draft
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div class="d-flex flex-row-reverse">
                                    <div>
                                        <a href="{{ route('list-meditation') }}"
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
var meditationType = "{{ $meditation->type }}";
let mediaType = meditationType.toLowerCase();

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

    $('#media_src').change(function() {
        var uploadMedia = $(this);
        var files = !!this.files ? this.files : [];
        if (!files.length || !window.FileReader) {
            $('#media_original_file').css('display', 'block');
            mediaType = reflectionType.toLowerCase();
            return;
        }

        mediaType = files[0].type;
        $('#media_original_file').css('display', 'none');
    });

    $('#type').change(function() {
        var type = $(this).val();
        if (type === 'Text')
            $('#type_box').css('display', 'none');
        else
            $('#type_box').css('display', 'block');
    })
})

function save() {
    const title = $('#title').val();
    const type = 'Audio';

    if (title === '' || type === '') {
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

    if ((/^audio/.test(mediaType) && type === 'Audio') || (/^video/.test(mediaType) && type === 'Video') || type ===
        'Text') {
        Swal.fire({
            icon: 'warning',
            title: "Please don't close the browser while updating the meditation.",
            width: '420px',
            customClass: {
                icon: 'swal-alert-icon',
                title: 'swal-alert-title'
            }
        });
        $('#update_form').submit();
    } else
        Swal.fire({
            icon: 'error',
            title: 'Media file should be matched with its type.',
            width: '420px',
            customClass: {
                icon: 'swal-alert-icon',
                title: 'swal-alert-title'
            }
        })
}
</script>
@endsection