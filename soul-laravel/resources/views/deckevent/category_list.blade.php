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

@media (max-width: 767px) {
    .mobile-hide {
        display: none;
    }
}
</style>
@endsection

@section('content')
<div class="row ps-5 pe-5" id="cancel-row">
    <div class="col-xl-12 col-lg-12 col-sm-12 layout-top-spacing layout-spacing">
        @include('layouts.alerts')
        <h5 class="pt-2 pb-2">Event</h5>
        <div class="widget-content widget-content-area br-8">
            <table id="deck-category-list" class="table dt-table-hover" style="width:100%">
                <thead>
                    <tr>
                        <th class="checkbox-column"> No. </th>
                        <th>Image</th>
                        <th>Name</th>
                        <th>Level</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($events as $event)
                    <tr>
                        <td class="checkbox-column">{{ $loop->index + 1 }}</td>
                        <td>
                            <img src="{{ asset('storage/events/'. $event->img_url) }}" class="rounded"
                                alt="deck category picture" style="object-fit: contain; width: 80px; height: 60px">
                        </td>
                        <td>
                            <span class="inv-number">{{ $event->name }}</span>
                        </td>
                        <td>
                            @if ($event->level === 'Paid')
                            <span class="badge badge-light-success inv-status">{{ $event->level }}</span>
                            @else
                            <span class="badge badge-light-warning inv-status">{{ $event->level }}</span>
                            @endif
                        </td>
                        <td>

                            <a class="badge badge-light-primary text-start me-2 action-edit"
                                href="javascript:openEditModal({{ $event }} )">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                    fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                    stroke-linejoin="round" class="feather feather-edit-3">
                                    <path d="M12 20h9"></path>
                                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                                </svg>
                            </a>

                            <a class="badge badge-light-danger text-start action-delete"
                                href="javascript:openDeleteAlert({{ $event->id }});">
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
                <h5 class="modal-title add-title" id="add_category_title">Add Event</h5>
                <h5 class="modal-title edit-title" id="edit_category_title">Edit Event</h5>
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
                                <div class="col-md-8 row justify-center items-center">
                                    <div class="contact-name">
                                        <label style="margin-bottom: 4px; color: white">Name*</label>
                                        <input type="text" id="category_name" class="form-control form-control-sm"
                                            name="category_name">
                                    </div>

                                    <div class="row">
                                        <div class="contact-name mt-3 col-md-6 mb-3">
                                            <label style="margin-bottom: 4px; color: white">Level*</label>
                                            <select name="category_level" class="form-select form-control-sm"
                                                id="category_level">
                                                <option value="" selected hidden>Choose Level</option>
                                                <option value="Free">Free</option>
                                                <option value="Paid">Paid</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="contact-name mt-3 col-md-6">
                                            <label style="margin-bottom: 4px; color: white">Free User*</label>
                                            <select name="free_deck_type" class="form-select form-control-sm  mb-2"
                                                id="free_deck_type">
                                                <option value="" selected hidden>Choose Deck</option>
                                                @foreach($decks as $deck)
                                                <option value="{{ $deck->id }}">{{ $deck->cname }}</option>
                                                @endforeach
                                            </select>
                                            <!-- Container to show the selected options as a list -->
                                            <ul id="free-selected-list" style="padding: 0;"></ul>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="contact-name mt-3 col-md-6 mb-3">
                                            <label style="margin-bottom: 4px; color: white">Paid User*</label>
                                            <p>Combinded:</p>
                                            <select name="paid_combined_deck_type"
                                                class="form-select form-control-sm  mb-2" id="paid_combined_deck_type">
                                                <option value="" selected hidden>Choose Deck</option>
                                                @foreach($decks as $deck)
                                                <option value="{{ $deck->id }}">{{ $deck->cname }}</option>
                                                @endforeach
                                            </select>
                                            <!-- Container to show the selected options as a list -->
                                            <div id="paid-combined-selected-list" style="padding: 0;">

                                            </div>
                                            <input type="text" name="combined_card_count" id="combined_card_count"
                                                class="form-control form-control-sm w-auto me-2"
                                                placeholder="Enter card count"
                                                oninput="this.value = this.value.replace(/[^0-9.]/g, '').replace(/^0+(\d)/, '$1');">
                                            <hr>
                                            <div class="d-flex align-items-center">

                                                <p style="width: 70%; margin: 0px;">Additional cards count:</p>

                                                <input type="text" name="additional_card_count"
                                                    id="additional_card_count" class="form-control form-control-sm"
                                                    oninput="this.value = this.value.replace(/[^0-9.]/g, '').replace(/^0+(\d)/, '$1');"
                                                    style="width: 20%">

                                            </div>
                                            <div>
                                                <p>Scrollable Item:</p>
                                                <div class="form-check form-check-inline">
                                                    <input class="form-check-input" type="radio" name="scrol-sort"
                                                        id="emotion" value="emotion">
                                                    <label class="form-check-label" for="emotion">Emotion</label>
                                                </div>
                                                <div class="form-check form-check-inline">
                                                    <input class="form-check-input" type="radio" name="scrol-sort"
                                                        id="guidance" value="guidance">
                                                    <label class="form-check-label" for="guidance">Guidance</label>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="contact-name mt-3 col-md-6 mb-3">
                                            <label style="margin-bottom: 4px; color: white">Paid User*</label>
                                            <p>Individual:</p>
                                            <select name="paid_individual_deck_type"
                                                class="form-select form-control-sm  mb-2"
                                                id="paid_individual_deck_type">
                                                <option value="" selected hidden>Choose Deck</option>
                                                @foreach($decks as $deck)
                                                <option value="{{ $deck->id }}">{{ $deck->cname }}</option>
                                                @endforeach
                                            </select>
                                            <!-- Container to show the selected options as a list -->
                                            <div id="paid-individual-selected-list" style="padding: 0;">

                                            </div>
                                        </div>
                                        <!-- Data sent by POST as hidden tags -->
                                        <input type="hidden" name="paid_combined_deck_id" id="paid_combined_deck_id">
                                        <input type="hidden" name="paid_individual_deck_id"
                                            id="paid_individual_deck_id">
                                        <input type="hidden" name="free_deck_id" id="free_deck_id">
                                        <input type="hidden" name="paid_combined_cards_cnt"
                                            id="paid_combined_cards_cnt">
                                        <input type="hidden" name="additional_cards_cnt" id="additional_cards_cnt">
                                        <input type="hidden" name="scroll_sort" id="scroll_sort">
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

    $('#category_form').attr('action', "{{ route('create-event-category') }}");
    $('#category_form #category_id').val('');
    $('#category_form #category_name').val('');
    $('#category_form #category_level option:eq(0)').prop('selected', true);
    $('#category_form #free_deck_type option:eq(0)').prop('selected', true);
    $('#category_form #paid_combined_deck_type option:eq(0)').prop('selected', true);
    $('#category_form #paid_individual_deck_type option:eq(0)').prop('selected', true);
    $('.preview').css('background-image', 'none');
    $('input[type=file]').val('');

    // Clear all selected options.
    $('#free-selected-list').empty();
    $('#paid-combined-selected-list').empty();
    $('#paid-individual-selected-list').empty();
    $('#combined_card_count').val('');
    $('#additional_card_count').val('');
    $('input[name="scrol-sort"]').prop('checked', false);
    selectedFreeOptions = [];
    combinedSelectedPaidOptions = [];
    individualSelectedPaidOptions = [];


    $('#category_modal').modal('show');
}

