@extends('layouts.main')
@section('title', 'List Categories')

@section('page-css')
<link href="{{ asset('src/plugins/src/table/datatable/datatables.css') }}" rel="stylesheet" type="text/css" />
<link rel="stylesheet" type="text/css" href="{{ asset('src/plugins/css/dark/table/datatable/dt-global_style.css') }}">
<link href="{{ asset('src/assets/css/dark/apps/list.css') }}" rel="stylesheet" type="text/css" />
<link href="{{ asset('src/assets/css/dark/components/modal.css') }}" rel="stylesheet" type="text/css">
<style>
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

.imagePreview {
    width: 100%;
    height: 300px;
    background-position: center center;
    background-color: #1b2e4b;
    background-size: cover;
    background-repeat: no-repeat;
    display: inline-block;
    box-shadow: 0px -3px 6px 2px rgba(0, 0, 0, 0.2);
    border-radius: 6px;
}

.upload-label {
    display: block;
    box-shadow: 0px 4px 6px 2px rgba(0, 0, 0, 0.2);
    margin-top: -6px;
    border-radius: 0px !important;
    width: 100%;
}

.uploadFile {
    width: 0px;
    height: 0px;
    overflow: hidden;
}

.imagePreview-info {
    width: 100%;
    height: 160px;
    background-position: center center;
    background-color: #1b2e4b;
    background-size: cover;
    background-repeat: no-repeat;
    display: inline-block;
    box-shadow: 0px -3px 6px 2px rgba(0, 0, 0, 0.2);
    border-radius: 6px;
}

.uploadFile-info {
    width: 0px;
    height: 0px;
    overflow: hidden;
}

.two-lines {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
}

@media (max-width: 767px) {
    .mobile-hide {
        display: none;
    }

    #cancel-row {
        padding-left: 0 !important;
        padding-right: 0 !important;
    }
}
</style>
@endsection

@section('content')
<div class="row ps-5 pe-5" id="cancel-row">
    <div class="col-xl-12 col-lg-12 col-sm-12 layout-top-spacing layout-spacing">
        @include('layouts.alerts')
        <h5 class="pt-2 pb-2">Reading</h5>
        <div class="widget-content widget-content-area br-8">
            <table id="deck-category-list" class="table dt-table-hover" style="width:100%">
                <thead>
                    <tr>
                        <th class="checkbox-column"> No. </th>
                        <th>Image</th>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($readings as $reading)
                    <tr>
                        <td class="checkbox-column">{{ $loop->index + 1 }}</td>
                        <td>
                            <img src="{{ asset('storage/reading/'. $reading->img) }}" class="rounded"
                                alt="deck category picture" style="object-fit: contain; width: 50px; height: 80px">
                        </td>
                        <td>
                            <span class="inv-number">{{ $reading->title }}</span>
                        </td>
                        <td>
                            <p class="align-self-center mb-0 user-name"
                                style="white-space:normal; word-wrap:break-word; width: 300px;">
                                {{ strlen(html_entity_decode(strip_tags($reading->description), ENT_QUOTES | ENT_HTML5, 'UTF-8')) > 140 ? substr(html_entity_decode(strip_tags($reading->description), ENT_QUOTES | ENT_HTML5, 'UTF-8'), 0, 140)."..." : html_entity_decode(strip_tags($reading->description), ENT_QUOTES | ENT_HTML5, 'UTF-8') }}
                            </p>
                        </td>
                        <td>
                            <a class="badge badge-light-primary text-start me-2 action-edit"
                                href="javascript:openEditModal({{ $reading }} )">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                    fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                    stroke-linejoin="round" class="feather feather-edit-3">
                                    <path d="M12 20h9"></path>
                                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                                </svg>
                            </a>
                            <a class="badge badge-light-danger text-start action-delete"
                                href="javascript:openDeleteAlert({{ $reading->id }});">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                    fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                    stroke-linejoin="round" class="feather feather-trash">
                                    <polyline points="3 6 5 6 21 6"></polyline>
                                    <path
                                        d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2">
                                    </path>
                                </svg>
                            </a>
                        </td>
                    </tr>
                    @endforeach
                </tbody>
            </table>
        </div>
    </div>
