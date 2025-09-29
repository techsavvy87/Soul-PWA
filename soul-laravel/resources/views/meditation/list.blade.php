@extends('layouts.main')
@section('title', 'List Meditations')

@section('page-css')
<link href="{{ asset('src/plugins/src/table/datatable/datatables.css') }}" rel="stylesheet" type="text/css" />
<link rel="stylesheet" type="text/css" href="{{ asset('src/plugins/css/dark/table/datatable/dt-global_style.css') }}">
<link href="{{ asset('src/assets/css/dark/apps/list.css') }}" rel="stylesheet" type="text/css" />
<style>
@media (max-width: 767px) {
    .mobile-hide {
        display: none;
    }
}

.word-break {
    white-space: pre-wrap !important;
    word-wrap: break-word !important;
}
</style>
@endsection

@section('content')
<div class="row" id="cancel-row">
    <div class="col-xl-12 col-lg-12 col-sm-12 layout-top-spacing layout-spacing">
        @include('layouts.alerts')
        <h5 class="pt-2 pb-2">Meditation</h5>
        <div class="widget-content widget-content-area br-8">
            <table id="meditation-list" class="table dt-table-hover" style="width:100%">
                <thead>
                    <tr>
                        <th class="checkbox-column"> No. </th>
                        <th>Cover Image</th>
                        <th>Title</th>
                        <th class="mobile-hide">Description</th>
                        <th>Type</th>
                        <th>Status</th>
                        <th>Published Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($meditations as $meditation)
                    <tr>
                        <td class="checkbox-column">{{ $loop->index + 1 }}</td>
                        <td>
                            @if (empty($meditation->cover_img))
                            <img src="{{ asset('images/no_image.jpg') }}" class="rounded" alt="meditation picture"
                                style="object-fit: cover; width: 80px; height: 60px">
                            @else
                            <img src="{{ asset('storage/meditations/'. $meditation->cover_img) }}" class="rounded"
                                alt="meditation picture" style="object-fit: cover; width: 50px; height: 80px">
                            @endif
                        </td>
                        <td>
                            <a href="{{ route('edit-meditation', ['id' => $meditation->id]) }}"><span
                                    class="inv-number word-break">{{ $meditation->title }}</span></a>
                        </td>
                        <td class="mobile-hide" style="width: 50%;">
                            <p class="align-self-center mb-0 user-name"
                                style="white-space:normal; word-wrap:break-word;">
                                {{ strlen(strip_tags($meditation->description)) > 240 ? substr(strip_tags($meditation->description), 0, 240)."..." : strip_tags($meditation->description) }}
                            </p>
                        </td>
                        <td>
                            @if ($meditation->type === 'Audio')
                            <span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                    fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                    stroke-linejoin="round" class="feather feather-volume-1">
                                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                                    <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                                </svg>
                            </span>
                            @elseif ($meditation->type === 'Video')
                            <span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                    fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                    stroke-linejoin="round" class="feather feather-video">
                                    <polygon points="23 7 16 12 23 17 23 7"></polygon>
                                    <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
                                </svg>
                            </span>
                            @else
                            <span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                    fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                    stroke-linejoin="round" class="feather feather-file-text">
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                    <polyline points="14 2 14 8 20 8"></polyline>
                                    <line x1="16" y1="13" x2="8" y2="13"></line>
                                    <line x1="16" y1="17" x2="8" y2="17"></line>
                                    <polyline points="10 9 9 9 8 9"></polyline>
                                </svg>
                            </span>
                            @endif
                        </td>
                        <td>
                            @if ($meditation->status === 'published')
                            <span class="badge badge-light-success inv-status">{{ ucfirst($meditation->status) }}</span>
                            @else
                            <span class="badge badge-light-warning inv-status">{{ ucfirst($meditation->status) }}</span>
                            @endif
                        </td>
                        <td>
                            @if (!empty($meditation->published_at))
                            <span class="inv-date">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                    fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                    stroke-linejoin="round" class="feather feather-calendar">
                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                    <line x1="16" y1="2" x2="16" y2="6"></line>
                                    <line x1="8" y1="2" x2="8" y2="6"></line>
                                    <line x1="3" y1="10" x2="21" y2="10"></line>
                                </svg>
                                {{ Carbon\Carbon::parse($meditation->published_at)->format('M d, y') }}
                            </span>
                            @endif
                        </td>
                        <td>
                            <a class="badge badge-light-primary text-start me-2 action-edit"
                                href="{{ route('edit-meditation', ['id' => $meditation->id]) }}">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                    fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                    stroke-linejoin="round" class="feather feather-edit-3">
                                    <path d="M12 20h9"></path>
                                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                                </svg>
                            </a>
                            <a class="badge badge-light-danger text-start action-delete"
                                href="javascript:openDeleteAlert({{ $meditation->id }});">
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
@endsection

@section('page-js')
<script src="{{ asset('src/plugins/src/table/datatable/datatables.js') }}"></script>
<script src="{{ asset('src/plugins/src/table/datatable/button-ext/dataTables.buttons.min.js') }}"></script>
<script>
var invoiceList = $('#meditation-list').DataTable({
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
            window.location = "{{ route('add-meditation') }}";
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
            form.action = "{{ route('delete-meditation') }}";

            input_id.value = id;
            input_id.name = "meditation_id";
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