function openEditModal(event) {

    // Clear all selected options.
    $('#free-selected-list').empty();
    $('#paid-combined-selected-list').empty();
    $('#paid-individual-selected-list').empty();
    $('#combined_card_count').val('');
    $('#additional_card_count').val('');
    $('input[name="scrol-sort"]').prop('checked', false);


    $('#category_modal #add_category_title').hide();
    $('#category_modal #edit_category_title').show();

    $('#category_modal #btn_add').hide();
    $('#category_modal #btn_edit').show();

    $('#category_form').attr('action', "{{ route('update-event-category') }}")
    $('#category_form #category_id').val(event.id)
    $('#category_form #category_name').val(event.name);
    $(`#category_form #category_level option[value='${event.level}']`).prop('selected', true);
    $('input[type=file]').val('');

    // Select the radio button with that value
    const radioToSelect = document.querySelector(`input[name="scrol-sort"][value="${event.scroll_sort}"]`);
    if (radioToSelect) {
        radioToSelect.checked = true;
    }

    if (event.img_url)
        $('.imagePreview').css('background-image', "url({{ asset('storage/events/') }}/" + event
            .img_url + ")")

    // Deck for free user.
    selectedFreeOptions = event.free_decks_id;
    event.free_decks_id.forEach(function(option) {
        $('#free-selected-list').append(`
                <div class="mb-2 selected-item" data-id="${option.id}">
                    <div>
                        <span class="me-2">${option.text}</span>
                    </div>
                    <div class="d-flex align-items-center">
                        <input type="text" 
                            name="deck_input[${option.id}]" 
                            class="form-control form-control-sm w-auto me-2" 
                            placeholder="Enter card count" inputmode="numeric" pattern="[0-9]*"
                            value="${option.cnt || ''}"
                            oninput="this.value = this.value.replace(/[^0-9.]/g, '').replace(/^0+(\d)/, '$1');">
                        <button type="button" class="btn btn-sm btn-danger free-remove-item">✕</button>
                    </div>
                </div>
            `);
    });

    // Combined Deck for paid user.
    combinedSelectedPaidOptions = event.paid_com_decks_id;
    event.paid_com_decks_id.forEach(function(option) {
        $('#paid-combined-selected-list').append(`
                <div class="mb-2 selected-item" data-id="${option.id}">
                    <div class="d-flex align-items-center">
                        <span class="me-2">${option.text}</span>
                        <button type="button" class="btn btn-sm btn-danger combined-paid-remove-item" style="padding: 2px 8px;">✕</button>
                    </div>
                </div>
            `);
    });

    // Individual Deck for paid user.
    individualSelectedPaidOptions = event.paid_indi_decks_id;
    event.paid_indi_decks_id.forEach(function(option) {
        $('#paid-individual-selected-list').append(`
                <div class="mb-2 selected-item" data-id="${option.id}">
                    <div>
                        <span class="me-2">${option.text}</span>
                    </div>
                    <div class="d-flex align-items-center">
                        <input type="text" 
                            name="deck_input[${option.id}]" 
                            class="form-control form-control-sm w-auto me-2" 
                            placeholder="Enter card count"
                            value="${option.cnt || ''}"
                            oninput="this.value = this.value.replace(/[^0-9.]/g, '').replace(/^0+(\d)/, '$1');">
                        <button type="button" class="btn btn-sm btn-danger individual-paid-remove-item">✕</button>
                    </div>
                </div>
            `);
    });

    // Card Count.
    $('#combined_card_count').val(event.paid_com_cards_cnt);
    $('#additional_card_count').val(event.add_cards_cnt);

    $('#category_modal').modal('show');
}