</div>
<div class="modal fade" id="category_modal" tabindex="-1" role="dialog" aria-labelledby="addCategoryModalTitle"
    aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-xl" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title add-title" id="add_category_title">Add Reading</h5>
                <h5 class="modal-title edit-title" id="edit_category_title">Edit Reading</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close">
                    <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                        viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                        stroke-linejoin="round" class="feather feather-x">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </div>

            <div class="modal-body">
                <div class="add-contact-box">
                    <div class="add-contact-content">
                        <form id="category_form" method="POST" enctype="multipart/form-data">
                            @csrf
                            <input type="hidden" name="category_id" id="category_id">
                            <div class="row">
                                <div class="col-md-4 row justify-center items-center">
                                    <label style="margin-bottom: 4px; color: white">Image*</label>
                                    <div class="invoice-logo imgUp">
                                        <div class="imagePreview preview"></div>
                                        <label class="btn btn-primary upload-label">
                                            Upload Image<input type="file" class="uploadFile img" name="info_img">
                                        </label>
                                    </div>
                                </div>
                                <div class="col-md-8">
                                    <div class="contact-name">
                                        <label style="margin-bottom: 4px; color: white">Title*</label>
                                        <input type="text" id="info_title" class="form-control form-control-sm"
                                            name="info_title">
                                    </div>
                                    <div class="contact-name mt-3">
                                        <label style="margin-bottom: 4px; color: white">Description*</label>
                                        <textarea class="form-control" id="info_description" name="info_description"
                                            placeholder="Write the description here..."
                                            style="height: 120px;"></textarea>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-outline-secondary" data-bs-dismiss="modal"> <i class="flaticon-delete-1"></i>
                    Discard</button>
                <button id="btn_edit" class="float-left btn btn-success" onclick="submitCategory()">Save</button>
                <button id="btn_add" class="btn btn-primary" onclick="submitCategory()">Add</button>
            </div>
        </div>
    </div>
</div>
@endsection

@section('page-js')
<script src="{{ asset('src/plugins/src/table/datatable/datatables.js') }}"></script>
<script src="{{ asset('src/plugins/src/table/datatable/button-ext/dataTables.buttons.min.js') }}"></script>
<script src="https://cdn.tiny.cloud/1/1okcindws6nfj21mgjbkioz8h4pk8dywvqhvquwztzmoy1ci/tinymce/8/tinymce.min.js"
    referrerpolicy="origin" crossorigin="anonymous"></script>

<script>
$(document).ready(function() {
    // Initialize TinyMCE editor
    tinymce.init({
        selector: 'textarea',
        plugins: [
            // Core editing features
            'anchor', 'autolink', 'charmap', 'codesample', 'emoticons', 'link', 'lists', 'media',
            'searchreplace', 'table', 'visualblocks', 'wordcount',
            // Your account includes a free trial of TinyMCE premium features
            // Try the most popular premium features until Oct 6, 2025:
            // 'checklist', 'mediaembed', 'casechange', 'formatpainter', 'pageembed', 'a11ychecker',
            // 'tinymcespellchecker', 'permanentpen', 'powerpaste', 'advtable', 'advcode',
            // 'advtemplate', 'ai',
            // 'uploadcare', 'mentions', 'tinycomments', 'tableofcontents', 'footnotes', 'mergetags',
            // 'autocorrect', 'typography', 'inlinecss', 'markdown', 'importword', 'exportword',
            // 'exportpdf'
        ],
        toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography uploadcare | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
        tinycomments_mode: 'embedded',
        tinycomments_author: 'Author name',
        mergetags_list: [{
                value: 'First.Name',
                title: 'First Name'
            },
            {
                value: 'Email',
                title: 'Email'
            },
        ],
        ai_request: (request, respondWith) => respondWith.string(() => Promise.reject(
            'See docs to implement AI Assistant')),
        uploadcare_public_key: '1114b17e8b338420f727',
    });

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

    $('.uploadFile-info').change(function() {
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
                uploadFile.closest(".imgUp-info").find('.imagePreview-info').css("background-image",
                    "url(" + this.result + ")");
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

var invoiceList = $('#deck-category-list').DataTable({
    "dom": "<'inv-list-top-section'<'row'<'col-sm-12 col-md-6 d-flex justify-content-md-start justify-content-center'l<'dt-action-buttons align-self-center'B>><'col-sm-12 col-md-6 d-flex justify-content-md-end justify-content-center mt-md-0 mt-3'f<'toolbar align-self-center'>>>>" +
        "<'table-responsive'tr>" +
        "<'inv-list-bottom-section d-sm-flex justify-content-sm-between text-center'<'inv-list-pages-count  mb-sm-0 mb-3'i><'inv-list-pagination'p>>",

    columnDefs: [{
        targets: 0,
        width: "30px",
        className: "",
        orderable: !1,
    }],
    buttons: [{
        text: 'Add New',
        className: 'btn btn-primary',
        action: function(e, dt, node, config) {
            openAddModal();
        }
    }],
    "order": [
        [1, "asc"]
    ],
    "oLanguage": {
        "oPaginate": {
            "sPrevious": '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-arrow-left"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>',
            "sNext": '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-arrow-right"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>'
        },
        "sInfo": "Showing page _PAGE_ of _PAGES_",
        "sSearch": '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-search"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>',
        "sSearchPlaceholder": "Search...",
        "sLengthMenu": "Results :  _MENU_",
    },
    "stripeClasses": [],
    "lengthMenu": [5, 7, 10, 15],
    "pageLength": 5
});

function openAddModal() {
    $('#category_modal #add_category_title').show();
    $('#category_modal #edit_category_title').hide();

    $('#category_modal #btn_add').show();
    $('#category_modal #btn_edit').hide();

    $('#category_form').attr('action', "{{ route('add-reading') }}")
    $('#category_form #category_id').val('')
    $('#category_form #info_title').val('')
    $('#category_form #info_description').val('')
    $('.preview').css('background-image', 'none')
    $('input[type=file]').val('')

    $('#category_modal').modal('show');
}

function openEditModal(reading) {
    console.log('AAA=', reading.description);
    $('#category_modal #add_category_title').hide();
    $('#category_modal #edit_category_title').show();

    $('#category_modal #btn_add').hide();
    $('#category_modal #btn_edit').show();

    $('#category_form').attr('action', "{{ route('update-reading') }}")
    $('#category_form #category_id').val(reading.id)
    $('#category_form #info_title').val(reading.title)
    tinymce.get('info_description').setContent(reading.description);
    $('input[type=file]').val('')

    if (reading.img)
        $('.imagePreview').css('background-image', "url({{ asset('storage/reading/') }}/" + reading.img + ")")

    $('#category_modal').modal('show');
}

function submitCategory() {
    const infoTitle = $('#info_title').val();
    const infoDescription = tinymce.get('info_description').getContent();
    const isInfoImg = $('input[name=info_img]')[0].files.length !== 0;
    const categoryId = $('#category_id').val();

    if (!infoDescription || !infoTitle || (!categoryId && !isInfoImg)) {
        Swal.fire({
            icon: 'error',
            title: 'The required field should not be empty.',
            width: '420px',
            customClass: {
                icon: 'swal-alert-icon',
                title: 'swal-alert-title'
            }
        })
        return;
    }

    $('#category_form').submit();
}

function openDeleteAlert(id) {
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
        if (result.isConfirmed) {
            var form = document.createElement("form");
            var input_id = document.createElement("input");
            var input_token = document.createElement("input");

            form.method = "POST";
            form.action = "{{ route('delete-reading') }}";

            input_id.value = id;
            input_id.name = "category_id";
            form.appendChild(input_id);

            input_token.value = "{{ csrf_token() }}";
            input_token.name = "_token";
            form.appendChild(input_token);

            document.body.appendChild(form);

            form.submit();
        }
    })
}
</script>
@endsection