function submitCategory() {
    const categoryName = $('#category_name').val();
    const categoryLevel = $('#category_level').val();
    const isInfoImg = $('input[name=info_img]')[0].files.length !== 0;
    const categoryId = $('#category_id').val();
    const combinedCardCount = $('#combined_card_count').val() || 0;
    const additionalCardCount = $('#additional_card_count').val() || 0;
    let scrollSort = $('input[name="scrol-sort"]:checked').val();

    //Extra Data
    $('#free_deck_id').val(JSON.stringify(selectedFreeOptions));
    $('#paid_combined_deck_id').val(JSON.stringify(combinedSelectedPaidOptions));
    $('#paid_individual_deck_id').val(JSON.stringify(individualSelectedPaidOptions));
    $('#additional_cards_cnt').val(additionalCardCount);
    $('#paid_combined_cards_cnt').val(combinedCardCount);
    $('#scroll_sort').val(scrollSort);

    let isFreeCardCntDefined = true;
    let isPaidIndiCardCntDefined = true;

    selectedFreeOptions.forEach(item => {
        if (!item.cnt) {
            isFreeCardCntDefined = false;
        }
    });

    individualSelectedPaidOptions.forEach(item => {
        if (!item.cnt) {
            isPaidIndiCardCntDefined = false;
        }
    });

    let errMsg = '';
    if (!categoryName) {
        errMsg = 'Category Name is required.';
    } else if (!categoryLevel) {
        errMsg = 'Category Level is required.';
    } else if (!isFreeCardCntDefined) {
        errMsg = 'Free User Deck card count is required.';
    } else if (combinedSelectedPaidOptions.length > 0 && combinedCardCount === 0) {
        errMsg = 'Combined card count is required.';
    } else if (individualSelectedPaidOptions.length > 0 && !isPaidIndiCardCntDefined) {
        errMsg = 'Individual paid deck card count is required.';
    }

    if (errMsg) {
        Swal.fire({
            icon: 'error',
            title: errMsg,
            width: '420px',
            customClass: {
                icon: 'swal-alert-icon',
                title: 'swal-alert-title'
            }
        });
        return; // stop further execution
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
            form.action = "{{ route('delete-event-category') }}";

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

// Show selected free options as a list
let selectedFreeOptions = [];

function showSelectedFreeOptions() {
    $('#free_deck_type option:selected').each(function() {
        selectedFreeOptions.push({
            id: $(this).val(),
            text: $(this).text(),
            cnt: ''
        });
    });

    $('#free-selected-list').empty();
    selectedFreeOptions.forEach(function(option) {
        $('#free-selected-list').append(`
                <div class="mb-2 selected-item" data-id="${option.id}">
                    <div>
                        <span class="me-2">${option.text}</span>
                    </div>
                    <div class="d-flex align-items-center">
                        <input type="text" 
                            name="deck_input[${option.id}]" 
                            class="form-control form-control-sm w-auto me-2" 
                            placeholder="Enter card count" inputmode="numeric" pattern="[0-9]*"
                            value="${option.cnt || ''}"
                            oninput="this.value = this.value.replace(/[^0-9.]/g, '').replace(/^0+(\d)/, '$1');">
                        <button type="button" class="btn btn-sm btn-danger free-remove-item">✕</button>
                    </div>
                </div>
            `);
    });
}

$(document).on('click', '.free-remove-item', function() {
    const itemDiv = $(this).closest('.selected-item');
    const deckId = itemDiv.data('id');

    // Unselect that option in the dropdown
    $(`#free_deck_type option[value="${deckId}"]`).prop('selected', false);
    console.log('DeckID=', deckId);

    selectedFreeOptions.splice(selectedFreeOptions.findIndex(option => Number(option.id) === deckId), 1);
    console.log('After remove:', selectedFreeOptions);
    // Remove the div
    itemDiv.remove();

});

$(document).on('input', '#free-selected-list input', function() {
    // Keep only digits
    let freeCnt = this.value.replace(/[^0-9]/g, '');
    let changedDeckId = $(this).closest('.selected-item').data('id');
    selectedFreeOptions.forEach(item => {
        if (Number(item.id) === changedDeckId) {
            item.cnt = freeCnt;
        }
    });
});
$('#category_form #free_deck_type').on('change', showSelectedFreeOptions);


// Show combined selected paid options as a list
let combinedSelectedPaidOptions = [];

function showCombinedSelectedPaidOptions() {

    $('#paid_combined_deck_type option:selected').each(function() {
        combinedSelectedPaidOptions.push({
            id: $(this).val(),
            text: $(this).text()
        });
    });

    console.log('Added Combined Selected Paid Options:', combinedSelectedPaidOptions);
    $('#paid-combined-selected-list').empty();
    combinedSelectedPaidOptions.forEach(function(option) {
        $('#paid-combined-selected-list').append(`
                <div class="mb-2 selected-item" data-id="${option.id}">
                    <div class="d-flex align-items-center">
                        <span class="me-2">${option.text}</span>
                        <button type="button" class="btn btn-sm btn-danger combined-paid-remove-item" style="padding: 2px 8px;">✕</button>
                    </div>
                </div>
            `);
    });
}

$(document).on('click', '.combined-paid-remove-item', function() {
    const itemDiv = $(this).closest('.selected-item');
    const deckId = itemDiv.data('id');

    // Unselect that option in the dropdown
    $(`#paid_combined_deck_type option[value="${deckId}"]`).prop('selected', false);
    combinedSelectedPaidOptions.splice(combinedSelectedPaidOptions.findIndex(option => Number(option.id) ===
        deckId), 1);

    console.log('After remove:', combinedSelectedPaidOptions);
    // Remove the div
    itemDiv.remove();
});


$('#category_form #paid_combined_deck_type').on('change', showCombinedSelectedPaidOptions);

// Show individual selected paid options as a list
let individualSelectedPaidOptions = [];

function showIndividualSelectedPaidOptions() {
    $('#paid_individual_deck_type option:selected').each(function() {
        individualSelectedPaidOptions.push({
            id: $(this).val(),
            text: $(this).text(),
            cnt: ''
        });
    });

    console.log('Individual Selected Paid Options:', individualSelectedPaidOptions);
    $('#paid-individual-selected-list').empty();
    individualSelectedPaidOptions.forEach(function(option) {
        $('#paid-individual-selected-list').append(`
                <div class="mb-2 selected-item" data-id="${option.id}">
                    <div>
                        <span class="me-2">${option.text}</span>
                    </div>
                    <div class="d-flex align-items-center">
                        <input type="text" 
                            name="deck_input[${option.id}]" 
                            class="form-control form-control-sm w-auto me-2" 
                            placeholder="Enter card count"
                            value="${option.cnt || ''}"
                            oninput="this.value = this.value.replace(/[^0-9.]/g, '').replace(/^0+(\d)/, '$1');">
                        <button type="button" class="btn btn-sm btn-danger individual-paid-remove-item">✕</button>
                    </div>
                </div>
            `);
    });
}

$(document).on('click', '.individual-paid-remove-item', function() {
    const itemDiv = $(this).closest('.selected-item');
    const deckId = itemDiv.data('id');

    // Unselect that option in the dropdown
    $(`#paid_individual_deck_type option[value="${deckId}"]`).prop('selected', false);
    individualSelectedPaidOptions.splice(individualSelectedPaidOptions.findIndex(option => Number(option.id) ===
        deckId), 1);
    console.log('After remove:', individualSelectedPaidOptions);
    // Remove the div
    itemDiv.remove();
});

$(document).on('input', '#paid-individual-selected-list input', function() {
    // Keep only digits
    let paidIndividualCnt = this.value.replace(/[^0-9]/g, '');
    let changedDeckId = $(this).closest('.selected-item').data('id');
    individualSelectedPaidOptions.forEach(item => {
        if (Number(item.id) === changedDeckId) {
            item.cnt = paidIndividualCnt;
        }
    });

    console.log('After input:', individualSelectedPaidOptions);
});
$('#category_form #paid_individual_deck_type').on('change', showIndividualSelectedPaidOptions);
</script>
@endsection